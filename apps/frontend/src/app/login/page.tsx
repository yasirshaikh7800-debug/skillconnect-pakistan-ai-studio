'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Lock, ArrowRight, Smartphone } from 'lucide-react';

const ThreeAuth3D = dynamic(() => import('@/components/ThreeAuth3D'), { ssr: false });

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'CUSTOMER' | 'PROVIDER'>('CUSTOMER');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isPhone = /^\+?[0-9\s-]{10,}$/.test(emailOrPhone.trim());
    const redirectTarget = role === 'CUSTOMER' ? '/dashboard/customer' : '/dashboard/provider';

    if (isPhone) {
      const phoneClean = emailOrPhone.trim().startsWith('+') ? emailOrPhone.trim() : `+92${emailOrPhone.trim().replace(/^0/, '')}`;
      router.push(`/verify-otp?phone=${encodeURIComponent(phoneClean)}&redirect=${encodeURIComponent(redirectTarget)}&role=${role}`);
    } else {
      router.push(redirectTarget);
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center py-12 px-4">
      <ThreeAuth3D />

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-800 mx-auto flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-900">
            Welcome to SkillConnect.pk
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-600">
            Sign in to manage your bookings or service profile
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white/90 dark:bg-white backdrop-blur-xl border border-slate-200 dark:border-blue-600/20 shadow-2xl space-y-6">
          {/* Role Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-50">
            <button
              type="button"
              onClick={() => setRole('CUSTOMER')}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                role === 'CUSTOMER'
                  ? 'bg-white dark:bg-white text-blue-600 dark:text-blue-600 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setRole('PROVIDER')}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                role === 'PROVIDER'
                  ? 'bg-white dark:bg-white text-blue-600 dark:text-blue-600 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Artisan / Provider
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-700">
                Email or Pakistani Phone Number
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. user@gmail.com or +923001234567"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-300 bg-slate-50/80 dark:bg-slate-50/80 text-xs text-slate-900 dark:text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-300 bg-slate-50/80 dark:bg-slate-50/80 text-xs text-slate-900 dark:text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Log In as {role === 'CUSTOMER' ? 'Customer' : 'Provider'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2">
              <Link
                href={`/verify-otp?phone=${encodeURIComponent('+923001234567')}&redirect=${encodeURIComponent(role === 'CUSTOMER' ? '/dashboard/customer' : '/dashboard/provider')}&role=${role}`}
                className="w-full py-2.5 rounded-xl border border-blue-600/30 bg-blue-600/10 hover:bg-blue-700/20 text-blue-600 dark:text-blue-600 font-bold text-xs transition-all flex items-center justify-center space-x-2"
              >
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>Login / Verify via Phone OTP SMS</span>
              </Link>
            </div>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-bold text-blue-600 dark:text-blue-600 hover:underline">
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
