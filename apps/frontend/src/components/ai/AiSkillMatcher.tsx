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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-950 border border-blue-600/30 text-white space-y-3 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center space-x-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
          <BrainCircuit className="w-4 h-4" />
          <span>Priority Feature — AI Skill Matcher</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Discover Your Ideal Career & Skill Match Percentage
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
          Enter your current skills, education, and goal. Our Gemini-powered AI analyzes the Pakistani job market (Karachi, Lahore, Islamabad, remote) to map your match percentage, skill gaps, and next learning path.
        </p>

        {/* Quick Presets */}
        <div className="pt-2 flex flex-wrap gap-2 items-center text-xs">
          <span className="text-slate-400 font-semibold">Try Quick Examples:</span>
          <button
            type="button"
            onClick={() => handleQuickPreset('Web Developer', 'HTML, CSS, JavaScript')}
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-700 transition-all cursor-pointer"
          >
            Web Developer
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('Solar PV & Electrical Engineer', 'Electrical wiring, Solar panel installation, Multimeter')}
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-700 transition-all cursor-pointer"
          >
            Solar Technician
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('UI/UX Designer', 'Figma, Canva, HTML basics')}
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-700 transition-all cursor-pointer"
          >
            UI/UX Designer
          </button>
        </div>
      </div>

      {/* Main Form + Results Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-white border border-slate-200 dark:border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-900 flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-600 dark:text-blue-600" />
            <span>Your Profile Details</span>
          </h3>

          <form onSubmit={handleAnalyze} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-700 mb-1">
                Your Current Skills
              </label>
              <textarea
                required
                rows={2}
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. HTML, CSS, basic JavaScript, Photoshop..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-300 bg-slate-50 dark:bg-slate-50 text-slate-900 dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-700 mb-1">
                  Target Career Goal
                </label>
                <input
                  type="text"
                  required
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  placeholder="e.g. Web Developer"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-300 bg-slate-50 dark:bg-slate-50 text-slate-900 dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-700 mb-1">
                  Education Level
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="e.g. BS CS, ICS, DAE..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-300 bg-slate-50 dark:bg-slate-50 text-slate-900 dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-700 mb-1">
                  City / Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-300 bg-slate-50 dark:bg-slate-50 text-slate-900 dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                <label className="block font-semibold text-slate-700 dark:text-slate-700 mb-1">
                  Work Type
                </label>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-300 bg-slate-50 dark:bg-slate-50 text-slate-900 dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Remote">Remote</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-700 mb-1">
                Practical Experience & Projects
              </label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g. 1 year personal projects, 6 months internship..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-300 bg-slate-50 dark:bg-slate-50 text-slate-900 dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
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
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!result && !loading && (
            <div className="p-12 rounded-3xl bg-slate-100 dark:bg-white border border-slate-200 dark:border-slate-200 text-center space-y-3">
              <BrainCircuit className="w-12 h-12 text-blue-600 mx-auto animate-bounce" />
              <h4 className="font-bold text-lg text-slate-900 dark:text-slate-900">
                Ready for AI Analysis
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Fill in your skills or pick a preset on the left, then click "Run AI Skill Matcher" to view your customized role matches and learning gaps.
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-fadeIn">
              {/* Role Match Breakdown */}
              <div className="p-6 rounded-3xl bg-white dark:bg-white border border-slate-200 dark:border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-900 flex items-center space-x-2">
                    <Award className="w-5 h-5 text-blue-600 dark:text-blue-600" />
                    <span>Career Role Match Scores</span>
                  </h3>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-600 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-50">
                    Pakistani Market Sync
                  </span>
                </div>

                <div className="space-y-4">
                  {result.matches?.map((match: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-50/60 border border-slate-200 dark:border-slate-300/60 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-base text-slate-900 dark:text-slate-900">
                            {match.role}
                          </h4>
                          <span className="text-[11px] text-slate-500">
                            Demand in Pakistan: <strong className="text-blue-600 dark:text-blue-600">{match.demandInPakistan}</strong>
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-blue-600 dark:text-blue-600">
                            {match.matchPercentage}%
                          </span>
                          <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                            Match Score
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-900 to-blue-700 rounded-full transition-all duration-1000"
                          style={{ width: `${match.matchPercentage}%` }}
                        />
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-700 leading-relaxed pt-1">
                        {match.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills You Should Learn Next */}
              <div className="p-6 rounded-3xl bg-white dark:bg-white border border-slate-200 dark:border-slate-200 shadow-sm space-y-4">
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-900 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Skills You Should Learn Next</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.nextSkills?.map((skill: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-50/80 border border-slate-200 dark:border-slate-300 flex items-start space-x-3"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-600 font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-900">
                          {skill.name}
                        </h4>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                          <span>Importance: <strong className="text-blue-600 dark:text-blue-600">{skill.importance}</strong></span>
                          <span>•</span>
                          <span>Est: {skill.estimatedTimeToLearn}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Gaps & Advice */}
              <div className="p-6 rounded-3xl bg-blue-50/50 dark:bg-blue-50 border border-blue-200 dark:border-blue-600/30 text-slate-900 dark:text-slate-900 space-y-3">
                <h4 className="font-bold text-sm text-blue-600 dark:text-blue-600 uppercase tracking-wider">
                  AI Career Recommendation
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-700">
                  {result.careerAdvice}
                </p>

                {result.skillGaps?.length > 0 && (
                  <div className="pt-2 border-t border-blue-600/20">
                    <span className="text-xs font-bold text-slate-500 block mb-1">
                      Identified Skill Gaps:
                    </span>
                    <ul className="space-y-1 text-xs">
                      {result.skillGaps.map((gap: string, i: number) => (
                        <li key={i} className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
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
