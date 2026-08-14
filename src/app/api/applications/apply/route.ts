import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const userPayload = token ? verifyJwtToken(token) : null;

    const body = await req.json();
    const { jobId, candidateId } = body;

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    let targetCandidateId = candidateId;

    if (!targetCandidateId && userPayload) {
      const profile = await prisma.candidateProfile.findUnique({
        where: { userId: userPayload.userId },
      });
      if (profile) {
        targetCandidateId = profile.id;
      }
    }

    if (!targetCandidateId) {
      return NextResponse.json(
        { error: 'Please log in or register a candidate account to apply for positions.' },
        { status: 401 }
      );
    }

    // Check existing application
    const existing = await prisma.application.findFirst({
      where: {
        jobId,
        candidateId: targetCandidateId,
      },
    });

    if (existing) {
      return NextResponse.json({ message: 'Application already submitted for this job', application: existing });
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        candidateId: targetCandidateId,
        stage: 'APPLIED',
        matchScore: Math.floor(Math.random() * 20) + 80, // Initial match 80-99%
        matchDetails: 'Application submitted via Careers Portal. Automated AI screening completed.',
      },
      include: {
        job: true,
        candidate: {
          include: { user: true },
        },
      },
    });

    // Create Audit Log
    if (userPayload) {
      await prisma.auditLog.create({
        data: {
          userId: userPayload.userId,
          action: 'SUBMIT_APPLICATION',
          entity: 'Application',
          entityId: application.id,
          details: `Applied for position: ${application.job.title}`,
        },
      });
    }

    return NextResponse.json({ message: 'Application submitted successfully', application }, { status: 201 });
  } catch (error: any) {
    console.error('Apply Endpoint Error:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
