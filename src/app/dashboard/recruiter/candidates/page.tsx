'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InterviewFeedbackModal from '@/components/InterviewFeedbackModal';
import {
  Users,
  Search,
  Filter,
  Sparkles,
  Calendar,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  UserCheck,
  FileText,
  Mail,
  Phone,
  Briefcase,
  ExternalLink,
  Plus,
  Video,
  X,
  AlertCircle,
  Award,
  Star
} from 'lucide-react';

const STAGES = [
  { key: 'APPLIED', title: 'Applied', color: 'border-slate-700 bg-slate-900/60 text-slate-300' },
  { key: 'SCREENING', title: 'Screening', color: 'border-blue-800/80 bg-blue-950/40 text-blue-300' },
  { key: 'SHORTLISTED', title: 'Shortlisted', color: 'border-indigo-800/80 bg-indigo-950/40 text-indigo-300' },
  { key: 'TECH_INTERVIEW', title: 'Tech Interview', color: 'border-purple-800/80 bg-purple-950/40 text-purple-300' },
  { key: 'HR_INTERVIEW', title: 'HR Interview', color: 'border-amber-800/80 bg-amber-950/40 text-amber-300' },
  { key: 'OFFER', title: 'Offer Sent', color: 'border-cyan-800/80 bg-cyan-950/40 text-cyan-300' },
  { key: 'HIRED', title: 'Hired', color: 'border-emerald-800/80 bg-emerald-950/40 text-emerald-300' },
  { key: 'REJECTED', title: 'Rejected', color: 'border-rose-900/80 bg-rose-950/40 text-rose-300' },
];

function KanbanContent() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';

  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);
  const [matchingAppId, setMatchingAppId] = useState<string | null>(null);

  // Interview Schedule Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedAppForInterview, setSelectedAppForInterview] = useState<any>(null);
  const [interviewTitle, setInterviewTitle] = useState('Technical Screening Interview');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('14:00');
  const [interviewDuration, setInterviewDuration] = useState('45');
  const [interviewers, setInterviewers] = useState<any[]>([]);
  const [selectedInterviewerId, setSelectedInterviewerId] = useState('');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [schedulingLoading, setSchedulingLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Interview Feedback Modal State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedInterviewForFeedback, setSelectedInterviewForFeedback] = useState<any>(null);

  useEffect(() => {
    fetchJobs();
    fetchInterviewers();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [selectedJobId]);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (data.jobs) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const fetchInterviewers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.users) {
        setInterviewers(data.users);
        if (data.users.length > 0) {
          setSelectedInterviewerId(data.users[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ats_token');
      let url = '/api/applications';
      if (selectedJobId) {
        url += `?jobId=${selectedJobId}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.applications) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, appId: string) => {
    setDraggedAppId(appId);
    e.dataTransfer.setData('text/plain', appId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStage: string) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData('text/plain') || draggedAppId;
    if (!appId) return;

    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, stage: newStage } : app))
    );
    setDraggedAppId(null);

    try {
      const token = localStorage.getItem('ats_token');
      await fetch(`/api/applications/${appId}/stage`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stage: newStage }),
      });
    } catch (err) {
      console.error('Failed to update stage:', err);
      fetchApplications();
    }
  };

  // Stage change via direct click dropdown
  const handleStageChange = async (appId: string, newStage: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, stage: newStage } : app))
    );

    try {
      const token = localStorage.getItem('ats_token');
      await fetch(`/api/applications/${appId}/stage`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stage: newStage }),
      });
    } catch (err) {
      console.error(err);
      fetchApplications();
    }
  };

  // Run AI Resume Match
  const handleRunAiMatch = async (app: any) => {
    setMatchingAppId(app.id);
    try {
      const token = localStorage.getItem('ats_token');
      const res = await fetch('/api/ai/match-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          candidateProfileId: app.candidateId,
          jobId: app.jobId,
        }),
      });

      const data = await res.json();
      if (res.ok && data.matchResults) {
        const score = data.matchResults.matchScore;
        const details = JSON.stringify(data.matchResults);

        setApplications((prev) =>
          prev.map((item) =>
            item.id === app.id
              ? { ...item, matchScore: score, matchDetails: details }
              : item
          )
        );
      }
    } catch (err) {
      console.error('AI match error:', err);
    } finally {
      setMatchingAppId(null);
    }
  };

  // Generate Google Meet Link & Schedule Interview
  const handleOpenScheduleModal = (app: any) => {
    setSelectedAppForInterview(app);
    setInterviewTitle(`Interview for ${app.job?.title || 'Position'}`);
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setInterviewDate(tomorrow.toISOString().split('T')[0]);

    const randCode = Math.random().toString(36).substring(2, 5) + '-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 5);
    setMeetingUrl(`https://meet.google.com/${randCode}`);
    
    setModalMessage('');
    setShowScheduleModal(true);
  };

  const handleScheduleInterviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForInterview) return;

    setSchedulingLoading(true);
    setModalMessage('');

    try {
      const token = localStorage.getItem('ats_token');
      const scheduledDateTime = new Date(`${interviewDate}T${interviewTime}:00`);

      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          applicationId: selectedAppForInterview.id,
          interviewerId: selectedInterviewerId || (interviewers[0]?.id || ''),
          title: interviewTitle,
          scheduledAt: scheduledDateTime.toISOString(),
          durationMinutes: parseInt(interviewDuration),
          meetingUrl: meetingUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to schedule interview');

      setModalMessage('Interview scheduled & Google Meet link dispatched!');
      setTimeout(() => {
        setShowScheduleModal(false);
        fetchApplications();
      }, 1200);
    } catch (err: any) {
      setModalMessage(err.message || 'Error scheduling interview');
    } finally {
      setSchedulingLoading(false);
    }
  };

  // Filter applications by search query
  const filteredApps = applications.filter((app) => {
    const candidateName = app.candidate?.user?.name || '';
    const candidateEmail = app.candidate?.user?.email || '';
    const jobTitle = app.job?.title || '';
    const q = searchQuery.toLowerCase();
    return (
      candidateName.toLowerCase().includes(q) ||
      candidateEmail.toLowerCase().includes(q) ||
      jobTitle.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 text-[11px] font-semibold uppercase tracking-wider">
                Recruitment Pipeline
              </span>
              <span className="px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-800/80 text-purple-300 text-[11px] font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                Gemini AI Screening Active
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">
              Candidate Application Kanban Board
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Drag and drop candidates across pipeline stages, trigger AI resume matching, schedule interviews, and score feedback.
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter by Job */}
            <div className="relative">
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="pl-3 pr-8 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">All Job Openings</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({j.department})
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidates or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          {STAGE_COUNTS(filteredApps).map((st) => (
            <div key={st.key} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 font-medium block truncate">{st.title}</span>
              <span className="text-xl font-extrabold text-white mt-1 block">{st.count}</span>
            </div>
          ))}
        </div>

        {/* Kanban Columns Board */}
        {loading ? (
          <div className="p-20 text-center text-slate-500 text-sm">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            Loading Candidate Pipeline Board...
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar min-h-[650px] items-start">
            {STAGES.map((stage) => {
              const stageApps = filteredApps.filter((a) => a.stage === stage.key);
              return (
                <div
                  key={stage.key}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.key)}
                  className="w-72 shrink-0 rounded-2xl bg-slate-900/70 border border-slate-800/80 p-3.5 flex flex-col max-h-[800px]"
                >
                  {/* Column Header */}
                  <div className={`p-2.5 rounded-xl border mb-3 flex items-center justify-between ${stage.color}`}>
                    <span className="text-xs font-bold uppercase tracking-wider">{stage.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-950/60 text-[11px] font-extrabold">
                      {stageApps.length}
                    </span>
                  </div>

                  {/* Cards Area */}
                  <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar min-h-[150px]">
                    {stageApps.length === 0 ? (
                      <div className="h-24 rounded-xl border border-dashed border-slate-800/80 flex items-center justify-center text-[11px] text-slate-600">
                        Drop candidate here
                      </div>
                    ) : (
                      stageApps.map((app) => {
                        let matchObj: any = null;
                        if (app.matchDetails) {
                          try {
                            matchObj = typeof app.matchDetails === 'string' ? JSON.parse(app.matchDetails) : app.matchDetails;
                          } catch {}
                        }

                        const activeInterview = app.interviews && app.interviews.length > 0 ? app.interviews[0] : null;

                        return (
                          <div
                            key={app.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, app.id)}
                            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 shadow-lg cursor-grab active:cursor-grabbing transition-all group relative"
                          >
                            {/* Candidate Info Header */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                                  {app.candidate?.user?.name || 'Unnamed Candidate'}
                                </h4>
                                <p className="text-[11px] text-slate-400 line-clamp-1">{app.job?.title}</p>
                              </div>

                              {/* AI Match Badge */}
                              {typeof app.matchScore === 'number' ? (
                                <span
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold border ${
                                    app.matchScore >= 80
                                      ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                                      : app.matchScore >= 60
                                      ? 'bg-amber-950/80 border-amber-700 text-amber-300'
                                      : 'bg-rose-950/80 border-rose-800 text-rose-300'
                                  }`}
                                >
                                  {app.matchScore}% Match
                                </span>
                              ) : null}
                            </div>

                            {/* Contact & Details */}
                            <div className="space-y-1 mb-3 text-[11px] text-slate-400">
                              <p className="flex items-center gap-1.5 truncate">
                                <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                                <span className="truncate">{app.candidate?.user?.email}</span>
                              </p>
                              {app.candidate?.phone && (
                                <p className="flex items-center gap-1.5">
                                  <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                                  <span>{app.candidate.phone}</span>
                                </p>
                              )}
                            </div>

                            {/* Scheduled Interview Badge if any */}
                            {activeInterview && (
                              <div className="mb-3 p-2 rounded-lg bg-purple-950/40 border border-purple-800/50 text-[10px]">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-purple-300 font-semibold flex items-center gap-1">
                                    <Video className="w-3.5 h-3.5 text-purple-400" />
                                    Interview Scheduled
                                  </span>
                                  {activeInterview.meetingUrl && (
                                    <a
                                      href={activeInterview.meetingUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-indigo-400 underline font-bold hover:text-white"
                                    >
                                      Join
                                    </a>
                                  )}
                                </div>
                                <button
                                  onClick={() => {
                                    setSelectedInterviewForFeedback(activeInterview);
                                    setShowFeedbackModal(true);
                                  }}
                                  className="w-full text-center py-1 rounded bg-purple-900/60 hover:bg-purple-800 text-purple-200 font-bold flex items-center justify-center gap-1 mt-1 transition-all"
                                >
                                  <Award className="w-3 h-3 text-amber-400" />
                                  <span>Score Candidate Feedback</span>
                                </button>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="pt-2 border-t border-slate-900 flex items-center justify-between gap-1">
                              {/* Trigger AI Match */}
                              <button
                                onClick={() => handleRunAiMatch(app)}
                                disabled={matchingAppId === app.id}
                                className="px-2 py-1 rounded-lg bg-purple-950/80 border border-purple-800/80 text-purple-300 hover:bg-purple-900 text-[10px] font-semibold flex items-center gap-1 transition-all"
                                title="Run Gemini AI Resume Match"
                              >
                                <Sparkles className="w-3 h-3 text-purple-400" />
                                <span>{matchingAppId === app.id ? 'Analyzing...' : 'AI Match'}</span>
                              </button>

                              {/* Schedule Interview Button */}
                              <button
                                onClick={() => handleOpenScheduleModal(app)}
                                className="px-2 py-1 rounded-lg bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 hover:bg-indigo-900 text-[10px] font-semibold flex items-center gap-1 transition-all"
                                title="Schedule Interview with Google Meet"
                              >
                                <Calendar className="w-3 h-3 text-indigo-400" />
                                <span>Schedule</span>
                              </button>

                              {/* Move Stage Selector */}
                              <select
                                value={app.stage}
                                onChange={(e) => handleStageChange(app.id, e.target.value)}
                                className="px-1.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[10px] focus:outline-none"
                              >
                                {STAGES.map((s) => (
                                  <option key={s.key} value={s.key}>
                                    Move: {s.title}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Interview Feedback Modal Component */}
        <InterviewFeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          interview={selectedInterviewForFeedback}
          onFeedbackSubmitted={() => fetchApplications()}
        />

        {/* Schedule Interview Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Schedule Interview</h3>
                    <p className="text-xs text-slate-400">
                      Candidate: {selectedAppForInterview?.candidate?.user?.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modalMessage && (
                <div
                  className={`p-3 rounded-xl mb-4 text-xs font-semibold ${
                    modalMessage.includes('scheduled')
                      ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                      : 'bg-rose-950/80 border border-rose-800 text-rose-300'
                  }`}
                >
                  {modalMessage}
                </div>
              )}

              <form onSubmit={handleScheduleInterviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Interview Title *</label>
                  <input
                    type="text"
                    required
                    value={interviewTitle}
                    onChange={(e) => setInterviewTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Time *</label>
                    <input
                      type="time"
                      required
                      value={interviewTime}
                      onChange={(e) => setInterviewTime(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Minutes)</label>
                    <select
                      value={interviewDuration}
                      onChange={(e) => setInterviewDuration(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="30">30 Minutes</option>
                      <option value="45">45 Minutes</option>
                      <option value="60">60 Minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Interviewer</label>
                    <select
                      value={selectedInterviewerId}
                      onChange={(e) => setSelectedInterviewerId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    >
                      {interviewers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Auto-Generated Meeting Link</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      required
                      value={meetingUrl}
                      onChange={(e) => setMeetingUrl(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-indigo-300 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                    <a
                      href={meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600 hover:text-white text-xs font-semibold transition-all flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Test
                    </a>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={schedulingLoading}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                  >
                    {schedulingLoading ? 'Scheduling...' : 'Confirm Schedule'}
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

function STAGE_COUNTS(apps: any[]) {
  return STAGES.map((s) => ({
    key: s.key,
    title: s.title,
    count: apps.filter((a) => a.stage === s.key).length,
  }));
}

export default function CandidatesKanbanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white p-10">Loading Kanban...</div>}>
      <KanbanContent />
    </Suspense>
  );
}
