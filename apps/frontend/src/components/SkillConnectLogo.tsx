'use client';

import React from 'react';

interface SkillConnectLogoProps {
  variant?: 'full' | 'compact' | 'icon-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
  forceTheme?: 'light' | 'dark';
}

export function SkillConnectIcon({
  size = 38,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 54 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_12px_rgba(0,242,254,0.35)]"
      >
        <defs>
          {/* Futuristic Cyan to Royal Blue to Purple Gradient */}
          <linearGradient id="scFuturisticGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="48%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>

          {/* Accent Flow for Inner Nodes */}
          <linearGradient id="scNodeFlow" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#00f2fe" />
          </linearGradient>

          {/* Subtle Outer Neon Glow */}
          <filter id="scNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodColor="#00f2fe" floodOpacity="0.38" />
          </filter>
        </defs>

        {/* Outer Dark Glass Background with Neon Border */}
        <rect
          x="3.5"
          y="3.5"
          width="47"
          height="47"
          rx="14"
          fill="#060c20"
          stroke="url(#scFuturisticGradient)"
          strokeWidth="1.8"
          filter="url(#scNeonGlow)"
        />

        {/* Interlocking Orbital Skill & Network Arcs */}
        {/* Top-Left to Bottom-Right Arc (Skills Network) */}
        <path
          d="M17 27C17 20.3726 21.4772 16 27 16C31.5 16 35.5 18.5 37 22"
          stroke="url(#scFuturisticGradient)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Bottom-Right to Top-Left Arc (People Connection) */}
        <path
          d="M37 27C37 33.6274 32.5228 38 27 38C22.5 38 18.5 35.5 17 32"
          stroke="url(#scNodeFlow)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Central Convergence Core (The National Platform) */}
        <circle cx="27" cy="27" r="4.2" fill="url(#scFuturisticGradient)" />
        <circle cx="27" cy="27" r="2" fill="#ffffff" />

        {/* Node 1: Citizen (Cyan) */}
        <circle cx="17" cy="27" r="2.8" fill="#00f2fe" />
        <circle cx="17" cy="27" r="1.2" fill="#ffffff" />

        {/* Node 2: Skilled Artisan (Purple) */}
        <circle cx="37" cy="27" r="2.8" fill="#c084fc" />
        <circle cx="37" cy="27" r="1.2" fill="#ffffff" />

        {/* Top Digital Link Orbit Node */}
        <circle cx="27" cy="16" r="1.8" fill="#38bdf8" />
      </svg>
    </div>
  );
}

export default function SkillConnectLogo({
  variant = 'compact',
  size = 'md',
  className = '',
  showSubtitle = true,
}: SkillConnectLogoProps) {
  const iconSizes = {
    sm: 30,
    md: 40,
    lg: 48,
    xl: 58,
  };

  const currentIconSize = iconSizes[size];

  if (variant === 'icon-only') {
    return <SkillConnectIcon size={currentIconSize} className={className} />;
  }

  return (
    <div className={`inline-flex items-center space-x-3 select-none ${className}`}>
      <SkillConnectIcon size={currentIconSize} />
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline">
          <span
            className={`font-extrabold tracking-tight text-white ${
              size === 'sm'
                ? 'text-lg'
                : size === 'md'
                ? 'text-xl'
                : size === 'lg'
                ? 'text-2xl'
                : 'text-3xl'
            }`}
          >
            SkillConnect
          </span>
          <span
            className={`font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 ${
              size === 'sm'
                ? 'text-lg'
                : size === 'md'
                ? 'text-xl'
                : size === 'lg'
                ? 'text-2xl'
                : 'text-3xl'
            }`}
          >
            .pk
          </span>
        </div>

        {(variant === 'full' || showSubtitle) && (
          <div className="flex items-center space-x-1.5 mt-0.5">
            <span
              className={`font-bold uppercase tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-purple-300 ${
                size === 'sm'
                  ? 'text-[8px]'
                  : size === 'md'
                  ? 'text-[9.5px]'
                  : 'text-[11px]'
              }`}
            >
              PAKISTAN
            </span>
            <span className="text-[7.5px] font-medium text-slate-400 tracking-wider">
              · SERVICES PLATFORM
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
