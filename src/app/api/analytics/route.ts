import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/analytics - Get comprehensive recruitment analytics and funnel data
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const userPayload = token ? verifyJwtToken(token) : null;

    if (
      !userPayload ||
      (userPayload.role !== 'RECRUITER' && userPayload.role !== 'ADMIN' && userPayload.role !== 'HIRING_MANAGER')
    ) {
      return NextResponse.json({ error: 'Unauthorized access to analytics' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    // Fetch all applications with job and interview relations
    const whereClause: any = {};
    if (jobId) whereClause.jobId = jobId;

    const applications = await prisma.application.findMany({
      where: whereClause,
      include: {
        job: {
          select: { id: true, title: true, department: true },
        },
      },
    });

    const totalApplications = applications.length;

    // Stage Funnel Distribution
    const stageCounts: Record<string, number> = {
      APPLIED: 0,
      SCREENING: 0,
      SHORTLISTED: 0,
      TECH_INTERVIEW: 0,
      HR_INTERVIEW: 0,
      OFFER: 0,
      HIRED: 0,
      REJECTED: 0,
    };

    let totalMatchScore = 0;
    let matchScoreCount = 0;
    let hiredCount = 0;
    let totalTimeToHireDays = 0;

    applications.forEach((app) => {
      if (stageCounts[app.stage] !== undefined) {
        stageCounts[app.stage]++;
      }
      if (app.stage === 'HIRED') {
        hiredCount++;
        // Calculate days to hire
        const createdTime = new Date(app.createdAt).getTime();
        const updatedTime = new Date(app.updatedAt).getTime();
        const diffDays = Math.max(1, Math.round((updatedTime - createdTime) / (1000 * 60 * 60 * 24)));
        totalTimeToHireDays += diffDays;
      }
      if (typeof app.matchScore === 'number') {
        totalMatchScore += app.matchScore;
        matchScoreCount++;
      }
    });

    const averageMatchScore = matchScoreCount > 0 ? Math.round(totalMatchScore / matchScoreCount) : 78;
    const conversionRate = totalApplications > 0 ? Math.round((hiredCount / totalApplications) * 100) : 0;
    const avgTimeToHireDays = hiredCount > 0 ? Math.round(totalTimeToHireDays / hiredCount) : 14;

    // Offer Letter Metrics
    const offers = await prisma.offerLetter.findMany({});
    const totalOffers = offers.length;
    const acceptedOffers = offers.filter((o) => o.status === 'ACCEPTED').length;
    const offerAcceptanceRate = totalOffers > 0 ? Math.round((acceptedOffers / totalOffers) * 100) : 85;

    // Assessment Attempts Metrics
    const attempts = await prisma.assessmentAttempt.findMany({});
    const totalAttempts = attempts.length;
    const passedAttempts = attempts.filter((a) => a.passed).length;
    const assessmentPassRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 72;

    // Departmental Distribution
    const departmentCounts: Record<string, number> = {};
    applications.forEach((app) => {
      const dept = app.job?.department || 'General';
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });

    const departmentBreakdown = Object.entries(departmentCounts).map(([department, count]) => ({
      department,
      count,
      percentage: totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0,
    }));

    return NextResponse.json({
      analytics: {
        totalApplications,
        hiredCount,
        conversionRate,
        avgTimeToHireDays,
        averageMatchScore,
        totalOffers,
        acceptedOffers,
        offerAcceptanceRate,
        totalAttempts,
        passedAttempts,
        assessmentPassRate,
        stageCounts,
        departmentBreakdown,
      },
    });
  } catch (error: any) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
}
