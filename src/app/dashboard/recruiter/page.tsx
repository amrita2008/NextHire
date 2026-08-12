'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Briefcase,
  Users,
  Calendar,
  FileCheck,
  Plus,
  Search,
  Filter,
  MoreVertical,
  MapPin,
  DollarSign,
  Clock,
  Sparkles,
  Building2,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostingModal, setShowPostingModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  // New Job Form State
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [experienceRequired, setExperienceRequired] = useState('2-4 years');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [employmentType, setEmploymentType] = useState('FULL_TIME');
  const [workMode, setWorkMode] = useState('HYBRID');
  const [description, setDescription] = useState('');
  const [postingLoading, setPostingLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('ats_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (data.jobs) {
        setJobs(data.jobs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostingLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('ats_token');
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: jobTitle,
          department,
          location,
          salaryMin,
          salaryMax,
          experienceRequired,
          skillsRequired: skillsRequired.split(',').map((s) => s.trim()),
          employmentType,
          workMode,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post job');

      setMessage('Job posted successfully!');
      setShowPostingModal(false);
      // Reset form
      setJobTitle('');
      setDepartment('');
      setLocation('');
      setDescription('');
      fetchJobs();
    } catch (err: any) {
      setMessage(err.message || 'Error creating job');
    } finally {
      setPostingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-800/80 text-purple-300 text-[11px] font-semibold uppercase tracking-wider">
                Recruiter Portal
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">
              Welcome back, {user?.name || 'Recruiter'}
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">Manage job postings, review candidates, and monitor hiring pipeline.</p>
          </div>

          <button
            onClick={() => setShowPostingModal(true)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Job</span>
          </button>
        </div>

        {/* Recruiter Summary Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Total Active Jobs</span>
              <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white mt-4">{jobs.length}</p>
            <p className="text-xs text-emerald-400 mt-2 font-medium">↑ 2 new postings this week</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Active Candidates</span>
              <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white mt-4">42</p>
            <p className="text-xs text-indigo-400 mt-2 font-medium">18 Screened by Gemini AI</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Interviews Today</span>
              <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white mt-4">5</p>
            <p className="text-xs text-amber-400 mt-2 font-medium">Next: 3:00 PM (Tech Interview)</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Offer Acceptance</span>
              <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400">
                <FileCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white mt-4">92%</p>
            <p className="text-xs text-emerald-400 mt-2 font-medium">11 Offers Accepted</p>
          </div>
        </div>

        {/* Active Jobs Table / Section */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Active Job Openings</h2>
              <p className="text-xs text-slate-400">Manage candidate pipelines and job details</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter jobs..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm">Loading job listings...</div>
          ) : jobs.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="font-semibold text-white">No job postings created yet</p>
              <p className="text-xs text-slate-500 mt-1">Click "Post New Job" above to create your first posting.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {jobs.map((job) => (
                <div key={job.id} className="p-6 hover:bg-slate-850/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-white">{job.title}</h3>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-[10px] font-semibold">
                        {job.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-purple-400" />
                        {job.location} ({job.workMode})
                      </span>
                      {job.salaryMin && (
                        <span className="flex items-center gap-1 text-slate-300">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                          ${job.salaryMin.toLocaleString()} - ${job.salaryMax?.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/dashboard/recruiter/candidates?jobId=${job.id}`}
                      className="px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600 hover:text-white font-semibold text-xs transition-all flex items-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5" />
                      View Applicants Kanban
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Job Modal */}
        {showPostingModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Create New Job Posting</h2>
                </div>
                <button
                  onClick={() => setShowPostingModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateJob} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Full Stack Engineer"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Department *</label>
                    <input
                      type="text"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Engineering"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Location *</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. San Francisco, CA / Remote"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Min Salary ($)</label>
                    <input
                      type="number"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      placeholder="100000"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Max Salary ($)</label>
                    <input
                      type="number"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      placeholder="150000"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Work Mode</label>
                    <select
                      value={workMode}
                      onChange={(e) => setWorkMode(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="HYBRID">Hybrid</option>
                      <option value="REMOTE">Remote</option>
                      <option value="ON_SITE">On-Site</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Employment Type</label>
                    <select
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="FULL_TIME">Full Time</option>
                      <option value="PART_TIME">Part Time</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="INTERNSHIP">Internship</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Required Skills (comma separated)</label>
                  <input
                    type="text"
                    value={skillsRequired}
                    onChange={(e) => setSkillsRequired(e.target.value)}
                    placeholder="React, Next.js, Node.js, TypeScript, MongoDB"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Job Description *</label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide responsibilities, requirements, and benefits..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPostingModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={postingLoading}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                  >
                    {postingLoading ? 'Publishing...' : 'Publish Job'}
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
