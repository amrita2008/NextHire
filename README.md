# NextHire — Enterprise AI-Powered Applicant Tracking System (ATS) & Hiring Platform 🚀

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma)](https://www.prisma.io/)
[![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini-2.5-4285F4?logo=google)](https://ai.google.dev/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker)](https://www.docker.com/)

> **NextHire** is an end-to-end, enterprise-grade Applicant Tracking System (ATS) and hiring platform built for high-growth tech companies and recruiters. Powered by **Google Gemini 2.5 AI**, NextHire automates resume parsing, candidate scoring, interview scheduling with Google Meet links, live coding assessments with anti-cheat monitoring, and dynamic PDF offer letter generation.

---

## 🌟 Key Features & Capabilities

### 1. 🤖 Google Gemini AI Resume Parsing & Matcher
- **Multimodal Resume Extraction:** Automatically extracts candidate skills, experience years, education, certifications, and contacts from PDF, DOCX, or plain text.
- **Match Score & Gap Analysis:** Computes a 0-100% suitability match score, listing key strengths and missing skill gaps for every job opening.

### 2. 📋 Interactive Kanban Application Pipeline
- **Drag-and-Drop Workflow:** Seamlessly progress applicants across custom recruitment stages (`Applied` -> `Screening` -> `Shortlisted` -> `Tech Interview` -> `HR Interview` -> `Offer` -> `Hired` -> `Rejected`).
- **AI Screening Badges:** Real-time match score badges on candidate cards.

### 3. 📅 Interview Scheduler & Google Meet Integration
- **Auto-Generated Meeting Links:** Automatically provisions Google Meet video call URLs (`https://meet.google.com/xxx-xxxx-xxx`) upon booking.
- **Calendar & Schedule Views:** Monthly calendar & list views for recruiters, interviewers, and candidate portals.
- **Add to Calendar & .ICS Download:** Candidate calendar invite generation.
- **Interviewer Feedback Modal:** Evaluates candidates across Technical Skills, Communication, and Problem Solving with live composite score calculations (`Strong Hire`, `Recommend Hire`, `Borderline`, `No Hire`).

### 4. 💻 Live Coding Assessment & Anti-Cheat Sandbox
- **In-Browser Code Mirror Editor:** Interactive code editor for Multiple Choice Questions (MCQ), SQL challenges, and coding tasks (JavaScript, Python, SQL).
- **Execution Output Console:** Executes code against test cases with live stdout logs.
- **Anti-Cheat Monitoring:** Monitors window focus/tab switches (`MAX_TAB_SWITCHES = 3`), locks copy-pasting, and triggers auto-submission on security violations or timer expiration (`0:00`).

### 5. 📜 Dynamic PDF Offer Letter Generator & Portal
- **Compensation Package Wizard:** Recruiter tool to specify base salary, currency ($/€/£/₹), joining date, location, and custom executive welcome notes.
- **Candidate Decision Portal:** Interactive letter presentation with "Accept Job Offer" (auto-updates stage to `HIRED`) and "Decline Offer" controls.
- **PDF Print Export:** Built-in `@media print` optimized CSS for clean PDF downloads via browser print.

### 6. 📊 Analytics & Executive Control Center
- **Recruitment Conversion Funnel Chart:** Stage conversion rates and drop-off analysis.
- **Time-to-Hire Velocity Metric:** Tracks average days from application submission to offer acceptance.
- **Admin Control Panel & Security Audit Log:** User role assignment management (`CANDIDATE`, `RECRUITER`, `HIRING_MANAGER`, `INTERVIEWER`, `ADMIN`) and system-wide security audit trail.

---

## 🛠️ Architecture & Technology Stack

- **Framework:** Next.js 15.1 (App Router) + React 19 + TypeScript
- **Styling:** Vanilla CSS + Tailwind CSS (Light Mode & Executive Maroon Design System)
- **Database & ORM:** MongoDB Atlas + Prisma ORM 5.22
- **Artificial Intelligence:** Google Gemini 2.5 AI (`@google/genai`)
- **Icons & UI:** Lucide React Icons
- **Authentication:** JWT (JSON Web Tokens) with HttpOnly cookies & bcryptjs password hashing
- **DevOps & Containerization:** Multi-stage Dockerfile + Docker Compose

---

## 🚀 Quick Start & Local Setup Guide

### 1. Prerequisites
- **Node.js:** `v20.x` or higher
- **npm:** `v10.x` or higher
- **MongoDB Database:** MongoDB URI or Atlas cluster connection string
- **Google Gemini API Key:** (Optional, for live AI resume parsing)

### 2. Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/amrita2008/NextHire.git
cd NextHire

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Create a .env file in the project root:
DATABASE_URL="mongodb+srv://demo:demo@cluster0.mongodb.net/nexthire_db"
JWT_SECRET="nexthire_super_secret_jwt_key_2026"
GEMINI_API_KEY="your_gemini_api_key_here"

# 4. Generate Prisma Client
npx prisma generate

# 5. Start Next.js Development Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker Deployment

To build and run NextHire in production container mode:

```bash
# Build and run container with Docker Compose
docker-compose up --build -d

# Verify container status
docker ps
```

The application will be accessible at `http://localhost:3000`.

---

## 🔑 Demo Login Credentials

For quick testing, use the following credentials or create new accounts on `/register`:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@nexthire.ai` | `Admin123!` |
| **Recruiter** | `recruiter@nexthire.ai` | `Recruiter123!` |
| **Candidate** | `candidate@nexthire.ai` | `Candidate123!` |
| **Interviewer** | `interviewer@nexthire.ai` | `Interviewer123!` |

---

## 📖 API Documentation

Interactive Swagger API Documentation is available at:
`http://localhost:3000/docs` or via `/swagger.json`.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more details.
