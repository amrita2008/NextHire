import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const userPayload = token ? verifyJwtToken(token) : null;

    if (!userPayload || (userPayload.role !== 'RECRUITER' && userPayload.role !== 'ADMIN' && userPayload.role !== 'CANDIDATE')) {
      return NextResponse.json({ error: 'Unauthorized role access' }, { status: 403 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API Key is not configured on the server' }, { status: 500 });
    }

    const { candidateProfileId, jobId } = await req.json();
    if (!candidateProfileId || !jobId) {
      return NextResponse.json({ error: 'Candidate Profile ID and Job ID are required' }, { status: 400 });
    }

    const profile = await prisma.candidateProfile.findUnique({
      where: { id: candidateProfileId },
    });

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!profile || !job) {
      return NextResponse.json({ error: 'Candidate profile or Job posting not found' }, { status: 404 });
    }

    const resumeText = profile.resumeText || '';
    if (!resumeText.trim()) {
      return NextResponse.json({ error: 'Candidate profile has no resume text to match' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are an expert recruitment coordinator. Match the candidate's resume below against the job description.
      Analyze skills, experience, and educational background to produce a precise match.
      
      Respond STRICTLY with a valid JSON object matching this structure:
      {
        "matchScore": 85, // Integer between 0 and 100
        "strengths": ["list of matching qualifications", "another strength"],
        "gaps": ["missing critical skills", "experience shortfalls"],
        "recommendation": "A concise summary of recommendation"
      }

      Job Title: ${job.title}
      Required Skills: ${job.skillsRequired.join(', ')}
      Job Description:
      ${job.description}

      Candidate Resume Text:
      """
      ${resumeText}
      """
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsedJsonText = response.text || '{}';
    const matchResults = JSON.parse(parsedJsonText);

    return NextResponse.json({
      message: 'AI Job Matching completed successfully',
      matchResults,
    });
  } catch (error: any) {
    console.error('Gemini AI Job Matching Route Error:', error);
    return NextResponse.json({ error: 'Failed to evaluate job match with Gemini AI' }, { status: 500 });
  }
}
