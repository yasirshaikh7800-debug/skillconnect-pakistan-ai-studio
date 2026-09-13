'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { PAKISTAN_CITIES, CATEGORIES } from '@/lib/mockData';
import CitySearchSelect from '@/components/CitySearchSelect';
import { ShieldCheck, User, Phone, CheckCircle2, ArrowRight } from 'lucide-react';

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
    <div className="relative min-h-[85vh] flex items-center justify-center py-8 px-4">
      <ThreeAuth3D />

      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-cyan-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Join SkillConnect Pakistan
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign up as a customer or register your skilled trade with NADRA CNIC verification
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-emerald-500/20 shadow-2xl glow-cyan-emerald space-y-6">
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80">
            <button
              type="button"
              onClick={() => setRole('PROVIDER')}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                role === 'PROVIDER'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Become a Provider
            </button>
            <button
              type="button"
              onClick={() => setRole('CUSTOMER')}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                role === 'CUSTOMER'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Customer
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">First Name</label>
                <input
                  type="text"
                  required
                  placeholder="Muhammad"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="Ali"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Pakistani Phone Number (For SMS OTP)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="+923001234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 focus:outline-none focus:border-emerald-500 font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Location</label>
              <CitySearchSelect
                value={city}
                onChange={setCity}
                buttonClassName="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Service Location</label>
              <CitySearchSelect
                value={serviceLocation}
                onChange={setServiceLocation}
                buttonClassName="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 font-semibold"
              />
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Automatically filled from Location</span>
              </p>
            </div>

            {role === 'PROVIDER' && (
              <>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    NADRA CNIC Number (13 Digits)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="42101-1234567-1"
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 font-mono focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Primary Skill / Trade</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 font-semibold focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/60 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center space-x-2 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <p className="text-[11px]">
                    Providers undergo CNIC background check and receive 90% direct payout on completed jobs via JazzCash / EasyPaisa.
                  </p>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Continue to SMS OTP Verification</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2">
            Already registered?{' '}
            <Link href="/login" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
