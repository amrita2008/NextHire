'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-800 flex items-center justify-center text-white font-bold text-sm">
                N
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Next<span className="text-rose-400">Hire</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enterprise Applicant Tracking & AI Hiring Platform. Streamlining candidate sourcing, interview scheduling, live coding assessments, and offer letters.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Product Platform</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers Portal</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors">AI Resume Matcher</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors">Kanban Pipeline</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors">Coding Assessments</Link></li>
            </ul>
          </div>

          <div>
            <div className="space-y-2 text-xs text-slate-400">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Developer & Security</h4>
              <li><Link href="/docs" className="hover:text-white transition-colors">OpenAPI Swagger Specs</Link></li>
              <li><span className="text-slate-400">Google Meet Integration</span></li>
              <li><span className="text-slate-400">Anti-Cheat Security Audit</span></li>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Enterprise Support</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-2">
              Need custom ATS integrations or dedicated hiring pipelines?
            </p>
            <Link href="/register" className="inline-block text-xs font-bold text-rose-400 hover:text-rose-300">
              Contact Enterprise Sales →
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NextHire Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/" className="hover:text-slate-400">Terms of Service</Link>
            <Link href="/docs" className="hover:text-slate-400">API Specs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
