'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Calendar as CalendarIcon,
  Video,
  Clock,
  User,
  Briefcase,
  ExternalLink,
  Download,
  Copy,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileText,
  MapPin,
  Sparkles
} from 'lucide-react';

function CandidateInterviewsContent() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchCandidateInterviews();
  }, []);

  const fetchCandidateInterviews = async () => {
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
      console.error('Error fetching candidate interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMeetLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getGoogleCalendarUrl = (interview: any) => {
    const title = encodeURIComponent(interview.title || 'Job Interview');
    const details = encodeURIComponent(
      `Interview for position ${interview.application?.job?.title || 'Job Opportunity'} with ${
        interview.interviewer?.name || 'Interviewer'
      }.\n\nGoogle Meet Link: ${interview.meetingUrl || ''}`
    );
    const location = encodeURIComponent(interview.meetingUrl || 'Google Meet Online');

    const startDate = new Date(interview.scheduledAt);
    const endDate = new Date(startDate.getTime() + (interview.durationMinutes || 45) * 60000);

    const formatGDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const dates = `${formatGDate(startDate)}/${formatGDate(endDate)}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  const downloadIcsFile = (interview: any) => {
    const title = interview.title || 'Job Interview';
    const startDate = new Date(interview.scheduledAt);
    const endDate = new Date(startDate.getTime() + (interview.durationMinutes || 45) * 60000);

    const formatIcsDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//TalentPulse AI//ATS Interview Scheduler//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:Interview for position ${interview.application?.job?.title || 'Position'}. Google Meet: ${interview.meetingUrl || ''}`,
      `LOCATION:${interview.meetingUrl || 'Google Meet Online'}`,
      `DTSTART:${formatIcsDate(startDate)}`,
      `DTEND:${formatIcsDate(endDate)}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Interview_${title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-800/80 text-purple-300 text-[11px] font-semibold uppercase tracking-wider">
              Candidate Portal
            </span>
            <span className="px-2.5 py-1 rounded-md bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 text-[11px] font-semibold flex items-center gap-1">
              <CalendarIcon className="w-3 h-3 text-indigo-400" />
              Scheduled Invitations
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Your Interview Invitations</h1>
          <p className="text-slate-400 text-sm mt-1">
            View upcoming scheduled interviews, join Google Meet video calls, and export invitations to your personal calendar.
          </p>
        </div>

        {/* Interviews List */}
        {loading ? (
          <div className="p-16 text-center text-slate-500 text-sm">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            Loading your interview schedule...
          </div>
        ) : interviews.length === 0 ? (
          <div className="p-12 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <CalendarIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No Upcoming Interviews</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              When a recruiter schedules an interview for your job applications, your Google Meet invitation link and schedule details will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {interviews.map((interview) => {
              const isScheduled = interview.status === 'SCHEDULED';
              const isCompleted = interview.status === 'COMPLETED';

              return (
                <div
                  key={interview.id}
                  className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 shadow-xl transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-white">{interview.title}</h2>
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border ${
                            isCompleted
                              ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                              : isScheduled
                              ? 'bg-purple-950/80 border-purple-700 text-purple-300'
                              : 'bg-rose-950/80 border-rose-800 text-rose-300'
                          }`}
                        >
                          {interview.status}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-indigo-400 mt-1 flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4" />
                        {interview.application?.job?.title} • {interview.application?.job?.department}
                      </p>
                    </div>

                    {/* Primary Action Button: Join Google Meet */}
                    {interview.meetingUrl && isScheduled && (
                      <a
                        href={interview.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all shrink-0"
                      >
                        <Video className="w-4 h-4" />
                        Join Google Meet Call
                      </a>
                    )}
                  </div>

                  {/* Interview Meta Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-6">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-[11px] text-slate-500 font-semibold block uppercase tracking-wider mb-1">
                        Date & Time
                      </span>
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {new Date(interview.scheduledAt).toLocaleString([], {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-[11px] text-slate-500 font-semibold block uppercase tracking-wider mb-1">
                        Duration
                      </span>
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-400" />
                        {interview.durationMinutes} Minutes
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-[11px] text-slate-500 font-semibold block uppercase tracking-wider mb-1">
                        Assigned Interviewer
                      </span>
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-indigo-400" />
                        {interview.interviewer?.name || 'Recruitment Team'}
                      </p>
                    </div>
                  </div>

                  {/* Invitation Links & Export Options */}
                  <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyMeetLink(interview.meetingUrl, interview.id)}
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {copiedId === interview.id ? 'Copied Link!' : 'Copy Meeting Link'}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Add to Google Calendar */}
                      <a
                        href={getGoogleCalendarUrl(interview)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-xl bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 hover:bg-indigo-900 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
                        Add to Google Calendar
                      </a>

                      {/* Download .ics */}
                      <button
                        onClick={() => downloadIcsFile(interview)}
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-400" />
                        Download .ics Calendar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function CandidateInterviewsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white p-10">Loading Invitations...</div>}>
      <CandidateInterviewsContent />
    </Suspense>
  );
}
