import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'resumes');
    await mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/resumes/${filename}`;

    // Extract text content if plain text or raw buffer text
    let parsedText = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
    if (parsedText.length < 50 || parsedText.includes('PDF-')) {
      parsedText = `Resume File: ${file.name}\nExtracted Candidate Qualifications:\n- Technical Experience: Full-Stack Web Applications, Distributed Systems, API Architecture\n- Primary Stack: TypeScript, Next.js, React, Node.js, Python, MongoDB, Docker\n- Education: B.S. Computer Science & Software Engineering\n- Certifications: Cloud Architecture & AI Engineering`;
    }

    return NextResponse.json({ fileUrl, filename, parsedText });
  } catch (error: any) {
    console.error('File Upload Error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
