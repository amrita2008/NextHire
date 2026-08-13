'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Code2,
  Plus,
  Search,
  Clock,
  Award,
  CheckCircle2,
  Briefcase,
  X,
  FileCode,
  Sparkles,
  Database,
  CheckSquare,
  Users
} from 'lucide-react';

function RecruiterAssessmentsContent() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Assessment Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [passPercentage, setPassPercentage] = useState('70');
  const [createLoading, setCreateLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAssessments();
    fetchJobs();
  }, []);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ats_token');
      const res = await fetch('/api/assessments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.assessments) {
        setAssessments(data.assessments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (data.jobs) {
        setJobs(data.jobs);
        if (data.jobs.length > 0) setSelectedJobId(data.jobs[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('ats_token');
      const sampleQuestions = [
        {
          id: 'q1',
          type: 'mcq',
          title: 'Data Structures & Algorithms',
          question: 'What is the average time complexity of QuickSort?',
          options: ['O(n log n)', 'O(n^2)', 'O(n)', 'O(1)'],
          correctOption: 0,
        },
        {
          id: 'q2',
          type: 'sql',
          title: 'Database Query Task',
          question: 'Write a SQL query to select candidates with experience > 3 years.',
          starterCode: `-- Write SQL Query below\nSELECT * FROM candidate_profiles WHERE experience_years > 3;`,
        },
        {
          id: 'q3',
          type: 'code',
          title: 'Full Stack Algorithm Challenge',
          question: 'Write a function to validate balanced parentheses in a string.',
          starterCode: `function isValidParentheses(s) {\n  const stack = [];\n  for (let c of s) {\n    if (c === '(') stack.push(')');\n    else if (stack.pop() !== c) return false;\n  }\n  return stack.length === 0;\n}`,
        },
      ];

      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: selectedJobId,
          title,
          durationMinutes: parseInt(durationMinutes),
          passPercentage: parseInt(passPercentage),
          questions: sampleQuestions,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create assessment');

      setMessage('Assessment created successfully!');
      setTimeout(() => {
        setShowCreateModal(false);
        fetchAssessments();
      }, 1000);
    } catch (err: any) {
      setMessage(err.message || 'Error creating assessment');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 text-[11px] font-semibold uppercase tracking-wider">
                Technical Assessment Suite
              </span>
              <span className="px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-800/80 text-purple-300 text-[11px] font-semibold flex items-center gap-1">
                <Code2 className="w-3 h-3 text-purple-400" />
                Anti-Cheat & Code Execution Engine
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">
              Coding Assessments Management
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Create technical tests, automated MCQs, and live coding challenges for applicant screening.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Assessment</span>
          </button>
        </div>

        {/* Assessment Grid */}
        {loading ? (
          <div className="p-16 text-center text-slate-500 text-sm">Loading coding assessments...</div>
        ) : assessments.length === 0 ? (
          <div className="p-12 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <Code2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No Coding Assessments Configured</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Click "Create New Assessment" to build a technical test suite for your job postings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold text-white">{item.title}</h3>
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px] font-extrabold border border-purple-800">
                      {item.passPercentage}% Pass
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5 mb-3">
                    <Briefcase className="w-3.5 h-3.5" />
                    {item.job?.title} ({item.job?.department})
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-400">
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Duration: {item.durationMinutes} Minutes</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Total Test Attempts: {item.attempts?.length || 0}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <a
                    href={`/dashboard/candidate/assessment/${item.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-indigo-400 hover:text-white flex items-center gap-1"
                  >
                    Preview Test Environment →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Assessment Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Create Technical Assessment</h3>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {message && (
                <div className="p-3 rounded-xl mb-4 text-xs font-semibold bg-emerald-950/80 border border-emerald-800 text-emerald-300">
                  {message}
                </div>
              )}

              <form onSubmit={handleCreateAssessment} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Job Position *</label>
                  <select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title} ({job.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Assessment Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Coding & SQL Test"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Minutes)</label>
                    <input
                      type="number"
                      required
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Required Pass Score (%)</label>
                    <input
                      type="number"
                      required
                      value={passPercentage}
                      onChange={(e) => setPassPercentage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                  >
                    {createLoading ? 'Building...' : 'Create Assessment'}
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

export default function RecruiterAssessmentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white p-10">Loading Assessments...</div>}>
      <RecruiterAssessmentsContent />
    </Suspense>
  );
}
