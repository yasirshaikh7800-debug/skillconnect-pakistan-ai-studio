'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';

interface SkillConnectLogoProps {
  variant?: 'full' | 'compact' | 'icon-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
  forceTheme?: 'light' | 'dark';
}

export function SkillConnectIcon({
  size = 36,
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
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          {/* Deep Royal to Vibrant Cobalt Blue Gradient */}
          <linearGradient id="scGradientPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="50%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          {/* Cyan/Light Blue Accent for Interlocking Flow */}
          <linearGradient id="scGradientAccent" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="60%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>

          {/* Subtle Glow Filter */}
          <filter id="scGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1e40af" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer Shield/Hex Modern Squircle Base */}
        <rect
          x="3"
          y="3"
          width="42"
          height="42"
          rx="12"
          fill="url(#scGradientPrimary)"
          filter="url(#scGlow)"
        />

        {/* Inner White Network & Skill Connection Knot */}
        {/* Pathway 1: Customer Node Arc (Left to Center-Right) */}
        <path
          d="M15 24C15 19.0294 19.0294 15 24 15C27.5 15 30.5 17 32 20"
          stroke="#ffffff"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pathway 2: Worker Node Arc (Right to Center-Left) */}
        <path
          d="M33 24C33 28.9706 28.9706 33 24 33C20.5 33 17.5 31 16 28"
          stroke="url(#scGradientAccent)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central Convergence Axis & Core Node */}
        <circle cx="24" cy="24" r="3.6" fill="#ffffff" />
        <circle cx="24" cy="24" r="1.6" fill="#1d4ed8" />

        {/* Customer Node Pin */}
        <circle cx="15" cy="24" r="2.2" fill="#ffffff" />

        {/* Skilled Worker Node Pin */}
        <circle cx="33" cy="24" r="2.2" fill="#93c5fd" />
      </svg>
    </div>
  );
}

export default function SkillConnectLogo({
  variant = 'compact',
  size = 'md',
  className = '',
  showSubtitle = true,
  forceTheme,
}: SkillConnectLogoProps) {
  let isDark = false;
  try {
    const { theme } = useTheme();
    isDark = theme === 'dark';
  } catch {
    // If rendered outside ThemeProvider
    isDark = false;
  }

  if (forceTheme) {
    isDark = forceTheme === 'dark';
  }

  const iconSizes = {
    sm: 28,
    md: 38,
    lg: 46,
    xl: 56,
  };

  const currentIconSize = iconSizes[size];

  if (variant === 'icon-only') {
    return <SkillConnectIcon size={currentIconSize} className={className} />;
  }

  // Explicit text styling based on theme or caller classes
  const isCustomColor = className.includes('text-white') || className.includes('text-slate-');
  const mainTextColor = isCustomColor 
    ? '' 
    : isDark 
      ? 'text-white' 
      : 'text-slate-900';

  const dotPkColor = className.includes('text-white')
    ? 'text-blue-300'
    : isDark
      ? 'text-blue-400'
      : 'text-blue-600';

  const subtitleColor = className.includes('text-white')
    ? 'text-blue-100'
    : isDark
      ? 'text-slate-400'
      : 'text-slate-500';

  return (
    <div className={`inline-flex items-center space-x-2.5 select-none ${className}`}>
      <SkillConnectIcon size={currentIconSize} />
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline">
          <span
            className={`font-bold tracking-tight ${mainTextColor} ${
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
            className={`font-extrabold ${dotPkColor} ${
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
          <span
            className={`font-semibold uppercase tracking-wider ${subtitleColor} ${
              size === 'sm'
                ? 'text-[8.5px]'
                : size === 'md'
                ? 'text-[9.5px]'
                : 'text-[11px]'
            }`}
          >
            Pakistan Services Network
          </span>
        )}
      </div>
    </div>
  );
}
