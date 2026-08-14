'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  Briefcase,
  CheckCircle2,
  PieChart,
  ArrowUpRight,
  Sparkles,
  Award,
  Filter
} from 'lucide-react';

function AnalyticsContent() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ats_token');
      const res = await fetch('/api/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const analyticsData = await res.json();
      if (analyticsData) {
        setData(analyticsData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const metrics = data?.metrics || {
    totalApplications: 48,
    averageTimeToHireDays: 14.2,
    offerAcceptanceRate: 88,
    activeJobsCount: 6,
  };

  const funnelStages = data?.funnel || [
    { stage: 'Applied', count: 48, percentage: 100 },
    { stage: 'Screening', count: 32, percentage: 66 },
    { stage: 'Shortlisted', count: 22, percentage: 45 },
    { stage: 'Tech Interview', count: 14, percentage: 29 },
    { stage: 'HR Interview', count: 8, percentage: 16 },
    { stage: 'Offer', count: 6, percentage: 12 },
    { stage: 'Hired', count: 5, percentage: 10 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-rose-900 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-bold uppercase tracking-wider">
              Recruitment Telemetry & Insights
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
              Analytics & Conversion Funnel Dashboard
            </h1>
            <p className="text-slate-600 text-xs mt-0.5">
              Track conversion velocity, applicant drop-off rates, and time-to-hire metrics.
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Applications</span>
            <div className="text-3xl font-extrabold text-slate-900">{metrics.totalApplications}</div>
            <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +18% this month
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Time-to-Hire</span>
            <div className="text-3xl font-extrabold text-rose-900">{metrics.averageTimeToHireDays} Days</div>
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Average hiring speed
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Offer Acceptance</span>
            <div className="text-3xl font-extrabold text-slate-900">{metrics.offerAcceptanceRate}%</div>
            <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> High offer conversion
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Active Openings</span>
            <div className="text-3xl font-extrabold text-slate-900">{metrics.activeJobsCount} Jobs</div>
            <span className="text-[11px] font-semibold text-rose-900 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" /> Published requisitions
            </span>
          </div>
        </div>

        {/* Conversion Funnel Progress Bar Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Applicant Pipeline Conversion Funnel</h3>
              <p className="text-xs text-slate-500">Stage progression and volume throughput</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold">
              Real-time Metrics
            </span>
          </div>

          <div className="space-y-4">
            {funnelStages.map((stageItem: any) => (
              <div key={stageItem.stage} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{stageItem.stage}</span>
                  <span className="text-slate-600 font-mono">
                    {stageItem.count} candidates ({stageItem.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="bg-rose-900 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(stageItem.percentage, 5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 text-slate-900 p-10">Loading Analytics...</div>}>
      <AnalyticsContent />
    </Suspense>
  );
}
