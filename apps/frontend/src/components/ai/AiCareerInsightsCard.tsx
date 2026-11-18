'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, TrendingUp, CheckCircle2, ArrowRight, Award, Target, Briefcase } from 'lucide-react';

interface AiCareerInsightsProps {
  currentProfileRole?: string;
  matchScore?: number;
  recommendedSkills?: string[];
  recommendedOpportunities?: string[];
}

export default function AiCareerInsightsCard({
  currentProfileRole = 'Frontend Web Developer',
  matchScore = 87,
  recommendedSkills = ['React & Next.js', 'TypeScript', 'REST APIs & Node.js'],
  recommendedOpportunities = [
    'Frontend Developer (Karachi / Remote)',
    'React Developer (Lahore)',
    'Junior Web Engineer (Islamabad)',
  ],
}: AiCareerInsightsProps) {
  return (
    <div className="p-6 rounded-3xl bg-[#0a1024]/85 backdrop-blur-xl border border-cyan-500/25 text-white shadow-[0_15px_35px_rgba(0,0,0,0.5)] space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI Career Insights Engine</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">
            Target Role: <span className="text-gradient-cyan-blue">{currentProfileRole}</span>
          </h3>
        </div>

        {/* Match Percentage Badge */}
        <div className="flex items-center space-x-3 bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 rounded-2xl w-fit shadow-[0_0_20px_rgba(0,242,254,0.15)]">
          <Award className="w-6 h-6 text-cyan-400" />
          <div>
            <span className="text-2xl font-black text-cyan-300">{matchScore}%</span>
            <span className="block text-[10px] text-slate-400 font-semibold uppercase font-mono">
              Profile AI Match
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Recommended Next Skills */}
        <div className="p-5 rounded-2xl bg-[#050814]/70 border border-cyan-500/20 space-y-3">
          <h4 className="font-extrabold text-slate-300 uppercase tracking-wider flex items-center space-x-2 font-mono">
            <Target className="w-4 h-4 text-cyan-400" />
            <span>Recommended Next Skills</span>
          </h4>
          <div className="space-y-2">
            {recommendedSkills.map((skill, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#0a1024] border border-slate-800 flex items-center justify-between text-slate-200 hover:border-cyan-500/30 transition-all"
              >
                <span className="font-semibold">{idx + 1}. {skill}</span>
                <span className="text-[10px] text-cyan-300 font-semibold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                  High Impact
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Opportunities */}
        <div className="p-5 rounded-2xl bg-[#050814]/70 border border-cyan-500/20 space-y-3">
          <h4 className="font-extrabold text-slate-300 uppercase tracking-wider flex items-center space-x-2 font-mono">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            <span>Recommended Opportunities</span>
          </h4>
          <div className="space-y-2">
            {recommendedOpportunities.map((opp, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#0a1024] border border-slate-800 flex items-center justify-between text-slate-200 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="font-medium">{opp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-slate-800">
        <span className="text-slate-400">
          Powered by SkillConnect Gemini AI Engine
        </span>
        <Link
          href="/ai-hub"
          className="px-4 py-2 rounded-xl glow-btn-cyan text-slate-950 font-bold shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
        >
          <span>Open Full AI Hub</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
