import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

// POST /api/assessments/[id]/submit - Submit candidate answers & evaluate score
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const userPayload = token ? verifyJwtToken(token) : null;

    if (!userPayload || userPayload.role !== 'CANDIDATE') {
      return NextResponse.json({ error: 'Unauthorized. Candidate access required.' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { answers, tabSwitchesCount, applicationId } = body;

    const assessment = await prisma.codingAssessment.findUnique({
      where: { id },
      include: { job: true },
    });

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    let questions = [];
    try {
      questions = JSON.parse(assessment.questionsJson);
    } catch {
      questions = [];
    }

    // Evaluate answers
    let correctCount = 0;
    const totalQuestions = questions.length || 1;

    questions.forEach((q: any, idx: number) => {
      const candidateAnswer = answers ? answers[q.id || idx] : null;

      if (q.type === 'mcq') {
        if (candidateAnswer !== undefined && candidateAnswer !== null && String(candidateAnswer) === String(q.correctOption)) {
          correctCount++;
        }
      } else if (q.type === 'sql' || q.type === 'code') {
        // Evaluate code solution: if non-empty code provided, award partial/full score
        if (typeof candidateAnswer === 'string' && candidateAnswer.trim().length > 10) {
          correctCount++;
        }
      }
    });

    const calculatedScore = Math.round((correctCount / totalQuestions) * 100);
    const passed = calculatedScore >= assessment.passPercentage;

    const answersJson = typeof answers === 'string' ? answers : JSON.stringify(answers || {});

    // Save attempt in Prisma
    const attempt = await prisma.assessmentAttempt.create({
      data: {
        assessmentId: id,
        candidateUserId: userPayload.userId,
        applicationId: applicationId || null,
        score: calculatedScore,
        passed,
        answersJson,
        tabSwitchesCount: tabSwitchesCount || 0,
      },
      include: {
        assessment: true,
      },
    });

    // If candidate has an active application and passed, auto-progress stage to SHORTLISTED or TECH_INTERVIEW
    if (applicationId && passed) {
      await prisma.application.update({
        where: { id: applicationId },
        data: { stage: 'SHORTLISTED' },
      });
    }

    // Create Notification
    await prisma.notification.create({
      data: {
        userId: userPayload.userId,
        title: `Coding Assessment Completed: ${assessment.title}`,
        message: `You scored ${calculatedScore}% (${passed ? 'PASSED' : 'NOT PASSED'}). ${
          passed ? 'Your application has been shortlisted!' : 'Thank you for participating.'
        }`,
        type: 'ASSESSMENT_COMPLETED',
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: userPayload.userId,
        action: 'SUBMIT_ASSESSMENT',
        entity: 'AssessmentAttempt',
        entityId: attempt.id,
        details: `Candidate completed ${assessment.title} with score ${calculatedScore}% (Passed: ${passed})`,
      },
    });

    return NextResponse.json(
      {
        message: 'Assessment submitted and evaluated successfully!',
        attempt,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Submit Assessment Error:', error);
    return NextResponse.json({ error: 'Failed to submit assessment' }, { status: 500 });
  }
}
