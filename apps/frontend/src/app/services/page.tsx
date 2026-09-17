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

  // Smoothly scroll to the filtered service results section
  const scrollToResults = (smooth = true) => {
    if (typeof window === 'undefined') return;

    requestAnimationFrame(() => {
      const el = resultsSectionRef.current || document.getElementById('service-results');
      if (!el) return;

      // Account for fixed/sticky navbar (64px) + comfortable clearance (20px) = 84px
      const navbarOffset = 84;
      const elementTop = el.getBoundingClientRect().top;
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
      const targetScrollY = Math.max(0, elementTop + currentScrollY - navbarOffset);

      window.scrollTo({
        top: targetScrollY,
        behavior: smooth ? 'smooth' : 'auto',
      });
    });
  };

  // If page is loaded directly with a category URL query parameter, scroll to results after mount
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

  // Listen for browser Back/Forward navigation to synchronize category and scroll
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

  // Synchronize category state whenever URL searchParams change (handles external navigation)
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    if (cat !== selectedCategory) {
      shouldScrollRef.current = true;
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Trigger smooth scroll after filtered results state is committed and DOM is rendered
  useEffect(() => {
    if (shouldScrollRef.current) {
      shouldScrollRef.current = false;
      const timer = setTimeout(() => {
        scrollToResults(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [selectedCategory]);

  // Automatically sync Service Location when top Location changes
  useEffect(() => {
    setServiceLocation(selectedCity);
  }, [selectedCity]);

  const handleCategorySelect = (categorySlug: string) => {
    const nextCat = categorySlug === selectedCategory ? 'all' : categorySlug;

    // 1. Update URL query parameter cleanly without triggering Next.js navigation scroll-to-top reset
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

    // 2. Set scroll flag and trigger state update for immediate filtering
    shouldScrollRef.current = true;
    if (nextCat !== selectedCategory) {
      setSelectedCategory(nextCat);
    } else {
      // If toggling or re-selecting same category, scroll to results immediately
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
      // Ignore storage errors in restricted contexts
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Skilled Services Directory
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Upfront fixed prices, CNIC verified home artisans & technicians across Pakistan
        </p>
      </div>

      {/* Filter Controls with Location & Service Location */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Filter by title, electrical..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
            <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategorySelect(e.target.value)}
                className="bg-transparent font-semibold cursor-pointer focus:outline-none text-slate-900 dark:text-white w-full"
              >
                <option value="all" className="dark:bg-slate-900">All Categories ({SAMPLE_SERVICES.length})</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.slug} className="dark:bg-slate-900">
                    {cat.name} ({SAMPLE_SERVICES.filter((s) => s.category.slug === cat.slug).length})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location</label>
            <CitySearchSelect
              value={selectedCity}
              onChange={setSelectedCity}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Service Location</label>
            <CitySearchSelect
              value={serviceLocation}
              onChange={setServiceLocation}
            />
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-1 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Automatically filled from Location</span>
            </p>
          </div>
        </div>
      </div>

      {/* SERVICE CATEGORIES CARDS SECTION */}
      <section className="space-y-4 relative z-10" id="service-categories-section">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <span>Service Categories</span>
              {selectedCategory !== 'all' && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-600/30">
                  {activeCategoryObj?.name || selectedCategory}
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any category card to view its verified services
            </p>
          </div>
          {selectedCategory !== 'all' && (
            <button
              id="reset-category-btn"
              type="button"
              onClick={() => handleCategorySelect('all')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center space-x-1"
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
                className={`group p-4 rounded-2xl border text-left flex flex-col justify-between space-y-3 cursor-pointer pointer-events-auto relative transition-all duration-200 ease-out hover:-translate-y-1 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 ring-2 ring-blue-600/40 shadow-lg shadow-blue-600/10'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-600/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-sm hover:shadow-md hover:shadow-blue-600/20'
                }`}
              >
                {/* Header: Icon & Counter Badge */}
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'bg-blue-600 text-white font-black shadow-md shadow-blue-600/30 scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 group-hover:scale-105 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60'
                    }`}
                  >
                    <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white font-black shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                    }`}
                  >
                    {count}
                  </span>
                </div>

                {/* Content: Title & Description */}
                <div className="flex-1 flex flex-col justify-start">
                  <h3
                    className={`font-bold text-sm tracking-tight transition-colors line-clamp-1 ${
                      isSelected
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                    }`}
                  >
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Footer: Subtle visual affordance */}
                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  <span>{isSelected ? 'Active Filter' : 'Explore Category'}</span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
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
        {/* Active Results Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
          <p>
            Showing <span className="font-bold text-slate-900 dark:text-white">{filteredServices.length}</span>{' '}
            {selectedCategory !== 'all' ? (
              <>
                services for{' '}
                <span className="font-bold text-blue-600 dark:text-blue-400">
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
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
            >
              Show All Categories
            </button>
          )}
        </div>

        {/* Services List */}
        {filteredServices.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <p className="text-base font-bold text-slate-900 dark:text-white">No services found</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No verified services match your current filters. Try resetting the category or search keyword.
            </p>
            <button
              onClick={() => {
                handleCategorySelect('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div key={selectedCategory} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                      {service.category.name}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                      ~{service.durationMinutes} mins
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>

                  {/* Provider info */}
                  <div className="flex items-center space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <img
                      src={service.provider.user?.avatarUrl}
                      alt={service.provider.user?.profile?.firstName}
                      className="w-8 h-8 rounded-full object-cover border border-blue-600"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-200 flex items-center space-x-1">
                        <span>
                          {service.provider.user?.profile?.firstName}{' '}
                          {service.provider.user?.profile?.lastName}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        CNIC Verified | {selectedCity}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Estimated Fee</span>
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      PKR {service.basePrice.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleBook(service)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!bookingConfirmedCode ? (
              <form onSubmit={handleConfirm} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Confirm Service Visit
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedService.title} in {selectedCity}
                </p>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs space-y-1">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Technician: {selectedService.provider.user?.profile?.firstName}{' '}
                    {selectedService.provider.user?.profile?.lastName}
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 font-bold">
                    Rate: PKR {selectedService.basePrice.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Your Street Address ({serviceLocation})</label>
                    <input
                      type="text"
                      required
                      value={bookingAddress}
                      onChange={(e) => setBookingAddress(e.target.value)}
                      placeholder="e.g. House 14, Street 8, Block 4"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Phone Number for WhatsApp / SMS</label>
                    <input
                      type="text"
                      required
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Book Instant Visit
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-2">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-slate-900 dark:text-white">Visit Scheduled!</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Booking Code: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{bookingConfirmedCode}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/dashboard/customer"
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center transition-colors"
                  >
                    View in Dashboard
                  </Link>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
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
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading Services Directory...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
