'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  FileText,
  Plus,
  Search,
  DollarSign,
  Calendar,
  CheckCircle2,
  XCircle,
  Briefcase,
  User,
  ExternalLink,
  X,
  Sparkles,
  Award,
  MapPin
} from 'lucide-react';

function RecruiterOffersContent() {
  const [offers, setOffers] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Issue Offer Modal State
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('120000');
  const [location, setLocation] = useState('Remote');
  const [joiningDate, setJoiningDate] = useState('');
  const [benefits, setBenefits] = useState('Standard Health, Vision, Dental & 401(k) Plan');
  const [createLoading, setCreateLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchOffers();
    fetchApplications();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ats_token');
      const res = await fetch('/api/offers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.offers) {
        setOffers(data.offers);
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
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
        if (data.applications.length > 0) {
          setSelectedAppId(data.applications[0].id);
          setRole(data.applications[0].job?.title || 'Software Engineer');
          setLocation(data.applications[0].job?.location || 'Remote');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenIssueModal = () => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 14);
    setJoiningDate(defaultDate.toISOString().split('T')[0]);
    setMessage('');
    setShowIssueModal(true);
  };

  const handleAppSelectChange = (appId: string) => {
    setSelectedAppId(appId);
    const selectedApp = applications.find((a) => a.id === appId);
    if (selectedApp) {
      setRole(selectedApp.job?.title || '');
      setLocation(selectedApp.job?.location || 'Remote');
    }
  };

  const handleIssueOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('ats_token');
      const selectedApp = applications.find((a) => a.id === selectedAppId);
      if (!selectedApp) throw new Error('Selected application not found');

      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          applicationId: selectedAppId,
          role,
          salary: parseInt(salary),
          joiningDate,
          location,
          benefits,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to issue offer letter');

      setMessage('Official Offer Letter generated and dispatched to candidate!');
      setTimeout(() => {
        setShowIssueModal(false);
        fetchOffers();
      }, 1200);
    } catch (err: any) {
      setMessage(err.message || 'Error generating offer');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-[11px] font-semibold uppercase tracking-wider">
                Offer Letter Operations
              </span>
              <span className="px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-800/80 text-purple-300 text-[11px] font-semibold flex items-center gap-1">
                <FileText className="w-3 h-3 text-purple-400" />
                Dynamic PDF Generator & Tracking Portal
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">
              Job Offers & Compensation Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Issue formal employment offer letters, define salary packages, and monitor candidate acceptance decisions.
            </p>
          </div>

          <button
            onClick={handleOpenIssueModal}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-xl shadow-emerald-600/30 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Extend Job Offer</span>
          </button>
        </div>

        {/* Offers Grid */}
        {loading ? (
          <div className="p-16 text-center text-slate-500 text-sm">Loading offer letters...</div>
        ) : offers.length === 0 ? (
          <div className="p-12 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No Offers Issued Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Click "Extend Job Offer" to issue a formal job offer letter to shortlisted candidates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => {
              const candidateName = offer.application?.candidate?.user?.name || 'Candidate';

              return (
                <div
                  key={offer.id}
                  className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 shadow-xl space-y-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-base font-bold text-white">{offer.role}</h3>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                          offer.status === 'ACCEPTED'
                            ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                            : offer.status === 'REJECTED'
                            ? 'bg-rose-950/80 border-rose-800 text-rose-300'
                            : 'bg-purple-950/80 border-purple-800 text-purple-300'
                        }`}
                      >
                        {offer.status}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5 mb-3">
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      Candidate: {candidateName}
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-400">
                      <p className="flex items-center gap-1.5 font-bold text-emerald-400">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Salary: ${offer.salary.toLocaleString()} / year</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-purple-400" />
                        <span>Location: {offer.location}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>Joining Date: {new Date(offer.joiningDate).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <a
                      href={`/dashboard/candidate/offers/${offer.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-indigo-400 hover:text-white flex items-center gap-1"
                    >
                      View & Print PDF Offer →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Issue Offer Modal */}
        {showIssueModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Extend Formal Job Offer</h3>
                </div>
                <button
                  onClick={() => setShowIssueModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {message && (
                <div className="p-3 rounded-xl mb-4 text-xs font-semibold bg-emerald-950/80 border border-emerald-800 text-emerald-300">
                  {message}
                </div>
              )}

              <form onSubmit={handleIssueOfferSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Select Candidate Application *</label>
                  <select
                    value={selectedAppId}
                    onChange={(e) => handleAppSelectChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    {applications.map((app) => (
                      <option key={app.id} value={app.id}>
                        {app.candidate?.user?.name} - {app.job?.title} ({app.stage})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Official Offer Job Title (Role) *</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Annual Base Salary ($) *</label>
                    <input
                      type="number"
                      required
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Work Location *</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Joining Date *</label>
                  <input
                    type="date"
                    required
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Benefits Package Summary</label>
                  <textarea
                    rows={2}
                    value={benefits}
                    onChange={(e) => setBenefits(e.target.value)}
                    placeholder="Health, Dental, Vision & 401(k)..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowIssueModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30"
                  >
                    {createLoading ? 'Generating...' : 'Issue Offer Letter'}
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

export default function RecruiterOffersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white p-10">Loading Offers...</div>}>
      <RecruiterOffersContent />
    </Suspense>
  );
}
