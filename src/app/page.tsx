'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Sparkles,
  Bot,
  Kanban,
  FileCheck,
  Code2,
  BarChart3,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Star,
  Users,
  Building2,
  BrainCircuit,
  Award
} from 'lucide-react';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 text-xs font-semibold mb-8 backdrop-blur-md animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>DevFusion 4.O Hackathon • Next-Gen AI Recruitment SaaS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
            Hire 10x Faster with <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI-Powered Intelligence
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Automate resume screening with Google Gemini, streamline candidate tracking with interactive Kanban boards, run anti-cheat coding assessments, and issue instant offer letters.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register?role=RECRUITER"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <span>Post a Job as Recruiter</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/careers"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-base flex items-center justify-center gap-2 transition-all"
            >
              <Users className="w-5 h-5 text-indigo-400" />
              <span>Browse Open Jobs</span>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-10 border-t border-slate-900">
            <div>
              <p className="text-3xl font-extrabold text-white">87%</p>
              <p className="text-xs text-slate-400 mt-1">Faster Resume Screening</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-indigo-400">95%+</p>
              <p className="text-xs text-slate-400 mt-1">Gemini AI Match Precision</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-purple-400">5 Roles</p>
              <p className="text-xs text-slate-400 mt-1">RBAC Security Controls</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-emerald-400">1-Click</p>
              <p className="text-xs text-slate-400 mt-1">Offer Letter PDF Generation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="py-20 bg-slate-900/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-3">Enterprise Core Features</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">
              Complete End-to-End Recruitment Lifecycle
            </p>
            <p className="text-slate-400 mt-4 text-base">
              Everything your hiring team, interviewers, and candidates need in one unified, collaborative ATS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Resume Parsing & Matching</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Extract candidate skills, education, and experience from PDF/DOCX automatically. Google Gemini compares resumes against Job Descriptions to calculate match %, strengths, and skill gaps.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-purple-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <Kanban className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Interactive Application Kanban</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Drag-and-drop candidates across recruitment stages: Applied, Screening, Shortlisted, Technical Interview, HR Interview, Offer, and Hired.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-pink-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Anti-Cheat Coding Assessments</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Conduct technical screening tests with live countdown timers, in-browser code editor, automated grading, and tab-switch detection.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Offer Letter PDF Generator</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Generate customized offer letters with dynamic fields (salary, role, date, benefits). Candidates can view, accept, reject, or download PDF in 1-click.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Hiring Funnel Analytics</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Visualize candidate conversions, time-to-hire metrics, offer acceptance rates, and recruiter performance with modern charts.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-blue-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Role-Based Access Control</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Strict data scoping across Candidate, Recruiter, Hiring Manager, Interviewer, and Admin roles with full audit log tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-3">Flexible Plans</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">Simple, Transparent Pricing</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Plan 1 */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Starter</h3>
                <p className="text-slate-400 text-xs mt-1">For growing startups hiring tech talent.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">$49</span>
                  <span className="text-slate-400 text-xs">/month</span>
                </div>
                <ul className="mt-8 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Up to 5 Active Jobs</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100 AI Resume Parses/mo</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Basic Kanban Pipeline</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Email Support</li>
                </ul>
              </div>
              <Link href="/register" className="mt-8 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs text-center transition-colors">
                Start Free Trial
              </Link>
            </div>

            {/* Plan 2 - Highlighted */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-indigo-950/80 to-slate-900 border-2 border-indigo-500 flex flex-col justify-between relative shadow-2xl shadow-indigo-600/20">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Growth Pro</h3>
                <p className="text-slate-400 text-xs mt-1">For scaling companies & tech teams.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">$149</span>
                  <span className="text-slate-400 text-xs">/month</span>
                </div>
                <ul className="mt-8 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Unlimited Active Jobs</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Unlimited Gemini AI Matching</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Anti-Cheat Coding Assessments</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Dynamic PDF Offer Letters</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Priority 24/7 Support</li>
                </ul>
              </div>
              <Link href="/register" className="mt-8 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs text-center shadow-lg shadow-indigo-600/30 transition-all">
                Get Pro Access
              </Link>
            </div>

            {/* Plan 3 */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Enterprise</h3>
                <p className="text-slate-400 text-xs mt-1">Custom solutions for large organizations.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">Custom</span>
                </div>
                <ul className="mt-8 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Dedicated Gemini Model Fine-Tuning</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> SSO & Custom RBAC Roles</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Full System Audit Logs</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Dedicated Account Manager</li>
                </ul>
              </div>
              <Link href="/register" className="mt-8 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs text-center transition-colors">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-slate-900/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-3">Frequently Asked Questions</h2>
            <p className="text-3xl font-extrabold text-white">Got Questions? We Have Answers.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does the AI Resume Parsing work?",
                a: "Candidates upload PDF or DOCX resumes (up to 10MB). Our text extraction pipeline feeds the resume into Google Gemini AI, which extracts skills, experience, and education to populate candidate profiles and calculate match scores against open job descriptions."
              },
              {
                q: "What user roles are supported by TalentPulse.AI?",
                a: "The system features 5 RBAC roles: Candidate (applies/tracks), Recruiter (posts jobs/manages candidates), Hiring Manager (reviews shortlisted applicants), Interviewer (submits ratings), and Admin (full system settings and audit logs)."
              },
              {
                q: "How does the anti-cheat Coding Assessment module work?",
                a: "Recruiters can assign coding tests or MCQs to candidates. The test environment includes a live countdown timer, code editor, automatic submission upon expiration, and real-time tab-switch detection."
              },
              {
                q: "Can candidates accept offer letters directly in the platform?",
                a: "Yes! Recruiters generate customized offer letters from templates. Candidates receive notifications, review terms, download the formal PDF, and accept or reject the offer directly from their portal."
              }
            ].map((faq, index) => (
              <div key={index} className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 text-left flex items-center justify-between font-semibold text-white hover:text-indigo-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === index ? 'rotate-180 text-indigo-400' : 'text-slate-500'}`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
