'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, User, LogOut, Briefcase, LayoutDashboard, Menu, X, Calendar, Code2, FileText, BarChart3, ShieldCheck, Terminal, Award } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    const storedUser = localStorage.getItem('ats_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ats_user');
    localStorage.removeItem('ats_token');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setUser(null);
    router.push('/');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm' : 'bg-white border-b border-slate-200 py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-rose-900 flex items-center justify-center text-white shadow-sm font-black text-lg">
            N
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Next<span className="text-rose-900 font-extrabold">Hire</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7">
          <Link href="/careers" className="text-xs font-semibold text-slate-600 hover:text-rose-900 transition-colors flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-rose-900" />
            Careers Portal
          </Link>
          <Link href="/docs" className="text-xs font-semibold text-slate-600 hover:text-rose-900 transition-colors flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-slate-500" />
            API Docs
          </Link>
          <Link href="/features" className="text-xs font-semibold text-slate-600 hover:text-rose-900 transition-colors">
            Features
          </Link>
          <Link href="/#pricing" className="text-xs font-semibold text-slate-600 hover:text-rose-900 transition-colors">
            Pricing
          </Link>
        </nav>

        {/* Right CTA / Auth Controls */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              {user.role === 'ADMIN' && (
                <Link
                  href="/dashboard/admin"
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-900 hover:bg-rose-100 flex items-center gap-1.5 transition-all"
                  title="Admin Control Panel"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-900" />
                  Admin
                </Link>
              )}
              {(user.role === 'RECRUITER' || user.role === 'ADMIN' || user.role === 'HIRING_MANAGER') && (
                <Link
                  href="/dashboard/recruiter/analytics"
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200 flex items-center gap-1.5 transition-all"
                  title="Analytics Command Center"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-rose-900" />
                  Analytics
                </Link>
              )}
              <Link
                href={
                  user.role === 'RECRUITER' || user.role === 'ADMIN' || user.role === 'HIRING_MANAGER'
                    ? '/dashboard/recruiter/offers'
                    : '/dashboard/candidate'
                }
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200 flex items-center gap-1.5 transition-all"
                title="Job Offers Portal"
              >
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                Offers
              </Link>
              <Link
                href={
                  user.role === 'RECRUITER' || user.role === 'ADMIN' || user.role === 'HIRING_MANAGER'
                    ? '/dashboard/recruiter/assessments'
                    : '/dashboard/candidate'
                }
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200 flex items-center gap-1.5 transition-all"
                title="Coding Tests Engine"
              >
                <Code2 className="w-3.5 h-3.5 text-slate-600" />
                Coding Tests
              </Link>
              <Link
                href={
                  user.role === 'RECRUITER' || user.role === 'ADMIN' || user.role === 'HIRING_MANAGER' || user.role === 'INTERVIEWER'
                    ? '/dashboard/recruiter/interviews'
                    : '/dashboard/candidate/interviews'
                }
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200 flex items-center gap-1.5 transition-all"
                title="Interviews Schedule"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-600" />
                Interviews
              </Link>
              <Link
                href={
                  user.role === 'RECRUITER' || user.role === 'ADMIN' || user.role === 'HIRING_MANAGER'
                    ? '/dashboard/recruiter'
                    : '/dashboard/candidate'
                }
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-900 hover:bg-rose-800 text-white flex items-center gap-1.5 transition-all shadow-sm"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard ({user.role})
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-rose-900 hover:bg-rose-50 transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-rose-900 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-4.5 py-2 rounded-xl text-xs font-bold bg-rose-900 hover:bg-rose-800 text-white transition-all shadow-sm"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3">
          <Link href="/careers" className="block text-sm font-medium text-slate-700 py-1">
            Careers Portal
          </Link>
          <Link href="/docs" className="block text-sm font-medium text-slate-700 py-1">
            API Documentation
          </Link>
          {user ? (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Link
                href={user.role === 'CANDIDATE' ? '/dashboard/candidate' : '/dashboard/recruiter'}
                className="block text-sm font-bold text-rose-900"
              >
                Go to Dashboard ({user.role})
              </Link>
              <button onClick={handleLogout} className="text-sm text-slate-500 font-medium">
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link href="/login" className="text-sm font-medium text-slate-700">
                Log In
              </Link>
              <Link href="/register" className="text-sm font-bold text-rose-900">
                Register Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
