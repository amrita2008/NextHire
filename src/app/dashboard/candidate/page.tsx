'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Briefcase,
  FileText,
  Calendar,
  Code2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Upload,
  User,
  Sparkles,
  ArrowRight
} from 'lucide-react';

function CandidateDashboardContent() {
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('ats_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }

    fetchCandidateData();
  }, []);

  const fetchCandidateData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ats_token');

      // Fetch Applications
      const resApps = await fetch('/api/jobs');
      const dataJobs = await resApps.json();

      let myApps: any[] = [];
      if (dataJobs.jobs) {
        dataJobs.jobs.forEach((job: any) => {
          if (job.applications) {
            job.applications.forEach((app: any) => {
              myApps.push({
                ...app,
                jobTitle: job.title,
                jobDepartment: job.department,
                jobLocation: job.location,
              });
            });
          }
        });
      }
      setApplications(myApps);

      // Fetch Scheduled Interviews
      const resInterviews = await fetch('/api/interviews', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataInterviews = await resInterviews.json();
      if (dataInterviews.interviews) {
        setInterviews(dataInterviews.interviews);
      }

      // Fetch Offers
      const resOffers = await fetch('/api/offers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataOffers = await resOffers.json();
      if (dataOffers.offers) {
        setOffers(dataOffers.offers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-rose-900 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-bold uppercase tracking-wider">
              Candidate Portal
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
              Welcome, {user?.name || 'Applicant'}
            </h1>
            <p className="text-slate-600 text-xs mt-0.5">
              Track your active job applications, scheduled interview video calls, and formal offer letters.
            </p>
          </div>

          <Link
            href="/careers"
            className="px-4.5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <Briefcase className="w-4 h-4" />
            <span>Browse Job Openings</span>
          </Link>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Submitted Applications</span>
            <div className="text-3xl font-extrabold text-slate-900">{applications.length}</div>
            <p className="text-xs text-slate-500">Active hiring pipelines</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Scheduled Video Calls</span>
            <div className="text-3xl font-extrabold text-rose-900">{interviews.length}</div>
            <p className="text-xs text-slate-500">Google Meet links active</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Pending Job Offers</span>
            <div className="text-3xl font-extrabold text-slate-900">{offers.length}</div>
            <p className="text-xs text-slate-500">Formal letter proposals</p>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-8">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Application Progress</h3>
            <span className="text-xs text-slate-500 font-medium">Real-time status updates</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              You haven't submitted any job applications yet.{' '}
              <Link href="/careers" className="text-rose-900 font-bold hover:underline">
                Explore open positions →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Position Title</th>
                    <th className="p-4">Department & Location</th>
                    <th className="p-4">Current Stage</th>
                    <th className="p-4">Applied Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{app.jobTitle}</td>
                      <td className="p-4 text-slate-600 font-medium">
                        {app.jobDepartment} ({app.jobLocation})
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 border border-rose-200 text-rose-900">
                          {app.stage}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <Link
                          href="/dashboard/candidate/interviews"
                          className="px-3 py-1.5 rounded-lg bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs shadow-sm inline-flex items-center gap-1.5"
                        >
                          <span>Interviews</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CandidateDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 text-slate-900 p-10">Loading Candidate Portal...</div>}>
      <CandidateDashboardContent />
    </Suspense>
  );
}
