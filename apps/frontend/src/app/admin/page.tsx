'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, ShieldCheck, Lock, Users, DollarSign, CheckCircle2, XCircle, AlertTriangle, ArrowRight, LogOut } from 'lucide-react';

export default function AdminProtectionPage() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sample pending providers awaiting CNIC verification
  const [pendingProviders, setPendingProviders] = useState([
    {
      id: 'prov-01',
      name: 'Tariq Mehmood',
      trade: 'Master Electrician',
      city: 'Lahore (Gulberg & DHA)',
      cnic: '35202-1928374-1',
      submittedDate: '10 Mins Ago',
      status: 'PENDING',
    },
    {
      id: 'prov-02',
      name: 'Kamran Siddiqui',
      trade: 'HVAC / Inverter AC Specialist',
      city: 'Karachi (Clifton & PECHS)',
      cnic: '42101-5839201-3',
      submittedDate: '25 Mins Ago',
      status: 'PENDING',
    },
    {
      id: 'prov-03',
      name: 'Bilal Khan',
      trade: 'Sanitary Plumber',
      city: 'Peshawar (Hayatabad)',
      cnic: '17301-4492019-7',
      submittedDate: '1 Hour Ago',
      status: 'PENDING',
    },
  ]);

  // Server-side verification of existing admin session on mount
  React.useEffect(() => {
    const token = localStorage.getItem('skillconnect_admin_token');
    if (!token) return;

    const verifyAdminSession = async () => {
      try {
        const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
        const res = await fetch(`${BACKEND_URL}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          setIsAdminAuthenticated(true);
        } else {
          // Token expired or not authorized with UserRole.ADMIN
          localStorage.removeItem('skillconnect_admin_token');
          setIsAdminAuthenticated(false);
        }
      } catch {
        // Leave to explicit login
      }
    };

    verifyAdminSession();
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);

    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
      // Attempt login via NestJS /api/v1/auth/login or frontend proxy
      let res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail.trim(), password: adminPassword, role: 'ADMIN' }),
      });

      if (!res.ok && !process.env.NEXT_PUBLIC_API_URL) {
        res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: adminEmail.trim(), password: adminPassword, role: 'ADMIN' }),
        });
      }

      const data = await res.json();

      if (res.ok && data.accessToken) {
        // Enforce role server verification: must be UserRole.ADMIN
        const role = data.user?.role || data.role;
        if (role !== 'ADMIN') {
          setAuthError('Access Denied: Account lacks UserRole.ADMIN authorization.');
          setLoading(false);
          return;
        }

        localStorage.setItem('skillconnect_admin_token', data.accessToken);
        document.cookie = `skillconnect_auth_token=${data.accessToken}; path=/; max-age=604800; SameSite=Lax`;
        setIsAdminAuthenticated(true);
      } else {
        setAuthError(data.message || 'Unauthorized: Invalid Administrator Credentials.');
      }
    } catch {
      setAuthError('Unable to connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('skillconnect_admin_token');
    document.cookie = 'skillconnect_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setIsAdminAuthenticated(false);
  };

  const handleVerify = (id: string, approve: boolean) => {
    setPendingProviders((prev) =>
      prev.map((prov) =>
        prov.id === id ? { ...prov, status: approve ? 'APPROVED' : 'REJECTED' } : prov
      )
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {!isAdminAuthenticated ? (
        /* Unauthorized / Admin Protection Security Gate */
        <div className="max-w-md mx-auto space-y-6">
          <div className="p-8 rounded-3xl bg-[#0a1024]/90 backdrop-blur-2xl border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)] space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-400 mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.3)]">
              <ShieldAlert className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-red-950/80 border border-red-500/30 text-red-300 text-xs font-mono font-bold uppercase tracking-wider">
                HTTP 403 / Access Denied
              </span>
              <h1 className="text-2xl font-extrabold text-white">
                Admin Console Protected
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                National provider CNIC verification registry and platform financial logs are strictly restricted to authenticated administrators.
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center space-x-2 text-left">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Administrator Email
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@skillconnect.pk"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-red-500/30 bg-[#050814] text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Administrator Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter Administrator Password"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-red-500/30 bg-[#050814] text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{loading ? 'Verifying with NestJS Guard...' : 'Authenticate Admin Access'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 border-t border-slate-800 text-center">
              <Link href="/" className="text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors">
                ← Return to Public Marketplace
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Authenticated Admin Dashboard */
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/15">
            <div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
                <h1 className="text-2xl font-black text-white">
                  SkillConnect Pakistan — <span className="text-gradient-cyan-blue">Admin Operations</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Authorized Session: Super Administrator • Real-Time NADRA Verification Gate
              </p>
            </div>

            <button
              onClick={handleAdminLogout}
              className="px-4 py-2 rounded-xl bg-[#0a1024] border border-slate-800 hover:border-red-500/40 hover:bg-red-500/10 text-slate-400 hover:text-red-400 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Admin Logout</span>
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0a1024]/80 backdrop-blur-xl border border-cyan-500/20 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Verified Providers</span>
              <p className="text-3xl font-black text-white">1,482</p>
              <p className="text-[11px] text-cyan-400 font-semibold">Covering 399 Pakistani Cities</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0a1024]/80 backdrop-blur-xl border border-cyan-500/20 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Platform Volume</span>
              <p className="text-3xl font-black text-cyan-400">PKR 8.42M</p>
              <p className="text-[11px] text-slate-400 font-semibold">JazzCash, EasyPaisa & COD</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0a1024]/80 backdrop-blur-xl border border-cyan-500/20 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Awaiting CNIC Verification</span>
              <p className="text-3xl font-black text-amber-400">
                {pendingProviders.filter((p) => p.status === 'PENDING').length}
              </p>
              <p className="text-[11px] text-amber-400 font-semibold">Priority SLA: Under 2 hours</p>
            </div>
          </div>

          {/* Pending CNIC Verification Registry */}
          <div className="p-6 rounded-3xl bg-[#0a1024]/80 backdrop-blur-xl border border-cyan-500/20 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-white">
                Service Providers Awaiting Identity Approval
              </h2>
              <p className="text-xs text-slate-400">
                Review submitted NADRA 13-digit CNIC numbers before listing workers live on the marketplace.
              </p>
            </div>

            <div className="space-y-4">
              {pendingProviders.map((prov) => (
                <div
                  key={prov.id}
                  className="p-4 rounded-2xl bg-[#050814]/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyan-500/30 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-white">{prov.name}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                        {prov.trade}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span>City: {prov.city}</span>
                      <span>•</span>
                      <span className="font-mono text-cyan-400 font-bold">CNIC: {prov.cnic}</span>
                      <span>•</span>
                      <span>Submitted: {prov.submittedDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {prov.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleVerify(prov.id, true)}
                          className="px-3.5 py-1.5 rounded-xl glow-btn-cyan text-slate-950 font-bold text-xs flex items-center space-x-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Verify</span>
                        </button>
                        <button
                          onClick={() => handleVerify(prov.id, false)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#050814] border border-slate-800 hover:border-red-500 hover:text-red-400 text-slate-400 font-semibold text-xs flex items-center space-x-1 cursor-pointer transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          prov.status === 'APPROVED'
                            ? 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-300'
                            : 'bg-red-950/60 border border-red-500/40 text-red-300'
                        }`}
                      >
                        {prov.status === 'APPROVED' ? '✓ CNIC Approved' : '✕ Application Rejected'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
