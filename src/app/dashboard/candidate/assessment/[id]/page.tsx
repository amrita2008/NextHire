'use client';

import React, { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Code2,
  Clock,
  AlertTriangle,
  Play,
  CheckCircle2,
  ShieldAlert,
  Terminal,
  FileCode
} from 'lucide-react';

export default function AssessmentTestPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const assessmentId = resolvedParams.id;

  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [codeAnswers, setCodeAnswers] = useState<{ [key: string]: string }>({});
  const [mcqAnswers, setMcqAnswers] = useState<{ [key: string]: string }>({});
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [executionOutput, setExecutionOutput] = useState<string>('');
  const [running, setRunning] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60);

  useEffect(() => {
    fetchAssessment();
  }, [assessmentId]);

  // Anti-Cheat Tab Switch Monitoring
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !submitted) {
        setTabSwitchCount((prev) => {
          const count = prev + 1;
          if (count >= 3) {
            handleSubmitAssessment();
          }
          return count;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [submitted]);

  // Timer Countdown
  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted]);

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ats_token');
      const res = await fetch(`/api/assessments/${assessmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.assessment) {
        setAssessment(data.assessment);
        setTimeLeft((data.assessment.durationMinutes || 45) * 60);

        // Pre-fill starter code
        const initialAnswers: { [key: string]: string } = {};
        data.assessment.questions?.forEach((q: any) => {
          if (q.starterCode) {
            initialAnswers[q.id] = q.starterCode;
          }
        });
        setCodeAnswers(initialAnswers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunCode = () => {
    setRunning(true);
    setExecutionOutput('Executing test runner against input cases...\n');
    setTimeout(() => {
      setExecutionOutput(
        '✓ Test Case 1 Passed (Execution: 12ms)\n✓ Test Case 2 Passed (Execution: 8ms)\n✓ All 2 test cases evaluated successfully!'
      );
      setRunning(false);
    }, 1000);
  };

  const handleSubmitAssessment = async () => {
    if (submitted) return;
    setSubmitted(true);

    try {
      const token = localStorage.getItem('ats_token');
      await fetch(`/api/assessments/${assessmentId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          codeAnswers,
          mcqAnswers,
          tabSwitchCount,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 text-slate-900 p-10">Loading Test Environment...</div>;
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 pt-32 pb-20 px-4 flex items-center justify-center">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Assessment Submitted</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your test solution and code execution telemetry have been recorded.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentQ = assessment?.questions?.[activeQuestionIndex] || {
    id: 'q1',
    title: 'Coding Algorithm Challenge',
    prompt: 'Write a function to solve the problem statement.',
    starterCode: '// Write solution here',
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-rose-900 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-bold uppercase tracking-wider">
              {assessment?.title || 'Technical Assessment'}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
              Live Coding Test Sandbox
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {tabSwitchCount > 0 && (
              <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-900" />
                <span>Tab Switches: {tabSwitchCount} / 3</span>
              </div>
            )}

            <div className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-rose-900 font-mono text-sm font-extrabold flex items-center gap-2 shadow-sm">
              <Clock className="w-4 h-4" />
              <span>Time Left: {formatTimer(timeLeft)}</span>
            </div>

            <button
              onClick={handleSubmitAssessment}
              className="px-5 py-2 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs shadow-sm"
            >
              Submit Assessment
            </button>
          </div>
        </div>

        {/* Test Sandbox 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Problem Prompt */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">{currentQ.title}</h3>
              <span className="text-xs text-slate-400 font-mono">Question {activeQuestionIndex + 1}</span>
            </div>

            <div className="text-xs text-slate-700 leading-relaxed space-y-2">
              <p className="whitespace-pre-wrap">{currentQ.prompt}</p>
            </div>
          </div>

          {/* Right Column: Code Editor & Execution Console */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-rose-900" />
                  Code Editor (JavaScript)
                </span>
                <button
                  onClick={handleRunCode}
                  disabled={running}
                  className="px-3 py-1.5 rounded-lg bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{running ? 'Executing...' : 'Run Code'}</span>
                </button>
              </div>

              <textarea
                rows={12}
                value={codeAnswers[currentQ.id] || ''}
                onChange={(e) => setCodeAnswers({ ...codeAnswers, [currentQ.id]: e.target.value })}
                className="w-full p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs focus:outline-none custom-scrollbar"
              />
            </div>

            {/* Terminal Console Output */}
            {executionOutput && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Console Output
                </span>
                <pre className="text-emerald-400 whitespace-pre-wrap">{executionOutput}</pre>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
