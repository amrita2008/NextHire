'use client';

import React, { useState } from 'react';
import { Star, CheckCircle2, X, Award, AlertCircle } from 'lucide-react';

interface InterviewFeedbackModalProps {
  interview: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function InterviewFeedbackModal({
  interview,
  onClose,
  onSuccess,
}: InterviewFeedbackModalProps) {
  const [techScore, setTechScore] = useState(4);
  const [commScore, setCommScore] = useState(4);
  const [problemScore, setProblemScore] = useState(4);
  const [recommendation, setRecommendation] = useState('RECOMMEND');
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const overallScore = Math.round(((techScore + commScore + problemScore) / 3) * 10) / 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('ats_token');
      const res = await fetch(`/api/interviews/${interview.id}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          techScore,
          commScore,
          problemScore,
          overallScore,
          recommendation,
          comments,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit feedback');

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error submitting interview scorecard');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Interviewer Scorecard Feedback</h3>
            <p className="text-xs text-rose-900 font-semibold">{interview.candidateName || interview.candidateEmail}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Composite Score Pill */}
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-rose-900 block">Composite Rating</span>
              <span className="text-[11px] text-rose-700 font-medium">Average across 3 evaluation dimensions</span>
            </div>
            <div className="text-2xl font-black text-rose-900">{overallScore} / 5.0</div>
          </div>

          {/* Technical Score */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Technical Competence (1-5)</label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={techScore}
              onChange={(e) => setTechScore(parseInt(e.target.value))}
              className="w-full accent-rose-900"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-bold">
              <span>1 - Poor</span>
              <span>3 - Average</span>
              <span>5 - Exceptional</span>
            </div>
          </div>

          {/* Communication Score */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Communication & Clarity (1-5)</label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={commScore}
              onChange={(e) => setCommScore(parseInt(e.target.value))}
              className="w-full accent-rose-900"
            />
          </div>

          {/* Recommendation */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Hiring Recommendation</label>
            <select
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-rose-900 focus:outline-none font-semibold"
            >
              <option value="STRONG_RECOMMEND">Strong Hire ⭐⭐⭐⭐⭐</option>
              <option value="RECOMMEND">Recommend Hire ⭐⭐⭐⭐</option>
              <option value="NEUTRAL">Borderline / Neutral ⭐⭐⭐</option>
              <option value="NOT_RECOMMEND">Do Not Hire ⭐⭐</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Detailed Evaluation Notes</label>
            <textarea
              rows={3}
              required
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Candidate demonstrated deep expertise in React and system design..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-rose-900 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold shadow-sm"
            >
              {submitting ? 'Submitting...' : 'Submit Evaluation Scorecard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
