'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CATEGORIES,
  SAMPLE_PROVIDERS,
  SAMPLE_SERVICES,
  PAKISTAN_CITIES,
} from '@/lib/mockData';
import CitySearchSelect from '@/components/CitySearchSelect';
import { ServiceItem } from '@/lib/types';
import AiCareerInsightsCard from '@/components/ai/AiCareerInsightsCard';
import AiAssistantDrawer from '@/components/ai/AiAssistantDrawer';
import {
  ShieldCheck,
  Search,
  MapPin,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  PhoneCall,
  ArrowRight,
  X,
  CreditCard,
  Building2,
  Users,
  Award,
  BrainCircuit,
  Briefcase,
  Laptop,
  TrendingUp,
  Video,
  GraduationCap,
  Wrench,
  Hammer,
  Car,
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

import dynamic from 'next/dynamic';

const ThreeHero3D = dynamic(() => import('@/components/ThreeHero3D'), { ssr: false });
const BookingSuccess3DModal = dynamic(() => import('@/components/BookingSuccess3DModal'), { ssr: false });

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Karachi');
  const [serviceLocation, setServiceLocation] = useState('Karachi');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Automatically update Service Location when top Location changes
  React.useEffect(() => {
    setServiceLocation(selectedCity);
  }, [selectedCity]);

  // Booking Modal State
  const [bookingService, setBookingService] = useState<ServiceItem | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingAddress, setBookingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'JAZZCASH' | 'EASYPAISA' | 'COD'>('JAZZCASH');
  const [bookingSuccessCode, setBookingSuccessCode] = useState<string | null>(null);

  const filteredServices = SAMPLE_SERVICES.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || service.category.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `SCPK-${Math.floor(10000 + Math.random() * 90000)}`;
    setBookingSuccessCode(code);

    try {
      const newBooking = {
        id: `book-${Date.now()}`,
        bookingCode: code,
        serviceId: bookingService?.id,
        service: bookingService,
        address: bookingAddress || `${serviceLocation}, Pakistan`,
        scheduledAt: bookingDate ? new Date(bookingDate).toISOString() : new Date().toISOString(),
        totalAmount: bookingService?.basePrice || 2500,
        providerEarning: Math.round((bookingService?.basePrice || 2500) * 0.85),
        status: 'PENDING',
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        paymentMethod: paymentMethod,
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

  const closeBookingModal = () => {
    setBookingService(null);
    setBookingSuccessCode(null);
    setBookingAddress('');
    setBookingDate('');
  };

  return (
    <div className="space-y-12 relative">
      {/* HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white p-8 sm:p-12 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/30 text-blue-600 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>AI-Powered Skill Matching & Verified Services</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Connect Skills. Discover Opportunities. <span className="text-blue-600">Build Your Future.</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Pakistan's leading AI-driven skills and home services platform. Match your career potential with Gemini AI or hire NADRA CNIC-verified electricians, plumbers, AC technicians & IT specialists across 399 Pakistani cities.
            </p>

            {/* ACTION BUTTONS & SEARCH BAR */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/search"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center space-x-2"
              >
                <Briefcase className="w-4 h-4" />
                <span>Find Opportunities</span>
              </Link>

              <Link
                href="/ai-hub"
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-blue-600 font-bold text-sm border border-blue-600/40 transition-all flex items-center space-x-2"
              >
                <BrainCircuit className="w-4 h-4 text-blue-600" />
                <span>Explore Skills</span>
              </Link>
            </div>

            {/* SEARCH & FILTER BAR */}
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-xl space-y-3 sm:space-y-0 sm:flex sm:items-center sm:space-x-3 mt-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search 100+ services (AC jet, Web Dev, Solar, Plumber)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl bg-white text-slate-900 placeholder-slate-500 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <CitySearchSelect
                value={selectedCity}
                onChange={setSelectedCity}
              />

              <Link
                href="/services"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all text-center flex items-center justify-center space-x-2"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* QUICK BADGES */}
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-300">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>100% CNIC Verified</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>399 Cities Covered</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>JazzCash & EasyPaisa Supported</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <ThreeHero3D />
          </div>
        </div>
      </section>

      {/* AI DASHBOARD FEATURED STRIP */}
      <section className="space-y-4">
        <AiCareerInsightsCard />
      </section>

      {/* STATS STRIP */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">100+ Unique</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Skilled Services</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">4,500+</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">CNIC Workers</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">4.9 / 5.0</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Average Rating</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">399 Cities</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Across 7 Provinces/Regions</p>
          </div>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Service Categories
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Browse skilled categories available in {selectedCity}
            </p>
          </div>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            const count = SAMPLE_SERVICES.filter((s) => s.category.slug === cat.slug).length;
            const Icon = CATEGORY_ICONS[cat.slug] || Sparkles;
            return (
              <Link
                key={cat.id}
                id={`cat-card-${cat.slug}`}
                href={`/services?category=${cat.slug}`}
                aria-label={`Explore ${cat.name}, ${count} services available`}
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
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-colors ${
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
                  <span>Explore Category</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURED SERVICES & QUICK BOOKING */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Top Popular Services in {selectedCity}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transparent upfront PKR pricing with verified home visit
            </p>
          </div>
          <Link
            href="/services"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
          >
            <span>View All Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                    {service.category.name}
                  </span>
                  <span className="flex items-center space-x-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>CNIC Verified</span>
                  </span>
                </div>

                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  {service.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {service.description}
                </p>

                {/* Provider info snippet */}
                <div className="flex items-center space-x-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <img
                    src={service.provider.user?.avatarUrl}
                    alt="Provider Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-blue-600"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-200">
                      {service.provider.user?.profile?.firstName}{' '}
                      {service.provider.user?.profile?.lastName}
                    </p>
                    <div className="flex items-center space-x-1 text-[11px] text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{service.provider.rating}</span>
                      <span className="text-slate-400">({service.provider.totalReviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 block">Starting From</span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    PKR {service.basePrice.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => setBookingService(service)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            How SkillConnect Pakistan Works
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Simple 3-step process to get verified professionals at your doorstep
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-extrabold text-lg flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Select Service & City</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Choose your required home repair service in Karachi, Lahore, Islamabad or Rawalpindi with transparent upfront rates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-extrabold text-lg flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Assigned CNIC Technician</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Our system matches you with a NADRA CNIC-verified artisan with top user ratings and nearby location.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-extrabold text-lg flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Pay via JazzCash or Cash</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Inspect the completed work and pay effortlessly using JazzCash, EasyPaisa, or Cash on Delivery (COD).
            </p>
          </div>
        </div>
      </section>

      {/* BOOKING MODAL */}
      {bookingService && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={closeBookingModal}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {!bookingSuccessCode ? (
              <form onSubmit={handleCreateBooking} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Quick Booking
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {bookingService.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Assigned Technician:{' '}
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {bookingService.provider.user?.profile?.firstName}{' '}
                      {bookingService.provider.user?.profile?.lastName} (CNIC Verified)
                    </span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Service Rate
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    PKR {bookingService.basePrice.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Preferred Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Location
                    </label>
                    <CitySearchSelect
                      value={selectedCity}
                      onChange={setSelectedCity}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Service Location
                    </label>
                    <CitySearchSelect
                      value={serviceLocation}
                      onChange={setServiceLocation}
                    />
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-1 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Automatically filled from Location</span>
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Address in {serviceLocation}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. House 14, Street 9, DHA Phase 6"
                      value={bookingAddress}
                      onChange={(e) => setBookingAddress(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Payment Option
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('JAZZCASH')}
                        className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                          paymentMethod === 'JAZZCASH'
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                            : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        JazzCash
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('EASYPAISA')}
                        className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                          paymentMethod === 'EASYPAISA'
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                            : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        EasyPaisa
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('COD')}
                        className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                          paymentMethod === 'COD'
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                            : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        Cash (COD)
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all mt-4"
                >
                  Confirm Booking (PKR {bookingService.basePrice.toLocaleString()})
                </button>
              </form>
            ) : (
              <BookingSuccess3DModal
                bookingCode={bookingSuccessCode}
                serviceTitle={bookingService.title}
                onClose={closeBookingModal}
              />
            )}
          </div>
        </div>
      )}

      {/* FLOATING AI ASSISTANT */}
      <AiAssistantDrawer />
    </div>
  );
}
