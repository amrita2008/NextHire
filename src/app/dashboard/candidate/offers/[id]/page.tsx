'use client';

import React, { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  FileText,
  Printer,
  CheckCircle2,
  XCircle,
  Building2,
  DollarSign,
  Calendar,
  Sparkles,
  MapPin
} from 'lucide-react';

export default function CandidateOfferLetterPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const offerId = resolvedParams.id;

  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (status: 'ACCEPTED' | 'DECLINED') => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('ats_token');
      const res = await fetch(`/api/offers/${offerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (data.offer) {
        setOffer(data.offer);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 text-slate-900 p-10">Loading Offer Letter...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-rose-900 selection:text-white print:bg-white print:text-black">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full print:pt-0 print:pb-0">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 print:hidden">
          <div>
            <span className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-bold uppercase tracking-wider">
              Formal Employment Offer Proposal
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
              Job Offer Decision Portal
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrintPDF}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Offer Document Sheet */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xl space-y-8 print:shadow-none print:border-none print:p-0">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-900 text-white flex items-center justify-center font-black text-xl">
                N
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Next<span className="text-rose-900">Hire</span> Enterprise
                </h2>
                <p className="text-xs text-slate-500">Talent Acquisition & Compensation Requisition</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 font-mono block">Offer ID: #{offerId.slice(-6)}</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold inline-block mt-1 ${
                  offer?.status === 'ACCEPTED'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : offer?.status === 'DECLINED'
                    ? 'bg-rose-50 border border-rose-200 text-rose-900'
                    : 'bg-amber-50 border border-amber-200 text-amber-800'
                }`}
              >
                Status: {offer?.status || 'PENDING'}
              </span>
            </div>
          </div>

          {/* Letter Body */}
          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <p className="font-bold text-slate-900 text-sm">
              Dear {offer?.candidateName || 'Candidate'},
            </p>
            <p>
              On behalf of NextHire and our engineering organization, we are delighted to formally extend this offer of employment for the position of{' '}
              <strong className="text-slate-900">{offer?.jobTitle}</strong>.
            </p>
            <p>
              We were immensely impressed with your technical experience and problem-solving skills throughout the interview process.
            </p>
          </div>

          {/* Compensation Terms Box */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
              Key Compensation & Schedule Terms
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Annual Base Salary</span>
                <span className="font-bold text-emerald-700 text-sm">
                  {offer?.currency || 'USD'} ${offer?.salary?.toLocaleString()} / yr
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Target Start Date</span>
                <span className="font-bold text-slate-900 text-sm">
                  {offer?.joiningDate ? new Date(offer.joiningDate).toLocaleDateString() : 'Immediate'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Work Location</span>
                <span className="font-bold text-slate-900 text-sm">{offer?.location || 'San Francisco, CA'}</span>
              </div>
            </div>
          </div>

          {offer?.welcomeNote && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-950 space-y-1">
              <span className="font-bold block">Executive Note from Hiring Manager</span>
              <p className="italic leading-relaxed">{offer.welcomeNote}</p>
            </div>
          )}

          {/* Action Buttons (Accept / Decline) */}
          {offer?.status === 'PENDING' && (
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-4 print:hidden">
              <button
                onClick={() => handleDecision('DECLINED')}
                disabled={updating}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold"
              >
                Decline Offer
              </button>

              <button
                onClick={() => handleDecision('ACCEPTED')}
                disabled={updating}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept Job Offer</span>
              </button>
            </div>
          )}
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
