import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/assessments/[id] - Get single assessment details with questions
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

    const assessment = await prisma.codingAssessment.findUnique({
      where: { id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            department: true,
            company: {
              select: { name: true, logo: true },
            },
          },
        },
        attempts: {
          where: {
            candidateUserId: userPayload.userId,
          },
          orderBy: {
            submittedAt: 'desc',
          },
        },
      },
    });

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment test not found' }, { status: 404 });
    }

    let parsedQuestions = [];
    try {
      parsedQuestions = JSON.parse(assessment.questionsJson);
    } catch {
      parsedQuestions = [];
    }

    return NextResponse.json({
      assessment: {
        ...assessment,
        questions: parsedQuestions,
      },
    });
  } catch (error: any) {
    console.error('Fetch Assessment Details Error:', error);
    return NextResponse.json({ error: 'Failed to fetch assessment details' }, { status: 500 });
  }
}
