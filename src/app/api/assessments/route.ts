import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/assessments?jobId=xxx - Fetch coding assessments
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const userPayload = token ? verifyJwtToken(token) : null;

    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    const where: any = {};
    if (jobId) where.jobId = jobId;

    const assessments = await prisma.codingAssessment.findMany({
      where,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            department: true,
          },
        },
        attempts: {
          select: {
            id: true,
            score: true,
            passed: true,
            submittedAt: true,
            candidateUserId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ assessments });
  } catch (error: any) {
    console.error('Fetch Assessments Error:', error);
    return NextResponse.json({ error: 'Failed to fetch coding assessments' }, { status: 500 });
  }
}

// POST /api/assessments - Create a new coding assessment for a job
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const userPayload = token ? verifyJwtToken(token) : null;

    if (
      !userPayload ||
      (userPayload.role !== 'RECRUITER' && userPayload.role !== 'ADMIN' && userPayload.role !== 'HIRING_MANAGER')
    ) {
      return NextResponse.json({ error: 'Unauthorized role for creating assessments' }, { status: 403 });
    }

    const body = await req.json();
    const { jobId, title, durationMinutes, passPercentage, questions } = body;

    if (!jobId || !title || !questions) {
      return NextResponse.json(
        { error: 'Job ID, assessment title, and questions are required' },
        { status: 400 }
      );
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job posting not found' }, { status: 404 });
    }

    const questionsJson = typeof questions === 'string' ? questions : JSON.stringify(questions);

    const assessment = await prisma.codingAssessment.create({
      data: {
        jobId,
        title,
        durationMinutes: durationMinutes ? parseInt(durationMinutes) : 60,
        passPercentage: passPercentage ? parseInt(passPercentage) : 70,
        questionsJson,
      },
      include: {
        job: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Coding assessment created successfully',
        assessment,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create Assessment API Error:', error);
    return NextResponse.json({ error: 'Failed to create coding assessment' }, { status: 500 });
  }
}
