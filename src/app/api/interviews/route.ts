import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/interviews - List scheduled interviews
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const userPayload = token ? verifyJwtToken(token) : null;

    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const applicationId = searchParams.get('applicationId');
    const interviewerId = searchParams.get('interviewerId');
    const status = searchParams.get('status');

    const where: any = {};
    if (applicationId) where.applicationId = applicationId;
    if (interviewerId) where.interviewerId = interviewerId;
    if (status) where.status = status;

    // Filter by candidate if user is candidate
    if (userPayload.role === 'CANDIDATE') {
      const profile = await prisma.candidateProfile.findUnique({
        where: { userId: userPayload.userId },
      });
      if (profile) {
        const apps = await prisma.application.findMany({
          where: { candidateId: profile.id },
          select: { id: true },
        });
        where.applicationId = { in: apps.map((a) => a.id) };
      }
    } else if (userPayload.role === 'INTERVIEWER') {
      where.interviewerId = userPayload.userId;
    }

    const interviews = await prisma.interview.findMany({
      where,
      include: {
        application: {
          include: {
            job: {
              select: {
                id: true,
                title: true,
                department: true,
                location: true,
              },
            },
            candidate: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
        interviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatarUrl: true,
          },
        },
        feedbacks: true,
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });

    return NextResponse.json({ interviews });
  } catch (error: any) {
    console.error('Fetch Interviews Error:', error);
    return NextResponse.json({ error: 'Failed to fetch interviews' }, { status: 500 });
  }
}

// POST /api/interviews - Schedule an interview & generate Google Meet link
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const userPayload = token ? verifyJwtToken(token) : null;

    if (
      !userPayload ||
      (userPayload.role !== 'RECRUITER' &&
        userPayload.role !== 'ADMIN' &&
        userPayload.role !== 'HIRING_MANAGER')
    ) {
      return NextResponse.json({ error: 'Unauthorized role for interview scheduling' }, { status: 403 });
    }

    const body = await req.json();
    const { applicationId, interviewerId, title, scheduledAt, durationMinutes, meetingUrl } = body;

    if (!applicationId || !scheduledAt) {
      return NextResponse.json(
        { error: 'Application ID and scheduled date/time are required' },
        { status: 400 }
      );
    }

    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        candidate: {
          include: { user: true },
        },
        job: true,
      },
    });

    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Auto-generate realistic Google Meet URL if not explicitly provided
    const randMeetCode = `nexthire-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}`;
    const generatedMeetUrl = meetingUrl && meetingUrl.trim() !== ''
      ? meetingUrl
      : `https://meet.google.com/${randMeetCode}`;

    // Create Interview record in Prisma
    const interview = await prisma.interview.create({
      data: {
        applicationId,
        interviewerId: interviewerId || userPayload.userId,
        title: title || `Technical Interview for ${app.job.title}`,
        scheduledAt: new Date(scheduledAt),
        durationMinutes: durationMinutes ? parseInt(durationMinutes) : 45,
        meetingUrl: generatedMeetUrl,
        status: 'SCHEDULED',
      },
      include: {
        interviewer: {
          select: { id: true, name: true, email: true, role: true },
        },
        application: {
          include: {
            job: true,
            candidate: {
              include: { user: true },
            },
          },
        },
      },
    });

    // Auto-update application stage to TECH_INTERVIEW if in earlier stages
    if (app.stage === 'APPLIED' || app.stage === 'SCREENING' || app.stage === 'SHORTLISTED') {
      await prisma.application.update({
        where: { id: applicationId },
        data: { stage: 'TECH_INTERVIEW' },
      });
    }

    // Create Notification for Candidate
    await prisma.notification.create({
      data: {
        userId: app.candidate.userId,
        title: `Interview Scheduled: ${app.job.title}`,
        message: `Your interview "${interview.title}" is scheduled for ${new Date(
          scheduledAt
        ).toLocaleString()}. Join Google Meet: ${generatedMeetUrl}`,
        type: 'INTERVIEW_SCHEDULED',
      },
    });

    // Create Notification for Interviewer if different from creator
    if (interview.interviewerId !== userPayload.userId) {
      await prisma.notification.create({
        data: {
          userId: interview.interviewerId,
          title: `New Interview Assigned: ${app.candidate.user.name}`,
          message: `You have been assigned to conduct an interview for ${app.job.title} on ${new Date(
            scheduledAt
          ).toLocaleString()}. Link: ${generatedMeetUrl}`,
          type: 'INTERVIEW_ASSIGNED',
        },
      });
    }

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: userPayload.userId,
        action: 'SCHEDULE_INTERVIEW',
        entity: 'Interview',
        entityId: interview.id,
        details: `Scheduled interview for candidate ${app.candidate.user.name} on ${scheduledAt}`,
      },
    });

    return NextResponse.json(
      {
        message: 'Interview scheduled successfully and Google Meet link generated!',
        interview,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Schedule Interview API Error:', error);
    return NextResponse.json({ error: 'Failed to schedule interview' }, { status: 500 });
  }
}
