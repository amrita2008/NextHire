'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  ChevronRight,
  Filter,
  CheckCircle2,
  Sparkles,
  Upload,
  X,
  FileText,
  User,
  Mail,
  Phone
} from 'lucide-react';

function CareersContent() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [workModeFilter, setWorkModeFilter] = useState('ALL');

  // Application Modal State
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [parsingResume, setParsingResume] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchJobs();

    const storedUser = localStorage.getItem('ats_user');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setName(u.name || '');
        setEmail(u.email || '');
      } catch (e) {}
    }
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (data.jobs) {
        setJobs(data.jobs.filter((j: any) => j.status === 'OPEN'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApplyModal = (job: any) => {
    setSelectedJob(job);
    setMessage('');
    setShowApplyModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFile(file);
    setParsingResume(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/candidate/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.parsedText) {
        setResumeText(data.parsedText);
      }
    } catch (err) {
      console.error('Error parsing resume:', err);
    } finally {
      setParsingResume(false);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const token = localStorage.getItem('ats_token');
      let candidateId = '';

      if (token) {
        const profileRes = await fetch('/api/candidate/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            phone,
            resumeText,
          }),
        });
        const profileData = await profileRes.json();
        if (profileData.profile) {
          candidateId = profileData.profile.id;
        }
      }

      if (!candidateId) {
        setMessage('Please log in or register a candidate account to apply.');
        setSubmitting(false);
        return;
      }

      const applyRes = await fetch('/api/applications/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: selectedJob.id,
          candidateId,
        }),
      });

      const applyData = await applyRes.json();
      if (!applyRes.ok) throw new Error(applyData.error || 'Application failed');

      setMessage('Application submitted successfully! Redirecting...');
      setTimeout(() => {
        setShowApplyModal(false);
      }, 1500);
    } catch (err: any) {
      setMessage(err.message || 'Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      job.title.toLowerCase().includes(q) ||
      job.department.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      (job.skillsRequired && job.skillsRequired.some((s: string) => s.toLowerCase().includes(q)));

    const matchesDept = departmentFilter === 'ALL' || job.department === departmentFilter;
    const matchesMode = workModeFilter === 'ALL' || job.workMode === workModeFilter;

    return matchesSearch && matchesDept && matchesMode;
  });

  const departments = Array.from(new Set(jobs.map((j) => j.department)));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-rose-900 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold uppercase tracking-wider">
            Explore Opportunities
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-3">
            Next<span className="text-rose-900">Hire</span> Careers Portal
          </h1>
          <p className="text-slate-600 text-sm mt-2">
            Join innovative teams building the future. Apply with instant AI resume evaluation.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by job title, skill, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-rose-900 font-medium"
            >
              <option value="ALL">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* Work Mode Filter */}
            <select
              value={workModeFilter}
              onChange={(e) => setWorkModeFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-rose-900 font-medium"
            >
              <option value="ALL">All Work Modes</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ON_SITE">On Site</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="p-16 text-center text-slate-500 text-sm">Loading available job openings...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center">
            <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No Job Openings Match Your Filters</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing search parameters to view all active openings.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-rose-900/40 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 border border-rose-200 text-rose-900 uppercase">
                      {job.workMode}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <span className="flex items-center gap-1.5 font-semibold text-rose-900">
                      <Building2 className="w-3.5 h-3.5" />
                      {job.company?.name || 'Enterprise Client'} ({job.department})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    {job.salaryMin && (
                      <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                        <DollarSign className="w-3.5 h-3.5" />
                        ${job.salaryMin.toLocaleString()} - ${job.salaryMax?.toLocaleString()} / yr
                      </span>
                    )}
                  </div>

                  {job.skillsRequired && job.skillsRequired.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      {job.skillsRequired.map((skill: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-600">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleOpenApplyModal(job)}
                  className="px-5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all self-start md:self-center shrink-0"
                >
                  <span>Apply Now</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Application Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Apply for Position</h3>
                  <p className="text-xs text-rose-900 font-semibold">{selectedJob?.title}</p>
                </div>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {message && (
                <div
                  className={`p-3 rounded-xl mb-4 text-xs font-semibold ${
                    message.includes('submitted')
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border border-rose-200 text-rose-900'
                  }`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-rose-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-rose-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-rose-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Upload Resume (PDF/DOCX)</label>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-900 file:text-white hover:file:bg-rose-800"
                  />
                  {parsingResume && (
                    <p className="text-[11px] text-rose-900 font-semibold mt-1 animate-pulse flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Parsing resume text...
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Or Paste Resume Text</label>
                  <textarea
                    rows={4}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste resume content here..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-rose-900 focus:outline-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-rose-900 hover:bg-rose-800 text-white text-xs font-bold shadow-sm"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
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

export default function CareersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 text-slate-900 p-10">Loading Opportunities...</div>}>
      <CareersContent />
    </Suspense>
  );
}
