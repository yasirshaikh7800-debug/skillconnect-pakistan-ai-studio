'use client';

import React, { useState } from 'react';
import AiSkillMatcher from '@/components/ai/AiSkillMatcher';
import AiCareerRoadmap from '@/components/ai/AiCareerRoadmap';
import AiProfileAssistant from '@/components/ai/AiProfileAssistant';
import AiCareerInsightsCard from '@/components/ai/AiCareerInsightsCard';
import { BrainCircuit, Route, UserCheck, Sparkles, LayoutDashboard } from 'lucide-react';

export default function AiCareerHubPage() {
  const [activeTab, setActiveTab] = useState<'matcher' | 'roadmap' | 'profile' | 'insights'>('matcher');

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto pt-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SkillConnect Pakistan AI Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          AI Career & Skills Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Match your skills with top Pakistani job market demands, generate interactive career roadmaps, and polish your professional service profile.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit mx-auto">
        <button
          onClick={() => setActiveTab('matcher')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 ${
            activeTab === 'matcher'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>AI Skill Matcher</span>
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 ${
            activeTab === 'roadmap'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Route className="w-4 h-4" />
          <span>AI Career Roadmap</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 ${
            activeTab === 'profile'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>AI Profile Assistant</span>
        </button>

        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 ${
            activeTab === 'insights'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>AI Career Insights</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'matcher' && <AiSkillMatcher />}
        {activeTab === 'roadmap' && <AiCareerRoadmap />}
        {activeTab === 'profile' && <AiProfileAssistant />}
        {activeTab === 'insights' && (
          <div className="max-w-4xl mx-auto">
            <AiCareerInsightsCard />
          </div>
        )}
      </div>
    </div>
  );
}
