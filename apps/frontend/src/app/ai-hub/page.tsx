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
    <div className="space-y-8 max-w-7xl mx-auto pb-16 px-4">
      {/* Top Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto pt-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/10">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>SkillConnect Pakistan AI Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          AI Career & <span className="text-gradient-cyan-blue">Skills Hub</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Match your skills with top Pakistani job market demands, generate interactive career roadmaps, and polish your professional service profile.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-[#0a1024]/90 backdrop-blur-xl border border-cyan-500/20 w-fit mx-auto shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <button
          onClick={() => setActiveTab('matcher')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'matcher'
              ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.3)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>AI Skill Matcher</span>
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'roadmap'
              ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.3)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Route className="w-4 h-4" />
          <span>AI Career Roadmap</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.3)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>AI Profile Assistant</span>
        </button>

        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'insights'
              ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.3)]'
              : 'text-slate-400 hover:text-white'
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
