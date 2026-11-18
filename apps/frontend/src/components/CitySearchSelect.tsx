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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        className={`flex items-center space-x-2 transition-all text-white ${
          compact
            ? 'px-3 py-1.5 rounded-xl bg-[#0a1024] border border-cyan-500/25 text-xs font-medium hover:border-cyan-400 hover:text-cyan-300 cursor-pointer shadow-sm'
            : 'w-full px-3.5 py-2.5 rounded-xl bg-[#0a1024] border border-cyan-500/25 text-xs font-medium justify-between hover:border-cyan-400 hover:text-cyan-300 shadow-sm cursor-pointer'
        } ${buttonClassName}`}
      >
        <div className="flex items-center space-x-2 truncate">
          <MapPin className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-cyan-400 flex-shrink-0`} />
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
        <div className="absolute left-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#0a1024]/95 backdrop-blur-2xl border border-cyan-500/35 shadow-[0_12px_40px_rgba(0,0,0,0.7)] z-50 overflow-hidden animate-fadeIn space-y-2 p-3">
          {/* Search Bar Header */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search major city in Pakistan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-[#050814] text-white placeholder-slate-500 border border-cyan-500/25 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Popular Cities */}
          {!searchQuery && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400 px-1">
                <span className="flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Popular Hubs</span>
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
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,242,254,0.3)]'
                          : 'bg-[#050814] border border-cyan-500/15 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-300'
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
          <div className="border-t border-slate-800 pt-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-1 py-1">
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
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-bold'
                          : 'text-slate-300 hover:bg-[#0e1736] hover:text-white'
                      }`}
                    >
                      <span>{cityName}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
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
