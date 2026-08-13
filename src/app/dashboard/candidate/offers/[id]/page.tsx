'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Download,
  Printer,
  Calendar,
  DollarSign,
  Briefcase,
  Building2,
  MapPin,
  Sparkles,
  Award,
  ChevronLeft,
  ShieldCheck
} from 'lucide-react';

function CandidateOfferContent({ offerId }: { offerId: string }) {
  const router = useRouter();
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchOfferDetails();
  }, [offerId]);

  const fetchOfferDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ats_token');
      const res = await fetch(`/api/offers/${offerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.offer) {
        setOffer(data.offer);
      }
    } catch (err) {
      console.error('Error fetching offer details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (decision: 'ACCEPTED' | 'REJECTED') => {
    setResponding(true);
    setMessage('');

    try {
      const token = localStorage.getItem('ats_token');
      const res = await fetch(`/api/offers/${offer.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: decision }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit offer response');

      setOffer((prev: any) => ({ ...prev, status: decision }));
      setMessage(`You have officially ${decision.toLowerCase()} the employment offer!`);
    } catch (err: any) {
      setMessage(err.message || 'Error responding to offer');
    } finally {
      setResponding(false);
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-400">Loading Official Job Offer Letter...</p>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
        <Navbar />
        <div className="p-16 text-center text-slate-400">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">Offer Letter Not Found</h2>
          <button
            onClick={() => router.push('/dashboard/candidate')}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Back to Candidate Portal
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const company = offer.application?.job?.company;
  const candidateUser = offer.application?.candidate?.user;
  const formattedSalary = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(offer.salary || 0);

  const joiningDateFormatted = new Date(offer.joiningDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white print:bg-white print:text-black">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full print:pt-0 print:pb-0 print:px-0 print:max-w-none">
        {/* Navigation & Action Bar (Hidden in Print) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 print:hidden">
          <button
            onClick={() => router.push('/dashboard/candidate')}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrintPdf}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 text-xs font-semibold shadow-md flex items-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4 text-indigo-400" />
              <span>Download / Print PDF</span>
            </button>
          </div>
        </div>

        {/* Status Notification Banner (Hidden in Print) */}
        {message && (
          <div
            className={`p-4 rounded-2xl mb-6 text-xs font-bold border print:hidden flex items-center gap-2 ${
              offer.status === 'ACCEPTED'
                ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                : 'bg-rose-950/80 border-rose-800 text-rose-300'
            }`}
          >
            {offer.status === 'ACCEPTED' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{message}</span>
          </div>
        )}

        {/* Formal PDF / Print Offer Document Paper */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8 relative overflow-hidden print:bg-white print:text-slate-900 print:border-none print:shadow-none print:p-6 print:rounded-none">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-slate-800 print:border-slate-300 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg print:bg-indigo-700">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-extrabold text-white print:text-slate-900">
                  {company?.name || 'TalentPulse AI Enterprise'}
                </span>
              </div>
              <p className="text-xs text-slate-400 print:text-slate-600">
                Official Employment Offer Letter • Ref: {offer.id.slice(-8).toUpperCase()}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold border print:border-slate-400 ${
                  offer.status === 'ACCEPTED'
                    ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300 print:bg-emerald-100 print:text-emerald-800'
                    : offer.status === 'REJECTED'
                    ? 'bg-rose-950/80 border-rose-800 text-rose-300 print:bg-rose-100 print:text-rose-800'
                    : 'bg-purple-950/80 border-purple-800 text-purple-300 print:bg-purple-100 print:text-purple-800'
                }`}
              >
                STATUS: {offer.status}
              </span>
              <p className="text-[11px] text-slate-400 print:text-slate-500 mt-2">
                Date Issued: {new Date(offer.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Candidate Greeting */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-400 print:text-slate-600 uppercase tracking-wider">
              Confidential Employment Offer For:
            </h2>
            <h3 className="text-2xl font-bold text-white print:text-slate-900">
              {candidateUser?.name || 'Valued Candidate'}
            </h3>
            <p className="text-xs text-indigo-400 print:text-indigo-600 font-medium">
              {candidateUser?.email}
            </p>
          </div>

          {/* Formal Letter Body */}
          <div className="space-y-4 text-xs text-slate-300 print:text-slate-800 leading-relaxed font-sans">
            <p>
              Dear <strong>{candidateUser?.name}</strong>,
            </p>
            <p>
              On behalf of <strong>{company?.name || 'TalentPulse AI Enterprise'}</strong>, we are thrilled to extend a formal offer of employment for the position of{' '}
              <strong className="text-white print:text-slate-900">{offer.role}</strong>. We were exceptionally impressed by your background, technical expertise, and leadership demonstrated throughout our recruitment evaluation.
            </p>
            <p>
              Below are the key terms and details of your formal compensation package:
            </p>
          </div>

          {/* Compensation Highlights Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 print:bg-slate-50 print:border-slate-300">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 print:text-slate-600 block uppercase tracking-wider">
                Position Title
              </span>
              <p className="text-base font-bold text-white print:text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-400 print:text-purple-600" />
                {offer.role}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 print:text-slate-600 block uppercase tracking-wider">
                Annual Base Compensation
              </span>
              <p className="text-xl font-extrabold text-emerald-400 print:text-emerald-700 flex items-center gap-1.5">
                <DollarSign className="w-5 h-5 text-emerald-400 print:text-emerald-700" />
                {formattedSalary} / Year
              </p>
            </div>

            <div className="space-y-1 pt-3 border-t border-slate-900 print:border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 print:text-slate-600 block uppercase tracking-wider">
                Target Joining Date
              </span>
              <p className="text-sm font-bold text-white print:text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400 print:text-amber-600" />
                {joiningDateFormatted}
              </p>
            </div>

            <div className="space-y-1 pt-3 border-t border-slate-900 print:border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 print:text-slate-600 block uppercase tracking-wider">
                Location & Benefits
              </span>
              <p className="text-xs font-semibold text-indigo-300 print:text-indigo-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-400 print:text-indigo-600" />
                {offer.location || 'Remote'} • {offer.benefits}
              </p>
            </div>
          </div>

          {/* Official Sign-Off */}
          <div className="pt-8 border-t border-slate-800 print:border-slate-300 flex items-center justify-between text-xs text-slate-400 print:text-slate-600">
            <div>
              <p className="font-bold text-white print:text-slate-900">TalentPulse Recruitment Operations</p>
              <p className="text-[11px]">Authorized Signature & Seal</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] text-slate-500">Document Security Hash: 0x{offer.id.slice(0, 16)}</p>
            </div>
          </div>
        </div>

        {/* Candidate Action Buttons (Hidden in Print & Hidden if already accepted/rejected) */}
        {offer.status === 'PENDING' && (
          <div className="mt-8 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            <div>
              <h4 className="text-sm font-bold text-white">Your Decision Required</h4>
              <p className="text-xs text-slate-400">Please accept or decline this offer letter before your start date.</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => handleRespond('REJECTED')}
                disabled={responding}
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-rose-950/80 border border-rose-800 hover:bg-rose-900 text-rose-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Decline Offer</span>
              </button>

              <button
                onClick={() => handleRespond('ACCEPTED')}
                disabled={responding}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{responding ? 'Processing...' : 'Accept Job Offer'}</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}

export default function CandidateOfferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white p-10">Loading Offer Portal...</div>}>
      <CandidateOfferContent offerId={id} />
    </Suspense>
  );
}
