'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ShieldCheck,
  Users,
  Search,
  Lock,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Activity,
  FileText,
  UserCheck,
  RefreshCw,
  Building2,
  Key,
  Database
} from 'lucide-react';

function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState<'users' | 'audit'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleUpdateMessage, setRoleUpdateMessage] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchAuditLogs();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ats_token');
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const token = localStorage.getItem('ats_token');
      const res = await fetch('/api/admin/audit-logs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.auditLogs) {
        setAuditLogs(data.auditLogs);
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingUserId(userId);
    setRoleUpdateMessage('');

    try {
      const token = localStorage.getItem('ats_token');
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update role');

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      setRoleUpdateMessage(`Role updated to ${newRole}!`);
      fetchAuditLogs();
      setTimeout(() => setRoleUpdateMessage(''), 3000);
    } catch (err: any) {
      setRoleUpdateMessage(err.message || 'Failed to update role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
  });

  const filteredAuditLogs = auditLogs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const actorName = log.user?.name || 'System';
    const action = log.action || '';
    const details = log.details || '';
    return actorName.toLowerCase().includes(q) || action.toLowerCase().includes(q) || details.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-rose-900 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-bold uppercase tracking-wider">
                System Administration
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-rose-900" />
                Security Audit Trail Active
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
              Next<span className="text-rose-900">Hire</span> Admin Control Panel
            </h1>
            <p className="text-slate-600 text-xs mt-0.5">
              Manage user role permissions, monitor system security audit logs, and review platform access.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search users or audit logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-900 shadow-sm"
            />
          </div>
        </div>

        {/* Status Notification Message */}
        {roleUpdateMessage && (
          <div className="p-3 rounded-xl mb-6 text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{roleUpdateMessage}</span>
          </div>
        )}

        {/* Tab Selector Bar */}
        <div className="p-1.5 rounded-2xl bg-white border border-slate-200 flex items-center gap-2 mb-8 max-w-md shadow-sm">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'users'
                ? 'bg-rose-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Management ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'audit'
                ? 'bg-rose-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Audit Trail Logs ({auditLogs.length})</span>
          </button>
        </div>

        {/* Tab 1: User & Role Management Table */}
        {activeTab === 'users' && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Registered Platform Users</h3>
              <span className="text-xs text-slate-500 font-medium">Select dropdown to update user access level</span>
            </div>

            {loading ? (
              <div className="p-16 text-center text-slate-500 text-sm">Loading user directory...</div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4">User Name</th>
                      <th className="p-4">Email Address</th>
                      <th className="p-4">Assigned Role</th>
                      <th className="p-4">Organization</th>
                      <th className="p-4">Date Joined</th>
                      <th className="p-4 text-right">Role Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-900 font-bold text-xs">
                            {user.name.charAt(0)}
                          </div>
                          <span>{user.name}</span>
                        </td>
                        <td className="p-4 text-slate-600 font-medium">{user.email}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                              user.role === 'ADMIN'
                                ? 'bg-rose-50 border-rose-200 text-rose-900'
                                : user.role === 'RECRUITER'
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
                                : user.role === 'HIRING_MANAGER'
                                ? 'bg-purple-50 border-purple-200 text-purple-800'
                                : user.role === 'INTERVIEWER'
                                ? 'bg-amber-50 border-amber-200 text-amber-800'
                                : 'bg-slate-100 border-slate-200 text-slate-700'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500">{user.company?.name || 'NextHire Org'}</td>
                        <td className="p-4 text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-right">
                          <select
                            value={user.role}
                            disabled={updatingUserId === user.id}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-rose-900 font-medium cursor-pointer"
                          >
                            <option value="CANDIDATE">Role: Candidate</option>
                            <option value="RECRUITER">Role: Recruiter</option>
                            <option value="HIRING_MANAGER">Role: Hiring Manager</option>
                            <option value="INTERVIEWER">Role: Interviewer</option>
                            <option value="ADMIN">Role: Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Security & System Audit Logs Table */}
        {activeTab === 'audit' && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">System Security Audit Trail Log</h3>
              <span className="text-xs text-slate-500 font-medium">Real-time security events & access logs</span>
            </div>

            {filteredAuditLogs.length === 0 ? (
              <div className="p-16 text-center text-slate-500 text-sm">No audit log records found.</div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Actor / User</th>
                      <th className="p-4">Action Event</th>
                      <th className="p-4">Entity</th>
                      <th className="p-4">Detailed Context</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 text-slate-500 font-mono text-[11px]">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="p-4 font-bold text-slate-900">
                          {log.user?.name || 'System Auto Agent'} ({log.user?.role || 'SYSTEM'})
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 border border-rose-200 text-rose-900">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-purple-700">{log.entity}</td>
                        <td className="p-4 text-slate-700 max-w-md truncate">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 text-slate-900 p-10">Loading Admin Dashboard...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
