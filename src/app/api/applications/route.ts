import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const userPayload = token ? verifyJwtToken(token) : null;

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');
    const stage = searchParams.get('stage');

    const where: any = {};
    if (jobId) where.jobId = jobId;
    if (stage) where.stage = stage;

    if (userPayload && userPayload.role === 'CANDIDATE') {
      const profile = await prisma.candidateProfile.findUnique({
        where: { userId: userPayload.userId },
      });
      if (profile) {
        where.candidateId = profile.id;
      }
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        job: {
          include: {
            company: true,
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
        interviews: true,
        offerLetter: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ applications });
  } catch (error: any) {
    console.error('Fetch Applications Error:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const userPayload = token ? verifyJwtToken(token) : null;

    const body = await req.json();
    const { jobId, candidateId } = body;

    if (!jobId || !candidateId) {
      return NextResponse.json({ error: 'Job ID and Candidate ID are required' }, { status: 400 });
    }

    // Check if application already exists
    const existing = await prisma.application.findFirst({
      where: { jobId, candidateId },
    });

    if (existing) {
      return NextResponse.json({ message: 'Application already exists', application: existing });
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        candidateId,
        stage: 'APPLIED',
        matchScore: 85,
        matchDetails: 'Initial AI match evaluation calculated upon application submission.',
      },
      include: {
        job: true,
        candidate: {
          include: { user: true },
        },
      },
    });

    return NextResponse.json({ message: 'Application submitted successfully', application }, { status: 201 });
  } catch (error: any) {
    console.error('Create Application Error:', error);
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}
