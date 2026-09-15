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
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-blue-600/30 text-slate-900 space-y-4 shadow-xl relative overflow-hidden">
        <div className="flex items-center space-x-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
          <Route className="w-4 h-4" />
          <span>Interactive AI Career Roadmap</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Visual Step-by-Step Pathway to Becoming <span className="text-blue-600">{targetRole}</span>
        </h2>
        <p className="text-slate-700 text-xs sm:text-sm max-w-2xl">
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
            className="flex-1 px-4 py-2.5 rounded-xl bg-white text-slate-900 placeholder-slate-400 border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white text-slate-900 border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="3 Months">Fast Track (3 Months)</option>
            <option value="6 Months">Standard (6 Months)</option>
            <option value="12 Months">Comprehensive (1 Year)</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-slate-900 font-bold text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
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
        <div className="p-12 rounded-3xl bg-white dark:bg-white border border-slate-200 dark:border-slate-200 text-center space-y-3 shadow-sm">
          <Route className="w-12 h-12 text-blue-600 mx-auto animate-pulse" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-900">
            Click "Build Roadmap" to Generate Your Path
          </h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Get a tailored progression from Beginner fundamentals to Job Ready projects designed for Pakistani tech & service industries.
          </p>
        </div>
      )}

      {roadmap && (
        <div className="space-y-6 animate-fadeIn">
          {/* Timeline Nodes */}
          <div className="relative">
            {/* Center Connecting Line */}
            <div className="absolute left-6 top-8 bottom-8 w-1 bg-gradient-to-b from-blue-800 via-blue-900 to-blue-800 rounded-full hidden sm:block" />

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
                          ? 'bg-blue-900 text-slate-900 ring-4 ring-blue-600/20'
                          : 'bg-slate-100 text-blue-600 border border-slate-300'
                      }`}
                    >
                      {step.stepNumber}
                    </button>

                    {/* Step Card */}
                    <div
                      onClick={() => setActiveStep(isExpanded ? null : step.stepNumber)}
                      className="p-6 rounded-3xl bg-white dark:bg-white border border-slate-200 dark:border-slate-200 shadow-sm hover:border-blue-600/50 transition-all cursor-pointer space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="sm:hidden w-8 h-8 rounded-xl bg-blue-900 text-slate-900 font-extrabold text-xs flex items-center justify-center">
                            {step.stepNumber}
                          </span>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-50 text-blue-600 dark:text-blue-600 border border-blue-600/20">
                            {step.phase}
                          </span>
                          <span className="text-xs text-slate-600 font-semibold hidden md:inline">
                            Difficulty: {step.estimatedDifficulty}
                          </span>
                        </div>

                        <span className="text-xs font-bold text-blue-600 dark:text-blue-600">
                          {isExpanded ? 'Hide Details' : 'View Step →'}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-900">
                        {step.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-700 leading-relaxed">
                        {step.whatToLearn}
                      </p>

                      {/* Expanded Step Details */}
                      {isExpanded && (
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-fadeIn">
                          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-50/60 border border-slate-200 dark:border-slate-300/60 space-y-1">
                            <span className="font-bold text-slate-900 dark:text-slate-800 flex items-center space-x-1">
                              <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-600" />
                              <span>Why It Matters</span>
                            </span>
                            <p className="text-slate-600 dark:text-slate-600 leading-relaxed">
                              {step.whyItMatters}
                            </p>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-50 border border-blue-600/30 space-y-1">
                            <span className="font-bold text-blue-600 dark:text-blue-600 flex items-center space-x-1">
                              <Wrench className="w-3.5 h-3.5 text-blue-600 dark:text-blue-600" />
                              <span>Suggested Project</span>
                            </span>
                            <p className="text-blue-600 dark:text-blue-200 font-semibold">
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
