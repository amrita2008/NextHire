'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Code2,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Award,
  Terminal,
  ShieldAlert,
  FileCode,
  X
} from 'lucide-react';

function AssessmentsContent() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('45');
  const [type, setType] = useState('MIXED');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAssessments();
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

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('ats_token');
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          jobTitle,
          durationMinutes: parseInt(durationMinutes),
          type,
          questions: [
            {
              id: 'q1',
              title: 'Reverse a Linked List',
              type: 'CODING',
              prompt: 'Write a function reverseLinkedList(head) that reverses a singly linked list in-place.',
              starterCode: 'function reverseLinkedList(head) {\n  // Write your code here\n}',
            },
            {
              id: 'q2',
              title: 'SQL Top Earners Query',
              type: 'SQL',
              prompt: 'Write a query to find top 3 highest paid employees per department.',
              starterCode: 'SELECT * FROM employees ORDER BY salary DESC LIMIT 3;',
            },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create assessment');

      setShowCreateModal(false);
      fetchAssessments();
    } catch (err: any) {
      alert(err.message || 'Error creating assessment');
    } finally {
      setSubmitting(false);
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
              Anti-Cheat Code Sandbox
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
              Technical Assessments & Code Test Suite
            </h1>
            <p className="text-slate-600 text-xs mt-0.5">
              Create live coding challenges with automated evaluation, anti-cheat tab-switch detection, and execution logs.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4.5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assessment</span>
          </button>
        </div>

        {/* Assessments List Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Active Technical Tests</h3>
            <span className="text-xs text-slate-500 font-medium">Includes anti-cheat security monitoring</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm">Loading coding test suite...</div>
          ) : assessments.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              No technical assessments created yet. Click "Create Assessment" to add one.
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Test Title</th>
                    <th className="p-4">Target Job</th>
                    <th className="p-4">Time Limit</th>
                    <th className="p-4">Format</th>
                    <th className="p-4">Submissions</th>
                    <th className="p-4 text-right">Security Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assessments.map((test) => (
                    <tr key={test.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{test.title}</td>
                      <td className="p-4 text-slate-600 font-medium">{test.jobTitle}</td>
                      <td className="p-4 text-slate-600">{test.durationMinutes} Minutes</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 border border-rose-200 text-rose-900">
                          {test.type}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        {test.submissions?.length || 0} Submissions
                      </td>
                      <td className="p-4 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-800">
                          Anti-Cheat Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create Assessment Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Create Technical Assessment</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assessment Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Full Stack Engineering Assessment"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-rose-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Position Requisition *</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Senior Software Engineer"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-rose-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Time Limit (Minutes)</label>
                    <select
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-rose-900 focus:outline-none"
                    >
                      <option value="30">30 Minutes</option>
                      <option value="45">45 Minutes</option>
                      <option value="60">60 Minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Format Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-rose-900 focus:outline-none"
                    >
                      <option value="CODING">Coding Algorithms</option>
                      <option value="SQL">SQL Data Challenges</option>
                      <option value="MIXED">Mixed Suite (Coding + MCQ)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold shadow-sm"
                  >
                    {submitting ? 'Creating...' : 'Publish Technical Test'}
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

export default function AssessmentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 text-slate-900 p-10">Loading Assessments Portal...</div>}>
      <AssessmentsContent />
    </Suspense>
  );
}
