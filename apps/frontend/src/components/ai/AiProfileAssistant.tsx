'use client';

import React, { useState } from 'react';
import { UserCheck, Sparkles, Copy, Check, FileText, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';

export default function AiProfileAssistant() {
  const [fullName, setFullName] = useState('Tariq Mahmood');
  const [city, setCity] = useState('Karachi');
  const [category, setCategory] = useState('Electrician & Solar Installer');
  const [skills, setSkills] = useState('DB box wiring, Solar PV inverter setup, UPS maintenance');
  const [rawExperience, setRawExperience] = useState('Worked 4 years on residential solar projects in Karachi & Hyderabad.');
  const [targetRoleOrService, setTargetRoleOrService] = useState('Solar PV Technician & Electrical Contractor');

  const [loading, setLoading] = useState(false);
  const [profileResult, setProfileResult] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleEnhance = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/ai/profile-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          city,
          category,
          skills,
          rawExperience,
          targetRoleOrService,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProfileResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 border border-teal-500/30 text-white space-y-3 shadow-xl">
        <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
          <UserCheck className="w-4 h-4" />
          <span>AI Profile & CV Optimizer</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Refine Your SkillConnect Bio & Resume Introductions
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
          Enter your authentic experience and skills. Gemini AI refines your profile overview, service pitch, and job application message with professional polish — without making false claims.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-teal-500" />
            <span>Profile Information</span>
          </h3>

          <form onSubmit={handleEnhance} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category / Primary Trade
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Electrician, Web Developer, Plumber"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Key Skills
              </label>
              <input
                type="text"
                required
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. React, Next.js, TypeScript or Solar Inverter Wiring"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Raw Experience / Notes
              </label>
              <textarea
                rows={3}
                value={rawExperience}
                onChange={(e) => setRawExperience(e.target.value)}
                placeholder="Tell us what you have actually worked on..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-600/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enhancing Profile Content...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Enhanced Profile</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Profile Output */}
        <div className="lg:col-span-7 space-y-6">
          {!profileResult && !loading && (
            <div className="p-12 rounded-3xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <UserCheck className="w-12 h-12 text-teal-500 mx-auto animate-bounce" />
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                AI Profile Assistant Ready
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Fill in your details on the left to generate polished bios, client outreach introductions, and profile audit checks.
              </p>
            </div>
          )}

          {profileResult && (
            <div className="space-y-6 animate-fadeIn">
              {/* Profile Bio */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                    Professional Bio
                  </h4>
                  <button
                    onClick={() => copyToClipboard(profileResult.professionalBio, 'bio')}
                    className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-teal-500 hover:text-white transition-all flex items-center space-x-1"
                  >
                    {copiedField === 'bio' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'bio' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                  {profileResult.professionalBio}
                </p>
              </div>

              {/* Client Outreach Intro */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                    Job & Client Outreach Note
                  </h4>
                  <button
                    onClick={() => copyToClipboard(profileResult.jobIntro, 'intro')}
                    className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-teal-500 hover:text-white transition-all flex items-center space-x-1"
                  >
                    {copiedField === 'intro' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'intro' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 font-mono">
                  {profileResult.jobIntro}
                </p>
              </div>

              {/* Suggestions Box */}
              <div className="p-6 rounded-3xl bg-teal-950/20 border border-teal-500/30 text-slate-900 dark:text-slate-100 space-y-3">
                <h4 className="font-bold text-sm text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Profile Completion Check</span>
                </h4>
                <div className="space-y-2 text-xs">
                  {profileResult.missingSuggestions?.map((item: string, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-900/40 border border-teal-500/20 text-slate-200">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
