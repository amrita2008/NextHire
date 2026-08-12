import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyJwtToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    const employmentType = searchParams.get('type') || '';
    const workMode = searchParams.get('mode') || '';

    const where: any = {
      status: 'OPEN',
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (employmentType) {
      where.employmentType = employmentType;
    }

    if (workMode) {
      where.workMode = workMode;
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        company: {
          select: { name: true, logo: true, website: true, officeLocations: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ jobs });
  } catch (error: any) {
    console.error('Fetch Jobs Error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const userPayload = token ? verifyJwtToken(token) : null;

    if (!userPayload || (userPayload.role !== 'RECRUITER' && userPayload.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized: Only recruiters can post jobs' }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      department,
      location,
      salaryMin,
      salaryMax,
      currency = 'USD',
      experienceRequired,
      skillsRequired = [],
      employmentType = 'FULL_TIME',
      workMode = 'HYBRID',
      deadline,
      description,
    } = body;

    if (!title || !department || !location || !description || !experienceRequired) {
      return NextResponse.json({ error: 'Missing required job fields' }, { status: 400 });
    }

    let companyId = userPayload.companyId;

    if (!companyId) {
      const userWithCompany = await prisma.user.findUnique({
        where: { id: userPayload.userId },
        select: { companyId: true },
      });
      companyId = userWithCompany?.companyId || null;
    }

    if (!companyId) {
      const newCompany = await prisma.company.create({
        data: {
          name: `${userPayload.email.split('@')[0]} Tech`,
        },
      });
      companyId = newCompany.id;

      await prisma.user.update({
        where: { id: userPayload.userId },
        data: { companyId },
      });
    }

    const job = await prisma.job.create({
      data: {
        companyId,
        createdById: userPayload.userId,
        title,
        department,
        location,
        salaryMin: salaryMin ? parseInt(salaryMin) : null,
        salaryMax: salaryMax ? parseInt(salaryMax) : null,
        currency,
        experienceRequired,
        skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : skillsRequired.split(',').map((s: string) => s.trim()),
        employmentType: employmentType as any,
        workMode: workMode as any,
        deadline: deadline ? new Date(deadline) : null,
        description,
        status: 'OPEN',
      },
    });

    return NextResponse.json({ message: 'Job created successfully', job }, { status: 201 });
  } catch (error: any) {
    console.error('Create Job Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
