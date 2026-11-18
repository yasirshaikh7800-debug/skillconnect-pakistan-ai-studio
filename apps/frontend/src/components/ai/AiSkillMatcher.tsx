'use client';

import React, { useState } from 'react';
import { Sparkles, BrainCircuit, ArrowRight, CheckCircle2, AlertCircle, Loader2, Target, Award, MapPin, Briefcase } from 'lucide-react';

export default function AiSkillMatcher() {
  const [skills, setSkills] = useState('HTML, CSS, basic JavaScript');
  const [education, setEducation] = useState('Intermediate / ICS');
  const [experience, setExperience] = useState('1 year personal coding projects');
  const [interests, setInterests] = useState('Web applications, UI design, freelancing');
  const [careerGoal, setCareerGoal] = useState('Web Developer');
  const [location, setLocation] = useState('Karachi');
  const [workType, setWorkType] = useState('Full-time');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/skill-matcher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills,
          education,
          experience,
          interests,
          careerGoal,
          location,
          workType,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to analyze skills');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while analyzing skills.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPreset = (presetGoal: string, presetSkills: string) => {
    setCareerGoal(presetGoal);
    setSkills(presetSkills);
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0a1024] via-[#0d1633] to-[#070d20] border border-cyan-500/30 text-white space-y-3 relative overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
          <BrainCircuit className="w-4 h-4 text-cyan-400" />
          <span>Priority Feature — AI Skill Matcher</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Discover Your Ideal Career & <span className="text-gradient-cyan-blue">Skill Match Percentage</span>
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
          Enter your current skills, education, and goal. Our Gemini-powered AI analyzes the Pakistani job market (Karachi, Lahore, Islamabad, remote) to map your match percentage, skill gaps, and next learning path.
        </p>

        {/* Quick Presets */}
        <div className="pt-2 flex flex-wrap gap-2 items-center text-xs">
          <span className="text-slate-400 font-semibold font-mono text-[11px]">Quick Presets:</span>
          <button
            type="button"
            onClick={() => handleQuickPreset('Web Developer', 'HTML, CSS, JavaScript')}
            className="px-3 py-1 rounded-full bg-[#050814] hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 border border-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer"
          >
            Web Developer
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('Solar PV & Electrical Engineer', 'Electrical wiring, Solar panel installation, Multimeter')}
            className="px-3 py-1 rounded-full bg-[#050814] hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 border border-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer"
          >
            Solar Technician
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('UI/UX Designer', 'Figma, Canva, HTML basics')}
            className="px-3 py-1 rounded-full bg-[#050814] hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 border border-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer"
          >
            UI/UX Designer
          </button>
        </div>
      </div>

      {/* Main Form + Results Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0a1024]/85 backdrop-blur-xl border border-cyan-500/20 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <span>Your Profile Details</span>
          </h3>

          <form onSubmit={handleAnalyze} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Your Current Skills
              </label>
              <textarea
                required
                rows={2}
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. HTML, CSS, basic JavaScript, Photoshop..."
                className="w-full p-3 rounded-xl border border-cyan-500/20 bg-[#050814] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Target Career Goal
                </label>
                <input
                  type="text"
                  required
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  placeholder="e.g. Web Developer"
                  className="w-full p-2.5 rounded-xl border border-cyan-500/20 bg-[#050814] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Education Level
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="e.g. BS CS, ICS, DAE..."
                  className="w-full p-2.5 rounded-xl border border-cyan-500/20 bg-[#050814] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  City / Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-cyan-500/20 bg-[#050814] text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                >
                  <option value="Karachi">Karachi</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Quetta">Quetta</option>
                  <option value="Remote Pakistan">Remote Pakistan</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Work Type
                </label>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-cyan-500/20 bg-[#050814] text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Remote">Remote</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Practical Experience & Projects
              </label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g. 1 year personal projects, 6 months internship..."
                className="w-full p-2.5 rounded-xl border border-cyan-500/20 bg-[#050814] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl glow-btn-cyan text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Match with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI Skill Matcher</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Display */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!result && !loading && (
            <div className="p-12 rounded-3xl bg-[#0a1024]/60 border border-cyan-500/20 text-center space-y-3">
              <BrainCircuit className="w-12 h-12 text-cyan-400 mx-auto animate-bounce" />
              <h4 className="font-bold text-lg text-white">
                Ready for AI Analysis
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Fill in your skills or pick a preset on the left, then click "Run AI Skill Matcher" to view your customized role matches and learning gaps.
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-fadeIn">
              {/* Role Match Breakdown */}
              <div className="p-6 rounded-3xl bg-[#0a1024]/85 backdrop-blur-xl border border-cyan-500/20 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-lg text-white flex items-center space-x-2">
                    <Award className="w-5 h-5 text-cyan-400" />
                    <span>Career Role Match Scores</span>
                  </h3>
                  <span className="text-[11px] font-mono font-bold text-cyan-300 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30">
                    Pakistani Market Sync
                  </span>
                </div>

                <div className="space-y-4">
                  {result.matches?.map((match: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#050814]/70 border border-slate-800 space-y-2 hover:border-cyan-500/30 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-base text-white">
                            {match.role}
                          </h4>
                          <span className="text-[11px] text-slate-400">
                            Demand in Pakistan: <strong className="text-cyan-400">{match.demandInPakistan}</strong>
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-cyan-300">
                            {match.matchPercentage}%
                          </span>
                          <span className="block text-[10px] text-slate-500 font-semibold uppercase font-mono">
                            Match Score
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-[#0a1024] overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,242,254,0.5)]"
                          style={{ width: `${match.matchPercentage}%` }}
                        />
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed pt-1">
                        {match.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills You Should Learn Next */}
              <div className="p-6 rounded-3xl bg-[#0a1024]/85 backdrop-blur-xl border border-cyan-500/20 shadow-sm space-y-4">
                <h3 className="font-extrabold text-lg text-white flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Skills You Should Learn Next</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.nextSkills?.map((skill: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#050814]/70 border border-slate-800 flex items-start space-x-3 hover:border-cyan-500/30 transition-all"
                    >
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">
                          {skill.name}
                        </h4>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                          <span>Importance: <strong className="text-cyan-400">{skill.importance}</strong></span>
                          <span>•</span>
                          <span>Est: {skill.estimatedTimeToLearn}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Gaps & Advice */}
              <div className="p-6 rounded-3xl bg-cyan-950/25 border border-cyan-500/25 text-white space-y-3">
                <h4 className="font-bold text-sm text-cyan-400 uppercase tracking-wider font-mono">
                  AI Career Recommendation
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                  {result.careerAdvice}
                </p>

                {result.skillGaps?.length > 0 && (
                  <div className="pt-2 border-t border-cyan-500/20">
                    <span className="text-xs font-bold text-slate-400 block mb-1">
                      Identified Skill Gaps:
                    </span>
                    <ul className="space-y-1 text-xs">
                      {result.skillGaps.map((gap: string, i: number) => (
                        <li key={i} className="flex items-center space-x-1.5 text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
