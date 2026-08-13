'use client';

import React, { useState, useEffect } from 'react';
import {
  Star,
  X,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Award,
  UserCheck,
  Sparkles
} from 'lucide-react';

interface InterviewFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  interview: any;
  onFeedbackSubmitted?: () => void;
}

export default function InterviewFeedbackModal({
  isOpen,
  onClose,
  interview,
  onFeedbackSubmitted,
}: InterviewFeedbackModalProps) {
  const [technicalRating, setTechnicalRating] = useState(4);
  const [communicationRating, setCommunicationRating] = useState(4);
  const [problemSolvingRating, setProblemSolvingRating] = useState(4);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [existingFeedbacks, setExistingFeedbacks] = useState<any[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);

  useEffect(() => {
    if (isOpen && interview?.id) {
      fetchFeedbacks();
    }
  }, [isOpen, interview]);

  const fetchFeedbacks = async () => {
    try {
      setLoadingFeedbacks(true);
      const token = localStorage.getItem('ats_token');
      const res = await fetch(`/api/interviews/${interview.id}/feedback`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.feedbacks) {
        setExistingFeedbacks(data.feedbacks);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  if (!isOpen || !interview) return null;

  // Composite Rating Calculation
  const compositeRating = Number(
    ((technicalRating + communicationRating + problemSolvingRating) / 3).toFixed(1)
  );

  const getVerdictText = (score: number) => {
    if (score >= 4.5) return { text: 'Strong Hire', color: 'bg-emerald-950/80 border-emerald-700 text-emerald-300' };
    if (score >= 3.5) return { text: 'Recommend Hire', color: 'bg-indigo-950/80 border-indigo-700 text-indigo-300' };
    if (score >= 2.5) return { text: 'Borderline', color: 'bg-amber-950/80 border-amber-700 text-amber-300' };
    return { text: 'No Hire', color: 'bg-rose-950/80 border-rose-800 text-rose-300' };
  };

  const verdict = getVerdictText(compositeRating);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const token = localStorage.getItem('ats_token');
      const res = await fetch(`/api/interviews/${interview.id}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          technicalRating,
          communicationRating,
          problemSolvingRating,
          comments,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit feedback');

      setMessage('Feedback and score submitted successfully!');
      if (onFeedbackSubmitted) onFeedbackSubmitted();

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setMessage(err.message || 'Error submitting feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarSelector = (
    label: string,
    value: number,
    onChange: (val: number) => void,
    description: string
  ) => (
    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-white block">{label}</label>
          <span className="text-[10px] text-slate-400">{description}</span>
        </div>
        <span className="text-xs font-extrabold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
          {value} / 5
        </span>
      </div>

      <div className="flex items-center gap-1.5 pt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                star <= value
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-700 hover:text-slate-500'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Interviewer Feedback & Score</h3>
              <p className="text-xs text-slate-400">
                Candidate: {interview?.application?.candidate?.user?.name || 'Applicant'} • {interview?.application?.job?.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Feedbacks list if any */}
        {existingFeedbacks.length > 0 && (
          <div className="mb-6 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Previously Submitted Feedbacks ({existingFeedbacks.length})
            </h4>
            <div className="space-y-3">
              {existingFeedbacks.map((fb) => (
                <div key={fb.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-indigo-300">{fb.interviewer?.name} ({fb.interviewer?.role})</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-extrabold border border-emerald-800">
                      Composite: {fb.overallRating} / 5
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2 text-[11px] text-slate-400">
                    <span>Tech: {fb.technicalRating}/5</span>
                    <span>Comm: {fb.communicationRating}/5</span>
                    <span>Problem Solving: {fb.problemSolvingRating}/5</span>
                  </div>
                  <p className="text-slate-300 italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 mt-1">
                    "{fb.comments}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {message && (
          <div
            className={`p-3 rounded-xl mb-5 text-xs font-semibold flex items-center gap-2 ${
              message.includes('success')
                ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                : 'bg-rose-950/80 border border-rose-800 text-rose-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        {/* Feedback Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Live Composite Score Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-indigo-800/50 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                Calculated Composite Rating
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-extrabold text-white">{compositeRating}</span>
                <span className="text-xs text-slate-400">/ 5.0</span>
                <div className="flex items-center ml-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= Math.round(compositeRating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 block mb-1">Recommendation</span>
              <span className={`px-3 py-1 rounded-lg text-xs font-extrabold border ${verdict.color}`}>
                {verdict.text}
              </span>
            </div>
          </div>

          {/* Star Categories */}
          <div className="space-y-3">
            {renderStarSelector(
              'Technical Skills & Domain Knowledge',
              technicalRating,
              setTechnicalRating,
              'Coding, system architecture, tools & algorithms'
            )}

            {renderStarSelector(
              'Communication & Cultural Alignment',
              communicationRating,
              setCommunicationRating,
              'Clarity, active listening, teamwork & articulation'
            )}

            {renderStarSelector(
              'Problem Solving & Analytical Ability',
              problemSolvingRating,
              setProblemSolvingRating,
              'Approach to complex challenges & logical reasoning'
            )}
          </div>

          {/* Comments Textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Detailed Feedback & Notes *
            </label>
            <textarea
              rows={4}
              required
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Highlight candidate's key strengths, gaps, technical answer accuracy, and specific hiring recommendations..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting Score...' : 'Submit Interview Feedback'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
