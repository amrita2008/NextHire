import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const userPayload = token ? verifyJwtToken(token) : null;

    if (!userPayload || userPayload.role !== 'CANDIDATE') {
      return NextResponse.json({ error: 'Unauthorized candidate role access' }, { status: 403 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API Key is not configured on the server' }, { status: 500 });
    }

    const { resumeText } = await req.json();
    if (!resumeText) {
      return NextResponse.json({ error: 'Resume text is required for AI parsing' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are an expert ATS (Applicant Tracking System) parser. Analyze the raw text of the resume below and extract key structured information.
      
      Respond STRICTLY with a valid JSON object matching this structure:
      {
        "phone": "extracted phone number or null",
        "location": "extracted city/country or null",
        "bio": "short professional bio summary",
        "skills": ["skill1", "skill2", "skill3"],
        "education": ["degree, university, year"],
        "experience": ["role, company, period, description"],
        "certifications": ["cert1", "cert2"]
      }

      Raw Resume Text:
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
    const parsedData = JSON.parse(parsedJsonText);

    // Save Gemini-parsed fields to candidate profile
    const updatedProfile = await prisma.candidateProfile.update({
      where: { userId: userPayload.userId },
      data: {
        phone: parsedData.phone || undefined,
        location: parsedData.location || undefined,
        bio: parsedData.bio || undefined,
        skills: parsedData.skills || [],
        education: parsedData.education || [],
        experience: parsedData.experience || [],
        certifications: parsedData.certifications || [],
      },
    });

    return NextResponse.json({
      message: 'Resume parsed by Gemini AI and profile updated successfully',
      parsedData,
      profile: updatedProfile,
    });
  } catch (error: any) {
    console.error('Gemini AI Parser Route Error:', error);
    return NextResponse.json({ error: 'Failed to process resume with Gemini AI' }, { status: 500 });
  }
}
