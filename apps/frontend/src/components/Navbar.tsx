'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Search, ShieldCheck, Menu, X, Sparkles } from 'lucide-react';
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
    <nav className="sticky top-0 z-50 bg-blue-900 border-b border-blue-600 transition-colors shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center">
              <SkillConnectLogo variant="compact" size="md" className="text-white" />
            </Link>

            {/* City Selector */}
            <div className="hidden md:flex items-center pl-2">
              <CitySearchSelect
                compact
                value={selectedCity}
                onChange={setSelectedCity}
              />
            </div>
          </div>

          {/* Search Quick Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <form onSubmit={handleNavSearch} className="relative w-full">
              <input
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                placeholder="Search electricians, plumbers, AC repair in PKR..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-white text-slate-900 placeholder-slate-500 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
              <button type="submit" className="absolute left-3.5 top-2.5 text-slate-400 hover:text-white">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Navigation & Controls */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            <Link
              href="/ai-hub"
              id="nav-aihub-link"
              aria-current={isAiHubActive ? 'page' : undefined}
              className={`group relative text-sm font-bold flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                isAiHubActive
                  ? 'text-slate-100 dark:text-slate-100 bg-blue-50 dark:bg-blue-50 border border-blue-200 dark:border-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.18)] hover:bg-blue-100/70 dark:hover:bg-blue-900/40'
                  : 'text-blue-100 hover:text-white bg-blue-600/60 border border-blue-600/60 hover:border-blue-600 hover:bg-blue-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-slate-100 dark:text-slate-100" />
              <span>AI Career Hub</span>
              {isAiHubActive && (
                <span className="absolute bottom-0.5 left-3.5 right-3.5 h-[2px] bg-blue-900 dark:bg-blue-50 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.7)] pointer-events-none transition-opacity duration-200" />
              )}
            </Link>
            <Link
              href="/services"
              id="nav-services-link"
              aria-current={isServicesActive ? 'page' : undefined}
              className={`group relative text-sm px-3.5 py-1.5 rounded-xl transition-all duration-200 ease-out inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                isServicesActive
                  ? 'font-bold text-white bg-blue-600 border border-blue-600 shadow-md'
                  : 'font-medium text-blue-100 hover:text-white hover:bg-blue-700/80'
              }`}
            >
              <span>Services</span>
              {isServicesActive && (
                <span className="absolute bottom-0.5 left-3 right-3 h-[2px] bg-blue-900 dark:bg-blue-50 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.7)] pointer-events-none transition-opacity duration-200" />
              )}
            </Link>
            <Link
              href="/search"
              id="nav-search-link"
              aria-current={isSearchActive ? 'page' : undefined}
              className={`group relative text-sm px-3.5 py-1.5 rounded-xl transition-all duration-200 ease-out inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                isSearchActive
                  ? 'font-bold text-white bg-blue-600 border border-blue-600 shadow-md'
                  : 'font-medium text-blue-100 hover:text-white hover:bg-blue-700/80'
              }`}
            >
              <span>Find Workers</span>
              {isSearchActive && (
                <span className="absolute bottom-0.5 left-3 right-3 h-[2px] bg-blue-900 dark:bg-blue-50 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.7)] pointer-events-none transition-opacity duration-200" />
              )}
            </Link>
            <Link
              href="/dashboard/customer"
              id="nav-dashboard-link"
              aria-current={isDashboardActive ? 'page' : undefined}
              className={`group relative text-sm px-3.5 py-1.5 rounded-xl transition-all duration-200 ease-out inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                isDashboardActive
                  ? 'font-bold text-white bg-blue-600 border border-blue-600 shadow-md'
                  : 'font-medium text-blue-100 hover:text-white hover:bg-blue-700/80'
              }`}
            >
              <span>Dashboard</span>
              {isDashboardActive && (
                <span className="absolute bottom-0.5 left-3 right-3 h-[2px] bg-blue-900 dark:bg-blue-50 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.7)] pointer-events-none transition-opacity duration-200" />
              )}
            </Link>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-blue-800 hover:bg-blue-700 text-blue-100 hover:text-white transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Login / Join CTA */}
            <Link
              href="/login"
              className="text-sm font-semibold text-blue-100 hover:text-white px-3 py-2"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md shadow-blue-600/20 transition-all"
            >
              Become a Provider
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-blue-800 hover:bg-blue-700 text-blue-100"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-blue-800 hover:bg-blue-700 text-blue-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-blue-700 bg-blue-900 backdrop-blur-lg px-4 pt-2 pb-6 space-y-2">
          <Link
            href="/ai-hub"
            id="mobile-nav-aihub-link"
            onClick={() => setMobileMenuOpen(false)}
            aria-current={isAiHubActive ? 'page' : undefined}
            className={`block font-bold py-2.5 px-3.5 rounded-xl flex items-center justify-between transition-all duration-200 ${
              isAiHubActive
                ? 'text-slate-100 bg-blue-900/60 border border-blue-600/40 shadow-sm shadow-blue-600/30'
                : 'text-slate-100 hover:text-white hover:bg-slate-100/50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-slate-100" />
              <span>AI Career Hub</span>
            </div>
            {isAiHubActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
            )}
          </Link>
          <Link
            href="/services"
            id="mobile-nav-services-link"
            onClick={() => setMobileMenuOpen(false)}
            aria-current={isServicesActive ? 'page' : undefined}
            className={`block py-2.5 px-3.5 rounded-xl transition-all duration-200 flex items-center justify-between ${
              isServicesActive
                ? 'font-bold text-slate-100 bg-blue-900/60 border border-blue-600/40 shadow-sm shadow-blue-600/30'
                : 'font-medium text-slate-300 hover:text-white hover:bg-slate-100/50'
            }`}
          >
            <span>Services</span>
            {isServicesActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
            )}
          </Link>
          <Link
            href="/search"
            id="mobile-nav-search-link"
            onClick={() => setMobileMenuOpen(false)}
            aria-current={isSearchActive ? 'page' : undefined}
            className={`block py-2.5 px-3.5 rounded-xl transition-all duration-200 flex items-center justify-between ${
              isSearchActive
                ? 'font-bold text-slate-100 bg-blue-900/60 border border-blue-600/40 shadow-sm shadow-blue-600/30'
                : 'font-medium text-slate-300 hover:text-white hover:bg-slate-100/50'
            }`}
          >
            <span>Find Workers</span>
            {isSearchActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
            )}
          </Link>
          <Link
            href="/dashboard/customer"
            id="mobile-nav-dashboard-link"
            onClick={() => setMobileMenuOpen(false)}
            aria-current={isDashboardActive ? 'page' : undefined}
            className={`block py-2.5 px-3.5 rounded-xl transition-all duration-200 flex items-center justify-between ${
              isDashboardActive
                ? 'font-bold text-slate-100 bg-blue-900/60 border border-blue-600/40 shadow-sm shadow-blue-600/30'
                : 'font-medium text-slate-300 hover:text-white hover:bg-slate-100/50'
            }`}
          >
            <span>Dashboard</span>
            {isDashboardActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
            )}
          </Link>
          <div className="pt-2 flex flex-col space-y-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg border border-slate-400 text-slate-100 font-medium hover:bg-blue-800 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-colors"
            >
              Register as Provider
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
