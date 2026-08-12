import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/interviews/[id] - Get single interview detail
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

    const interview = await prisma.interview.findUnique({
      where: { id },
      include: {
        application: {
          include: {
            job: true,
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
        feedbacks: {
          include: {
            interviewer: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    return NextResponse.json({ interview });
  } catch (error: any) {
    console.error('Fetch Single Interview Error:', error);
    return NextResponse.json({ error: 'Failed to fetch interview' }, { status: 500 });
  }
}

// PATCH /api/interviews/[id] - Update interview details/status
export async function PATCH(
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
    const body = await req.json();
    const { status, scheduledAt, durationMinutes, meetingUrl, title, interviewerId } = body;

    const existing = await prisma.interview.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (scheduledAt) updateData.scheduledAt = new Date(scheduledAt);
    if (durationMinutes) updateData.durationMinutes = parseInt(durationMinutes);
    if (meetingUrl) updateData.meetingUrl = meetingUrl;
    if (title) updateData.title = title;
    if (interviewerId) updateData.interviewerId = interviewerId;

    const updatedInterview = await prisma.interview.update({
      where: { id },
      data: updateData,
      include: {
        application: true,
        interviewer: true,
      },
    });

    return NextResponse.json({
      message: 'Interview updated successfully',
      interview: updatedInterview,
    });
  } catch (error: any) {
    console.error('Update Interview Error:', error);
    return NextResponse.json({ error: 'Failed to update interview' }, { status: 500 });
  }
}

// DELETE /api/interviews/[id] - Cancel/Delete interview
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const userPayload = token ? verifyJwtToken(token) : null;

    if (
      !userPayload ||
      (userPayload.role !== 'RECRUITER' &&
        userPayload.role !== 'ADMIN' &&
        userPayload.role !== 'HIRING_MANAGER')
    ) {
      return NextResponse.json({ error: 'Unauthorized role for cancelling interview' }, { status: 403 });
    }

    const { id } = await params;

    await prisma.interview.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Interview cancelled successfully' });
  } catch (error: any) {
    console.error('Delete Interview Error:', error);
    return NextResponse.json({ error: 'Failed to cancel interview' }, { status: 500 });
  }
}
