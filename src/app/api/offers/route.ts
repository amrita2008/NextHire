import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/offers - Fetch offers for logged-in user (candidate or recruiter)
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const userPayload = token ? verifyJwtToken(token) : null;

    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const applicationId = searchParams.get('applicationId');

    const where: any = {};
    if (applicationId) {
      where.applicationId = applicationId;
    }

    const offers = await prisma.offerLetter.findMany({
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
                company: {
                  select: { name: true, logo: true },
                },
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ offers });
  } catch (error: any) {
    console.error('Fetch Offers API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch offer letters' }, { status: 500 });
  }
}

// POST /api/offers - Issue a new offer letter for a candidate application
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const userPayload = token ? verifyJwtToken(token) : null;

    if (
      !userPayload ||
      (userPayload.role !== 'RECRUITER' && userPayload.role !== 'ADMIN' && userPayload.role !== 'HIRING_MANAGER')
    ) {
      return NextResponse.json({ error: 'Unauthorized. Recruiter privileges required.' }, { status: 403 });
    }

    const body = await req.json();
    const { applicationId, role, salary, joiningDate, location, benefits } = body;

    if (!applicationId || !salary || !joiningDate) {
      return NextResponse.json(
        { error: 'Application ID, salary, and joining date are required' },
        { status: 400 }
      );
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true, candidate: { include: { user: true } } },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Upsert OfferLetter using exact schema fields
    const offer = await prisma.offerLetter.upsert({
      where: { applicationId },
      create: {
        applicationId,
        role: role || application.job.title,
        salary: parseInt(String(salary)),
        joiningDate: new Date(joiningDate),
        location: location || application.job.location || 'Remote',
        benefits: benefits || 'Standard Health, Vision, Dental & 401(k) Plan',
        status: 'PENDING',
      },
      update: {
        role: role || application.job.title,
        salary: parseInt(String(salary)),
        joiningDate: new Date(joiningDate),
        location: location || application.job.location || 'Remote',
        benefits: benefits || 'Standard Health, Vision, Dental & 401(k) Plan',
        status: 'PENDING',
      },
      include: {
        application: {
          include: { job: true },
        },
      },
    });

    // Automatically transition application stage to OFFER
    await prisma.application.update({
      where: { id: applicationId },
      data: { stage: 'OFFER' },
    });

    // Notify Candidate User
    if (application.candidate?.userId) {
      await prisma.notification.create({
        data: {
          userId: application.candidate.userId,
          title: `Official Job Offer Extended: ${offer.role}`,
          message: `Congratulations! You have received an official job offer for ${offer.role}. Please review and respond in your Candidate Portal.`,
          type: 'OFFER_RECEIVED',
        },
      });
    }

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: userPayload.userId,
        action: 'CREATE_OFFER',
        entity: 'OfferLetter',
        entityId: offer.id,
        details: `Issued offer letter to ${application.candidate?.user?.name} for ${offer.role} with base salary $${offer.salary}`,
      },
    });

    return NextResponse.json(
      {
        message: 'Offer letter issued and sent to candidate successfully!',
        offer,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create Offer API Error:', error);
    return NextResponse.json({ error: 'Failed to generate offer letter' }, { status: 500 });
  }
}
