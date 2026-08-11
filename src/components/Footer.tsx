import React from 'react';
import Link from 'next/link';
import { Sparkles, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white">TalentPulse.AI</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Enterprise-grade AI Applicant Tracking System empowering recruiting teams to parse resumes, match top candidates, schedule interviews, and make data-driven hiring decisions.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2.5">
              <li><Link href="/#features" className="hover:text-white transition-colors">AI Resume Parser</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors">Kanban Pipeline</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors">Coding Assessments</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing Plans</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2.5">
              <li><Link href="/careers" className="hover:text-white transition-colors">Public Careers Portal</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Recruiter Dashboard</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Candidate Portal</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Hackathon Info</h4>
            <p className="text-xs text-slate-500 mb-2">DevFusion 4.O Hackathon Project</p>
            <p className="text-xs text-slate-500">Problem Statement 2: AI-Powered Recruitment & ATS</p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 TalentPulse.AI. Built for DevFusion 4.O Hackathon. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Security Audit</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
