'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { CATEGORIES, SAMPLE_SERVICES, PAKISTAN_CITIES } from '@/lib/mockData';
import CitySearchSelect from '@/components/CitySearchSelect';
import { ServiceItem } from '@/lib/types';
import {
  Search,
  MapPin,
  CheckCircle2,
  Star,
  X,
  Filter,
  Sparkles,
  ArrowRight,
  Laptop,
  TrendingUp,
  Video,
  GraduationCap,
  Wrench,
  Hammer,
  Car,
  Briefcase,
  Sprout,
  LucideIcon,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'technology-it': Laptop,
  'digital-marketing': TrendingUp,
  'media-creative': Video,
  'education-tutoring': GraduationCap,
  'home-repair': Wrench,
  'construction-trades': Hammer,
  'automotive': Car,
  'personal-lifestyle': Sparkles,
  'business-legal': Briefcase,
  'agriculture-gardening': Sprout,
};

function ServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const initialCat = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [selectedCity, setSelectedCity] = useState('Karachi');
  const [serviceLocation, setServiceLocation] = useState('Karachi');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [bookingConfirmedCode, setBookingConfirmedCode] = useState<string | null>(null);
  const [bookingAddress, setBookingAddress] = useState('');
  const [bookingPhone, setBookingPhone] = useState('+923001234567');

  const resultsSectionRef = useRef<HTMLElement>(null);
  const shouldScrollRef = useRef<boolean>(false);
  const isInitialMount = useRef<boolean>(true);

  const scrollToResults = (smooth = true) => {
    if (typeof window === 'undefined') return;

    requestAnimationFrame(() => {
      const el = resultsSectionRef.current || document.getElementById('service-results');
      if (!el) return;

      const navbarOffset = 90;
      const elementTop = el.getBoundingClientRect().top;
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
      const targetScrollY = Math.max(0, elementTop + currentScrollY - navbarOffset);

      window.scrollTo({
        top: targetScrollY,
        behavior: smooth ? 'smooth' : 'auto',
      });
    });
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const initialCatParam = searchParams.get('category');
      if (initialCatParam && initialCatParam !== 'all') {
        const timer = setTimeout(() => {
          scrollToResults(true);
        }, 200);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const currentParams = new URLSearchParams(window.location.search);
      const cat = currentParams.get('category') || 'all';
      shouldScrollRef.current = true;
      setSelectedCategory(cat);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    if (cat !== selectedCategory) {
      shouldScrollRef.current = true;
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    if (shouldScrollRef.current) {
      shouldScrollRef.current = false;
      const timer = setTimeout(() => {
        scrollToResults(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [selectedCategory]);

  useEffect(() => {
    setServiceLocation(selectedCity);
  }, [selectedCity]);

  const handleCategorySelect = (categorySlug: string) => {
    const nextCat = categorySlug === selectedCategory ? 'all' : categorySlug;

    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : searchParams.toString());
    if (nextCat && nextCat !== 'all') {
      params.set('category', nextCat);
    } else {
      params.delete('category');
    }
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    if (typeof window !== 'undefined') {
      window.history.pushState({ category: nextCat }, '', newUrl);
    }

    shouldScrollRef.current = true;
    if (nextCat !== selectedCategory) {
      setSelectedCategory(nextCat);
    } else {
      setTimeout(() => {
        scrollToResults(true);
      }, 50);
    }
  };

  const filteredServices = SAMPLE_SERVICES.filter((srv) => {
    const matchesCat = selectedCategory === 'all' || srv.category.slug === selectedCategory;
    const matchesSearch =
      srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.category.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeCategoryObj = CATEGORIES.find((c) => c.slug === selectedCategory);

  const handleBook = (service: ServiceItem) => {
    setSelectedService(service);
    setBookingConfirmedCode(null);
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `SCPK-${Math.floor(10000 + Math.random() * 90000)}`;
    setBookingConfirmedCode(code);

    try {
      const newBooking = {
        id: `book-${Date.now()}`,
        bookingCode: code,
        serviceId: selectedService?.id,
        service: selectedService,
        address: bookingAddress || `${serviceLocation}, Pakistan`,
        phone: bookingPhone,
        scheduledAt: new Date().toISOString(),
        totalAmount: selectedService?.basePrice || 2500,
        providerEarning: Math.round((selectedService?.basePrice || 2500) * 0.85),
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod: 'COD',
        provider: {
          profile: { firstName: 'Tariq', lastName: 'Mehmood' },
          cnicNumber: '42101-1234567-1',
          isVerified: true,
        },
        createdAt: new Date().toISOString(),
      };
      const existing = JSON.parse(localStorage.getItem('skillconnect_user_bookings') || '[]');
      localStorage.setItem('skillconnect_user_bookings', JSON.stringify([newBooking, ...existing]));
    } catch {
      // Storage error fallback
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Skilled Services <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Directory</span>
        </h1>
        <p className="text-xs text-slate-400">
          Transparent fixed rates, NADRA CNIC verified artisans & technicians across Pakistan
        </p>
      </div>

      {/* Filter Controls with Location & Service Location */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0a1024]/85 border border-cyan-500/20 shadow-[0_4px_25px_rgba(0,0,0,0.4)] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <div className="relative">
            <label className="block text-xs font-medium text-slate-300 mb-1">Search Keywords</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Filter by title, electrical..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-cyan-500/20 bg-[#050814] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
            <div className="flex items-center space-x-2 bg-[#050814] px-3 py-2.5 rounded-xl border border-cyan-500/20 text-xs">
              <Filter className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategorySelect(e.target.value)}
                className="bg-transparent font-medium cursor-pointer focus:outline-none text-white w-full"
              >
                <option value="all" className="bg-[#0a1024] text-white">All Categories ({SAMPLE_SERVICES.length})</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.slug} className="bg-[#0a1024] text-white">
                    {cat.name} ({SAMPLE_SERVICES.filter((s) => s.category.slug === cat.slug).length})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
            <CitySearchSelect
              value={selectedCity}
              onChange={setSelectedCity}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Service Location</label>
            <CitySearchSelect
              value={serviceLocation}
              onChange={setServiceLocation}
            />
            <p className="text-[10px] text-cyan-400 font-medium mt-1.5 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Synced with Location</span>
            </p>
          </div>
        </div>
      </div>

      {/* SERVICE CATEGORIES CARDS SECTION */}
      <section className="space-y-4 relative z-10" id="service-categories-section">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>Categories</span>
              {selectedCategory !== 'all' && (
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                  {activeCategoryObj?.name || selectedCategory}
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">
              Select any category to filter verified service listings
            </p>
          </div>
          {selectedCategory !== 'all' && (
            <button
              id="reset-category-btn"
              type="button"
              onClick={() => handleCategorySelect('all')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset to All</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            const count = SAMPLE_SERVICES.filter((s) => s.category.slug === cat.slug).length;
            const Icon = CATEGORY_ICONS[cat.slug] || Sparkles;
            return (
              <button
                key={cat.id}
                id={`cat-card-${cat.slug}`}
                type="button"
                aria-pressed={isSelected}
                aria-label={`Filter by ${cat.name}, ${count} services available`}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`group p-4 rounded-2xl border text-left flex flex-col justify-between space-y-3 cursor-pointer relative transition-all duration-200 ease-out hover:-translate-y-1 active:translate-y-0 ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/50 ring-1 ring-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.3)]'
                    : 'border-cyan-500/15 bg-[#0a1024]/80 hover:border-cyan-400/50 hover:bg-[#0e1736] shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black shadow-md'
                        : 'bg-[#050814] border border-cyan-500/20 text-cyan-400 group-hover:scale-105'
                    }`}
                  >
                    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  </div>
                  <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/30">
                    {count}
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-start">
                  <h3 className="font-bold text-sm tracking-tight text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] font-medium text-cyan-400">
                  <span>{isSelected ? 'Active Filter' : 'Filter by Category'}</span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isSelected ? 'translate-x-0.5' : 'group-hover:translate-x-1'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* FILTERED SERVICES RESULTS SECTION */}
      <section
        id="service-results"
        ref={resultsSectionRef}
        className="space-y-6 pt-2 scroll-mt-24"
      >
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <p>
            Showing <span className="font-bold text-white font-mono">{filteredServices.length}</span>{' '}
            {selectedCategory !== 'all' ? (
              <>
                services for{' '}
                <span className="font-bold text-cyan-300">
                  {activeCategoryObj?.name || selectedCategory}
                </span>
              </>
            ) : (
              'available services'
            )}
            {searchQuery ? ` matching "${searchQuery}"` : ''}
          </p>

          {selectedCategory !== 'all' && (
            <button
              onClick={() => handleCategorySelect('all')}
              className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline cursor-pointer"
            >
              Show All Categories
            </button>
          )}
        </div>

        {filteredServices.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-cyan-500/20 bg-[#0a1024]/80 space-y-3">
            <p className="text-base font-bold text-white">No services found</p>
            <p className="text-xs text-slate-400">
              No verified services match your current filters. Try resetting the category or search keyword.
            </p>
            <button
              onClick={() => {
                handleCategorySelect('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div key={selectedCategory} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border border-cyan-500/20 bg-[#0a1024]/80 p-6 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(0,242,254,0.15)] transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                      {service.category.name}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      ~{service.durationMinutes} mins
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>

                  <div className="flex items-center space-x-3 pt-3 border-t border-slate-800">
                    <img
                      src={service.provider.user?.avatarUrl}
                      alt={service.provider.user?.profile?.firstName}
                      className="w-8 h-8 rounded-full object-cover border border-cyan-400"
                    />
                    <div>
                      <p className="text-xs font-bold text-white flex items-center space-x-1">
                        <span>
                          {service.provider.user?.profile?.firstName}{' '}
                          {service.provider.user?.profile?.lastName}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      </p>
                      <p className="text-[10px] text-slate-400">
                        CNIC Verified | {selectedCity}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Estimated Fee</span>
                    <span className="text-lg font-bold font-mono text-cyan-300">
                      PKR {service.basePrice.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleBook(service)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs cursor-pointer shadow-[0_0_12px_rgba(0,242,254,0.3)] transition-all"
                  >
                    Book Visit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Booking Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-[#050814]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a1024] border border-cyan-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-[0_0_50px_rgba(0,242,254,0.25)] relative">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!bookingConfirmedCode ? (
              <form onSubmit={handleConfirm} className="space-y-4">
                <h3 className="text-lg font-bold text-white">
                  Confirm Service Visit
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedService.title} in {selectedCity}
                </p>

                <div className="p-3 bg-[#050814] border border-cyan-500/20 rounded-xl text-xs space-y-1">
                  <p className="font-semibold text-white">
                    Technician: {selectedService.provider.user?.profile?.firstName}{' '}
                    {selectedService.provider.user?.profile?.lastName}
                  </p>
                  <p className="text-cyan-300 font-mono font-bold">
                    Rate: PKR {selectedService.basePrice.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium mb-1 text-slate-300">Your Street Address ({serviceLocation})</label>
                    <input
                      type="text"
                      required
                      value={bookingAddress}
                      onChange={(e) => setBookingAddress(e.target.value)}
                      placeholder="e.g. House 14, Street 8, Block 4"
                      className="w-full p-2.5 rounded-xl border border-cyan-500/20 bg-[#050814] text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-slate-300">Phone Number for WhatsApp / SMS</label>
                    <input
                      type="text"
                      required
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full p-2.5 rounded-xl border border-cyan-500/20 bg-[#050814] text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-[0_0_15px_rgba(0,242,254,0.35)]"
                >
                  Book Instant Visit
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-2">
                <div className="w-12 h-12 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(0,242,254,0.3)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-white">Visit Scheduled!</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Booking Code: <span className="font-mono font-bold text-cyan-300">{bookingConfirmedCode}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/dashboard/customer"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 text-xs font-bold text-center transition-colors shadow-md"
                  >
                    View in Dashboard
                  </Link>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-cyan-300">Loading Services Directory...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
