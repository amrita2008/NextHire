'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Briefcase,
  FileText,
  Calendar,
  Code2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Upload,
  User,
  Sparkles,
  ArrowRight,
  Video,
  Award,
  Download,
  X,
  Edit3,
  Mail,
  MapPin,
  Phone,
  FileCode,
  Bell
} from 'lucide-react';

function CandidateDashboardContent() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit / AI Resume Parsing Modal
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [parsingAi, setParsingAi] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('ats_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }

    fetchCandidateData();
  }, []);

  const fetchCandidateData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ats_token');
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Fetch Candidate Profile
      const resProfile = await fetch('/api/candidate/profile', { headers });
      const dataProfile = await resProfile.json();
      if (dataProfile.profile) {
        setProfile(dataProfile.profile);
        setPhone(dataProfile.profile.phone || '');
        setLocation(dataProfile.profile.location || '');
        setBio(dataProfile.profile.bio || '');
        setSkillsText(dataProfile.profile.skills ? dataProfile.profile.skills.join(', ') : '');
        setResumeText(dataProfile.profile.resumeText || '');
      }

      // 2. Fetch Applications
      const resApps = await fetch('/api/applications', { headers });
      const dataApps = await resApps.json();
      if (dataApps.applications) {
        setApplications(dataApps.applications);
      } else {
        // Fallback fetch via /api/jobs if direct applications empty
        const resJobs = await fetch('/api/jobs');
        const dataJobs = await resJobs.json();
        let myApps: any[] = [];
        if (dataJobs.jobs) {
          dataJobs.jobs.forEach((job: any) => {
            if (job.applications) {
              job.applications.forEach((app: any) => {
                myApps.push({
                  ...app,
                  jobTitle: job.title,
                  jobDepartment: job.department,
                  jobLocation: job.location,
                });
              });
            }
          });
        }
        setApplications(myApps);
      }

      // 3. Fetch Scheduled Interviews
      const resInterviews = await fetch('/api/interviews', { headers });
      const dataInterviews = await resInterviews.json();
      if (dataInterviews.interviews) {
        setInterviews(dataInterviews.interviews);
      }

      // 4. Fetch Assigned Assessments
      const resAssessments = await fetch('/api/assessments', { headers });
      const dataAssessments = await resAssessments.json();
      if (dataAssessments.assessments) {
        setAssessments(dataAssessments.assessments);
      }

      // 5. Fetch Offers
      const resOffers = await fetch('/api/offers', { headers });
      const dataOffers = await resOffers.json();
      if (dataOffers.offers) {
        setOffers(dataOffers.offers);
      }
    } catch (err) {
      console.error('Fetch Candidate Data Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setModalMsg('');

    try {
      const token = localStorage.getItem('ats_token');
      const skillsArray = skillsText.split(',').map((s) => s.trim()).filter(Boolean);

      const res = await fetch('/api/candidate/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone,
          location,
          bio,
          skills: skillsArray,
          resumeText,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      setModalMsg('Profile updated successfully!');
      if (data.profile) {
        setProfile(data.profile);
      }
      setTimeout(() => setShowProfileModal(false), 1200);
    } catch (err: any) {
      setModalMsg(err.message || 'Error updating profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleRunGeminiResumeParse = async () => {
    if (!resumeText.trim()) {
      setModalMsg('Please paste resume text below to run Gemini AI analysis.');
      return;
    }

    setParsingAi(true);
    setModalMsg('');

    try {
      const token = localStorage.getItem('ats_token');
      const res = await fetch('/api/ai/parse-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resumeText }),
      });

      const data = await res.json();
      if (data.parsedData || data.profile) {
        setModalMsg('Gemini AI parsed resume successfully! Profile fields auto-populated.');
        if (data.profile) setProfile(data.profile);
        if (data.parsedData) {
          if (data.parsedData.phone) setPhone(data.parsedData.phone);
          if (data.parsedData.location) setLocation(data.parsedData.location);
          if (data.parsedData.bio) setBio(data.parsedData.bio);
          if (data.parsedData.skills) setSkillsText(data.parsedData.skills.join(', '));
        }
      }
    } catch (err: any) {
      setModalMsg('Error parsing resume text');
    } finally {
      setParsingAi(false);
    }
  };

  const handleDownloadIcs = (item: any) => {
    const jobTitle = item.jobTitle || item.application?.job?.title || 'Position';
    const meetingUrl = item.meetingUrl || 'https://meet.google.com/nexthire-demo';

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//NextHire//Interview Calendar//EN
BEGIN:VEVENT
SUMMARY:Technical Interview for ${jobTitle}
DESCRIPTION:Video Interview via Google Meet: ${meetingUrl}
LOCATION:${meetingUrl}
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

  // Calculate Profile Completion %
  const calculateCompletion = () => {
    let score = 20; // Base registered user
    if (profile?.phone || phone) score += 15;
    if (profile?.location || location) score += 15;
    if (profile?.bio || bio) score += 20;
    if (profile?.skills?.length || skillsText) score += 15;
    if (profile?.resumeText || resumeText) score += 15;
    return Math.min(100, score);
  };

  const completionPct = calculateCompletion();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-rose-900 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-bold uppercase tracking-wider">
              Candidate Portal & Career Suite
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
              Welcome back, {user?.name || 'Applicant'}
            </h1>
            <p className="text-slate-600 text-xs mt-0.5">
              Track your active job applications, scheduled video interviews, coding assessments, and job offers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowProfileModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-xs shadow-sm flex items-center gap-1.5 hover:bg-slate-100 transition-all"
            >
              <Edit3 className="w-4 h-4 text-rose-900" />
              <span>Edit Profile & AI Resume</span>
            </button>

            <Link
              href="/careers"
              className="px-4.5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Briefcase className="w-4 h-4" />
              <span>Browse Job Openings</span>
            </Link>
          </div>
        </div>

        {/* Top Profile Summary & AI Evaluation Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-900 text-white flex items-center justify-center font-bold text-lg">
                  {user?.name?.charAt(0) || 'C'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{user?.name || 'Candidate'}</h3>
                  <p className="text-xs text-slate-500">{user?.email || 'candidate@nexthire.ai'}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 border border-emerald-200 text-emerald-800">
                Active Candidate
              </span>
            </div>

            {/* Profile Completion Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Profile Completion</span>
                <span className="font-extrabold text-rose-900">{completionPct}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-rose-800 to-rose-900 transition-all duration-500 rounded-full"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile?.location || location || 'Location not specified'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile?.phone || phone || 'Phone not added'}</span>
              </div>
            </div>
          </div>

          {/* Gemini AI Resume Score & Feedback Card */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-white shadow-xl flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Google Gemini AI Resume Analysis</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-extrabold text-xs">
                92 / 100 Resume Score
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed italic">
              "{profile?.bio || 'Candidate profile demonstrates exceptional technical alignment with modern full-stack frameworks, TypeScript, React 19, and Google Gemini AI APIs. Resume structure is clear and ATS-friendly.'}"
            </p>

            {/* Skills Badges */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1">Verified Skills:</span>
              {(profile?.skills && profile.skills.length > 0
                ? profile.skills
                : ['TypeScript', 'Next.js', 'React', 'Node.js', 'Google Gemini AI', 'Prisma', 'MongoDB']
              ).map((skill: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Submitted Applications</span>
            <div className="text-3xl font-extrabold text-slate-900">{applications.length}</div>
            <p className="text-[11px] text-slate-500">Active hiring pipelines</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Scheduled Interviews</span>
            <div className="text-3xl font-extrabold text-rose-900">{interviews.length}</div>
            <p className="text-[11px] text-slate-500">Google Meet links ready</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Coding Assessments</span>
            <div className="text-3xl font-extrabold text-slate-900">{assessments.length}</div>
            <p className="text-[11px] text-slate-500">Sandbox tests assigned</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Formal Job Offers</span>
            <div className="text-3xl font-extrabold text-emerald-700">{offers.length}</div>
            <p className="text-[11px] text-slate-500">Decision portals active</p>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Application Stage Tracker</h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time status updates from hiring managers</p>
            </div>
            <Link href="/careers" className="text-xs text-rose-900 font-bold hover:underline">
              Apply for More Jobs →
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              You haven't submitted any job applications yet.{' '}
              <Link href="/careers" className="text-rose-900 font-bold hover:underline">
                Explore open positions →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Position Title</th>
                    <th className="p-4">Department & Location</th>
                    <th className="p-4">AI Match Score</th>
                    <th className="p-4">Pipeline Stage</th>
                    <th className="p-4">Applied Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">
                        {app.jobTitle || app.job?.title || 'Senior Full-Stack AI Engineer'}
                      </td>
                      <td className="p-4 text-slate-600 font-medium">
                        {app.jobDepartment || app.job?.department || 'Engineering'} ({app.jobLocation || app.job?.location || 'San Francisco, CA'})
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-900 font-extrabold text-[10px]">
                          {app.matchScore || 94}% AI Match
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            app.stage === 'OFFER' || app.stage === 'HIRED'
                              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                              : 'bg-rose-50 border border-rose-200 text-rose-900'
                          }`}
                        >
                          {app.stage}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Today'}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href="/dashboard/candidate/interviews"
                          className="px-3 py-1.5 rounded-lg bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs shadow-sm inline-flex items-center gap-1.5"
                        >
                          <span>Interviews</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 2-Column Grid: Scheduled Interviews & Coding Assessments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scheduled Video Interviews Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-rose-900" />
                <h3 className="text-base font-bold text-slate-900">Scheduled Interviews</h3>
              </div>
              <Link href="/dashboard/candidate/interviews" className="text-xs text-rose-900 font-bold hover:underline">
                View All →
              </Link>
            </div>

            {interviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">No scheduled interviews currently booked.</p>
            ) : (
              <div className="space-y-3">
                {interviews.slice(0, 2).map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {item.jobTitle || item.application?.job?.title || 'Technical Architecture Interview'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 border border-rose-200 text-rose-900">
                        {item.status}
                      </span>
                    </div>

                    <p className="text-slate-600">
                      📅 {new Date(item.scheduledAt || Date.now()).toLocaleString()} ({item.durationMinutes || 45} mins)
                    </p>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => handleDownloadIcs(item)}
                        className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>.ics Calendar</span>
                      </button>

                      <a
                        href={item.meetingUrl || 'https://meet.google.com/nexthire-demo-meet'}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-rose-900 text-white font-bold text-[11px] shadow-sm flex items-center gap-1"
                      >
                        <Video className="w-3 h-3" />
                        <span>Join Google Meet</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assigned Coding Assessments Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-rose-900" />
                <h3 className="text-base font-bold text-slate-900">Assigned Coding Tests</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">Live Anti-Cheat Sandbox</span>
            </div>

            {assessments.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">No coding assessments assigned.</p>
            ) : (
              <div className="space-y-3">
                {assessments.slice(0, 2).map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{item.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-800">
                        Pass Mark: {item.passPercentage}%
                      </span>
                    </div>

                    <p className="text-slate-600">⏱️ Duration: {item.durationMinutes} Minutes (Anti-Cheat Telemetry Active)</p>

                    <div className="pt-2 flex items-center justify-end">
                      <Link
                        href={`/dashboard/candidate/assessment/${item.id}`}
                        className="px-3.5 py-1.5 rounded-lg bg-rose-900 hover:bg-rose-800 text-white font-bold text-[11px] shadow-sm flex items-center gap-1"
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        <span>Launch Live Sandbox</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pending Job Offers Card */}
        {offers.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-slate-900">Formal Job Offer Proposals</h3>
              </div>
              <span className="text-xs text-emerald-800 font-extrabold px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                Decision Required
              </span>
            </div>

            <div className="space-y-3">
              {offers.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">
                      {item.jobTitle || 'Senior Full-Stack AI Engineer'}
                    </h4>
                    <p className="text-emerald-700 font-extrabold">
                      Base Salary: ${item.salary?.toLocaleString()} / year ({item.currency || 'USD'})
                    </p>
                    <p className="text-slate-500">
                      Target Start Date: {item.joiningDate ? new Date(item.joiningDate).toLocaleDateString() : 'Immediate'}
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/candidate/offers/${item.id}`}
                    className="px-4 py-2 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 self-start sm:self-auto"
                  >
                    <span>Preview & Decide</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Edit & AI Resume Parser Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-rose-900" />
                  <h3 className="text-base font-bold text-slate-900">Candidate Profile & AI Resume</h3>
                </div>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modalMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold ${
                    modalMsg.includes('success') || modalMsg.includes('parsed')
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border border-rose-200 text-rose-900'
                  }`}
                >
                  {modalMsg}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-rose-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="San Francisco, CA"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-rose-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Professional Bio</label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Short bio summary..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-rose-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                    placeholder="TypeScript, Next.js, React, Node.js, Python, Docker"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-rose-900 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-700">Resume Content</label>
                    <button
                      type="button"
                      onClick={handleRunGeminiResumeParse}
                      disabled={parsingAi}
                      className="text-[11px] font-bold text-rose-900 hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{parsingAi ? 'Parsing...' : 'Analyze & Auto-fill with AI'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={5}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste resume raw text content here..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-rose-900 focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-5 py-2 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold shadow-sm"
                  >
                    {savingProfile ? 'Saving...' : 'Save Profile Changes'}
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

export default function CandidateDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 text-slate-900 p-10">Loading Candidate Portal...</div>}>
      <CandidateDashboardContent />
    </Suspense>
  );
}
