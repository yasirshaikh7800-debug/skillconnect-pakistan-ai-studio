'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Search, Menu, X, Sparkles, ArrowRight } from 'lucide-react';
import CitySearchSelect from '@/components/CitySearchSelect';
import SkillConnectLogo from '@/components/SkillConnectLogo';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname() || '';
  const { theme, toggleTheme } = useTheme();
  const [selectedCity, setSelectedCity] = useState('Karachi');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  const isServicesActive = pathname === '/services' || pathname.startsWith('/services/');
  const isSearchActive = pathname === '/search' || pathname.startsWith('/search/');
  const isDashboardActive = pathname.startsWith('/dashboard');
  const isAiHubActive = pathname === '/ai-hub' || pathname.startsWith('/ai-hub/');

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      router.push(`/search?q=${encodeURIComponent(navSearch.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#050814]/85 backdrop-blur-xl border-b border-cyan-500/15 shadow-[0_4px_30px_rgba(0,0,0,0.6)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & City Selector */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center group">
              <SkillConnectLogo variant="compact" size="md" />
            </Link>

            {/* City Selector */}
            <div className="hidden xl:flex items-center pl-2 border-l border-slate-800">
              <CitySearchSelect
                compact
                value={selectedCity}
                onChange={setSelectedCity}
              />
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-sm mx-6">
            <form onSubmit={handleNavSearch} className="relative w-full">
              <input
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                placeholder="Search electricians, plumbers, AC..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-[#0a1024]/90 text-slate-100 placeholder-slate-400 border border-cyan-500/20 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute left-3 top-2.5 text-slate-400 hover:text-cyan-400 transition-colors"
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Clean Navigation Links & Actions */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              href="/ai-hub"
              id="nav-aihub-link"
              aria-current={isAiHubActive ? 'page' : undefined}
              className={`relative text-xs font-semibold flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-all ${
                isAiHubActive
                  ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                  : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-900/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>AI Hub</span>
              {isAiHubActive && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_8px_#00f2fe]" />
              )}
            </Link>

            <Link
              href="/services"
              id="nav-services-link"
              aria-current={isServicesActive ? 'page' : undefined}
              className={`relative text-xs font-medium px-3 py-2 rounded-lg transition-all ${
                isServicesActive
                  ? 'text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <span>Services</span>
              {isServicesActive && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_8px_#00f2fe]" />
              )}
            </Link>

            <Link
              href="/search"
              id="nav-search-link"
              aria-current={isSearchActive ? 'page' : undefined}
              className={`relative text-xs font-medium px-3 py-2 rounded-lg transition-all ${
                isSearchActive
                  ? 'text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <span>Find Workers</span>
              {isSearchActive && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_8px_#00f2fe]" />
              )}
            </Link>

            <Link
              href="/dashboard/customer"
              id="nav-dashboard-link"
              aria-current={isDashboardActive ? 'page' : undefined}
              className={`relative text-xs font-medium px-3 py-2 rounded-lg transition-all ${
                isDashboardActive
                  ? 'text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <span>Dashboard</span>
              {isDashboardActive && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_8px_#00f2fe]" />
              )}
            </Link>

            {/* Subtle Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-900/60 transition-colors"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-cyan-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Auth Link */}
            <Link
              href="/login"
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
            >
              Log In
            </Link>

            {/* Glowing Cyan Get Started Button */}
            <Link
              href="/register"
              className="group relative inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-slate-950 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400 shadow-[0_0_20px_rgba(0,242,254,0.35)] hover:shadow-[0_0_28px_rgba(0,242,254,0.55)] hover:brightness-105 active:scale-[0.98] transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-400"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-cyan-500/20 bg-[#050814]/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2.5">
          <Link
            href="/ai-hub"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2.5 px-3.5 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-500/20"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI Career Hub</span>
            </div>
          </Link>
          <Link
            href="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 text-xs font-medium text-slate-200 hover:text-cyan-300"
          >
            Services
          </Link>
          <Link
            href="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 text-xs font-medium text-slate-200 hover:text-cyan-300"
          >
            Find Workers
          </Link>
          <Link
            href="/dashboard/customer"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 text-xs font-medium text-slate-200 hover:text-cyan-300"
          >
            Dashboard
          </Link>
          <div className="pt-2 flex flex-col space-y-2 border-t border-slate-800">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 rounded-lg border border-slate-700 text-xs font-medium text-slate-200 hover:bg-slate-900"
            >
              Log In
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(0,242,254,0.3)]"
            >
              Get Started · Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
