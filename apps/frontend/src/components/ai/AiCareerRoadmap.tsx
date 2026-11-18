'use client';

import React, { useState } from 'react';
import { Route, Sparkles, ArrowDown, CheckCircle, BookOpen, Wrench, Shield, Loader2, Play } from 'lucide-react';

export default function AiCareerRoadmap() {
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [timeframe, setTimeframe] = useState('6 Months');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [activeStep, setActiveStep] = useState<number | null>(1);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/ai/career-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole, timeframe }),
      });

      if (res.ok) {
        const data = await res.json();
        setRoadmap(data);
        setActiveStep(1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0a1024] via-[#0d1633] to-[#070d20] border border-cyan-500/30 text-white space-y-4 shadow-[0_10px_35px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
          <Route className="w-4 h-4 text-cyan-400" />
          <span>Interactive AI Career Roadmap</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Visual Step-by-Step Pathway to Becoming <span className="text-gradient-cyan-blue">{targetRole}</span>
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
          Enter any career goal in Pakistan (Full Stack Developer, Solar Engineer, Graphic Designer, Flutter Developer). Gemini AI generates a structured milestone roadmap with projects and skill prerequisites.
        </p>

        {/* Input Form Bar */}
        <form onSubmit={handleGenerate} className="pt-2 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Full Stack Developer, MERN Developer..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#050814] text-white placeholder-slate-500 border border-cyan-500/20 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
          />

          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-[#050814] text-white border border-cyan-500/20 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-medium"
          >
            <option value="3 Months" className="bg-[#0a1024]">Fast Track (3 Months)</option>
            <option value="6 Months" className="bg-[#0a1024]">Standard (6 Months)</option>
            <option value="12 Months" className="bg-[#0a1024]">Comprehensive (1 Year)</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl glow-btn-cyan text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Roadmap...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Build Roadmap</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Roadmap Visualization */}
      {!roadmap && !loading && (
        <div className="p-12 rounded-3xl bg-[#0a1024]/60 border border-cyan-500/20 text-center space-y-3 shadow-sm">
          <Route className="w-12 h-12 text-cyan-400 mx-auto animate-pulse" />
          <h3 className="text-lg font-bold text-white">
            Click "Build Roadmap" to Generate Your Path
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Get a tailored progression from Beginner fundamentals to Job Ready projects designed for Pakistani tech & service industries.
          </p>
        </div>
      )}

      {roadmap && (
        <div className="space-y-6 animate-fadeIn">
          {/* Timeline Nodes */}
          <div className="relative">
            {/* Center Connecting Line */}
            <div className="absolute left-6 top-8 bottom-8 w-1 bg-gradient-to-b from-cyan-400 via-sky-500 to-violet-600 rounded-full hidden sm:block shadow-[0_0_10px_rgba(0,242,254,0.4)]" />

            <div className="space-y-6">
              {roadmap.roadmapSteps?.map((step: any, index: number) => {
                const isExpanded = activeStep === step.stepNumber;
                return (
                  <div
                    key={index}
                    className={`relative sm:pl-16 transition-all ${
                      isExpanded ? 'scale-[1.01]' : 'opacity-95 hover:opacity-100'
                    }`}
                  >
                    {/* Step Badge Node */}
                    <button
                      onClick={() => setActiveStep(isExpanded ? null : step.stepNumber)}
                      className={`absolute left-0 top-0 w-12 h-12 rounded-2xl font-black text-sm flex items-center justify-center transition-all z-10 shadow-lg hidden sm:flex cursor-pointer ${
                        isExpanded
                          ? 'glow-btn-cyan text-slate-950 ring-4 ring-cyan-400/20'
                          : 'bg-[#050814] text-cyan-400 border border-cyan-500/30'
                      }`}
                    >
                      {step.stepNumber}
                    </button>

                    {/* Step Card */}
                    <div
                      onClick={() => setActiveStep(isExpanded ? null : step.stepNumber)}
                      className="p-6 rounded-3xl bg-[#0a1024]/85 backdrop-blur-xl border border-cyan-500/20 shadow-sm hover:border-cyan-500/50 transition-all cursor-pointer space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="sm:hidden w-8 h-8 rounded-xl bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center justify-center">
                            {step.stepNumber}
                          </span>
                          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                            {step.phase}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold hidden md:inline">
                            Difficulty: {step.estimatedDifficulty}
                          </span>
                        </div>

                        <span className="text-xs font-bold text-cyan-400">
                          {isExpanded ? 'Hide Details' : 'View Step →'}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white">
                        {step.title}
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {step.whatToLearn}
                      </p>

                      {/* Expanded Step Details */}
                      {isExpanded && (
                        <div className="pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-fadeIn">
                          <div className="p-3.5 rounded-2xl bg-[#050814]/70 border border-slate-800 space-y-1">
                            <span className="font-bold text-white flex items-center space-x-1">
                              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Why It Matters</span>
                            </span>
                            <p className="text-slate-300 leading-relaxed">
                              {step.whyItMatters}
                            </p>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-1">
                            <span className="font-bold text-cyan-300 flex items-center space-x-1">
                              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Suggested Project</span>
                            </span>
                            <p className="text-cyan-200 font-semibold">
                              {step.suggestedProject}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
