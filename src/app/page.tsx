'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
  Award
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-rose-900 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-rose-900" />
          <span>Next-Generation Enterprise ATS Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Hire Top Talent Faster with <span className="text-rose-900">NextHire</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mt-5 leading-relaxed">
          An all-in-one Applicant Tracking System combining AI resume matching, interactive candidate Kanban pipelines, Google Meet scheduling, live coding assessments, and dynamic PDF offer letters.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/careers"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Briefcase className="w-4 h-4 text-rose-900" />
            <span>Explore Open Jobs</span>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 pt-10 border-t border-slate-200">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
            <span className="text-2xl font-black text-rose-900 block">95%</span>
            <span className="text-xs text-slate-500 font-medium">Resume Screening Speed</span>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
            <span className="text-2xl font-black text-rose-900 block">14 Days</span>
            <span className="text-xs text-slate-500 font-medium">Average Time-to-Hire</span>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
            <span className="text-2xl font-black text-rose-900 block">85%</span>
            <span className="text-xs text-slate-500 font-medium">Offer Acceptance Rate</span>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
            <span className="text-2xl font-black text-rose-900 block">100%</span>
            <span className="text-xs text-slate-500 font-medium">Anti-Cheat Security</span>
          </div>
        </div>
      </section>

      {/* Main Feature Cards Section */}
      <section id="features" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-extrabold text-rose-900 uppercase tracking-wider mb-2">Core Platform Capabilities</h2>
            <h3 className="text-3xl font-extrabold text-slate-900">Everything You Need to Streamline Recruitment</h3>
            <p className="text-sm text-slate-600 mt-2">Built for recruiters, hiring managers, candidates, and engineering interviewers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-rose-900/40 shadow-sm transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-900 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">AI Resume Matching</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Google Gemini AI parses PDF/DOCX resumes, calculates a 0-100% suitability match score, and highlights skill gaps automatically.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-rose-900/40 shadow-sm transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-900 text-white flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Candidate Kanban Board</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Drag-and-drop pipeline stages from Applied to Screening, Tech Interview, Offer, and Hired with live stage sync.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-rose-900/40 shadow-sm transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-900 text-white flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Interview Calendar & Meet Links</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Auto-generates Google Meet links, coordinates team calendar slots, and includes structured interviewer scoring feedback.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-rose-900/40 shadow-sm transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-900 text-white flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Coding Tests & Anti-Cheat</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                In-browser CodeMirror sandbox for MCQs, SQL, and algorithm tasks with live execution logs, timer countdowns, and tab-switch monitoring.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-rose-900/40 shadow-sm transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-900 text-white flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">PDF Offer Letter Generator</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate official offer letters with salary breakdown, joining dates, candidate acceptance portals, and clean PDF export.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-rose-900/40 shadow-sm transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-900 text-white flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Recruitment Analytics & Admin</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visual conversion funnel charts, time-to-hire velocity stats, role management controls, and real-time security audit trails.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Demo Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="px-3 py-1 rounded-full bg-rose-900/80 border border-rose-700 text-rose-200 text-xs font-bold uppercase tracking-wider">
              Ready to Upgrade Your Hiring?
            </span>
            <h3 className="text-3xl font-extrabold text-white">Experience NextHire Today</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Join hiring teams using NextHire to automate candidate evaluation and deliver outstanding candidate experiences.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link
              href="/register"
              className="px-6 py-3.5 rounded-xl bg-rose-800 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all text-center"
            >
              Register Recruiter Account
            </Link>
            <Link
              href="/careers"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all text-center"
            >
              Browse Careers
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
