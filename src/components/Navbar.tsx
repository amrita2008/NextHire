'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, User, LogOut, Briefcase, LayoutDashboard, Menu, X, Sun, Moon, Calendar, Code2, FileText } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('ats_user');
    localStorage.removeItem('ats_token');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setUser(null);
    router.push('/');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-xl' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            TalentPulse<span className="text-indigo-400 font-black">.AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/careers" className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            Careers Portal
          </Link>
          <Link href="/#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="/#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/#faq" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            FAQ
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={
                  user.role === 'RECRUITER' || user.role === 'ADMIN' || user.role === 'HIRING_MANAGER'
                    ? '/dashboard/recruiter/offers'
                    : '/dashboard/candidate'
                }
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 flex items-center gap-1.5 transition-all"
                title="Job Offers Portal"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                Offers
              </Link>
              <Link
                href={
                  user.role === 'RECRUITER' || user.role === 'ADMIN' || user.role === 'HIRING_MANAGER'
                    ? '/dashboard/recruiter/assessments'
                    : '/dashboard/candidate'
                }
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 flex items-center gap-1.5 transition-all"
                title="Coding Assessments Engine"
              >
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                Coding Tests
              </Link>
              <Link
                href={
                  user.role === 'RECRUITER' || user.role === 'ADMIN' || user.role === 'HIRING_MANAGER' || user.role === 'INTERVIEWER'
                    ? '/dashboard/recruiter/interviews'
                    : '/dashboard/candidate/interviews'
                }
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 flex items-center gap-1.5 transition-all"
                title="Interview Schedule & Calendar"
              >
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                Interviews
              </Link>
              <Link
                href={
                  user.role === 'RECRUITER' || user.role === 'ADMIN' || user.role === 'HIRING_MANAGER'
                    ? '/dashboard/recruiter'
                    : '/dashboard/candidate'
                }
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 transition-all shadow-md shadow-indigo-600/30"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard ({user.role})
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-900/80 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-6 py-6 space-y-4">
          <Link href="/careers" className="block text-slate-300 font-medium py-2">
            Careers Portal
          </Link>
          <Link href="/#features" className="block text-slate-300 font-medium py-2">
            Features
          </Link>
          <Link href="/#pricing" className="block text-slate-300 font-medium py-2">
            Pricing
          </Link>
          {user ? (
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
              <Link
                href={user.role === 'RECRUITER' ? '/dashboard/recruiter' : '/dashboard/candidate'}
                className="w-full text-center py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-center py-2.5 rounded-xl bg-slate-900 text-rose-400 font-semibold text-sm border border-slate-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
              <Link href="/login" className="w-full text-center py-2.5 rounded-xl bg-slate-900 text-slate-200 text-sm font-semibold">
                Sign In
              </Link>
              <Link href="/register" className="w-full text-center py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold">
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
