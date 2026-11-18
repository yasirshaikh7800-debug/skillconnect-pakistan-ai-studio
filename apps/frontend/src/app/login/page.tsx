'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Lock, ArrowRight, Smartphone, Sparkles } from 'lucide-react';

const ThreeAuth3D = dynamic(() => import('@/components/ThreeAuth3D'), { ssr: false });

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'CUSTOMER' | 'PROVIDER'>('CUSTOMER');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isPhone = /^\+?[0-9\s-]{10,}$/.test(emailOrPhone.trim());
    const redirectTarget = role === 'CUSTOMER' ? '/dashboard/customer' : '/dashboard/provider';

    if (isPhone) {
      const phoneClean = emailOrPhone.trim().startsWith('+') ? emailOrPhone.trim() : `+92${emailOrPhone.trim().replace(/^0/, '')}`;
      
      try {
        await fetch('/api/auth/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: phoneClean }),
        });
      } catch (err) {}
      
      router.push(`/verify-otp?phone=${encodeURIComponent(phoneClean)}&redirect=${encodeURIComponent(redirectTarget)}&role=${role}`);
    } else {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailOrPhone, password, role }),
        });
        const data = await res.json();
        
        if (res.ok && data.accessToken) {
          localStorage.setItem('skillconnect_auth_token', data.accessToken);
          document.cookie = `skillconnect_auth_token=${data.accessToken}; path=/; max-age=604800; SameSite=Lax`;
          
          if (data.user?.role === 'CUSTOMER') {
            router.push('/dashboard/customer');
          } else if (data.user?.role === 'PROVIDER') {
            router.push('/dashboard/provider');
          } else {
            router.push(redirectTarget);
          }
        } else {
          alert(data.message || 'Login failed');
        }
      } catch (err) {
        alert('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-12 px-4 overflow-hidden">
      <ThreeAuth3D />

      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 mx-auto flex items-center justify-center text-slate-950 shadow-[0_0_25px_rgba(0,242,254,0.35)]">
            <ShieldCheck className="w-8 h-8 text-white drop-shadow" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-[11px] font-mono font-bold tracking-wider uppercase mb-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Verified Access Gate</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome to <span className="text-gradient-cyan-blue">SkillConnect.pk</span>
            </h1>
            <p className="text-xs text-slate-400">
              Sign in to manage your bookings or service profile across Pakistan
            </p>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-[#0a1024]/85 backdrop-blur-2xl border border-cyan-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6">
          {/* Role Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#050814]/80 border border-slate-800">
            <button
              type="button"
              onClick={() => setRole('CUSTOMER')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                role === 'CUSTOMER'
                  ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setRole('PROVIDER')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                role === 'PROVIDER'
                  ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Artisan / Provider
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Email or Pakistani Phone Number
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. user@gmail.com or +923001234567"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cyan-500/20 bg-[#050814]/70 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cyan-500/20 bg-[#050814]/70 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl glow-btn-cyan text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer mt-2"
            >
              <span>Log In as {role === 'CUSTOMER' ? 'Customer' : 'Provider'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2">
              <Link
                href={`/verify-otp?phone=${encodeURIComponent('+923001234567')}&redirect=${encodeURIComponent(role === 'CUSTOMER' ? '/dashboard/customer' : '/dashboard/provider')}&role=${role}`}
                className="w-full py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/15 text-cyan-300 font-bold text-xs transition-all flex items-center justify-center space-x-2"
              >
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>Login / Verify via Phone OTP SMS</span>
              </Link>
            </div>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline">
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
