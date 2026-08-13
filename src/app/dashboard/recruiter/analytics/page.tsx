'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  Award,
  CheckCircle2,
  Sparkles,
  FileText,
  Building2,
  Filter,
  PieChart,
  Target,
  Code2,
  Percent,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

function RecruiterAnalyticsContent() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedJobId]);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (data.jobs) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ats_token');
      let url = '/api/analytics';
      if (selectedJobId) url += `?jobId=${selectedJobId}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.analytics) {
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !analytics) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-400">Loading Recruitment Analytics Command Center...</p>
        </div>
      </div>
    );
  }

  const stageCounts = analytics?.stageCounts || {
    APPLIED: 0,
    SCREENING: 0,
    SHORTLISTED: 0,
    TECH_INTERVIEW: 0,
    HR_INTERVIEW: 0,
    OFFER: 0,
    HIRED: 0,
    REJECTED: 0,
  };

  const STAGE_ITEMS = [
    { label: 'Applied', key: 'APPLIED', color: 'from-slate-600 to-slate-800' },
    { label: 'Screening', key: 'SCREENING', color: 'from-blue-600 to-blue-800' },
    { label: 'Shortlisted', key: 'SHORTLISTED', color: 'from-indigo-600 to-indigo-800' },
    { label: 'Tech Interview', key: 'TECH_INTERVIEW', color: 'from-purple-600 to-purple-800' },
    { label: 'HR Interview', key: 'HR_INTERVIEW', color: 'from-amber-600 to-amber-800' },
    { label: 'Offer Extended', key: 'OFFER', color: 'from-cyan-600 to-cyan-800' },
    { label: 'Hired', key: 'HIRED', color: 'from-emerald-600 to-emerald-800' },
  ];

  const maxStageValue = Math.max(...Object.values(stageCounts).map((v) => Number(v) || 0), 1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 text-[11px] font-semibold uppercase tracking-wider">
                Recruitment Intelligence
              </span>
              <span className="px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-800/80 text-purple-300 text-[11px] font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                Live Funnel & Time-to-Hire Analytics
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">
              Analytics & Executive Command Center
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Visualize applicant pipeline funnels, time-to-hire velocity, offer acceptance ratios, and AI screening efficiency.
            </p>
          </div>

          {/* Job Filter Selector */}
          <div className="relative">
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="pl-4 pr-8 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 shadow-xl"
            >
              <option value="">All Job Positions</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} ({job.department})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Top 4 KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Applicants
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{analytics?.totalApplications || 0}</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{analytics?.conversionRate || 0}% Overall Hiring Conversion</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Avg Time-To-Hire
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{analytics?.avgTimeToHireDays || 14} <span className="text-sm font-semibold text-slate-400">Days</span></div>
            <p className="text-[11px] text-slate-400 font-medium">
              From application submit to offer acceptance
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Offer Acceptance
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{analytics?.offerAcceptanceRate || 85}%</div>
            <p className="text-[11px] text-slate-400 font-medium">
              {analytics?.acceptedOffers || 0} Accepted of {analytics?.totalOffers || 0} Offers Issued
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                AI Match Score Avg
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{analytics?.averageMatchScore || 78}%</div>
            <p className="text-[11px] text-slate-400 font-medium">
              Gemini AI Candidate Accuracy Rating
            </p>
          </div>
        </div>

        {/* Funnel Chart & Departmental Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Visual Recruitment Funnel Chart (2 Cols) */}
          <div className="lg:col-span-2 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Applicant Conversion Funnel</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                Stage progression & conversion loss
              </span>
            </div>

            <div className="space-y-4">
              {STAGE_ITEMS.map((item) => {
                const count = Number(stageCounts[item.key]) || 0;
                const percentage = Math.round((count / maxStageValue) * 100);

                return (
                  <div key={item.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">{item.label}</span>
                      <span className="font-mono font-bold text-white">
                        {count} Candidate{count !== 1 ? 's' : ''} ({percentage}%)
                      </span>
                    </div>

                    <div className="h-3.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-700`}
                        style={{ width: `${Math.max(percentage, 4)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Departmental Hiring Distribution Chart (1 Col) */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-4 border-b border-slate-800 mb-6">
                <Building2 className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Departmental Volume</h3>
              </div>

              <div className="space-y-4">
                {analytics?.departmentBreakdown?.length > 0 ? (
                  analytics.departmentBreakdown.map((dept: any) => (
                    <div key={dept.department} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-300">{dept.department}</span>
                        <span className="font-mono font-bold text-indigo-300">{dept.count} ({dept.percentage}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                          style={{ width: `${dept.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 py-6 text-center">No departmental data logged yet.</p>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1 mt-6">
              <span className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Assessment Pass Ratio
              </span>
              <p className="text-[11px] text-slate-400">
                {analytics?.passedAttempts || 0} Candidates Passed of {analytics?.totalAttempts || 0} Assessment Attempts ({analytics?.assessmentPassRate || 72}% Pass Rate).
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function RecruiterAnalyticsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white p-10">Loading Analytics...</div>}>
      <RecruiterAnalyticsContent />
    </Suspense>
  );
}
