'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, ChevronDown, Check, X, Sparkles } from 'lucide-react';
import { PAKISTAN_CITIES, POPULAR_CITIES } from '@/lib/citiesData';

interface CitySearchSelectProps {
  value: string;
  onChange: (city: string) => void;
  className?: string;
  buttonClassName?: string;
  placeholder?: string;
  compact?: boolean;
}

export default function CitySearchSelect({
  value,
  onChange,
  className = '',
  buttonClassName = '',
  placeholder = 'Select City',
  compact = false,
}: CitySearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredCities = PAKISTAN_CITIES.filter((city) =>
    city.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  const handleSelectCity = (city: string) => {
    onChange(city);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1.5 transition-all text-slate-900 dark:text-white ${
          compact
            ? 'px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:border-emerald-500/50'
            : 'w-full px-3.5 py-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-semibold justify-between hover:border-emerald-500/50 shadow-sm'
        } ${buttonClassName}`}
      >
        <div className="flex items-center space-x-2 truncate">
          <MapPin className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-emerald-500 flex-shrink-0`} />
          <span className="truncate">{value || placeholder}</span>
        </div>
        <ChevronDown
          className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-slate-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-fadeIn space-y-2 p-3">
          {/* Search Bar Header */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search major city in Pakistan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Popular Cities Pills (Shown when no search query active) */}
          {!searchQuery && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                <span className="flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  <span>Popular Cities</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_CITIES.map((popCity) => {
                  const isSelected = value === popCity;
                  return (
                    <button
                      key={popCity}
                      type="button"
                      onClick={() => handleSelectCity(popCity)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-sm font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 dark:hover:text-emerald-400'
                      }`}
                    >
                      {popCity}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Scrollable City List */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 py-1">
              <span>All Cities ({filteredCities.length})</span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-0.5 custom-scrollbar pr-1">
              {filteredCities.length > 0 ? (
                filteredCities.map((cityName) => {
                  const isSelected = value === cityName;
                  return (
                    <button
                      key={cityName}
                      type="button"
                      onClick={() => handleSelectCity(cityName)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-left transition-colors ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{cityName}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                    </button>
                  );
                })
              ) : (
                <div className="py-4 text-center text-xs text-slate-400">
                  No city matching &quot;{searchQuery}&quot; found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
