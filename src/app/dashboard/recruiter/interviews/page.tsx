'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InterviewFeedbackModal from '@/components/InterviewFeedbackModal';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  User,
  Users,
  Search,
  Filter,
  Plus,
  Copy,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Briefcase,
  Mail,
  MapPin,
  X,
  MoreVertical,
  CalendarCheck,
  Building2,
  Award,
  Star
} from 'lucide-react';

function RecruiterInterviewsContent() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Edit / Reschedule Modal
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingInterview, setEditingInterview] = useState<any>(null);
  const [interviewers, setInterviewers] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  // Feedback Modal State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedInterviewForFeedback, setSelectedInterviewForFeedback] = useState<any>(null);

  // Schedule Form State
  const [selectedAppId, setSelectedAppId] = useState('');
  const [selectedInterviewerId, setSelectedInterviewerId] = useState('');
  const [interviewTitle, setInterviewTitle] = useState('Technical Screening Interview');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('14:00');
  const [interviewDuration, setInterviewDuration] = useState('45');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchInterviews();
    fetchInterviewers();
    fetchApplications();
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
      console.error('Error fetching interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInterviewers = async () => {
    try {
      const token = localStorage.getItem('ats_token');
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.users) {
        setInterviewers(data.users);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('ats_token');
      const res = await fetch('/api/applications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.applications) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenNewScheduleModal = () => {
    setEditingInterview(null);
    setInterviewTitle('Technical Screening Interview');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setInterviewDate(tomorrow.toISOString().split('T')[0]);
    setInterviewTime('14:00');
    setInterviewDuration('45');
    
    const randCode = Math.random().toString(36).substring(2, 5) + '-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 5);
    setMeetingUrl(`https://meet.google.com/${randCode}`);
    
    if (applications.length > 0) setSelectedAppId(applications[0].id);
    if (interviewers.length > 0) setSelectedInterviewerId(interviewers[0].id);
    
    setMessage('');
    setShowScheduleModal(true);
  };

  const handleOpenEditModal = (interview: any) => {
    setEditingInterview(interview);
    setInterviewTitle(interview.title || 'Technical Interview');
    const dateObj = new Date(interview.scheduledAt);
    setInterviewDate(dateObj.toISOString().split('T')[0]);
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const mins = String(dateObj.getMinutes()).padStart(2, '0');
    setInterviewTime(`${hours}:${mins}`);
    setInterviewDuration(String(interview.durationMinutes || 45));
    setMeetingUrl(interview.meetingUrl || '');
    setSelectedInterviewerId(interview.interviewerId || '');
    setSelectedAppId(interview.applicationId || '');
    setMessage('');
    setShowScheduleModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('ats_token');
      const scheduledDateTime = new Date(`${interviewDate}T${interviewTime}:00`);

      if (editingInterview) {
        const res = await fetch(`/api/interviews/${editingInterview.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: interviewTitle,
            scheduledAt: scheduledDateTime.toISOString(),
            durationMinutes: parseInt(interviewDuration),
            meetingUrl,
            interviewerId: selectedInterviewerId,
          }),
        });

        if (!res.ok) throw new Error('Failed to update interview');
        setMessage('Interview updated successfully!');
      } else {
        const res = await fetch('/api/interviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            applicationId: selectedAppId,
            interviewerId: selectedInterviewerId,
            title: interviewTitle,
            scheduledAt: scheduledDateTime.toISOString(),
            durationMinutes: parseInt(interviewDuration),
            meetingUrl,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to schedule interview');
        setMessage('Interview scheduled & Google Meet link generated!');
      }

      setTimeout(() => {
        setShowScheduleModal(false);
        fetchInterviews();
      }, 1000);
    } catch (err: any) {
      setMessage(err.message || 'An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusChange = async (interviewId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('ats_token');
      setInterviews((prev: any[]) =>
        prev.map((item: any) => (item.id === interviewId ? { ...item, status: newStatus } : item))
      );

      await fetch(`/api/interviews/${interviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error(err);
      fetchInterviews();
    }
  };

  const handleCopyLink = (interview: any) => {
    if (!interview.meetingUrl) return;
    navigator.clipboard.writeText(interview.meetingUrl);
    setCopiedId(interview.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered interviews
  const filteredInterviews = interviews.filter((item: any) => {
    const candidateName = item.application?.candidate?.user?.name || '';
    const jobTitle = item.application?.job?.title || '';
    const interviewerName = item.interviewer?.name || '';
    const q = searchQuery.toLowerCase();

    const matchesSearch =
      candidateName.toLowerCase().includes(q) ||
      jobTitle.toLowerCase().includes(q) ||
      interviewerName.toLowerCase().includes(q);

    if (filterStatus === 'ALL') return matchesSearch;
    return matchesSearch && item.status === filterStatus;
  });

  // Calendar Days Computation
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-800/80 text-purple-300 text-[11px] font-semibold uppercase tracking-wider">
                Interview Management
              </span>
              <span className="px-2.5 py-1 rounded-md bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 text-[11px] font-semibold flex items-center gap-1">
                <Video className="w-3 h-3 text-indigo-400" />
                Google Meet Auto-Integration
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">
              Interview Schedule & Calendar
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Manage candidate interviews, coordinate interviewer schedules, and dispatch Google Meet links.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Switcher */}
            <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'calendar' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                Calendar View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                List View
              </button>
            </div>

            <button
              onClick={handleOpenNewScheduleModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Interview</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                filterStatus === 'ALL'
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All ({interviews.length})
            </button>
            <button
              onClick={() => setFilterStatus('SCHEDULED')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                filterStatus === 'SCHEDULED'
                  ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Scheduled ({interviews.filter((i: any) => i.status === 'SCHEDULED').length})
            </button>
            <button
              onClick={() => setFilterStatus('COMPLETED')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                filterStatus === 'COMPLETED'
                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Completed ({interviews.filter((i: any) => i.status === 'COMPLETED').length})
            </button>
            <button
              onClick={() => setFilterStatus('CANCELLED')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                filterStatus === 'CANCELLED'
                  ? 'bg-rose-600/20 border-rose-500 text-rose-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Cancelled ({interviews.filter((i: any) => i.status === 'CANCELLED').length})
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate, job, interviewer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Content Render: Calendar vs List */}
        {loading ? (
          <div className="p-20 text-center text-slate-500 text-sm">Loading interview calendar...</div>
        ) : viewMode === 'calendar' ? (
          /* Interactive Monthly Calendar View */
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-6">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-400" />
                {currentDate.toLocaleString('default', { month: 'long' })} {currentYear}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Today
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Month Grid Cells */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[110px] rounded-xl bg-slate-950/30 border border-slate-800/30"></div>
              ))}

              {Array.from({ length: daysInMonth }).map((_, dayIdx) => {
                const dayNum = dayIdx + 1;
                const dateObj = new Date(currentYear, currentMonth, dayNum);
                const isToday =
                  new Date().toDateString() === dateObj.toDateString();

                const dayInterviews = filteredInterviews.filter((item: any) => {
                  const itemDate = new Date(item.scheduledAt);
                  return itemDate.toDateString() === dateObj.toDateString();
                });

                return (
                  <div
                    key={dayNum}
                    className={`min-h-[110px] p-2 rounded-xl border transition-all flex flex-col justify-between ${
                      isToday
                        ? 'bg-indigo-950/30 border-indigo-500/60'
                        : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-extrabold px-2 py-0.5 rounded-lg ${
                          isToday
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-300'
                        }`}
                      >
                        {dayNum}
                      </span>
                      {dayInterviews.length > 0 && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                          {dayInterviews.length} slots
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 mt-2 flex-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                      {dayInterviews.map((item: any) => (
                        <div
                          key={item.id}
                          onClick={() => handleOpenEditModal(item)}
                          className={`p-1.5 rounded-lg border text-[10px] cursor-pointer transition-all hover:scale-[1.02] ${
                            item.status === 'COMPLETED'
                              ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
                              : item.status === 'CANCELLED'
                              ? 'bg-rose-950/60 border-rose-800/80 text-rose-300'
                              : 'bg-purple-950/60 border-purple-800/80 text-purple-300'
                          }`}
                        >
                          <p className="font-bold truncate">{item.title}</p>
                          <p className="text-slate-400 truncate">
                            {new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {item.application?.candidate?.user?.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* List View */
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl divide-y divide-slate-800">
            {filteredInterviews.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Video className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="font-semibold text-white">No interviews scheduled yet</p>
                <p className="text-xs text-slate-500 mt-1">Click "Schedule Interview" to book candidate slots.</p>
              </div>
            ) : (
              filteredInterviews.map((interview: any) => (
                <div
                  key={interview.id}
                  className="p-6 hover:bg-slate-850/50 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-white">{interview.title}</h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border ${
                          interview.status === 'COMPLETED'
                            ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                            : interview.status === 'CANCELLED'
                            ? 'bg-rose-950/80 border-rose-800 text-rose-300'
                            : 'bg-purple-950/80 border-purple-800 text-purple-300'
                        }`}
                      >
                        {interview.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                      <span className="flex items-center gap-1.5 font-medium text-indigo-300">
                        <User className="w-3.5 h-3.5 text-indigo-400" />
                        Candidate: {interview.application?.candidate?.user?.name || 'N/A'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                        {interview.application?.job?.title || 'Position'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {new Date(interview.scheduledAt).toLocaleString()} ({interview.durationMinutes} mins)
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>Interviewer: {interview.interviewer?.name} ({interview.interviewer?.role})</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    {interview.meetingUrl && (
                      <a
                        href={interview.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Join Google Meet
                      </a>
                    )}

                    {/* Submit / View Feedback Button */}
                    <button
                      onClick={() => {
                        setSelectedInterviewForFeedback(interview);
                        setShowFeedbackModal(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-purple-950/80 border border-purple-800/80 text-purple-300 hover:bg-purple-900 font-semibold text-xs transition-all flex items-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5 text-purple-400" />
                      <span>{interview.feedbacks && interview.feedbacks.length > 0 ? 'View Feedback' : 'Score & Feedback'}</span>
                    </button>

                    <button
                      onClick={() => handleCopyLink(interview)}
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copiedId === interview.id ? 'Copied Link!' : 'Copy Invite Link'}
                    </button>

                    {/* Status Dropdown */}
                    <select
                      value={interview.status}
                      onChange={(e) => handleStatusChange(interview.id, e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none"
                    >
                      <option value="SCHEDULED">Status: Scheduled</option>
                      <option value="COMPLETED">Status: Completed</option>
                      <option value="CANCELLED">Status: Cancelled</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Interview Feedback Modal Component */}
        <InterviewFeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          interview={selectedInterviewForFeedback}
          onFeedbackSubmitted={() => fetchInterviews()}
        />

        {/* Schedule / Reschedule Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {editingInterview ? 'Reschedule Interview' : 'Schedule New Interview'}
                    </h3>
                    <p className="text-xs text-slate-400">Google Meet link will be generated automatically</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {message && (
                <div
                  className={`p-3 rounded-xl mb-4 text-xs font-semibold ${
                    message.includes('success') || message.includes('generated')
                      ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                      : 'bg-rose-950/80 border border-rose-800 text-rose-300'
                  }`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {!editingInterview && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Select Candidate Application *</label>
                    <select
                      value={selectedAppId}
                      onChange={(e) => setSelectedAppId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    >
                      {applications.map((app: any) => (
                        <option key={app.id} value={app.id}>
                          {app.candidate?.user?.name} - {app.job?.title} ({app.stage})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Interview Title *</label>
                  <input
                    type="text"
                    required
                    value={interviewTitle}
                    onChange={(e) => setInterviewTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Time *</label>
                    <input
                      type="time"
                      required
                      value={interviewTime}
                      onChange={(e) => setInterviewTime(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Minutes)</label>
                    <select
                      value={interviewDuration}
                      onChange={(e) => setInterviewDuration(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="30">30 Minutes</option>
                      <option value="45">45 Minutes</option>
                      <option value="60">60 Minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Interviewer</label>
                    <select
                      value={selectedInterviewerId}
                      onChange={(e) => setSelectedInterviewerId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    >
                      {interviewers.map((user: any) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Google Meet URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      required
                      value={meetingUrl}
                      onChange={(e) => setMeetingUrl(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-indigo-300 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                    <a
                      href={meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600 hover:text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                  >
                    {formLoading ? 'Saving...' : editingInterview ? 'Update Schedule' : 'Schedule Interview'}
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

export default function RecruiterInterviewsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white p-10">Loading Calendar...</div>}>
      <RecruiterInterviewsContent />
    </Suspense>
  );
}
