'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Code2,
  FileText,
  Lock,
  Sparkles,
  Server,
  Terminal,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Globe,
  Zap,
  Shield,
  Play,
  Key,
  Users,
  Briefcase,
  Calendar,
  BarChart3,
  Award
} from 'lucide-react';

const API_ENDPOINTS = [
  {
    category: 'Authentication',
    color: 'rose',
    icon: Lock,
    endpoints: [
      {
        method: 'POST',
        path: '/api/auth/register',
        summary: 'Register New User',
        description: 'Registers a new Candidate, Recruiter, Hiring Manager, or Interviewer with JWT token response.',
        requestBody: JSON.stringify({ name: 'Jane Doe', email: 'jane@nexthire.ai', password: 'Password123!', role: 'CANDIDATE' }, null, 2),
        responseExample: JSON.stringify({ message: 'User registered successfully', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', user: { id: 'uid123', name: 'Jane Doe', role: 'CANDIDATE' } }, null, 2),
        auth: false,
      },
      {
        method: 'POST',
        path: '/api/auth/login',
        summary: 'Authenticate & Issue JWT Token',
        description: 'Validates credentials and returns a signed JWT bearer token for subsequent API requests.',
        requestBody: JSON.stringify({ email: 'recruiter@nexthire.ai', password: 'Recruiter123!' }, null, 2),
        responseExample: JSON.stringify({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', user: { id: 'uid456', role: 'RECRUITER' } }, null, 2),
        auth: false,
      },
    ],
  },
  {
    category: 'Gemini AI Engine',
    color: 'purple',
    icon: Sparkles,
    endpoints: [
      {
        method: 'POST',
        path: '/api/ai/parse-resume',
        summary: 'AI Resume Parsing (Gemini 1.5 Flash)',
        description: 'Uses Google Gemini AI to parse raw resume text and extract structured profile data including skills, education, experience, certifications, phone, and location.',
        requestBody: JSON.stringify({ resumeText: 'Jane Doe - Senior Engineer - 5 years React, Node.js, TypeScript...' }, null, 2),
        responseExample: JSON.stringify({ parsedData: { phone: '+1-555-0100', location: 'San Francisco, CA', bio: 'Senior full-stack engineer...', skills: ['React', 'TypeScript', 'Node.js'], education: ['B.Tech, IIT Delhi, 2019'] } }, null, 2),
        auth: true,
      },
      {
        method: 'POST',
        path: '/api/ai/match-job',
        summary: 'Candidate-Job AI Fit Scoring',
        description: 'Runs Gemini AI analysis to generate a 0-100% suitability match score, key technical strengths, and missing skills gap analysis for a candidate-job pair.',
        requestBody: JSON.stringify({ applicationId: 'app_id_here' }, null, 2),
        responseExample: JSON.stringify({ matchScore: 94, strengths: ['TypeScript', 'Next.js', 'MongoDB'], missingSkills: ['Kubernetes'], explanation: 'Strong alignment with 94% score across core requirements.' }, null, 2),
        auth: true,
      },
    ],
  },
  {
    category: 'Job Requisitions',
    color: 'blue',
    icon: Briefcase,
    endpoints: [
      {
        method: 'GET',
        path: '/api/jobs',
        summary: 'List All Open Job Postings',
        description: 'Returns all active job requisitions with company details, skill requirements, salary ranges, and candidate application counts.',
        requestBody: null,
        responseExample: JSON.stringify({ jobs: [{ id: 'job1', title: 'Senior Full-Stack AI Engineer', department: 'Engineering', location: 'San Francisco, CA', salaryMin: 140000, salaryMax: 180000 }] }, null, 2),
        auth: false,
      },
      {
        method: 'POST',
        path: '/api/jobs',
        summary: 'Create New Job Requisition',
        description: 'Creates a new job posting. Requires RECRUITER or HIRING_MANAGER role. Supports remote/hybrid/onsite work modes.',
        requestBody: JSON.stringify({ title: 'Lead DevOps Engineer', department: 'Infrastructure', location: 'Remote', salaryMin: 130000, salaryMax: 160000, skillsRequired: ['AWS', 'Kubernetes', 'Terraform'] }, null, 2),
        responseExample: JSON.stringify({ message: 'Job created successfully', job: { id: 'new_job_id', status: 'OPEN' } }, null, 2),
        auth: true,
      },
    ],
  },
  {
    category: 'Applications Pipeline',
    color: 'emerald',
    icon: Users,
    endpoints: [
      {
        method: 'POST',
        path: '/api/applications/apply',
        summary: 'Submit Job Application',
        description: 'Candidate submits an application for an open job posting. Attaches resume text for Gemini AI evaluation.',
        requestBody: JSON.stringify({ jobId: 'job_id_here', coverLetter: 'I am excited to apply...', resumeText: 'Jane Doe - Engineer...' }, null, 2),
        responseExample: JSON.stringify({ message: 'Application submitted successfully', application: { id: 'app_id', stage: 'APPLIED' } }, null, 2),
        auth: true,
      },
      {
        method: 'PATCH',
        path: '/api/applications/[id]/stage',
        summary: 'Update Candidate Pipeline Stage',
        description: 'Moves a candidate application to a new Kanban stage. Stages: APPLIED → SCREENING → SHORTLISTED → TECH_INTERVIEW → HR_INTERVIEW → OFFER → HIRED / REJECTED.',
        requestBody: JSON.stringify({ stage: 'TECH_INTERVIEW', notes: 'Strong candidate, technical round confirmed.' }, null, 2),
        responseExample: JSON.stringify({ message: 'Stage updated successfully', application: { stage: 'TECH_INTERVIEW' } }, null, 2),
        auth: true,
      },
    ],
  },
  {
    category: 'Interview Scheduling',
    color: 'amber',
    icon: Calendar,
    endpoints: [
      {
        method: 'GET',
        path: '/api/interviews',
        summary: 'List Scheduled Interviews',
        description: 'Returns all scheduled interviews for the logged-in user with Google Meet URLs, scheduled times, and interviewer details.',
        requestBody: null,
        responseExample: JSON.stringify({ interviews: [{ id: 'int1', scheduledAt: '2026-08-15T10:00:00Z', meetingUrl: 'https://meet.google.com/nexthire-demo-meet', status: 'SCHEDULED', durationMinutes: 60 }] }, null, 2),
        auth: true,
      },
      {
        method: 'POST',
        path: '/api/interviews',
        summary: 'Schedule Interview & Auto-Generate Google Meet',
        description: 'Books a technical or HR interview with automatic Google Meet link generation, interviewer assignment, and calendar invite support.',
        requestBody: JSON.stringify({ applicationId: 'app_id_here', interviewerId: 'user_id_here', scheduledAt: '2026-08-15T10:00:00Z', durationMinutes: 60, title: 'Technical Architecture Round' }, null, 2),
        responseExample: JSON.stringify({ message: 'Interview scheduled', interview: { id: 'int2', meetingUrl: 'https://meet.google.com/abc-defg-hij' } }, null, 2),
        auth: true,
      },
    ],
  },
  {
    category: 'Coding Assessments',
    color: 'indigo',
    icon: Code2,
    endpoints: [
      {
        method: 'GET',
        path: '/api/assessments',
        summary: 'List Technical Assessments',
        description: 'Returns all coding assessments with question sets, time limits, pass thresholds, and attempt counts.',
        requestBody: null,
        responseExample: JSON.stringify({ assessments: [{ id: 'a1', title: 'Full Stack Engineering Challenge', durationMinutes: 45, passPercentage: 70 }] }, null, 2),
        auth: true,
      },
      {
        method: 'POST',
        path: '/api/assessments/[id]/submit',
        summary: 'Submit Assessment Answers',
        description: 'Submits candidate code answers and MCQ responses for anti-cheat evaluation. Includes tab-switch telemetry data.',
        requestBody: JSON.stringify({ codeAnswers: { q1: 'function solution(arr) { return arr.reverse(); }' }, mcqAnswers: { q2: 'A' }, tabSwitchCount: 0 }, null, 2),
        responseExample: JSON.stringify({ message: 'Assessment submitted', attempt: { score: 88, passed: true } }, null, 2),
        auth: true,
      },
    ],
  },
  {
    category: 'Offer Letters',
    color: 'rose',
    icon: FileText,
    endpoints: [
      {
        method: 'POST',
        path: '/api/offers',
        summary: 'Generate Formal Offer Letter',
        description: 'Creates a structured offer letter with salary breakdown, joining date, and benefit package. Sends decision portal link to candidate.',
        requestBody: JSON.stringify({ applicationId: 'app_id_here', salary: 165000, joiningDate: '2026-09-01', location: 'San Francisco, CA', benefits: 'Health, Dental, 401k, Stock options', currency: 'USD' }, null, 2),
        responseExample: JSON.stringify({ message: 'Offer letter generated', offer: { id: 'offer_id', status: 'PENDING', salary: 165000 } }, null, 2),
        auth: true,
      },
      {
        method: 'PATCH',
        path: '/api/offers/[id]',
        summary: 'Accept or Decline Job Offer',
        description: 'Candidate accepts or declines the job offer. Accepting auto-transitions the application stage to HIRED.',
        requestBody: JSON.stringify({ status: 'ACCEPTED' }, null, 2),
        responseExample: JSON.stringify({ message: 'Offer accepted successfully', offer: { status: 'ACCEPTED' }, application: { stage: 'HIRED' } }, null, 2),
        auth: true,
      },
    ],
  },
  {
    category: 'Analytics & Admin',
    color: 'slate',
    icon: BarChart3,
    endpoints: [
      {
        method: 'GET',
        path: '/api/analytics',
        summary: 'Recruitment Funnel Analytics',
        description: 'Returns pipeline conversion metrics, time-to-hire velocity, offer acceptance rate, and stage distribution counts.',
        requestBody: null,
        responseExample: JSON.stringify({ totalApplications: 47, stageBreakdown: { APPLIED: 12, SCREENING: 8, SHORTLISTED: 7, TECH_INTERVIEW: 6, OFFER: 4, HIRED: 10 }, avgTimeToHire: 14, offerAcceptanceRate: 85 }, null, 2),
        auth: true,
      },
      {
        method: 'GET',
        path: '/api/admin/audit-logs',
        summary: 'Security Audit Logs (Admin Only)',
        description: 'Returns all security and role activity audit trail entries. Requires ADMIN role.',
        requestBody: null,
        responseExample: JSON.stringify({ logs: [{ action: 'USER_REGISTER', userId: 'uid1', timestamp: '2026-08-14T08:00:00Z', metadata: { role: 'CANDIDATE' } }] }, null, 2),
        auth: true,
      },
    ],
  },
];

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  POST: 'bg-blue-100 text-blue-800 border-blue-200',
  PATCH: 'bg-amber-100 text-amber-800 border-amber-200',
  PUT: 'bg-violet-100 text-violet-800 border-violet-200',
  DELETE: 'bg-rose-100 text-rose-800 border-rose-200',
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function EndpointCard({ endpoint }: { endpoint: any }) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'request' | 'response'>('request');
  const [isLiveTesting, setIsLiveTesting] = useState(false);
  const [liveResult, setLiveResult] = useState<string | null>(null);

  const handleLiveTest = async () => {
    setIsLiveTesting(true);
    setLiveResult(null);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('ats_token') : '';
      const opts: RequestInit = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          ...(endpoint.auth && token ? { Authorization: `Bearer ${token}` } : {}),
        },
      };
      if (endpoint.requestBody && endpoint.method !== 'GET') {
        opts.body = endpoint.requestBody;
      }

      const path = endpoint.path.replace(/\[.*?\]/g, 'test_id');
      const res = await fetch(path, opts);
      const text = await res.text();
      let pretty = text;
      try { pretty = JSON.stringify(JSON.parse(text), null, 2); } catch {}
      setLiveResult(`HTTP ${res.status}\n\n${pretty}`);
    } catch (err: any) {
      setLiveResult(`Error: ${err.message}`);
    } finally {
      setIsLiveTesting(false);
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-all"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${METHOD_COLORS[endpoint.method] || 'bg-slate-100 text-slate-700 border-slate-200'} shrink-0`}
          >
            {endpoint.method}
          </span>
          <code className="text-sm font-mono text-slate-800 font-semibold truncate">{endpoint.path}</code>
          {endpoint.auth && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 border border-amber-200 text-amber-700 shrink-0">
              🔑 Auth Required
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-slate-500 font-medium hidden sm:block">{endpoint.summary}</span>
          {expanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">{endpoint.description}</p>

          {/* Tabs */}
          {(endpoint.requestBody || endpoint.responseExample) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                {endpoint.requestBody && (
                  <button
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${activeTab === 'request' ? 'bg-rose-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                    onClick={() => setActiveTab('request')}
                  >
                    Request Body
                  </button>
                )}
                <button
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${activeTab === 'response' ? 'bg-rose-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                  onClick={() => setActiveTab('response')}
                >
                  Response Example
                </button>
                <button
                  onClick={handleLiveTest}
                  disabled={isLiveTesting}
                  className="ml-auto text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Play className="w-3 h-3 fill-current" />
                  {isLiveTesting ? 'Testing...' : 'Live Test'}
                </button>
              </div>

              {activeTab === 'request' && endpoint.requestBody && (
                <div className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    <CopyButton text={endpoint.requestBody} />
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed custom-scrollbar pr-10">
                    {endpoint.requestBody}
                  </pre>
                </div>
              )}

              {activeTab === 'response' && endpoint.responseExample && (
                <div className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    <CopyButton text={endpoint.responseExample} />
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed custom-scrollbar pr-10">
                    {endpoint.responseExample}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Live Test Result */}
          {liveResult && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Live Response</span>
              <pre className="p-4 rounded-xl bg-slate-900 text-blue-300 font-mono text-xs overflow-x-auto leading-relaxed custom-scrollbar max-h-60">
                {liveResult}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SwaggerDocsContent() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [copiedCurl, setCopiedCurl] = useState(false);

  const filteredCategories = API_ENDPOINTS.filter((cat) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      cat.category.toLowerCase().includes(term) ||
      cat.endpoints.some(
        (e) =>
          e.path.toLowerCase().includes(term) ||
          e.summary.toLowerCase().includes(term) ||
          e.method.toLowerCase().includes(term)
      )
    );
  });

  const totalEndpoints = API_ENDPOINTS.reduce((acc, cat) => acc + cat.endpoints.length, 0);

  const sampleCurl = `curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"recruiter@nexthire.ai","password":"Recruiter123!"}'`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-rose-900 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-bold uppercase tracking-wider">
              OpenAPI 3.0 Specification
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
              {totalEndpoints} Endpoints
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-600" />
              Live Testing Enabled
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900">
                Next<span className="text-rose-900">Hire</span> Developer API
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Interactive REST API explorer — click any endpoint to expand, test live, and copy examples.
              </p>
            </div>
            <a
              href="/swagger.json"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-slate-800 transition-all self-start"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Download swagger.json
            </a>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'API Endpoints', value: totalEndpoints, icon: Server, color: 'rose' },
            { label: 'JWT Auth Routes', value: 13, icon: Shield, color: 'amber' },
            { label: 'AI-Powered APIs', value: 2, icon: Sparkles, color: 'purple' },
            { label: 'Response Time', value: '< 50ms', icon: Zap, color: 'emerald' },
          ].map((stat, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <stat.icon className="w-5 h-5 text-rose-900 mb-1" />
              <div className="text-2xl font-extrabold text-slate-900">{stat.value}</div>
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Base URL & Auth Helper */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Base URL</span>
            </div>
            <code className="text-sm font-mono text-emerald-400">http://localhost:3000/api</code>
            <p className="text-xs text-slate-400">All endpoints are prefixed with the base URL above.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-rose-900" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Authentication</span>
            </div>
            <p className="text-xs text-slate-600">Pass your JWT token as a Bearer token in the Authorization header:</p>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900">
              <code className="text-xs font-mono text-emerald-400 flex-1">Authorization: Bearer &lt;your_jwt_token&gt;</code>
              <CopyButton text="Authorization: Bearer <your_jwt_token>" />
            </div>
          </div>
        </div>

        {/* Sample cURL */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-rose-900" />
              <span className="text-sm font-bold text-slate-900">Quick Start — Get Your Token</span>
            </div>
            <CopyButton text={sampleCurl} />
          </div>
          <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed custom-scrollbar">
            {sampleCurl}
          </pre>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search endpoints (e.g. /api/ai, POST, offers...)"
            className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 text-sm focus:border-rose-900 focus:outline-none shadow-sm"
          />
          <Terminal className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>

        {/* Endpoint Groups */}
        <div className="space-y-6">
          {filteredCategories.map((category) => {
            const Icon = category.icon;
            const isOpen = activeCategory === category.category;

            return (
              <div key={category.category} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <button
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-all"
                  onClick={() => setActiveCategory(isOpen ? null : category.category)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-900">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-bold text-slate-900">{category.category}</h3>
                      <p className="text-xs text-slate-500">{category.endpoints.length} endpoints</p>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 border-t border-slate-100 space-y-3 pt-4">
                    {category.endpoints.map((ep) => (
                      <EndpointCard key={ep.path + ep.method} endpoint={ep} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function DocsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 text-slate-900 p-10">Loading API Documentation...</div>}>
      <SwaggerDocsContent />
    </Suspense>
  );
}
