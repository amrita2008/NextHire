'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Calendar,
  Clock,
  Video,
  Download,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  User,
  Plus,
  X,
  Sparkles
} from 'lucide-react';

function CandidateInterviewsContent() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('45');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ats_token');
      const res = await fetch('/api/interviews', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.interviews) {
        setInterviews(data.interviews);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const token = localStorage.getItem('ats_token');
      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          scheduledAt,
          durationMinutes: parseInt(durationMinutes),
          title: 'Candidate Self-Scheduled Interview',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to schedule interview');

      setSuccessMsg(`✅ Interview slot booked! Google Meet link: ${data.interview?.meetingUrl}`);
      setShowScheduleModal(false);
      setScheduledAt('');
      fetchInterviews();
      setTimeout(() => setSuccessMsg(''), 6000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error scheduling interview');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadIcs = (item: any) => {
    const jobTitle = item.jobTitle || 'Technical Interview';
    const meetUrl = item.meetingUrl || 'https://meet.google.com/nexthire-demo-meet';

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//NextHire//Interview Calendar//EN
BEGIN:VEVENT
SUMMARY:Interview for ${jobTitle}
DESCRIPTION:Video Interview via Google Meet: ${meetUrl}
LOCATION:${meetUrl}
DTSTART:${new Date(item.scheduledAt || Date.now()).toISOString().replace(/-|:|\.\d\d\d/g, '')}
DURATION:PT${item.durationMinutes || 45}M
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `interview_${jobTitle.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-rose-900 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-bold uppercase tracking-wider">
              Google Meet Portal
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
              My Scheduled Interviews
            </h1>
            <p className="text-slate-600 text-xs mt-0.5">
              Join live Google Meet calls, book interview slots, or download `.ics` calendar files.
            </p>
          </div>

          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-4.5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Book Interview Slot</span>
          </button>
        </div>

        {/* Success / Error Messages */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Interviews Cards Grid */}
        {loading ? (
          <div className="p-16 text-center text-slate-500 text-sm">Loading scheduled video calls...</div>
        ) : interviews.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center text-slate-500 text-sm space-y-3">
            <p>No scheduled interviews currently booked for your profile.</p>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-4 py-2 rounded-xl bg-rose-900 text-white font-bold text-xs shadow-sm inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Book Interview Slot Now</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interviews.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-rose-900/40 shadow-sm transition-all space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-rose-900" />
                    <h3 className="text-base font-bold text-slate-900">{item.jobTitle}</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 border border-rose-200 text-rose-900">
                    {item.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-slate-900">
                      {new Date(item.scheduledAt).toLocaleString()} ({item.durationMinutes} min)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Host: {item.interviewerName || 'Talent Acquisition Team'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => handleDownloadIcs(item)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Add to Calendar (.ics)</span>
                  </button>

                  <a
                    href={item.meetingUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Google Meet</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Schedule Interview Modal for Candidate */}
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-rose-900" />
                  <h3 className="text-base font-bold text-slate-900">Book Interview Slot</h3>
                </div>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCandidateSchedule} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preferred Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-rose-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
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

                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>A Google Meet invite link will be generated automatically and added to your dashboard.</span>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold shadow-sm"
                  >
                    {submitting ? 'Booking Slot...' : 'Confirm Interview Slot'}
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

export default function CandidateInterviewsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 text-slate-900 p-10">Loading Interview Schedule...</div>}>
      <CandidateInterviewsContent />
    </Suspense>
  );
}
