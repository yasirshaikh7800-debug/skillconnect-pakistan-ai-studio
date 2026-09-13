'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, ArrowRight, RefreshCw, CheckCircle2, AlertCircle, Phone, Lock, Sparkles, Check, Loader2 } from 'lucide-react';

const ThreeAuth3D = dynamic(() => import('@/components/ThreeAuth3D'), { ssr: false });

function OtpVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const phoneParam = searchParams?.get('phone') || '+923001234567';
  const redirectParam = searchParams?.get('redirect') || '/dashboard/customer';

  // Exactly 4 digits for OTP
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeInputIndex, setActiveInputIndex] = useState<number>(0);

  // Lock ref to prevent duplicate triggers
  const isVerifyingRef = useRef<boolean>(false);
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer for Resend OTP (30s)
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Format masked phone number e.g., +923001234567 -> +92 ******4567
  const maskPhoneNumber = (num: string) => {
    if (!num) return '+92 *******';
    const clean = num.replace(/\s+/g, '');
    if (clean.length > 7) {
      const prefix = clean.slice(0, 3);
      const suffix = clean.slice(-4);
      return `${prefix} ******${suffix}`;
    }
    return clean;
  };

  // Timer Countdown Effect with Cleanup
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      setCanResend(false);
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, []);

  // Submit REAL OTP Verification (Fires ONCE)
  const handleVerify = async (codeToVerify?: string) => {
    const finalCode = codeToVerify || otp.join('');
    if (finalCode.length < 4) {
      setError('Please enter all 4 digits.');
      return;
    }

    if (isVerifyingRef.current) return; // Lock duplicate requests
    isVerifyingRef.current = true;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneParam,
          code: finalCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid verification code. Please check the code.');
      }

      setSuccess(true);

      // Successful verification! Redirect after checkmark display
      redirectTimerRef.current = setTimeout(() => {
        router.push(redirectParam);
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Invalid verification code. Please try again.');
      isVerifyingRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  // Handle single digit input
  const handleChange = (index: number, value: string) => {
    if (loading || success) return;
    setError(null);
    if (!/^\d*$/.test(value)) return; // Digits only

    const digit = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-advance focus
    if (digit && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
      setActiveInputIndex(index + 1);
    } else {
      setActiveInputIndex(index);
    }

    // Immediately after 4th digit is entered -> trigger verification ONCE
    if (newOtp.every((d) => d !== '') && !isVerifyingRef.current) {
      handleVerify(newOtp.join(''));
    }
  };

  // Handle Key Down (Backspace navigation & Arrows)
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (loading || success) return;
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
        setActiveInputIndex(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveInputIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < 3) {
      inputRefs.current[index + 1]?.focus();
      setActiveInputIndex(index + 1);
    }
  };

  // Handle Paste Support
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (loading || success) return;
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 4);
    if (!pastedData) return;

    const newOtp = ['', '', '', ''];
    for (let i = 0; i < 4; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtp(newOtp);

    const nextFocusIndex = Math.min(pastedData.length, 3);
    inputRefs.current[nextFocusIndex]?.focus();
    setActiveInputIndex(nextFocusIndex);

    if (pastedData.length === 4 && !isVerifyingRef.current) {
      handleVerify(pastedData);
    }
  };

  // Resend OTP Code
  const handleResend = async () => {
    if (!canResend || resending || loading) return;

    setResending(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneParam }),
      });

      const data = await response.json();

      if (!response.ok && response.status !== 429) {
        throw new Error(data.message || 'Failed to resend code');
      }

      setCountdown(30);
      setCanResend(false);
      setOtp(['', '', '', '']);
      isVerifyingRef.current = false;
      setActiveInputIndex(0);
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } catch (err: any) {
      setError(err.message || 'Could not resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const formattedCountdown = `00:${countdown < 10 ? `0${countdown}` : countdown}`;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center py-10 px-4 bg-[#070b14] overflow-hidden text-slate-100">
      {/* 3D Background */}
      <ThreeAuth3D isSuccess={success} isError={Boolean(error)} isVerifying={loading} />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

      {/* Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] sm:w-[600px] h-[480px] sm:h-[600px] bg-gradient-to-tr from-teal-500/15 via-emerald-500/10 to-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Top Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-teal-500/30 text-teal-400 text-xs font-semibold tracking-wider uppercase shadow-lg shadow-teal-500/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span className="font-mono text-[11px]">SkillConnect.pk</span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center space-x-1 text-slate-300">
              <Lock className="w-3 h-3 text-teal-400" />
              <span>Secure Verification</span>
            </span>
          </div>

          {/* Shield Icon */}
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center my-2">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-teal-500/20 via-emerald-500/20 to-cyan-500/20" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-slate-900 to-[#0f1d2e] border border-teal-400/50 flex items-center justify-center shadow-[0_0_25px_rgba(20,184,166,0.35)]">
              {success ? (
                <Check className="w-8 h-8 text-emerald-400 animate-bounce" />
              ) : (
                <ShieldCheck className="w-8 h-8 text-teal-300" />
              )}
            </div>
          </div>
        </div>

        {/* Center Card - Premium Floating Glass Panel */}
        <div
          className={`relative p-6 sm:p-8 rounded-3xl bg-[#0d1527]/90 backdrop-blur-2xl border transition-all duration-300 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] ${
            error
              ? 'animate-shake border-red-500/70 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
              : success
              ? 'border-emerald-500/70 shadow-[0_0_35px_rgba(16,185,129,0.35)] scale-[1.02]'
              : 'border-teal-500/30 hover:border-teal-500/50'
          }`}
        >
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Verify your phone number
              </h1>
              <p className="text-xs text-slate-400">
                Enter the verification code sent to your phone
              </p>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/90 border border-teal-500/30 text-xs font-mono text-teal-300 font-semibold shadow-inner">
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                <span>{maskPhoneNumber(phoneParam)}</span>
              </div>
            </div>

            {/* 4 SEPARATE SQUARE INPUT BOXES */}
            <div className="flex justify-center items-center gap-3 sm:gap-4">
              {otp.map((digit, idx) => {
                const isActive = activeInputIndex === idx;
                const isFilled = Boolean(digit);

                return (
                  <div key={idx} className="relative transition-transform duration-200">
                    <input
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      disabled={loading || success}
                      onFocus={() => setActiveInputIndex(idx)}
                      onChange={(e) => handleChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={handlePaste}
                      className={`w-14 sm:w-16 h-16 sm:h-20 text-center text-2xl sm:text-3xl font-black rounded-2xl border transition-all duration-200 outline-none select-none ${
                        success
                          ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105'
                          : error
                          ? 'bg-red-950/40 border-red-500 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                          : loading
                          ? 'bg-slate-900/90 border-teal-500/50 text-teal-400 opacity-80'
                          : isFilled
                          ? 'bg-slate-900/90 border-teal-400 text-teal-300 shadow-[0_0_18px_rgba(20,184,166,0.3)] scale-[1.03]'
                          : isActive
                          ? 'bg-slate-900/80 border-teal-400 ring-4 ring-teal-500/25 text-white shadow-[0_0_20px_rgba(20,184,166,0.3)] scale-105'
                          : 'bg-slate-950/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                      }`}
                    />

                    {loading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-2xl pointer-events-none">
                        <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
                      </div>
                    )}

                    {success && (
                      <div className="absolute inset-0 flex items-center justify-center bg-emerald-950/90 rounded-2xl pointer-events-none animate-fadeIn">
                        <Check className="w-7 h-7 text-emerald-400 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* STATUS MESSAGE BELOW BOXES */}
            <div className="text-center min-h-[24px]">
              {loading && (
                <p className="text-xs font-semibold text-teal-300 animate-pulse flex items-center justify-center space-x-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
                  <span>Verifying code...</span>
                </p>
              )}

              {success && (
                <p className="text-xs font-black text-emerald-400 animate-fadeIn flex items-center justify-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verification Successful!</span>
                </p>
              )}

              {error && !loading && !success && (
                <div className="flex items-center justify-center space-x-1.5 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* VERIFY BUTTON */}
            <button
              type="button"
              onClick={() => handleVerify()}
              disabled={loading || success || otp.some((d) => d === '')}
              className="w-full relative group overflow-hidden py-4 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black text-sm shadow-[0_10px_30px_rgba(20,184,166,0.35)] transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="flex items-center space-x-2 text-slate-950 font-bold">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </div>
              ) : success ? (
                <div className="flex items-center space-x-2 text-slate-950 font-bold">
                  <Check className="w-4 h-4" />
                  <span>Verified</span>
                </div>
              ) : (
                <>
                  <span>Verify & Continue</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            {/* RESEND SECTION */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs gap-2 pt-1 text-slate-400">
              <span>Didn&apos;t receive the code?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend || resending || loading || success}
                className={`font-semibold flex items-center space-x-1.5 transition-all ${
                  canResend && !loading && !success
                    ? 'text-teal-400 hover:text-teal-300 hover:underline cursor-pointer'
                    : 'text-slate-500 cursor-not-allowed opacity-80'
                }`}
              >
                {resending ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-400" />
                ) : canResend ? (
                  <span className="text-teal-400 font-bold">Resend OTP</span>
                ) : (
                  <span className="font-mono text-slate-400">
                    Resend code in <strong className="text-teal-400 font-bold">{formattedCountdown}</strong>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center space-x-1.5 pt-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>SkillConnect Pakistan Security Layer • Encrypted 256-bit</span>
        </div>
      </div>
    </div>
  );
}

export default function OtpVerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-teal-400 text-xs font-mono">
          Loading Secure Verification...
        </div>
      }
    >
      <OtpVerificationContent />
    </Suspense>
  );
}
