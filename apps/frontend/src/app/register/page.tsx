'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { PAKISTAN_CITIES, CATEGORIES } from '@/lib/mockData';
import CitySearchSelect from '@/components/CitySearchSelect';
import { ShieldCheck, User, Phone, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

const ThreeAuth3D = dynamic(() => import('@/components/ThreeAuth3D'), { ssr: false });

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'CUSTOMER' | 'PROVIDER'>('PROVIDER');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('+923001234567');
  const [cnic, setCnic] = useState('');
  const [city, setCity] = useState('Karachi');
  const [serviceLocation, setServiceLocation] = useState('Karachi');
  const [selectedCategory, setSelectedCategory] = useState('electrician');

  // Sync Service Location with top Location field automatically
  useEffect(() => {
    setServiceLocation(city);
  }, [city]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.trim().startsWith('+') ? phone.trim() : `+92${phone.trim().replace(/^0/, '')}`;
    const redirectTarget = role === 'CUSTOMER' ? '/dashboard/customer' : '/dashboard/provider';
    router.push(`/verify-otp?phone=${encodeURIComponent(cleanPhone)}&redirect=${encodeURIComponent(redirectTarget)}&role=${role}`);
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-8 px-4 overflow-hidden">
      <ThreeAuth3D />

      <div className="relative z-10 w-full max-w-lg space-y-6">
        <div className="text-center space-y-3">
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 mx-auto flex items-center justify-center text-slate-950 shadow-[0_0_25px_rgba(0,242,254,0.35)]">
            <ShieldCheck className="w-8 h-8 text-white drop-shadow" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-[11px] font-mono font-bold tracking-wider uppercase mb-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>National Artisan Registry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Join <span className="text-gradient-cyan-blue">SkillConnect Pakistan</span>
            </h1>
            <p className="text-xs text-slate-400">
              Sign up as a customer or register your skilled trade with NADRA CNIC verification
            </p>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-[#0a1024]/85 backdrop-blur-2xl border border-cyan-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6">
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#050814]/80 border border-slate-800">
            <button
              type="button"
              onClick={() => setRole('PROVIDER')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                role === 'PROVIDER'
                  ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Become a Provider
            </button>
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
          </div>

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-slate-300">First Name</label>
                <input
                  type="text"
                  required
                  placeholder="Muhammad"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-cyan-500/20 bg-[#050814]/70 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-slate-300">Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="Ali"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-cyan-500/20 bg-[#050814]/70 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-300">
                Pakistani Phone Number (For SMS OTP)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="+923001234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cyan-500/20 bg-[#050814]/70 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono text-white placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-300">Location</label>
              <CitySearchSelect
                value={city}
                onChange={setCity}
                buttonClassName="w-full py-2.5 rounded-xl border border-cyan-500/20 bg-[#050814]/70 font-semibold text-white hover:border-cyan-500/40"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-300">Service Location</label>
              <CitySearchSelect
                value={serviceLocation}
                onChange={setServiceLocation}
                buttonClassName="w-full py-2.5 rounded-xl border border-cyan-500/20 bg-[#050814]/70 font-semibold text-white hover:border-cyan-500/40"
              />
              <p className="text-[10px] text-cyan-400 font-medium mt-1 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Automatically filled from Location</span>
              </p>
            </div>

            {role === 'PROVIDER' && (
              <>
                <div>
                  <label className="block font-semibold mb-1 text-slate-300">
                    NADRA CNIC Number (13 Digits)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="42101-1234567-1"
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-cyan-500/20 bg-[#050814]/70 font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Primary Skill / Trade</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-cyan-500/20 bg-[#050814]/70 font-semibold focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.slug} className="bg-[#0a1024] text-white">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-cyan-950/30 rounded-xl border border-cyan-500/30 flex items-center space-x-2 text-cyan-300">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-cyan-400" />
                  <p className="text-[11px] leading-relaxed">
                    Providers undergo CNIC background check and receive 90% direct payout on completed jobs via JazzCash / EasyPaisa.
                  </p>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl glow-btn-cyan text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 group cursor-pointer mt-2"
            >
              <span>Continue to SMS OTP Verification</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
            Already registered?{' '}
            <Link href="/login" className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
