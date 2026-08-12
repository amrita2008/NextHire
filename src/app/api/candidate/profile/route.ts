import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const userPayload = token ? verifyJwtToken(token) : null;

    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.candidateProfile.findUnique({
      where: { userId: userPayload.userId },
      include: { user: { select: { name: true, email: true, avatarUrl: true } } },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (error: any) {
    console.error('Fetch Profile Error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const userPayload = token ? verifyJwtToken(token) : null;

    if (!userPayload || userPayload.role !== 'CANDIDATE') {
      return NextResponse.json({ error: 'Unauthorized candidate role access' }, { status: 403 });
    }

    const body = await req.json();
    const {
      phone,
      location,
      bio,
      education,
      experience,
      skills,
      certifications,
      portfolioUrl,
      githubUrl,
      linkedinUrl,
      resumeUrl,
      coverLetterUrl,
    } = body;

    const profile = await prisma.candidateProfile.upsert({
      where: { userId: userPayload.userId },
      update: {
        phone,
        location,
        bio,
        education: education || [],
        experience: experience || [],
        skills: skills || [],
        certifications: certifications || [],
        portfolioUrl,
        githubUrl,
        linkedinUrl,
        resumeUrl,
        coverLetterUrl,
      },
      create: {
        userId: userPayload.userId,
        phone,
        location,
        bio,
        education: education || [],
        experience: experience || [],
        skills: skills || [],
        certifications: certifications || [],
        portfolioUrl,
        githubUrl,
        linkedinUrl,
        resumeUrl,
        coverLetterUrl,
      },
    });

    return NextResponse.json({ message: 'Profile updated successfully', profile });
  } catch (error: any) {
    console.error('Upsert Profile Error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
