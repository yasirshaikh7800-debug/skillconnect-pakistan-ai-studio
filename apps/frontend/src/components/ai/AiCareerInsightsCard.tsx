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
    <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 border border-blue-600/30 text-slate-900 shadow-xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>AI Career Insights</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            Target Role: <span className="text-blue-600">{currentProfileRole}</span>
          </h3>
        </div>

        {/* Match Percentage Badge */}
        <div className="flex items-center space-x-3 bg-blue-600/10 border border-blue-600/30 px-4 py-2 rounded-2xl w-fit">
          <Award className="w-6 h-6 text-blue-600" />
          <div>
            <span className="text-2xl font-black text-blue-600">{matchScore}%</span>
            <span className="block text-[10px] text-slate-700 font-semibold uppercase">
              Profile AI Match
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Recommended Next Skills */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
          <h4 className="font-extrabold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span>Recommended Next Skills</span>
          </h4>
          <div className="space-y-2">
            {recommendedSkills.map((skill, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-100/80 border border-slate-300/60 flex items-center justify-between text-slate-700"
              >
                <span className="font-bold">{idx + 1}. {skill}</span>
                <span className="text-[10px] text-blue-600 font-semibold px-2 py-0.5 rounded bg-blue-900">
                  High Impact
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Opportunities */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
          <h4 className="font-extrabold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            <span>Recommended Opportunities</span>
          </h4>
          <div className="space-y-2">
            {recommendedOpportunities.map((opp, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-100/80 border border-slate-300/60 flex items-center justify-between text-slate-700"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="font-medium">{opp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="pt-2 flex items-center justify-between text-xs">
        <span className="text-slate-600">
          Powered by SkillConnect Gemini AI Engine
        </span>
        <Link
          href="/ai-hub"
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-slate-900 font-bold shadow-md shadow-blue-600/20 transition-all flex items-center space-x-1.5 cursor-pointer"
        >
          <span>Open Full AI Hub</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
