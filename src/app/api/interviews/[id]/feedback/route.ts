import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/interviews/[id]/feedback - Fetch feedbacks for an interview
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const userPayload = token ? verifyJwtToken(token) : null;

    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const { id } = await params;

    const feedbacks = await prisma.interviewFeedback.findMany({
      where: { interviewId: id },
      include: {
        interviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ feedbacks });
  } catch (error: any) {
    console.error('Fetch Feedback Error:', error);
    return NextResponse.json({ error: 'Failed to fetch interview feedback' }, { status: 500 });
  }
}

// POST /api/interviews/[id]/feedback - Submit feedback & score
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const userPayload = token ? verifyJwtToken(token) : null;

    if (
      !userPayload ||
      (userPayload.role !== 'INTERVIEWER' &&
        userPayload.role !== 'RECRUITER' &&
        userPayload.role !== 'ADMIN' &&
        userPayload.role !== 'HIRING_MANAGER')
    ) {
      return NextResponse.json({ error: 'Unauthorized role for submitting feedback' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { technicalRating, communicationRating, problemSolvingRating, comments } = body;

    if (
      typeof technicalRating !== 'number' ||
      typeof communicationRating !== 'number' ||
      typeof problemSolvingRating !== 'number' ||
      !comments
    ) {
      return NextResponse.json(
        { error: 'All rating categories (1-5) and comments are required' },
        { status: 400 }
      );
    }

    const interview = await prisma.interview.findUnique({
      where: { id },
      include: {
        application: {
          include: {
            candidate: {
              include: { user: true },
            },
            job: true,
          },
        },
      },
    });

    if (!interview) {
      return NextResponse.json({ error: 'Interview record not found' }, { status: 404 });
    }

    // Calculate composite overall rating (average rounded to nearest integer)
    const overallRating = Math.round(
      (technicalRating + communicationRating + problemSolvingRating) / 3
    );

    // Create Feedback record
    const feedback = await prisma.interviewFeedback.create({
      data: {
        interviewId: id,
        interviewerId: userPayload.userId,
        technicalRating,
        communicationRating,
        problemSolvingRating,
        overallRating,
        comments,
      },
      include: {
        interviewer: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    // Mark interview status as COMPLETED if currently SCHEDULED
    if (interview.status === 'SCHEDULED') {
      await prisma.interview.update({
        where: { id },
        data: { status: 'COMPLETED' },
      });
    }

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: userPayload.userId,
        action: 'SUBMIT_INTERVIEW_FEEDBACK',
        entity: 'InterviewFeedback',
        entityId: feedback.id,
        details: `Submitted feedback for candidate ${interview.application.candidate.user.name} (Overall: ${overallRating}/5)`,
      },
    });

    return NextResponse.json(
      {
        message: 'Interview feedback submitted successfully!',
        feedback,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Submit Feedback API Error:', error);
    return NextResponse.json({ error: 'Failed to submit interview feedback' }, { status: 500 });
  }
}
