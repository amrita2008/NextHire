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
  Building2
} from 'lucide-react';

function CandidateInterviewsContent() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDownloadIcs = (item: any) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//NextHire//Interview Calendar//EN
BEGIN:VEVENT
SUMMARY:Interview for ${item.jobTitle}
DESCRIPTION:Video Interview via Google Meet: ${item.meetingUrl}
LOCATION:${item.meetingUrl}
DTSTART:${new Date(item.scheduledAt).toISOString().replace(/-|:|\.\d\d\d/g, '')}
DURATION:PT${item.durationMinutes}M
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `interview_${item.jobTitle.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-rose-900 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <span className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-bold uppercase tracking-wider">
            Google Meet Portal
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            My Scheduled Interviews
          </h1>
          <p className="text-slate-600 text-xs mt-0.5">
            Join live Google Meet calls or download `.ics` calendar files.
          </p>
        </div>

        {/* Interviews Cards Grid */}
        {loading ? (
          <div className="p-16 text-center text-slate-500 text-sm">Loading scheduled video calls...</div>
        ) : interviews.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center text-slate-500 text-sm">
            No scheduled interviews currently booked for your profile.
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
