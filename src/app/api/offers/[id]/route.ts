import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/offers/[id] - Get single offer letter details
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

    const offer = await prisma.offerLetter.findFirst({
      where: {
        OR: [{ id }, { applicationId: id }],
      },
      include: {
        application: {
          include: {
            job: {
              include: {
                company: true,
              },
            },
            candidate: {
              include: {
                user: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
          },
        },
      },
    });

    if (!offer) {
      return NextResponse.json({ error: 'Offer letter not found' }, { status: 404 });
    }

    return NextResponse.json({ offer });
  } catch (error: any) {
    console.error('Fetch Offer Details Error:', error);
    return NextResponse.json({ error: 'Failed to fetch offer letter' }, { status: 500 });
  }
}

// PATCH /api/offers/[id] - Accept or Reject job offer
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const userPayload = token ? verifyJwtToken(token) : null;

    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body; // ACCEPTED or REJECTED

    if (!status || !['ACCEPTED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Valid status (ACCEPTED or REJECTED) is required' }, { status: 400 });
    }

    const existingOffer = await prisma.offerLetter.findUnique({
      where: { id },
      include: { application: true },
    });

    if (!existingOffer) {
      return NextResponse.json({ error: 'Offer letter not found' }, { status: 404 });
    }

    // Update Offer Status
    const updatedOffer = await prisma.offerLetter.update({
      where: { id },
      data: { status: status as 'ACCEPTED' | 'REJECTED' },
      include: {
        application: true,
      },
    });

    // Update Application Stage: HIRED if ACCEPTED, REJECTED if REJECTED
    const newStage = status === 'ACCEPTED' ? 'HIRED' : 'REJECTED';
    await prisma.application.update({
      where: { id: existingOffer.applicationId },
      data: { stage: newStage },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: userPayload.userId,
        action: 'RESPOND_OFFER',
        entity: 'OfferLetter',
        entityId: id,
        details: `Candidate ${status.toLowerCase()} offer letter for application ${existingOffer.applicationId}`,
      },
    });

    return NextResponse.json({
      message: `Offer successfully ${status.toLowerCase()}`,
      offer: updatedOffer,
    });
  } catch (error: any) {
    console.error('Update Offer Error:', error);
    return NextResponse.json({ error: 'Failed to update offer letter' }, { status: 500 });
  }
}
