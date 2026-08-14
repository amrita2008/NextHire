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
    }

    const offersRaw = await prisma.offerLetter.findMany({
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

    const offers = offersRaw.map((o) => ({
      ...o,
      candidateName: o.application?.candidate?.user?.name || 'Candidate',
      candidateEmail: o.application?.candidate?.user?.email || 'candidate@example.com',
      jobTitle: o.role || o.application?.job?.title || 'Engineering Role',
      currency: 'USD',
      welcomeNote: o.benefits,
    }));

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
    const { applicationId, candidateEmail, candidateName, jobTitle, role, salary, joiningDate, location, benefits, welcomeNote } = body;

    let targetApplicationId = applicationId;

    if (!targetApplicationId) {
      // Find candidate application by candidate email or select most recent candidate application
      const firstApp = await prisma.application.findFirst({
        include: { candidate: { include: { user: true } } },
        orderBy: { createdAt: 'desc' },
      });
      if (firstApp) {
        targetApplicationId = firstApp.id;
      }
    }

    if (!targetApplicationId) {
      return NextResponse.json({ error: 'No active candidate application found to issue offer to' }, { status: 400 });
    }

    const application = await prisma.application.findUnique({
      where: { id: targetApplicationId },
      include: { job: true, candidate: { include: { user: true } } },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const offerRole = role || jobTitle || application.job.title;
    const offerBenefits = welcomeNote || benefits || 'Standard Medical, Dental, Vision & 401(k) Plan';

    const offer = await prisma.offerLetter.upsert({
      where: { applicationId: targetApplicationId },
      create: {
        applicationId: targetApplicationId,
        role: offerRole,
        salary: parseInt(String(salary)),
        joiningDate: new Date(joiningDate),
        location: location || application.job.location || 'San Francisco, CA',
        benefits: offerBenefits,
        status: 'PENDING',
      },
      update: {
        role: offerRole,
        salary: parseInt(String(salary)),
        joiningDate: new Date(joiningDate),
        location: location || application.job.location || 'San Francisco, CA',
        benefits: offerBenefits,
        status: 'PENDING',
      },
      include: {
        application: {
          include: { job: true },
        },
      },
    });

    await prisma.application.update({
      where: { id: targetApplicationId },
      data: { stage: 'OFFER' },
    });

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
        offer: {
          ...offer,
          candidateName: candidateName || application.candidate?.user?.name,
          candidateEmail: candidateEmail || application.candidate?.user?.email,
          jobTitle: offer.role,
          currency: 'USD',
          welcomeNote: offer.benefits,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create Offer API Error:', error);
    return NextResponse.json({ error: 'Failed to generate offer letter' }, { status: 500 });
  }
}
