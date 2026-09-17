'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, ShieldCheck, Lock, Users, DollarSign, CheckCircle2, XCircle, AlertTriangle, ArrowRight, LogOut } from 'lucide-react';

export default function AdminProtectionPage() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
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

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      // In this system, adminKey is the password, email could be hardcoded or we assume a login form
      // Wait, the UI only asks for Admin Secret (which was used as a key). Let's assume we call backend login.
      // But we need an email. If we only have adminKey, let's treat adminKey as password and hardcode admin email?
      // Actually, let's add email state if it doesn't exist. Wait, the prompt says "Connect the admin page to the existing NestJS authentication system: /api/v1/auth/login"
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@skillconnect.pk', password: adminKey }),
      });
      const data = await res.json();
      if (res.ok && data.user?.role === 'ADMIN') {
        localStorage.setItem('skillconnect_admin_token', data.accessToken);
        setIsAdminAuthenticated(true);
      } else {
        setAuthError(data.message || 'Unauthorized: Invalid Administrator Credentials.');
      }
    } catch (err) {
      setAuthError('Unable to connect to authentication server.');
    }
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
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
              <ShieldAlert className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 text-xs font-black uppercase tracking-wider">
                HTTP 403 / Access Denied
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Admin Console Protected
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                National provider CNIC verification registry and platform financial logs are strictly restricted. Unauthorized access attempts are monitored and recorded.
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center space-x-2 text-left">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Administrator Access Key
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="Enter Administrator Password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Demo authorization credentials: (Please use your provisioned admin credentials)
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Authenticate Admin Access</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
              <Link href="/" className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300">
                ← Return to Public Marketplace
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Authenticated Admin Dashboard */
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                  SkillConnect Pakistan — Admin Operations
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authorized Session: Super Administrator • Real-Time NADRA Verification Gate
              </p>
            </div>

            <button
              onClick={() => setIsAdminAuthenticated(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-500/10 text-slate-700 dark:text-slate-300 hover:text-red-500 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Admin Logout</span>
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Verified Providers</span>
              <p className="text-3xl font-black text-slate-900 dark:text-white">1,482</p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">Covering 399 Pakistani Cities</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Gross Platform Volume</span>
              <p className="text-3xl font-black text-blue-600 dark:text-blue-400">PKR 8.42M</p>
              <p className="text-[11px] text-slate-400 font-semibold">JazzCash, EasyPaisa & COD</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Awaiting CNIC Verification</span>
              <p className="text-3xl font-black text-amber-500">
                {pendingProviders.filter((p) => p.status === 'PENDING').length}
              </p>
              <p className="text-[11px] text-amber-600 dark:text-amber-500 font-semibold">Priority SLA: Under 2 hours</p>
            </div>
          </div>

          {/* Pending CNIC Verification Registry */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Service Providers Awaiting Identity Approval
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Review submitted NADRA 13-digit CNIC numbers before listing workers live on the marketplace.
              </p>
            </div>

            <div className="space-y-4">
              {pendingProviders.map((prov) => (
                <div
                  key={prov.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{prov.name}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {prov.trade}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>City: {prov.city}</span>
                      <span>•</span>
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">CNIC: {prov.cnic}</span>
                      <span>•</span>
                      <span>Submitted: {prov.submittedDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {prov.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleVerify(prov.id, true)}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Verify</span>
                        </button>
                        <button
                          onClick={() => handleVerify(prov.id, false)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-red-600 hover:text-white text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center space-x-1 cursor-pointer transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          prov.status === 'APPROVED'
                            ? 'bg-blue-100 dark:bg-blue-50 text-blue-600 dark:text-blue-600'
                            : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
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
