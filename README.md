# 🚀 NextHire — Next-Gen AI Applicant Tracking & Engineering Hiring Platform

[![Hackathon Winner Showcase](https://img.shields.io/badge/Hackathon-Winning%20Submission-rose?style=for-the-badge&logo=trophy)](https://github.com/amrita2008/NextHire)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini-2.5%20AI-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Docker Containerized](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

> **NextHire** is an enterprise-grade, end-to-end Applicant Tracking System (ATS) and Technical Hiring Platform designed to eliminate recruitment bottlenecks. Powered by **Google Gemini 2.5 AI**, NextHire unifies multimodal resume screening, automated candidate-to-job fit scoring, interactive drag-and-drop Kanban pipelines, Google Meet interview provisioning, live anti-cheat coding test sandboxes, and PDF offer letter generation into a single unified platform.

---

## 📌 Table of Contents
- [💡 Inspiration & Problem Statement](#-inspiration--problem-statement)
- [🌟 Key Features & Core Innovations](#-key-features--core-innovations)
- [🏗️ Complete Project Directory Structure](#️-complete-project-directory-structure)
- [🛠️ Architecture & Technology Stack](#️-architecture--technology-stack)
- [🚀 Quick Start & Installation Guide](#-quick-start--installation-guide)
- [🐳 Production Docker Setup](#-production-docker-setup)
- [🔑 Hackathon Demo Credentials](#-hackathon-demo-credentials)
- [📖 OpenAPI / Swagger Documentation](#-openapi--swagger-documentation)
- [🔮 Future Roadmap & Potential Improvements](#-future-roadmap--potential-improvements)
- [👥 Hackathon Team & Acknowledgments](#-hackathon-team--acknowledgments)

---

## 💡 Inspiration & Problem Statement

Modern hiring teams waste up to **65% of their time** manually reviewing non-matching resumes, scheduling video interviews across disparate calendars, evaluating unverified technical assessments, and managing tedious paper offer letters.

**The Solution — NextHire:**
We built NextHire to automate the full hiring lifecycle from **Application submission to Hired stage**:
1. **Intelligent Screening:** Instantly rank candidate suitability (0-100%) and detect missing skill gaps with Google Gemini AI.
2. **Unified Pipeline Management:** Manage candidate stage progression visually using a drag-and-drop Kanban workflow.
3. **Automated Scheduling:** Generate Google Meet video conference links with integrated interviewer scorecards.
4. **Fraud-Resistant Technical Tests:** Conduct live coding & SQL assessments backed by real-time tab-switch anti-cheat telemetry.
5. **Seamless Closing:** Issue formal PDF offer letters with candidate decision portals.

---

## 🌟 Key Features & Core Innovations

### 1. 🤖 Multimodal AI Resume Parser & Suitability Matcher
- **Automated Resume Parsing:** Extracts skills, experience timeline, education, certifications, and contact details from PDF, DOCX, or raw text.
- **Gemini AI Match Algorithm:** Evaluates candidate profiles against job requirements, producing a 0-100% suitability match score, key strengths, and actionable gap analysis.

### 2. 📋 Interactive Kanban Recruitment Pipeline
- **8-Stage Workflow:** Drag-and-drop candidates across `Applied`, `Screening`, `Shortlisted`, `Tech Interview`, `HR Interview`, `Offer`, `Hired`, and `Rejected`.
- **Live AI Badges:** Real-time suitability match score pills rendered on candidate cards for instant triage.

### 3. 📅 Google Meet Interview Scheduler & Scorecard Engine
- **Instant Meeting Provisioning:** Auto-generates Google Meet URLs (`https://meet.google.com/xxx-xxxx-xxx`) upon booking.
- **Calendar Invite Generation:** Download `.ics` calendar files directly to sync with Google Calendar or Outlook.
- **Structured Interviewer Scorecards:** Evaluates candidates across Technical Competence, Communication, and Problem Solving with composite rating calculations (`Strong Hire`, `Recommend Hire`, `Neutral`, `Do Not Hire`).

### 4. 💻 Live Code Sandbox with Anti-Cheat Telemetry
- **CodeMirror Test Environment:** In-browser code editor supporting JavaScript, Python, SQL, and Multiple-Choice Questions (MCQs).
- **Live Test Runner Console:** Executes code against test cases with real-time stdout and execution duration logs.
- **Anti-Cheat Monitoring:** Tracks window focus and tab switches (`MAX_TAB_SWITCHES = 3`), triggering automatic test submission on security threshold breach or timer expiration.

### 5. 📜 Dynamic PDF Offer Letter Generator & Candidate Portal
- **Compensation Package Wizard:** Recruiter wizard to define annual salary, currency ($/€/£/₹), start dates, location, and custom executive notes.
- **Candidate Decision Portal:** Interactive letter presentation with instant "Accept Offer" (auto-updates stage to `HIRED`) or "Decline Offer" controls.
- **Print & PDF Export:** Clean `@media print` optimized layout for PDF downloading via browser print.

### 6. 📊 Executive Analytics & System Security Audit Trail
- **Conversion Funnel Analytics:** Visual breakdown of applicant throughput across hiring stages.
- **Time-to-Hire Velocity Metric:** Tracks average days elapsed from initial application to offer acceptance.
- **Admin Security Center:** Role management console (`CANDIDATE`, `RECRUITER`, `HIRING_MANAGER`, `INTERVIEWER`, `ADMIN`) and real-time security audit log trail.

---

## 🏗️ Complete Project Directory Structure

```
NextHire/
├── .dockerignore                  # Docker build exclusion rules
├── Dockerfile                     # Multi-stage production container build (deps -> builder -> runner)
├── docker-compose.yml             # Container orchestration configuration
├── implementation_plan.md         # 25-Commit Hackathon Engineering Roadmap
├── next.config.ts                 # Next.js 15 configuration
├── package.json                   # Dependencies and npm scripts
├── postcss.config.mjs             # PostCSS Tailwind CSS processor
├── README.md                      # Winning Hackathon Documentation
├── tsconfig.json                  # TypeScript compiler settings
├── prisma/
│   └── schema.prisma              # Prisma MongoDB Database Schemas (User, Job, Application, Interview, Assessment, Offer, AuditLog)
├── public/
│   ├── favicon.ico                # Platform icon asset
│   └── swagger.json               # OpenAPI 3.0 REST API Specification
└── src/
    ├── app/
    │   ├── (auth)/
    │   │   ├── login/
    │   │   │   └── page.tsx        # Login authentication page
    │   │   └── register/
    │   │       └── page.tsx        # Account registration page
    │   ├── api/
    │   │   ├── admin/
    │   │   │   ├── audit-logs/
    │   │   │   │   └── route.ts   # GET security audit log trail
    │   │   │   └── users/
    │   │   │       └── route.ts   # GET users list & PATCH user role API
    │   │   ├── ai/
    │   │   │   ├── match-job/
    │   │   │   │   └── route.ts   # POST Gemini AI Resume Matcher API
    │   │   │   └── parse-resume/
    │   │   │       └── route.ts   # POST Gemini AI Resume Extractor API
    │   │   ├── analytics/
    │   │   │   └── route.ts       # GET recruitment conversion funnel analytics
    │   │   ├── applications/
    │   │   │   └── [id]/stage/
    │   │   │       └── route.ts   # PATCH candidate pipeline stage API
    │   │   ├── assessments/
    │   │   │   ├── route.ts       # GET & POST technical coding tests
    │   │   │   └── [id]/
    │   │   │       ├── route.ts   # GET assessment by ID
    │   │   │       └── submit/
    │   │   │           └── route.ts # POST test submission & anti-cheat log
    │   │   ├── auth/
    │   │   │   ├── login/
    │   │   │   │   └── route.ts   # POST login JWT token generator
    │   │   │   └── register/
    │   │   │       └── route.ts   # POST user registration
    │   │   ├── candidate/
    │   │   │   ├── profile/
    │   │   │   │   └── route.ts   # GET & POST candidate profile details
    │   │   │   └── upload/
    │   │   │       └── route.ts   # POST resume file upload parser
    │   │   ├── interviews/
    │   │   │   ├── route.ts       # GET & POST interview schedule & Meet URL generator
    │   │   │   └── [id]/feedback/
    │   │   │       └── route.ts   # POST interviewer scorecard feedback
    │   │   ├── jobs/
    │   │   │   ├── route.ts       # GET & POST job requisitions
    │   │   │   └── [id]/
    │   │   │       └── route.ts   # GET job details by ID
    │   │   ├── offers/
    │   │   │   ├── route.ts       # GET & POST offer letters
    │   │   │   └── [id]/
    │   │   │       └── route.ts   # GET & PATCH offer letter decision
    │   │   └── users/
    │   │       └── route.ts       # GET current user session profile
    │   ├── careers/
    │   │   └── page.tsx           # Public Careers Job Board & Application Modal
    │   ├── dashboard/
    │   │   ├── admin/
    │   │   │   └── page.tsx       # Admin Control Panel & Audit Log Center
    │   │   ├── candidate/
    │   │   │   ├── page.tsx       # Candidate Application Tracker Portal
    │   │   │   ├── assessment/
    │   │   │   │   └── [id]/
    │   │   │   │       └── page.tsx # Candidate Live Coding Test Sandbox
    │   │   │   ├── interviews/
    │   │   │   │   └── page.tsx   # Candidate Interview Schedule & .ics Download
    │   │   │   └── offers/
    │   │   │       └── [id]/
    │   │   │           └── page.tsx # Candidate Offer Letter Decision Portal
    │   │   └── recruiter/
    │   │       ├── page.tsx       # Recruiter Dashboard & Job Requisition Manager
    │   │       ├── analytics/
    │   │       │   └── page.tsx   # Recruitment Funnel Analytics Dashboard
    │   │       ├── assessments/
    │   │       │   └── page.tsx   # Technical Assessment Test Suite Creator
    │   │       ├── candidates/
    │   │       │   └── page.tsx   # Interactive Drag-and-Drop Candidate Kanban Board
    │   │       ├── interviews/
    │   │       │   └── page.tsx   # Interview Scheduling & Scorecard Manager
    │   │       └── offers/
    │   │           └── page.tsx   # Offer Letter Package Generator
    │   ├── docs/
    │   │   └── page.tsx           # Interactive Swagger API Documentation Viewer
    │   ├── globals.css            # Executive Light Mode & Maroon Theme Styles
    │   ├── layout.tsx             # Root layout with font and metadata configuration
    │   └── page.tsx               # Main NextHire Marketing Landing Page
    ├── components/
    │   ├── Footer.tsx             # Responsive Footer Component
    │   ├── InterviewFeedbackModal.tsx # Scorecard Modal for Interviewer Ratings
    │   └── Navbar.tsx             # Responsive Top Header with Navigation
    └── lib/
        ├── auth.ts                # JWT Sign, Verify, & Password Hashing Utilities
        └── db.ts                  # Singleton Prisma Client Instance
```

---

## 🛠️ Architecture & Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 15.1 (App Router)** | Server & Client Components, Route Handlers, Turbopack |
| **UI Library** | **React 19** | Dynamic state management & component hierarchy |
| **Language** | **TypeScript 5.0** | End-to-end type safety across client and server |
| **Styling & Design System** | **Tailwind CSS 3.4** | Executive Light Mode & Maroon Palette (`#800020` / `rose-900`) |
| **Iconography** | **Lucide React** | Modern, clean vector iconography |
| **Database** | **MongoDB Atlas** | Document store for users, applications, tests, and offers |
| **ORM** | **Prisma 5.22** | Type-safe schema definition and query builder |
| **Artificial Intelligence** | **Google Gemini 2.5 AI** | Multimodal resume extraction & candidate-job fit scoring |
| **Authentication** | **JWT & HttpOnly Cookies** | Secure token-based auth with `bcryptjs` password hashing |
| **Code Sandbox** | **CodeMirror** | In-browser code editing, SQL challenges, & stdout execution |
| **Containerization** | **Docker & Docker Compose** | Production multi-stage build containerization |

---

## 🚀 Quick Start & Installation Guide

### Prerequisites
- **Node.js:** `v20.x` or higher
- **npm:** `v10.x` or higher
- **MongoDB Database:** Local MongoDB URI or MongoDB Atlas cluster connection string
- **Google Gemini API Key:** (Optional, for live AI resume evaluation)

### Step-by-Step Installation

```bash
# 1. Clone the repository
git clone https://github.com/amrita2008/NextHire.git
cd NextHire

# 2. Install package dependencies
npm install

# 3. Create environment configuration file (.env)
cat <<EOT > .env
DATABASE_URL="mongodb+srv://demo:demo@cluster0.mongodb.net/nexthire_db"
JWT_SECRET="nexthire_super_secret_jwt_key_2026"
GEMINI_API_KEY="your_google_gemini_api_key_here"
PORT=3000
EOT

# 4. Generate Prisma Client ORM bindings
npx prisma generate

# 5. Launch local development server
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 🐳 Production Docker Setup

Run NextHire in an isolated, multi-stage production container environment:

```bash
# Build and launch NextHire container with Docker Compose
docker-compose up --build -d

# Verify container status
docker ps
```

The application will be accessible at **`http://localhost:3000`**.

---

## 🔑 Hackathon Demo Credentials

Use these pre-seeded test accounts or register a new user on `/register`:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@nexthire.ai` | `Admin123!` | Role management, security audit logs, full system control |
| **Recruiter** | `recruiter@nexthire.ai` | `Recruiter123!` | Kanban board, job posting, interview scheduling, offer letters |
| **Candidate** | `candidate@nexthire.ai` | `Candidate123!` | Job applications, video calls, live coding test sandbox, offer decision |
| **Interviewer** | `interviewer@nexthire.ai` | `Interviewer123!` | Interview calendar, Google Meet calls, evaluation scorecards |

---

## 📖 OpenAPI / Swagger Documentation

Interactive OpenAPI 3.0 REST API documentation is available built into the platform:
- **Interactive UI Viewer:** [http://localhost:3000/docs](http://localhost:3000/docs)
- **Raw OpenAPI JSON Spec:** [http://localhost:3000/swagger.json](http://localhost:3000/swagger.json)

---

## 🔮 Future Roadmap & Potential Improvements

To take NextHire from a hackathon-winning MVP to an industry-dominant hiring platform, we have mapped out the following future expansions:

### 1. 🎙️ Gemini Live Multimodal AI Autonomous Video Interviewer
- **Feature:** Leverage Google Gemini 2.5 Live WebSocket API for real-time, voice-to-voice autonomous technical screening interviews.
- **Impact:** Conducts preliminary technical Q&A sessions with candidates 24/7 before human recruiter involvement, recording full transcripts and sentiment analysis.

### 2. 🛡️ Automated Background Check & Identity Verification (Checkr API)
- **Feature:** Native integration with background check APIs (e.g., Checkr, Trulioo) directly from the `Offer` stage on the Kanban board.
- **Impact:** Reduces hiring risk by automating criminal record verification and employment verification with a single click.

### 3. 🌐 2-Way Calendar Synchronization Engine (Google Workspace & Outlook 365)
- **Feature:** Full OAuth 2.0 integration with Google Calendar and Microsoft Outlook APIs for real-time 2-way interviewer availability detection.
- **Impact:** Completely eliminates scheduling friction by allowing candidates to self-book available slots directly from recruiter calendars.

### 4. 📈 AI Equity & Compensation Intelligence Engine
- **Feature:** Integrate real-time market salary data and equity benchmarking algorithms to suggest competitive salary bands based on role, location, and seniority.
- **Impact:** Empowers recruiters to create compelling offer packages that maximize acceptance rates.

### 5. 🔒 Enterprise Security & Compliance Suite (SOC2, GDPR PII Scrubbing)
- **Feature:** Automated PII (Personally Identifiable Information) redactor to enable blind resume screening for unbiased hiring practices.
- **Impact:** Ensures strict compliance with international privacy laws (GDPR, CCPA) while promoting Diversity, Equity, and Inclusion (DEI).

---

## 👥 Hackathon Team & Acknowledgments

Built with ❤️ by Team **NextHire** for the AI Hackathon. Special thanks to Google DeepMind and the Next.js team for providing cutting-edge AI models and developer tooling.

- **GitHub Repository:** [https://github.com/amrita2008/NextHire](https://github.com/amrita2008/NextHire)
- **License:** MIT License — free for open-source and commercial extension.
