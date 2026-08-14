'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  Sparkles,
  Users,
  Briefcase,
  Calendar,
  Code2,
  FileText,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  Target,
  Clock,
  Award,
  Video,
  Brain,
  GitBranch,
  Lock,
  Shield,
  Globe,
  Cpu,
  TrendingUp
} from 'lucide-react';

const FEATURES = [
  {
    icon: Sparkles,
    category: 'AI-Powered',
    title: 'Gemini AI Resume Matching Engine',
    description:
      'Google Gemini 1.5 Flash multimodal AI parses PDF and plain-text resumes, generates a 0-100% suitability score, identifies technical skill gaps, and provides actionable interview preparation guidance.',
    badge: 'Gemini 1.5 Flash',
    badgeColor: 'bg-purple-50 border-purple-200 text-purple-800',
    actions: [
      { label: 'Try AI Resume Parsing', href: '/dashboard/candidate' },
      { label: 'Run Job Matching', href: '/dashboard/recruiter/candidates' },
    ],
    highlights: [
      'Multimodal resume text extraction',
      '0–100% suitability match scoring',
      'Skills gap analysis & interview tips',
      'Auto-populates candidate profile fields',
    ],
  },
  {
    icon: GitBranch,
    category: 'Recruiter Tools',
    title: 'Interactive Drag-and-Drop Kanban Pipeline',
    description:
      'Move candidates through 8 structured hiring stages — Applied, Screening, Shortlisted, Tech Interview, HR Interview, Offer, Hired, and Rejected — with instant backend sync on every drag action.',
    badge: 'Real-time Sync',
    badgeColor: 'bg-blue-50 border-blue-200 text-blue-800',
    actions: [{ label: 'Open Kanban Board', href: '/dashboard/recruiter/candidates' }],
    highlights: [
      '8-stage hiring pipeline (APPLIED → HIRED)',
      'Drag-and-drop with instant backend update',
      'AI match score pills on every candidate card',
      'Stage-based interview scheduling triggers',
    ],
  },
  {
    icon: Video,
    category: 'Interview Suite',
    title: 'Google Meet Interview Scheduler',
    description:
      'Auto-generates unique Google Meet links on every interview booking with structured scorecard templates. Candidates can add to calendar via downloadable .ics files.',
    badge: 'Google Meet API',
    badgeColor: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    actions: [
      { label: 'Schedule Interview', href: '/dashboard/recruiter/interviews' },
      { label: 'Candidate Interview Portal', href: '/dashboard/candidate/interviews' },
    ],
    highlights: [
      'Auto-generated Google Meet URLs',
      'ICS calendar file downloads',
      'Structured interviewer scorecards',
      'Multi-round interview tracking',
    ],
  },
  {
    icon: Code2,
    category: 'Assessment Platform',
    title: 'Live Coding Sandbox & Anti-Cheat Engine',
    description:
      'In-browser code editor with JavaScript/SQL algorithm challenges, live test case execution, countdown timer, and tab-switch anti-cheat detection that auto-submits after 3 violations.',
    badge: 'Anti-Cheat Active',
    badgeColor: 'bg-rose-50 border-rose-200 text-rose-900',
    actions: [
      { label: 'Create Assessment', href: '/dashboard/recruiter/assessments' },
      { label: 'View Candidate Sandbox', href: '/dashboard/candidate' },
    ],
    highlights: [
      'CodeMirror in-browser JavaScript editor',
      'Real-time test case execution output',
      'Anti-cheat tab-switch monitoring (3x limit)',
      '45-minute countdown timer with auto-submit',
    ],
  },
  {
    icon: FileText,
    category: 'Offer Management',
    title: 'Formal Offer Letter Generation & Decision Portal',
    description:
      'Recruiters generate structured offer packages with salary, joining date, and benefits. Candidates accept or decline via a dedicated decision portal — accepting auto-transitions stage to HIRED.',
    badge: 'PDF Export',
    badgeColor: 'bg-amber-50 border-amber-200 text-amber-800',
    actions: [
      { label: 'Generate Offer Letter', href: '/dashboard/recruiter/offers' },
      { label: 'Candidate Decision Portal', href: '/dashboard/candidate' },
    ],
    highlights: [
      'Salary breakdown with currency support',
      'Candidate acceptance/decline portal',
      'Auto-transitions to HIRED on acceptance',
      'Full offer history tracking',
    ],
  },
  {
    icon: BarChart3,
    category: 'Analytics',
    title: 'Real-Time Recruitment Analytics Dashboard',
    description:
      'Visual recruitment funnel charts, time-to-hire velocity metrics, department-wise offer acceptance rates, and conversion percentages across all pipeline stages.',
    badge: 'Live Metrics',
    badgeColor: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    actions: [{ label: 'View Analytics Dashboard', href: '/dashboard/recruiter/analytics' }],
    highlights: [
      'Conversion funnel visualization',
      'Average time-to-hire tracking (14 days avg)',
      '85% offer acceptance rate benchmark',
      'Department & role-level breakdowns',
    ],
  },
  {
    icon: ShieldCheck,
    category: 'Admin & Security',
    title: 'Role-Based Access Control & Audit Logs',
    description:
      'Granular RBAC enforcing permissions across Admin, Recruiter, Hiring Manager, Interviewer, and Candidate roles. Every action is logged in a tamper-resistant security audit trail.',
    badge: 'Enterprise Security',
    badgeColor: 'bg-slate-100 border-slate-300 text-slate-700',
    actions: [{ label: 'Admin Control Panel', href: '/dashboard/admin' }],
    highlights: [
      '5-tier role hierarchy (Admin → Candidate)',
      'JWT-signed bearer token authentication',
      'Immutable security audit log trail',
      'Brute-force login protection',
    ],
  },
  {
    icon: Globe,
    category: 'Careers Portal',
    title: 'Public Careers Job Board & Application Portal',
    description:
      'A public-facing job board where candidates discover openings, filter by department and work mode, upload resumes, and submit applications with cover letters directly from the portal.',
    badge: 'Public Access',
    badgeColor: 'bg-teal-50 border-teal-200 text-teal-800',
    actions: [{ label: 'Browse Open Positions', href: '/careers' }],
    highlights: [
      'Public job search with smart filtering',
      'One-click application with resume upload',
      'Instant application confirmation',
      'Mobile-responsive card layout',
    ],
  },
];

const STATS = [
  { label: 'Resume Screening Automation', value: '95%', icon: Cpu },
  { label: 'Average Time-to-Hire', value: '14 Days', icon: Clock },
  { label: 'Offer Acceptance Rate', value: '85%', icon: Award },
  { label: 'Anti-Cheat Security', value: '100%', icon: Shield },
  { label: 'API Endpoints', value: '21+', icon: Zap },
  { label: 'Pipeline Stages', value: '8 Stages', icon: TrendingUp },
];

function FeaturesContent() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-rose-900 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-16">
        {/* Hero Header */}
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            NextHire Platform Capabilities
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 max-w-3xl mx-auto leading-tight">
            Every Feature You Need to Hire <span className="text-rose-900">Smarter & Faster</span>
          </h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            An AI-powered end-to-end applicant tracking system for recruiters, hiring managers, candidates, and interviewers — all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/docs"
              className="px-6 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm shadow-sm transition-all"
            >
              View API Documentation
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {STATS.map((stat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-1 hover:border-rose-900/30 transition-all"
            >
              <stat.icon className="w-5 h-5 text-rose-900 mx-auto mb-1" />
              <div className="text-2xl font-extrabold text-slate-900">{stat.value}</div>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xs font-extrabold text-rose-900 uppercase tracking-wider">Core Platform Modules</h2>
            <h3 className="text-2xl font-extrabold text-slate-900">8 Integrated Feature Modules</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              const isExpanded = activeFeature === idx;

              return (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl bg-white border shadow-sm transition-all duration-300 space-y-4 ${
                    isExpanded ? 'border-rose-900/40 shadow-md' : 'border-slate-200 hover:border-rose-900/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-rose-900 text-white flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${feature.badgeColor}`}>
                          {feature.badge}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">{feature.title}</h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{feature.description}</p>

                  {/* Highlights */}
                  <div className="grid grid-cols-1 gap-1.5">
                    {feature.highlights.map((h, hi) => (
                      <div key={hi} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap gap-2 border-t border-slate-100">
                    {feature.actions.map((action, ai) => (
                      <Link
                        key={ai}
                        href={action.href}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          ai === 0
                            ? 'bg-rose-900 hover:bg-rose-800 text-white shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                        }`}
                      >
                        <span>{action.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="px-3 py-1 rounded-full bg-rose-900/80 border border-rose-700 text-rose-200 text-xs font-bold uppercase tracking-wider">
              DevFusion 4.0 Hackathon Project
            </span>
            <h3 className="text-3xl font-extrabold text-white">Start Using NextHire Today</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Log in as a Recruiter or Candidate to experience all 8 feature modules live with pre-seeded demo data.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link
              href="/login"
              className="px-6 py-3.5 rounded-xl bg-rose-800 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all text-center"
            >
              Log In to Dashboard
            </Link>
            <Link
              href="/careers"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all text-center"
            >
              Browse Open Jobs
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function FeaturesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 text-slate-900 p-10">Loading Features...</div>}>
      <FeaturesContent />
    </Suspense>
  );
}
