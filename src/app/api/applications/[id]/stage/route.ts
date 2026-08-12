import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const userPayload = token ? verifyJwtToken(token) : null;

    if (!userPayload || (userPayload.role !== 'RECRUITER' && userPayload.role !== 'ADMIN' && userPayload.role !== 'HIRING_MANAGER')) {
      return NextResponse.json({ error: 'Unauthorized role access' }, { status: 403 });
    }

    const { stage } = await req.json();
    const validStages = [
      'APPLIED',
      'SCREENING',
      'SHORTLISTED',
      'TECH_INTERVIEW',
      'HR_INTERVIEW',
      'OFFER',
      'HIRED',
      'REJECTED',
    ];

    if (!stage || !validStages.includes(stage)) {
      return NextResponse.json({ error: 'Invalid application stage' }, { status: 400 });
    }

    const application = await prisma.application.update({
      where: { id: params.id },
      data: { stage },
    });

    return NextResponse.json({
      message: 'Application stage updated successfully',
      application,
    });
  } catch (error: any) {
    console.error('Update Application Stage Error:', error);
    return NextResponse.json({ error: 'Failed to update application stage' }, { status: 500 });
  }
}
