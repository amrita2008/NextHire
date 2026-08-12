'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Search,
  MapPin,
  DollarSign,
  Briefcase,
  Building2,
  Clock,
  Filter,
  ArrowRight,
  Zap,
  Globe,
  Wifi,
  X,
  ChevronRight,
  Star,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

const workModeLabels: Record<string, string> = {
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
  ON_SITE: 'On-Site',
};

const employmentTypeLabels: Record<string, string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
};

const workModeColors: Record<string, string> = {
  REMOTE: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
  HYBRID: 'text-indigo-400 bg-indigo-950/60 border-indigo-800',
  ON_SITE: 'text-amber-400 bg-amber-950/60 border-amber-800',
};

export default function CareersPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (location) params.append('location', location);
      if (workMode) params.append('mode', workMode);
      if (employmentType) params.append('type', employmentType);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (e) {
      console.error('Failed to fetch jobs:', e);
    } finally {
      setLoading(false);
    }
  }, [search, location, workMode, employmentType]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchJobs();
    }, 350);
    return () => clearTimeout(debounce);
  }, [fetchJobs]);

  const clearFilters = () => {
    setSearch('');
    setLocation('');
    setWorkMode('');
    setEmploymentType('');
  };

  const activeFilterCount = [location, workMode, employmentType].filter(Boolean).length;

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    if (min && max) return `$${(min / 1000).toFixed(0)}k – $${(max / 1000).toFixed(0)}k`;
    if (min) return `From $${(min / 1000).toFixed(0)}k`;
    return `Up to $${(max! / 1000).toFixed(0)}k`;
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return `${Math.floor(days / 7)}w ago`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-28 pb-10 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-[11px] font-semibold mb-5">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI-Matched · {jobs.length}+ Open Positions</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Find Your Next <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Dream Role</span>
          </h1>
          <p className="text-slate-400 mt-4 text-base max-w-xl mx-auto">
            Browse curated, AI-matched opportunities. Upload your resume once and let Gemini AI find your best match.
          </p>

          {/* Main Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-xl shadow-slate-950/50">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Job title, skills, keyword..."
                className="w-full pl-9 pr-4 py-3 bg-transparent text-white text-sm placeholder-slate-500 focus:outline-none"
              />
            </div>
            <div className="w-px h-8 bg-slate-800 hidden sm:block" />
            <div className="relative hidden sm:flex items-center flex-1">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State or Remote"
                className="w-full pl-9 pr-4 py-3 bg-transparent text-white text-sm placeholder-slate-500 focus:outline-none"
              />
            </div>
            <button className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors flex items-center gap-2 shrink-0">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>

          {/* Quick Filter Pills */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {['REMOTE', 'HYBRID', 'ON_SITE'].map((mode) => (
              <button
                key={mode}
                onClick={() => setWorkMode(workMode === mode ? '' : mode)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                  workMode === mode
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                {workModeLabels[mode]}
              </button>
            ))}
            {['FULL_TIME', 'INTERNSHIP', 'CONTRACT'].map((type) => (
              <button
                key={type}
                onClick={() => setEmploymentType(employmentType === type ? '' : type)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                  employmentType === type
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                {employmentTypeLabels[type]}
              </button>
            ))}
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 rounded-full text-[11px] font-semibold border border-rose-800 bg-rose-950/50 text-rose-400 hover:bg-rose-900/50 transition-all flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content: Job List + Detail Panel */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex gap-6 items-start">
          {/* Job Listings Column */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-slate-400">
                {loading ? 'Searching...' : <span><span className="font-bold text-white">{jobs.length}</span> positions found</span>}
              </p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse rounded-2xl bg-slate-900 border border-slate-800 p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-800" />
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-slate-800 rounded w-3/4" />
                        <div className="h-3 bg-slate-800 rounded w-1/2" />
                        <div className="flex gap-2">
                          <div className="h-5 bg-slate-800 rounded w-16" />
                          <div className="h-5 bg-slate-800 rounded w-16" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="py-20 text-center rounded-2xl bg-slate-900 border border-slate-800">
                <Briefcase className="w-14 h-14 text-slate-700 mx-auto mb-4" />
                <p className="text-white font-semibold text-lg">No jobs found</p>
                <p className="text-slate-400 text-sm mt-1">Try adjusting your search terms or clearing filters</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all group hover:border-indigo-500/60 hover:shadow-lg hover:shadow-indigo-600/10 ${
                      selectedJob?.id === job.id
                        ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-600/10'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Company Logo Placeholder */}
                      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-indigo-400 group-hover:bg-indigo-900/40 transition-colors">
                        <Building2 className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-bold text-white text-base leading-tight group-hover:text-indigo-300 transition-colors">
                              {job.title}
                            </h3>
                            <p className="text-slate-400 text-xs mt-0.5 font-medium">
                              {job.company?.name || 'Company'} · {job.department}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-600 shrink-0 group-hover:text-indigo-400 transition-colors mt-0.5" />
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-purple-400" />
                            {job.location}
                          </span>
                          {formatSalary(job.salaryMin, job.salaryMax) && (
                            <span className="flex items-center gap-1 text-emerald-400 font-medium">
                              <DollarSign className="w-3.5 h-3.5" />
                              {formatSalary(job.salaryMin, job.salaryMax)}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            {timeAgo(job.createdAt)}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${workModeColors[job.workMode] || 'text-slate-400 bg-slate-800 border-slate-700'}`}>
                            {workModeLabels[job.workMode] || job.workMode}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold border text-slate-400 bg-slate-800/80 border-slate-700">
                            {employmentTypeLabels[job.employmentType] || job.employmentType}
                          </span>
                          {job.skillsRequired?.slice(0, 3).map((skill: string) => (
                            <span key={skill} className="px-2 py-0.5 rounded-md text-[10px] font-medium border text-indigo-300 bg-indigo-950/40 border-indigo-800/60">
                              {skill}
                            </span>
                          ))}
                          {job.skillsRequired?.length > 3 && (
                            <span className="text-[10px] text-slate-500">+{job.skillsRequired.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Job Detail Panel (desktop) */}
          {selectedJob && (
            <div className="hidden lg:block w-[420px] shrink-0 sticky top-24">
              <div className="rounded-2xl bg-slate-900 border border-indigo-500/40 overflow-hidden shadow-2xl shadow-indigo-600/10">
                <div className="p-6 border-b border-slate-800 bg-gradient-to-br from-indigo-950/60 to-slate-900">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400">
                      <Building2 className="w-7 h-7" />
                    </div>
                    <button
                      onClick={() => setSelectedJob(null)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <h2 className="text-xl font-extrabold text-white">{selectedJob.title}</h2>
                  <p className="text-slate-400 text-sm mt-1">{selectedJob.company?.name || 'Company'} · {selectedJob.department}</p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${workModeColors[selectedJob.workMode] || ''}`}>
                      {workModeLabels[selectedJob.workMode]}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold border text-slate-400 bg-slate-800 border-slate-700">
                      {employmentTypeLabels[selectedJob.employmentType]}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <p className="text-slate-500 mb-1">Location</p>
                      <p className="text-white font-semibold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-purple-400" />
                        {selectedJob.location}
                      </p>
                    </div>
                    {formatSalary(selectedJob.salaryMin, selectedJob.salaryMax) && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <p className="text-slate-500 mb-1">Salary Range</p>
                        <p className="text-emerald-400 font-semibold">
                          {formatSalary(selectedJob.salaryMin, selectedJob.salaryMax)}
                        </p>
                      </div>
                    )}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <p className="text-slate-500 mb-1">Experience</p>
                      <p className="text-white font-semibold">{selectedJob.experienceRequired}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <p className="text-slate-500 mb-1">Posted</p>
                      <p className="text-white font-semibold">{timeAgo(selectedJob.createdAt)}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.skillsRequired?.map((skill: string) => (
                        <span key={skill} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Job Description</h3>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-6">
                      {selectedJob.description}
                    </p>
                  </div>

                  <Link
                    href={`/register?role=CANDIDATE`}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    <Zap className="w-4 h-4" />
                    Apply with AI Resume Match
                  </Link>
                  <p className="text-center text-[10px] text-slate-500">Create a free account to apply. Your resume is parsed by Gemini AI.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
