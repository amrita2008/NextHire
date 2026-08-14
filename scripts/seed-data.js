const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/nexthire?replicaSet=rs0',
    },
  },
});

async function seed() {
  console.log('--- Starting NextHire Hackathon Data Seeding ---');

  try {
    // 1. Clean existing collections
    console.log('Cleaning up existing database records...');
    await prisma.auditLog.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.offerLetter.deleteMany({});
    await prisma.assessmentAttempt.deleteMany({});
    await prisma.codingAssessment.deleteMany({});
    await prisma.interviewFeedback.deleteMany({});
    await prisma.interview.deleteMany({});
    await prisma.application.deleteMany({});
    await prisma.job.deleteMany({});
    await prisma.candidateProfile.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.company.deleteMany({});

    console.log('Creating demo company...');
    const company = await prisma.company.create({
      data: {
        name: 'TalentPulse AI Systems',
        website: 'https://talentpulse.ai',
        industry: 'Artificial Intelligence & Software',
        companySize: '100-500',
        description: 'Building next-generation enterprise recruitment automation tools powered by Google Gemini AI.',
        officeLocations: ['San Francisco, CA', 'New York, NY', 'Remote'],
      },
    });

    console.log('Creating demo users...');
    const adminPasswordHash = await bcrypt.hash('Admin123!', 10);
    const recruiterPasswordHash = await bcrypt.hash('Recruiter123!', 10);
    const candidatePasswordHash = await bcrypt.hash('Candidate123!', 10);
    const interviewerPasswordHash = await bcrypt.hash('Interviewer123!', 10);

    // Admin
    const adminUser = await prisma.user.create({
      data: {
        name: 'Alex Rivera (System Admin)',
        email: 'admin@nexthire.ai',
        passwordHash: adminPasswordHash,
        role: 'ADMIN',
        companyId: company.id,
        isEmailVerified: true,
      },
    });

    // Recruiter
    const recruiterUser = await prisma.user.create({
      data: {
        name: 'Sarah Jenkins (Lead Recruiter)',
        email: 'recruiter@nexthire.ai',
        passwordHash: recruiterPasswordHash,
        role: 'RECRUITER',
        companyId: company.id,
        isEmailVerified: true,
      },
    });

    // Interviewer
    const interviewerUser = await prisma.user.create({
      data: {
        name: 'David Vance (Staff Architect & Interviewer)',
        email: 'interviewer@nexthire.ai',
        passwordHash: interviewerPasswordHash,
        role: 'INTERVIEWER',
        companyId: company.id,
        isEmailVerified: true,
      },
    });

    // Candidate 1 (Primary Demo Candidate)
    const candidateUser1 = await prisma.user.create({
      data: {
        name: 'Shrishti Sharma',
        email: 'candidate@nexthire.ai',
        passwordHash: candidatePasswordHash,
        role: 'CANDIDATE',
        isEmailVerified: true,
      },
    });

    const candidateProfile1 = await prisma.candidateProfile.create({
      data: {
        userId: candidateUser1.id,
        phone: '+1 (555) 349-8201',
        location: 'San Francisco, CA',
        bio: 'Senior Full-Stack & AI Engineer with 5+ years of experience building distributed Next.js, Node.js, and Python microservices.',
        education: ['B.S. Computer Science - Stanford University (2021)'],
        experience: [
          'Senior Software Engineer at TechCorp (2022 - Present)',
          'Full-Stack Developer at AI Startup (2020 - 2022)',
        ],
        skills: ['TypeScript', 'Next.js', 'React', 'Node.js', 'Python', 'Google Gemini AI', 'Prisma', 'MongoDB', 'Docker', 'GraphQL'],
        certifications: ['AWS Certified Solutions Architect', 'Google Cloud AI Professional'],
        portfolioUrl: 'https://shrishti.dev',
        githubUrl: 'https://github.com/shrishti-demo',
        linkedinUrl: 'https://linkedin.com/in/shrishti-demo',
        resumeText: `
          Shrishti Sharma
          Senior Full-Stack & AI Engineer
          Email: candidate@nexthire.ai | Location: San Francisco, CA

          Summary:
          Senior Software Engineer specializing in modern JavaScript/TypeScript web architectures, Next.js App Router, React 19, Python AI model integration (Google Gemini, OpenAI), GraphQL APIs, and high-performance MongoDB/PostgreSQL database optimization.

          Technical Skills:
          - Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS, Redux Toolkit
          - Backend: Node.js, Express, Python FastAPI, REST & GraphQL APIs, Prisma ORM
          - AI / ML: Google Gemini 2.5 API, RAG Architecture, Vector Databases, Prompt Engineering
          - Infrastructure: Docker, Docker Compose, AWS Lambda, Kubernetes, CI/CD Pipelines

          Work Experience:
          Senior Full-Stack Engineer — TechCorp (2022 - Present)
          - Architected enterprise Next.js dashboard handling 50k+ daily active users.
          - Integrated Google Gemini AI API to automate document parsing and workflow classification, reducing manual triage time by 70%.
          - Managed Prisma ORM MongoDB schemas and optimized query indexing.

          Full-Stack Developer — InnovateAI (2020 - 2022)
          - Built real-time collaborative workspace tools with React, Node.js, and WebSockets.
          - Implemented JWT authentication, role-based access control (RBAC), and security audit logging.

          Education:
          B.S. in Computer Science — Stanford University (2017 - 2021)
        `,
      },
    });

    // Candidate 2
    const candidateUser2 = await prisma.user.create({
      data: {
        name: 'Marcus Vance',
        email: 'marcus.vance@example.com',
        passwordHash: candidatePasswordHash,
        role: 'CANDIDATE',
        isEmailVerified: true,
      },
    });

    const candidateProfile2 = await prisma.candidateProfile.create({
      data: {
        userId: candidateUser2.id,
        phone: '+1 (555) 891-2300',
        location: 'New York, NY',
        bio: 'DevOps & Cloud Infrastructure Specialist with deep Kubernetes and Terraform expertise.',
        skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'Python', 'Go', 'CI/CD'],
        resumeText: 'Marcus Vance DevOps Cloud Specialist Kubernetes Docker Terraform AWS Ansible Go Python',
      },
    });

    // Candidate 3
    const candidateUser3 = await prisma.user.create({
      data: {
        name: 'Elena Rostova',
        email: 'elena.rostova@example.com',
        passwordHash: candidatePasswordHash,
        role: 'CANDIDATE',
        isEmailVerified: true,
      },
    });

    const candidateProfile3 = await prisma.candidateProfile.create({
      data: {
        userId: candidateUser3.id,
        phone: '+1 (555) 412-9081',
        location: 'Austin, TX',
        bio: 'Frontend UI/UX Specialist with React 19, Next.js, and Tailwind CSS expertise.',
        skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Figma', 'GraphQL'],
        resumeText: 'Elena Rostova Frontend UI UX React TypeScript Next.js Tailwind CSS Design Systems',
      },
    });

    // Candidate 4
    const candidateUser4 = await prisma.user.create({
      data: {
        name: 'David Kim',
        email: 'david.kim@example.com',
        passwordHash: candidatePasswordHash,
        role: 'CANDIDATE',
        isEmailVerified: true,
      },
    });

    const candidateProfile4 = await prisma.candidateProfile.create({
      data: {
        userId: candidateUser4.id,
        phone: '+1 (555) 762-1190',
        location: 'Seattle, WA',
        bio: 'Backend & Systems Performance Engineer with Python and Distributed Systems experience.',
        skills: ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Redis', 'Kafka'],
        resumeText: 'David Kim Backend Systems Engineer Python FastAPI PostgreSQL Redis Kafka Distributed Systems',
      },
    });

    console.log('Creating demo job requisitions...');
    const job1 = await prisma.job.create({
      data: {
        companyId: company.id,
        createdById: recruiterUser.id,
        title: 'Senior Full-Stack AI Engineer',
        department: 'Engineering',
        location: 'San Francisco, CA (Hybrid)',
        salaryMin: 140000,
        salaryMax: 180000,
        currency: 'USD',
        experienceRequired: '4+ years',
        skillsRequired: ['TypeScript', 'Next.js', 'React', 'Node.js', 'Google Gemini AI', 'Prisma', 'MongoDB', 'Docker'],
        employmentType: 'FULL_TIME',
        workMode: 'HYBRID',
        description: 'We are seeking an exceptional Senior Full-Stack AI Engineer to architect our next-gen hiring automation platform. You will build cutting-edge web applications using Next.js 15, React 19, TypeScript, Prisma ORM, and integrate Google Gemini AI models.',
        status: 'OPEN',
      },
    });

    const job2 = await prisma.job.create({
      data: {
        companyId: company.id,
        createdById: recruiterUser.id,
        title: 'Lead DevOps & Cloud Architect',
        department: 'Infrastructure',
        location: 'New York, NY (Remote)',
        salaryMin: 150000,
        salaryMax: 190000,
        currency: 'USD',
        experienceRequired: '5+ years',
        skillsRequired: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'CI/CD', 'Go'],
        employmentType: 'FULL_TIME',
        workMode: 'REMOTE',
        description: 'Join our cloud platform team to scale microservices across multi-region AWS environments using Kubernetes, Terraform, Docker containers, and automated deployment pipelines.',
        status: 'OPEN',
      },
    });

    const job3 = await prisma.job.create({
      data: {
        companyId: company.id,
        createdById: recruiterUser.id,
        title: 'Staff Frontend UI Engineer',
        department: 'Product',
        location: 'Remote',
        salaryMin: 130000,
        salaryMax: 165000,
        currency: 'USD',
        experienceRequired: '3+ years',
        skillsRequired: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Figma'],
        employmentType: 'FULL_TIME',
        workMode: 'REMOTE',
        description: 'Craft stunning, high-performance user interfaces and responsive web applications for enterprise workflows.',
        status: 'OPEN',
      },
    });

    console.log('Creating demo applications across Kanban pipeline stages...');
    // Application 1: Primary Demo Candidate -> OFFER stage
    const app1 = await prisma.application.create({
      data: {
        jobId: job1.id,
        candidateId: candidateProfile1.id,
        stage: 'OFFER',
        matchScore: 94,
        matchDetails: 'Candidate demonstrates 94% alignment with full-stack requirements, exhibiting strong proficiency in TypeScript, Next.js, Node.js, Prisma ORM, and Google Gemini AI integration.',
        notes: 'Top candidate. Passed technical coding challenge with perfect score and excellent interview scorecard.',
      },
    });

    // Application 2: Marcus Vance -> TECH_INTERVIEW stage
    const app2 = await prisma.application.create({
      data: {
        jobId: job2.id,
        candidateId: candidateProfile2.id,
        stage: 'TECH_INTERVIEW',
        matchScore: 89,
        matchDetails: 'Candidate exhibits 89% match score for DevOps role. Strong Kubernetes and Terraform experience.',
        notes: 'Scheduled for technical architecture interview.',
      },
    });

    // Application 3: Elena Rostova -> SHORTLISTED stage
    const app3 = await prisma.application.create({
      data: {
        jobId: job3.id,
        candidateId: candidateProfile3.id,
        stage: 'SHORTLISTED',
        matchScore: 85,
        matchDetails: '85% suitability score. Excellent React and Tailwind CSS expertise.',
        notes: 'Shortlisted for initial screening call.',
      },
    });

    // Application 4: David Kim -> SCREENING stage
    const app4 = await prisma.application.create({
      data: {
        jobId: job1.id,
        candidateId: candidateProfile4.id,
        stage: 'SCREENING',
        matchScore: 78,
        matchDetails: '78% suitability match score. Strong backend experience, growing frontend skills.',
        notes: 'Resume under initial recruiter review.',
      },
    });

    console.log('Creating demo scheduled interview with Google Meet URL...');
    const interview1 = await prisma.interview.create({
      data: {
        applicationId: app1.id,
        interviewerId: interviewerUser.id,
        title: 'Technical Deep Dive & Architecture Review',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        durationMinutes: 60,
        meetingUrl: 'https://meet.google.com/nexthire-demo-meet',
        status: 'SCHEDULED',
      },
    });

    console.log('Creating demo interview scorecard feedback...');
    await prisma.interviewFeedback.create({
      data: {
        interviewId: interview1.id,
        interviewerId: interviewerUser.id,
        technicalRating: 5,
        communicationRating: 5,
        problemSolvingRating: 5,
        overallRating: 5,
        comments: 'Strong Hire. Candidate demonstrated mastery of distributed React/Next.js architectures, database schema design, and AI integration.',
      },
    });

    console.log('Creating demo coding assessment challenge...');
    const assessment = await prisma.codingAssessment.create({
      data: {
        jobId: job1.id,
        title: 'Full-Stack Technical Coding & SQL Challenge',
        durationMinutes: 60,
        passPercentage: 70,
        questionsJson: JSON.stringify([
          {
            id: 'q1',
            type: 'CODE',
            title: 'Two Sum Array Index Optimization',
            description: 'Write a JavaScript function `twoSum(nums, target)` that returns indices of the two numbers such that they add up to `target`. Must run in O(n) time complexity.',
            initialCode: 'function twoSum(nums, target) {\n  // Write your solution here\n}',
          },
          {
            id: 'q2',
            type: 'SQL',
            title: 'Top Candidate Application Query',
            description: 'Write an SQL query to select candidates whose match score is greater than 80%, ordered by match score descending.',
            initialCode: 'SELECT * FROM candidates WHERE match_score > 80 ORDER BY match_score DESC;',
          },
          {
            id: 'q3',
            type: 'MCQ',
            title: 'Next.js App Router Server Components',
            description: 'Which of the following statements about React Server Components in Next.js App Router is true?',
            options: [
              'Server components render exclusively on the server and do not add to client bundle size.',
              'Server components allow using useState and useEffect hooks natively.',
              'Server components cannot perform asynchronous database queries.',
              'Server components require "use client" directive at top of file.',
            ],
            correctAnswerIndex: 0,
          },
        ]),
      },
    });

    console.log('Creating demo candidate assessment attempt...');
    await prisma.assessmentAttempt.create({
      data: {
        assessmentId: assessment.id,
        candidateUserId: candidateUser1.id,
        applicationId: app1.id,
        score: 95,
        passed: true,
        answersJson: JSON.stringify({ q1: 'Passed', q2: 'Passed', q3: 'Passed' }),
        tabSwitchesCount: 0,
      },
    });

    console.log('Creating demo pending offer letter...');
    const offer = await prisma.offerLetter.create({
      data: {
        applicationId: app1.id,
        role: 'Senior Full-Stack AI Engineer',
        salary: 165000,
        joiningDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        location: 'San Francisco, CA (Hybrid)',
        benefits: 'Comprehensive Medical/Dental/Vision, 401(k) 4% Match, $3,000 Annual Learning Stipend, Flexible Unlimited PTO, Remote Home Office Setup Allowance.',
        status: 'PENDING',
      },
    });

    console.log('Creating demo security audit logs...');
    await prisma.auditLog.createMany({
      data: [
        {
          userId: adminUser.id,
          action: 'SYSTEM_INITIALIZATION',
          entity: 'System',
          details: 'NextHire AI platform database initialized with security policies.',
        },
        {
          userId: recruiterUser.id,
          action: 'CREATE_JOB_REQUISITION',
          entity: 'Job',
          entityId: job1.id,
          details: 'Created job posting: Senior Full-Stack AI Engineer',
        },
        {
          userId: recruiterUser.id,
          action: 'SCHEDULE_INTERVIEW',
          entity: 'Interview',
          entityId: interview1.id,
          details: 'Provisioned Google Meet URL for interview with candidate Shrishti Sharma',
        },
        {
          userId: recruiterUser.id,
          action: 'ISSUE_OFFER_LETTER',
          entity: 'OfferLetter',
          entityId: offer.id,
          details: 'Generated formal offer letter package ($165,000 / year)',
        },
      ],
    });

    console.log('\n======================================================');
    console.log('✅ NEXTHIRE HACKATHON DEMO DATA SEEDED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('\nDemo User Logins:');
    console.log('1. Admin:       admin@nexthire.ai        (Password: Admin123!)');
    console.log('2. Recruiter:   recruiter@nexthire.ai    (Password: Recruiter123!)');
    console.log('3. Candidate:   candidate@nexthire.ai    (Password: Candidate123!)');
    console.log('4. Interviewer: interviewer@nexthire.ai  (Password: Interviewer123!)');
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ Data Seeding Failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
