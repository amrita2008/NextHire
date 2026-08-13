'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Briefcase,
  Calendar,
  FileText,
  User,
  Upload,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus
} from 'lucide-react';

export default function CandidateDashboard() {
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('ats_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchCandidateData();
  }, []);

  const fetchCandidateData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ats_token');

      // Fetch Candidate Applications
      const appRes = await fetch('/api/applications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const appData = await appRes.json();
      if (appData.applications) {
        setApplications(appData.applications);
      }

      // Fetch Candidate Interviews
      const intRes = await fetch('/api/interviews', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const intData = await intRes.json();
      if (intData.interviews) {
        setInterviews(intData.interviews);
      }
    } catch (err) {
      console.error('Error fetching candidate dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 text-[11px] font-semibold uppercase tracking-wider">
                Candidate Portal
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">
              Welcome, {user?.name || 'Applicant'}
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Track job application progress, manage your profile resume, and access interview schedules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/careers"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <Briefcase className="w-4 h-4" />
              <span>Browse Job Openings</span>
            </Link>
          </div>
        </div>

        {/* Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Applied Jobs</span>
              <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white mt-4">{applications.length}</p>
            <p className="text-xs text-slate-400 mt-2 font-medium">Active Applications</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Upcoming Interviews</span>
              <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white mt-4">{interviews.length}</p>
            <p className="text-xs text-indigo-400 mt-2 font-medium">
              <Link href="/dashboard/candidate/interviews" className="underline">
                View Calendar Invites →
              </Link>
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">AI Resume Score</span>
              <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white mt-4">Active</p>
            <p className="text-xs text-emerald-400 mt-2 font-medium">Gemini AI Auto-Match Enabled</p>
          </div>
        </div>

        {/* Section: Applications & Scheduled Interviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications List (2 cols) */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Your Job Applications</h2>
                <p className="text-xs text-slate-400">Track application status and progression</p>
              </div>
              <Link
                href="/careers"
                className="text-xs text-indigo-400 font-semibold hover:text-indigo-300 flex items-center gap-1"
              >
                Apply for Jobs <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500 text-sm">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="font-semibold text-white">No active job applications</p>
                <p className="text-xs text-slate-500 mt-1">Explore open positions on the Careers page to submit your application.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {applications.map((app) => (
                  <div key={app.id} className="p-6 hover:bg-slate-850/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white">{app.job?.title}</h3>
                      <p className="text-xs text-slate-400">{app.job?.department} • Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-extrabold border ${
                          app.stage === 'HIRED'
                            ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                            : app.stage === 'REJECTED'
                            ? 'bg-rose-950/80 border-rose-800 text-rose-300'
                            : 'bg-indigo-950/80 border-indigo-700 text-indigo-300'
                        }`}
                      >
                        Stage: {app.stage.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Interviews Sidebar (1 col) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                Upcoming Interviews
              </h2>
              <Link
                href="/dashboard/candidate/interviews"
                className="text-xs text-indigo-400 font-semibold hover:underline"
              >
                View All
              </Link>
            </div>

            {interviews.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs flex-1 flex flex-col justify-center">
                <Calendar className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                No upcoming interviews scheduled yet.
              </div>
            ) : (
              <div className="space-y-3 flex-1">
                {interviews.slice(0, 3).map((interview) => (
                  <div
                    key={interview.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{interview.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-semibold">
                        {interview.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {new Date(interview.scheduledAt).toLocaleString([], {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </p>
                    {interview.meetingUrl && (
                      <a
                        href={interview.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 pt-1"
                      >
                        Join Google Meet Call →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
