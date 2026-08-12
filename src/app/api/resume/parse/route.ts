import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { join } from 'path';
import { readFile } from 'fs/promises';
import pdfParse from 'pdf-parse';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const userPayload = token ? verifyJwtToken(token) : null;

    if (!userPayload || userPayload.role !== 'CANDIDATE') {
      return NextResponse.json({ error: 'Unauthorized candidate role access' }, { status: 403 });
    }

    const { fileUrl } = await req.json();
    if (!fileUrl) {
      return NextResponse.json({ error: 'File URL is required' }, { status: 400 });
    }

    // Resolving local file path
    const filePath = join(process.cwd(), 'public', fileUrl);

    let extractedText = '';

    if (fileUrl.endsWith('.pdf')) {
      const buffer = await readFile(filePath);
      const data = await pdfParse(buffer);
      extractedText = data.text;
    } else {
      // Basic text reader fallback for non-PDF files
      return NextResponse.json({ error: 'Unsupported file type for parser parsing' }, { status: 400 });
    }

    if (!extractedText.trim()) {
      return NextResponse.json({ error: 'No readable text could be extracted' }, { status: 422 });
    }

    // Save extracted text to Candidate Profile
    await prisma.candidateProfile.update({
      where: { userId: userPayload.userId },
      data: { resumeText: extractedText, resumeUrl: fileUrl },
    });

    return NextResponse.json({
      message: 'Resume text parsed and saved successfully',
      textSnippet: extractedText.substring(0, 1000),
    });
  } catch (error: any) {
    console.error('Resume Parser Error:', error);
    return NextResponse.json({ error: 'Failed to extract text from resume' }, { status: 500 });
  }
}
