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
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';

function SwaggerDocsContent() {
  const [swaggerSpec, setSwaggerSpec] = useState<any>(null);

  useEffect(() => {
    fetch('/swagger.json')
      .then((res) => res.json())
      .then((data) => setSwaggerSpec(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-rose-900 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-bold uppercase tracking-wider">
              OpenAPI 3.0 Specification
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1">
              <Terminal className="w-3 h-3 text-slate-500" />
              REST API Documentation
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Next<span className="text-rose-900">Hire</span> Developer API Documentation
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Explore and test API endpoints for AI resume parsing, candidate scoring, interview scheduling, coding assessments, and offer letter generation.
          </p>
        </div>

        {/* OpenAPI Quick Spec Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-900 font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Authentication & Roles</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              JWT bearer token authorization supporting Candidate, Recruiter, Hiring Manager, Interviewer, and Admin access levels.
            </p>
            <div className="text-[11px] font-mono text-rose-900 pt-2 border-t border-slate-100">
              POST /api/auth/login • POST /api/auth/register
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-900 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Gemini AI Matching Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Multimodal resume parsing and automated job fit scoring (0-100%) powered by Google Gemini 2.5 API.
            </p>
            <div className="text-[11px] font-mono text-rose-900 pt-2 border-t border-slate-100">
              POST /api/ai/match-job • POST /api/ai/parse-resume
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-900 font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Offers & Assessments API</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Live coding test environment evaluations, anti-cheat security logging, and PDF offer letter generation.
            </p>
            <div className="text-[11px] font-mono text-rose-900 pt-2 border-t border-slate-100">
              POST /api/assessments/submit • POST /api/offers
            </div>
          </div>
        </div>

        {/* JSON Spec Viewer Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-rose-900" />
              <h3 className="text-base font-bold text-slate-900">OpenAPI 3.0 Raw Specification</h3>
            </div>
            <a
              href="/swagger.json"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 hover:bg-rose-900 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Download swagger.json</span>
            </a>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-[500px] custom-scrollbar leading-relaxed">
            <pre>{JSON.stringify(swaggerSpec, null, 2)}</pre>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function DocsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 text-slate-900 p-10">Loading Documentation...</div>}>
      <SwaggerDocsContent />
    </Suspense>
  );
}
