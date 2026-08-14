'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Users,
  Briefcase,
  Calendar,
  Code2,
  FileText,
  BarChart3,
  Plus,
  ArrowRight,
  TrendingUp,
  Search,
  Sparkles,
  MapPin,
  Clock,
  DollarSign
} from 'lucide-react';

function RecruiterDashboardContent() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeCandidates: 0,
    scheduledInterviews: 0,
    pendingOffers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // New Job Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('HYBRID');
  const [type, setType] = useState('FULL_TIME');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [description, setDescription] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('ats_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (data.jobs) {
        setJobs(data.jobs);
        setStats((prev) => ({
          ...prev,
          totalJobs: data.jobs.length,
          activeCandidates: data.jobs.reduce((acc: number, j: any) => acc + (j.applications?.length || 0), 0),
        }));
      }
    } catch (err) {
      console.error('Fetch Jobs Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const token = localStorage.getItem('ats_token');
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          department,
          location,
          workMode,
          type,
          salaryMin: salaryMin ? parseInt(salaryMin) : undefined,
          salaryMax: salaryMax ? parseInt(salaryMax) : undefined,
          description,
          skillsRequired: skillsRequired.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post job opening');

      setShowCreateModal(false);
      fetchDashboardData();
    } catch (err: any) {
      alert(err.message || 'Error creating job opening');
    } finally {
      setCreating(false);
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
              Recruitment Command Center
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
              Welcome back, {user?.name || 'Recruiter'}
            </h1>
            <p className="text-slate-600 text-xs mt-0.5">
              Overview of active job requisitions, candidate pipelines, and scheduling telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4.5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Requisition</span>
            </button>
          </div>
        </div>

        {/* Quick Nav Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link
            href="/dashboard/recruiter/candidates"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-rose-900/40 shadow-sm transition-all flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-900 font-bold group-hover:bg-rose-900 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Candidate Kanban</span>
              <span className="text-sm font-bold text-slate-900">Manage Pipeline →</span>
            </div>
          </Link>

          <Link
            href="/dashboard/recruiter/interviews"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-rose-900/40 shadow-sm transition-all flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-900 font-bold group-hover:bg-rose-900 group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Interview Schedule</span>
              <span className="text-sm font-bold text-slate-900">Google Meet Invites →</span>
            </div>
          </Link>

          <Link
            href="/dashboard/recruiter/assessments"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-rose-900/40 shadow-sm transition-all flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-900 font-bold group-hover:bg-rose-900 group-hover:text-white transition-colors">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Coding Tests</span>
              <span className="text-sm font-bold text-slate-900">Anti-Cheat Suite →</span>
            </div>
          </Link>

          <Link
            href="/dashboard/recruiter/offers"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-rose-900/40 shadow-sm transition-all flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-900 font-bold group-hover:bg-rose-900 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Offer Letters</span>
              <span className="text-sm font-bold text-slate-900">Generate Offers →</span>
            </div>
          </Link>
        </div>

        {/* Active Requisitions Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Active Job Requisitions</h3>
              <p className="text-xs text-slate-500">List of published job openings and applicant counts</p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
              {jobs.length} Active Openings
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm">Loading requisitions...</div>
          ) : jobs.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              No active job requisitions found. Click "Post New Requisition" to create one.
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Position Title</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Location & Mode</th>
                    <th className="p-4">Applicants</th>
                    <th className="p-4">Salary Range</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{job.title}</td>
                      <td className="p-4 text-slate-600 font-medium">{job.department}</td>
                      <td className="p-4 text-slate-600">
                        {job.location} ({job.workMode})
                      </td>
                      <td className="p-4 font-bold text-rose-900">
                        {job.applications?.length || 0} Candidates
                      </td>
                      <td className="p-4 text-slate-600">
                        {job.salaryMin ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax?.toLocaleString()}` : 'N/A'}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href="/dashboard/recruiter/candidates"
                          className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 font-bold hover:bg-rose-900 hover:text-white transition-all text-xs"
                        >
                          View Applicants →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create Requisition Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Post New Job Requisition
              </h3>

              <form onSubmit={handleCreateJob} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-rose-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Department *</label>
                    <input
                      type="text"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Engineering"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-rose-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Location *</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="San Francisco, CA"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-rose-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Work Mode</label>
                    <select
                      value={workMode}
                      onChange={(e) => setWorkMode(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-rose-900 focus:outline-none"
                    >
                      <option value="REMOTE">Remote</option>
                      <option value="HYBRID">Hybrid</option>
                      <option value="ON_SITE">On Site</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Employment Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-rose-900 focus:outline-none"
                    >
                      <option value="FULL_TIME">Full Time</option>
                      <option value="PART_TIME">Part Time</option>
                      <option value="CONTRACT">Contract</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Salary Min ($)</label>
                    <input
                      type="number"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      placeholder="120000"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-rose-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Salary Max ($)</label>
                    <input
                      type="number"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      placeholder="160000"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-rose-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Skills Required (Comma separated)</label>
                  <input
                    type="text"
                    value={skillsRequired}
                    onChange={(e) => setSkillsRequired(e.target.value)}
                    placeholder="React, TypeScript, Node.js, Next.js"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-rose-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description *</label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed job requisition responsibilities..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-rose-900 focus:outline-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-5 py-2 rounded-xl bg-rose-900 hover:bg-rose-800 text-white text-xs font-bold shadow-sm"
                  >
                    {creating ? 'Creating...' : 'Publish Job Opening'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function RecruiterDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 text-slate-900 p-10">Loading Recruiter Command Center...</div>}>
      <RecruiterDashboardContent />
    </Suspense>
  );
}
