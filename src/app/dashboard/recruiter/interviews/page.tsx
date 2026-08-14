'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InterviewFeedbackModal from '@/components/InterviewFeedbackModal';
import {
  Calendar,
  Clock,
  Video,
  Plus,
  User,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Sparkles,
  X,
  Download,
  AlertCircle,
  Briefcase
} from 'lucide-react';

function RecruiterInterviewsContent() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [interviewers, setInterviewers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedInterviewForFeedback, setSelectedInterviewForFeedback] = useState<any>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form state
  const [selectedApplicationId, setSelectedApplicationId] = useState('');
  const [selectedInterviewerId, setSelectedInterviewerId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('45');
  const [interviewType, setInterviewType] = useState('TECHNICAL');
  const [interviewTitle, setInterviewTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ats_token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch interviews
      const resInterviews = await fetch('/api/interviews', { headers });
      const dataInterviews = await resInterviews.json();
      if (dataInterviews.interviews) setInterviews(dataInterviews.interviews);

      // Fetch all jobs with applications to build candidate-job dropdown
      const resJobs = await fetch('/api/jobs', { headers });
      const dataJobs = await resJobs.json();
      if (dataJobs.jobs) {
        const appsList: any[] = [];
        dataJobs.jobs.forEach((job: any) => {
          if (job.applications && job.applications.length > 0) {
            job.applications.forEach((app: any) => {
              appsList.push({
                ...app,
                jobTitle: job.title,
                jobDepartment: job.department,
                candidateName: app.candidate?.user?.name || 'Candidate',
                candidateEmail: app.candidate?.user?.email || '',
              });
            });
          }
        });
        setApplications(appsList);
      }

      // Fetch interviewers
      const resUsers = await fetch('/api/users?role=INTERVIEWER', { headers });
      const dataUsers = await resUsers.json();
      if (dataUsers.users) setInterviewers(dataUsers.users);

    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const token = localStorage.getItem('ats_token');
      const selectedApp = applications.find((a) => a.id === selectedApplicationId);

      const payload: any = {
        scheduledAt,
        durationMinutes: parseInt(durationMinutes),
        type: interviewType,
        title: interviewTitle || `${interviewType} Interview for ${selectedApp?.jobTitle || 'Position'}`,
      };

      if (selectedApplicationId) {
        payload.applicationId = selectedApplicationId;
      } else if (applications.length > 0) {
        // fallback to first application
        payload.applicationId = applications[0].id;
      }

      if (selectedInterviewerId) {
        payload.interviewerId = selectedInterviewerId;
      }

      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to schedule interview');

      setSuccessMsg(`✅ Interview scheduled! Google Meet: ${data.interview?.meetingUrl}`);
      setShowScheduleModal(false);
      setSelectedApplicationId('');
      setSelectedInterviewerId('');
      setScheduledAt('');
      setInterviewTitle('');
      fetchData();

      setTimeout(() => setSuccessMsg(''), 6000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error scheduling interview');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadIcs = (item: any) => {
    const title = item.jobTitle || item.title || 'Technical Interview';
    const meetUrl = item.meetingUrl || 'https://meet.google.com/nexthire-demo-meet';

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//NextHire//Interview Calendar//EN
BEGIN:VEVENT
SUMMARY:Technical Interview – ${title}
DESCRIPTION:Candidate: ${item.candidateName || 'Candidate'} | Google Meet: ${meetUrl}
LOCATION:${meetUrl}
DTSTART:${new Date(item.scheduledAt || Date.now()).toISOString().replace(/-|:|\.\d\d\d/g, '')}
DURATION:PT${item.durationMinutes || 45}M
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `interview_${title.replace(/\s+/g, '_')}.ics`);
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
              Google Meet Integration
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
              Interview Scheduling & Feedback Portal
            </h1>
            <p className="text-slate-600 text-xs mt-0.5">
              Schedule candidate interviews, auto-generate Google Meet URLs, and record structured evaluation scorecards.
            </p>
          </div>

          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-4.5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Interview</span>
          </button>
        </div>

        {/* Success / Error banners */}
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

        {/* Interviews Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Scheduled Interviews</h3>
            <span className="text-xs text-slate-500 font-medium">{interviews.length} session{interviews.length !== 1 ? 's' : ''} booked</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm">Loading interview calendar...</div>
          ) : interviews.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              No interviews scheduled yet. Click <strong>"Schedule Interview"</strong> to book a Google Meet session.
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Candidate</th>
                    <th className="p-4">Position</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Google Meet</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {interviews.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{item.candidateName || item.application?.candidate?.user?.name || 'Candidate'}</div>
                        <div className="text-slate-400 text-[11px]">{item.candidateEmail || item.application?.candidate?.user?.email || ''}</div>
                      </td>
                      <td className="p-4 text-slate-600 font-medium">{item.jobTitle}</td>
                      <td className="p-4 text-slate-600">
                        {item.scheduledAt ? new Date(item.scheduledAt).toLocaleString() : 'N/A'}
                        <div className="text-slate-400 text-[11px]">{item.durationMinutes} mins</div>
                      </td>
                      <td className="p-4">
                        <a
                          href={item.meetingUrl || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 font-bold text-[11px] hover:bg-rose-900 hover:text-white transition-all"
                        >
                          <Video className="w-3 h-3" />
                          <span>Join Meet</span>
                        </a>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'COMPLETED'
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                            : 'bg-slate-100 border border-slate-200 text-slate-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDownloadIcs(item)}
                            className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 transition-all"
                            title="Download .ics calendar invite"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedInterviewForFeedback(item)}
                            className="px-3 py-1.5 rounded-lg bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Scorecard</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Schedule Interview Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-rose-900" />
                  <h3 className="text-base font-bold text-slate-900">Schedule Interview & Generate Meet Link</h3>
                </div>
                <button
                  onClick={() => { setShowScheduleModal(false); setErrorMsg(''); }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
                {/* Candidate + Job selector */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Select Candidate & Job Application *
                  </label>
                  {applications.length === 0 ? (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                      No active applications found. Candidates need to apply first via the Careers portal.
                    </div>
                  ) : (
                    <select
                      required
                      value={selectedApplicationId}
                      onChange={(e) => setSelectedApplicationId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-rose-900 focus:outline-none"
                    >
                      <option value="">— Select Candidate & Position —</option>
                      {applications.map((app) => (
                        <option key={app.id} value={app.id}>
                          {app.candidateName} → {app.jobTitle} [{app.stage}]
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Interviewer selector */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assign Interviewer</label>
                  <select
                    value={selectedInterviewerId}
                    onChange={(e) => setSelectedInterviewerId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-rose-900 focus:outline-none"
                  >
                    <option value="">— Assign to self (default) —</option>
                    {interviewers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Interview Title */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Interview Title (optional)</label>
                  <input
                    type="text"
                    value={interviewTitle}
                    onChange={(e) => setInterviewTitle(e.target.value)}
                    placeholder="Technical Architecture Round"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-rose-900 focus:outline-none"
                  />
                </div>

                {/* Interview Type */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Interview Type</label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-rose-900 focus:outline-none"
                  >
                    <option value="TECHNICAL">Technical Round</option>
                    <option value="HR">HR Round</option>
                    <option value="SYSTEM_DESIGN">System Design</option>
                    <option value="CULTURAL_FIT">Cultural Fit</option>
                    <option value="FINAL">Final Round</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date & Time *</label>
                    <input
                      type="datetime-local"
                      required
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-rose-900 focus:outline-none"
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
                      <option value="90">90 Minutes</option>
                    </select>
                  </div>
                </div>

                {/* Auto Meet Link Info */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-900 shrink-0" />
                  <span>A unique Google Meet URL will be auto-generated (e.g. <strong>meet.google.com/abc-defg-hij</strong>) and sent to the candidate.</span>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => { setShowScheduleModal(false); setErrorMsg(''); }}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || applications.length === 0}
                    className="px-5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs shadow-sm disabled:opacity-60"
                  >
                    {submitting ? 'Scheduling...' : '📅 Generate Google Meet Invite'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Feedback Modal */}
        {selectedInterviewForFeedback && (
          <InterviewFeedbackModal
            interview={selectedInterviewForFeedback}
            onClose={() => setSelectedInterviewForFeedback(null)}
            onSuccess={() => {
              setSelectedInterviewForFeedback(null);
              fetchData();
            }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function RecruiterInterviewsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 text-slate-900 p-10">Loading Interview Portal...</div>}>
      <RecruiterInterviewsContent />
    </Suspense>
  );
}
