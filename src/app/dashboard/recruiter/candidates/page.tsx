'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Users,
  Search,
  Sparkles,
  ChevronRight,
  Filter,
  CheckCircle2,
  FileText,
  Calendar,
  Code2,
  Award,
  Clock,
  ArrowRight,
  X,
  UserCheck
} from 'lucide-react';

const STAGES = [
  { id: 'APPLIED', label: 'Applied', color: 'border-slate-300 bg-slate-200 text-slate-700' },
  { id: 'SCREENING', label: 'Screening', color: 'border-blue-300 bg-blue-100 text-blue-800' },
  { id: 'SHORTLISTED', label: 'Shortlisted', color: 'border-indigo-300 bg-indigo-100 text-indigo-800' },
  { id: 'TECH_INTERVIEW', label: 'Tech Interview', color: 'border-purple-300 bg-purple-100 text-purple-800' },
  { id: 'HR_INTERVIEW', label: 'HR Interview', color: 'border-amber-300 bg-amber-100 text-amber-800' },
  { id: 'OFFER', label: 'Offer', color: 'border-emerald-300 bg-emerald-100 text-emerald-800' },
  { id: 'HIRED', label: 'Hired', color: 'border-rose-300 bg-rose-100 text-rose-900' },
  { id: 'REJECTED', label: 'Rejected', color: 'border-slate-300 bg-slate-200 text-slate-500' },
];

function KanbanBoardContent() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('ALL');
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggingAppId, setDraggingAppId] = useState<string | null>(null);

  // AI Match Modal State
  const [aiMatchingApp, setAiMatchingApp] = useState<any>(null);
  const [aiMatching, setAiMatching] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (data.jobs) {
        setJobs(data.jobs);

        let allApps: any[] = [];
        data.jobs.forEach((j: any) => {
          if (j.applications) {
            j.applications.forEach((app: any) => {
              allApps.push({
                ...app,
                jobTitle: j.title,
                jobDepartment: j.department,
              });
            });
          }
        });
        setApplications(allApps);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStageChange = async (appId: string, newStage: string) => {
    try {
      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, stage: newStage } : app))
      );

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
    }
  };

  const handleRunAiMatch = async (app: any) => {
    setAiMatchingApp(app);
    setAiMatching(true);

    try {
      const token = localStorage.getItem('ats_token');
      const res = await fetch('/api/ai/match-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ applicationId: app.id }),
      });

      const data = await res.json();
      if (data.application) {
        setApplications((prev) =>
          prev.map((a) => (a.id === app.id ? { ...a, matchScore: data.application.matchScore, matchAnalysis: data.application.matchAnalysis } : a))
        );
        setAiMatchingApp({
          ...app,
          matchScore: data.application.matchScore,
          matchAnalysis: data.application.matchAnalysis,
        });
      }
    } catch (err) {
      console.error('AI Match Error:', err);
    } finally {
      setAiMatching(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    const q = searchQuery.toLowerCase();
    const name = app.candidate?.user?.name || app.candidateName || '';
    const email = app.candidate?.user?.email || app.candidateEmail || '';
    const matchesSearch = name.toLowerCase().includes(q) || email.toLowerCase().includes(q) || app.jobTitle.toLowerCase().includes(q);
    const matchesJob = selectedJobId === 'ALL' || app.jobId === selectedJobId;
    return matchesSearch && matchesJob;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-rose-900 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-bold uppercase tracking-wider">
              Interactive Kanban Pipeline
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
              Candidate Hiring Pipeline
            </h1>
            <p className="text-slate-600 text-xs mt-0.5">
              Drag candidate cards across recruitment stages or execute Gemini AI suitability match evaluations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-900 shadow-sm"
              />
            </div>

            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-rose-900 font-medium shadow-sm"
            >
              <option value="ALL">All Requisitions ({jobs.length})</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Kanban Board Container */}
        {loading ? (
          <div className="p-16 text-center text-slate-500 text-sm">Loading candidate pipeline...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4 overflow-x-auto pb-6 custom-scrollbar">
            {STAGES.map((stage) => {
              const stageApps = filteredApps.filter((a) => a.stage === stage.id);
              return (
                <div
                  key={stage.id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggingAppId) {
                      handleStageChange(draggingAppId, stage.id);
                      setDraggingAppId(null);
                    }
                  }}
                  className="bg-slate-100 border border-slate-200 rounded-2xl p-3 flex flex-col min-w-[260px] lg:min-w-[210px] min-h-[550px] shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${stage.color}`}>
                      {stage.label}
                    </span>
                    <span className="text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {stageApps.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                    {stageApps.map((app) => (
                      <div
                        key={app.id}
                        draggable
                        onDragStart={() => setDraggingAppId(app.id)}
                        className="p-4 rounded-xl bg-white border border-slate-200 hover:border-rose-900/40 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {app.candidate?.user?.name || 'Applicant'}
                          </h4>
                          {app.matchScore !== undefined && app.matchScore !== null && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-900 text-[10px] font-extrabold">
                              {app.matchScore}% AI
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-500 truncate">{app.jobTitle}</p>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <button
                            onClick={() => handleRunAiMatch(app)}
                            className="text-[10px] font-bold text-rose-900 hover:underline flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>AI Match</span>
                          </button>

                          <select
                            value={app.stage}
                            onChange={(e) => handleStageChange(app.id, e.target.value)}
                            className="text-[10px] bg-slate-50 border border-slate-200 text-slate-700 rounded px-1.5 py-0.5 focus:outline-none"
                          >
                            {STAGES.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* AI Match Details Modal */}
        {aiMatchingApp && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Gemini AI Match Analysis</h3>
                  <p className="text-xs text-rose-900 font-semibold">{aiMatchingApp.candidate?.user?.name || 'Candidate'}</p>
                </div>
                <button
                  onClick={() => setAiMatchingApp(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {aiMatching ? (
                <div className="p-8 text-center text-rose-900 text-xs font-bold animate-pulse flex flex-col items-center gap-2">
                  <Sparkles className="w-8 h-8" />
                  <span>Evaluating candidate skills against job requirements...</span>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                    <span className="font-bold text-rose-900">Suitability Score</span>
                    <span className="text-2xl font-black text-rose-900">{aiMatchingApp.matchScore}%</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Match Evaluation Analysis</h4>
                    <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-wrap">
                      {aiMatchingApp.matchAnalysis?.summary || aiMatchingApp.matchAnalysis || 'Candidate exhibits strong alignment with requested technical stack.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function KanbanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 text-slate-900 p-10">Loading Kanban Pipeline...</div>}>
      <KanbanBoardContent />
    </Suspense>
  );
}
