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
  ChevronRight,
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
      // Storage error fallback
    }
  };

  const closeBookingModal = () => {
    setBookingService(null);
    setBookingSuccessCode(null);
    setBookingAddress('');
    setBookingDate('');
  };

  return (
    <div className="space-y-16 relative">
      {/* HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden bg-[#060c20]/90 border border-cyan-500/20 p-6 sm:p-10 lg:p-12 shadow-[0_0_60px_rgba(0,242,254,0.12)]">
        {/* Atmospheric Backdrops */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/15 via-blue-600/10 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* Left Column: Headings, Value Proposition & Search */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Trust Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#0a1024]/90 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide shadow-[0_0_15px_rgba(0,242,254,0.18)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Next-Gen Skills & Home Services Infrastructure</span>
            </div>

            {/* Futuristic Hero Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
              Connect Skills.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">
                Discover Opportunities.
              </span>{' '}
              Build Pakistan&apos;s Future.
            </h1>

            {/* Description */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Pakistan&apos;s leading AI-powered ecosystem connecting households and businesses with NADRA CNIC-verified electricians, plumbers, HVAC technicians, IT engineers, and creative artisans across 399 cities.
            </p>

            {/* Modern Action Buttons with Glowing Borders */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/services"
                className="group relative inline-flex items-center space-x-2 px-6 py-3 rounded-full text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400 shadow-[0_0_25px_rgba(0,242,254,0.45)] hover:shadow-[0_0_35px_rgba(0,242,254,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Briefcase className="w-4 h-4 text-slate-950" />
                <span>Hire Verified Artisans</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/ai-hub"
                className="group inline-flex items-center space-x-2 px-6 py-3 rounded-full text-xs font-bold text-cyan-300 bg-[#0a1024]/80 border border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-950/40 shadow-[0_0_18px_rgba(0,242,254,0.15)] hover:shadow-[0_0_25px_rgba(0,242,254,0.3)] transition-all"
              >
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                <span>AI Career Engine</span>
                <ChevronRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Futuristic Search & Location Toolbar */}
            <div className="bg-[#0a1024]/90 backdrop-blur-xl p-2.5 sm:p-3 rounded-2xl border border-cyan-500/25 shadow-[0_8px_30px_rgba(0,0,0,0.5)] space-y-3 sm:space-y-0 sm:flex sm:items-center sm:space-x-3 mt-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search 100+ services (AC Jet Wash, Electrician, Solar)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#050814] text-white placeholder-slate-400 border border-cyan-500/20 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all"
                />
              </div>

              <CitySearchSelect
                value={selectedCity}
                onChange={setSelectedCity}
              />

              <Link
                href={`/services?city=${encodeURIComponent(selectedCity)}&q=${encodeURIComponent(searchQuery)}`}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-[0_0_18px_rgba(0,242,254,0.35)] transition-all text-center flex items-center justify-center space-x-1.5"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Unboxed Metadata Trust Indicators */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-400">
              <div className="flex items-center space-x-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>NADRA CNIC Verified</span>
              </div>
              <span className="text-slate-600">·</span>
              <div className="flex items-center space-x-1.5 text-slate-300">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>399 Cities Covered</span>
              </div>
              <span className="text-slate-600">·</span>
              <div className="flex items-center space-x-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>JazzCash & EasyPaisa</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Spatial Canvas */}
          <div className="lg:col-span-5">
            <ThreeHero3D />
          </div>
        </div>
      </section>

      {/* AI CAREER STRIP */}
      <section className="relative">
        <AiCareerInsightsCard />
      </section>

      {/* STATS STRIP */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0a1024]/80 border border-cyan-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xl font-bold font-mono tabular-nums text-white">100+ Unique</p>
            <p className="text-xs text-slate-400">Skilled Services</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a1024]/80 border border-cyan-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xl font-bold font-mono tabular-nums text-white">4,500+</p>
            <p className="text-xs text-slate-400">CNIC Workers</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a1024]/80 border border-cyan-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xl font-bold font-mono tabular-nums text-white">4.9 / 5.0</p>
            <p className="text-xs text-slate-400">Average Rating</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a1024]/80 border border-cyan-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xl font-bold font-mono tabular-nums text-white">399 Cities</p>
            <p className="text-xs text-slate-400">Across 7 Regions</p>
          </div>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Service Categories
            </h2>
            <p className="text-xs text-slate-400">
              Browse skilled categories available in {selectedCity}
            </p>
          </div>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
                className={`group p-4 rounded-2xl border text-left flex flex-col justify-between space-y-3 cursor-pointer relative transition-all duration-200 ease-out hover:-translate-y-1 active:translate-y-0 ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.25)]'
                    : 'border-cyan-500/15 bg-[#0a1024]/75 hover:border-cyan-400/50 hover:bg-[#0e1736] shadow-sm hover:shadow-[0_0_20px_rgba(0,242,254,0.15)]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black shadow-md'
                        : 'bg-slate-900 border border-cyan-500/20 text-cyan-400 group-hover:scale-105 group-hover:border-cyan-400/50'
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
                  <span>Explore Services</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
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
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Top Popular Services in {selectedCity}
            </h2>
            <p className="text-xs text-slate-400">
              Transparent upfront PKR pricing with verified doorstep visit
            </p>
          </div>
          <Link
            href="/services"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline flex items-center space-x-1"
          >
            <span>View All Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="rounded-2xl border border-cyan-500/20 bg-[#0a1024]/80 p-6 shadow-sm hover:shadow-[0_0_25px_rgba(0,242,254,0.15)] hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                    {service.category.name}
                  </span>
                  <span className="flex items-center space-x-1 text-xs font-medium text-cyan-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>CNIC Verified</span>
                  </span>
                </div>

                <h3 className="font-bold text-base text-white">
                  {service.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {service.description}
                </p>

                {/* Provider info snippet */}
                <div className="flex items-center space-x-3 pt-3 border-t border-slate-800">
                  <img
                    src={service.provider.user?.avatarUrl}
                    alt="Provider Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-cyan-400"
                  />
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {service.provider.user?.profile?.firstName}{' '}
                      {service.provider.user?.profile?.lastName}
                    </p>
                    <div className="flex items-center space-x-1 text-[11px] text-amber-400 font-medium">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{service.provider.rating}</span>
                      <span className="text-slate-400">({service.provider.totalReviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Starting Rate</span>
                  <span className="text-lg font-bold font-mono text-cyan-300">
                    PKR {service.basePrice.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => setBookingService(service)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="p-8 sm:p-10 rounded-3xl bg-[#060c20]/90 border border-cyan-500/20 space-y-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            How SkillConnect Pakistan Works
          </h2>
          <p className="text-xs text-slate-400">
            A frictionless three-step process for secure, verified services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0a1024]/80 border border-cyan-500/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-base flex items-center justify-center shadow-md">
              1
            </div>
            <h3 className="font-bold text-sm text-white">Select Service & City</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Choose your required service in Karachi, Lahore, Islamabad, or any of 399 cities with upfront PKR pricing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0a1024]/80 border border-cyan-500/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-base flex items-center justify-center shadow-md">
              2
            </div>
            <h3 className="font-bold text-sm text-white">Assigned CNIC Artisan</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our matching engine routes your request to a NADRA CNIC-verified specialist with high customer ratings.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0a1024]/80 border border-cyan-500/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-base flex items-center justify-center shadow-md">
              3
            </div>
            <h3 className="font-bold text-sm text-white">Pay via JazzCash or Cash</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inspect the job and pay securely via JazzCash, EasyPaisa, or direct Cash on Delivery (COD).
            </p>
          </div>
        </div>
      </section>

      {/* BOOKING MODAL */}
      {bookingService && (
        <div className="fixed inset-0 z-50 bg-[#050814]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a1024] border border-cyan-500/40 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-[0_0_50px_rgba(0,242,254,0.25)] relative">
            <button
              onClick={closeBookingModal}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {!bookingSuccessCode ? (
              <form onSubmit={handleCreateBooking} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                    Quick Booking
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    {bookingService.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Assigned Technician:{' '}
                    <span className="font-semibold text-cyan-300">
                      {bookingService.provider.user?.profile?.firstName}{' '}
                      {bookingService.provider.user?.profile?.lastName} (CNIC Verified)
                    </span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#050814] border border-cyan-500/25 flex justify-between items-center text-sm">
                  <span className="text-xs font-medium text-slate-400">
                    Service Rate
                  </span>
                  <span className="font-mono font-bold text-cyan-300">
                    PKR {bookingService.basePrice.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">
                      Preferred Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-cyan-500/20 bg-[#050814] text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">
                      Location
                    </label>
                    <CitySearchSelect
                      value={selectedCity}
                      onChange={setSelectedCity}
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">
                      Service Location
                    </label>
                    <CitySearchSelect
                      value={serviceLocation}
                      onChange={setServiceLocation}
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">
                      Full Address in {serviceLocation}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. House 14, Street 9, DHA Phase 6"
                      value={bookingAddress}
                      onChange={(e) => setBookingAddress(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-cyan-500/20 bg-[#050814] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">
                      Payment Option
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('JAZZCASH')}
                        className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                          paymentMethod === 'JAZZCASH'
                            ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-[0_0_12px_rgba(0,242,254,0.25)]'
                            : 'border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        JazzCash
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('EASYPAISA')}
                        className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                          paymentMethod === 'EASYPAISA'
                            ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-[0_0_12px_rgba(0,242,254,0.25)]'
                            : 'border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        EasyPaisa
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('COD')}
                        className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                          paymentMethod === 'COD'
                            ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-[0_0_12px_rgba(0,242,254,0.25)]'
                            : 'border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Cash (COD)
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,242,254,0.35)] transition-all mt-4 cursor-pointer"
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
