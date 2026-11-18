'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { SAMPLE_SERVICES, CATEGORIES, PAKISTAN_CITIES } from '@/lib/mockData';
import { ServiceItem } from '@/lib/types';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Star,
  Clock,
  MapPin,
  Calendar,
  CreditCard,
  Sparkles,
  Phone,
  Award,
  AlertTriangle,
  ChevronRight,
  X,
  Share2,
  Check,
  Shield,
  Zap,
  DollarSign,
} from 'lucide-react';

interface ServiceDetailPageProps {
  params?: Promise<{ id: string }>;
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const router = useRouter();
  const routeParams = useParams();

  let resolvedId = '';
  if (params) {
    try {
      const unwrapped = use(params);
      if (unwrapped?.id) {
        resolvedId = unwrapped.id;
      }
    } catch {
      // Fallback to useParams
    }
  }

  if (!resolvedId && routeParams?.id) {
    resolvedId = Array.isArray(routeParams.id) ? routeParams.id[0] : routeParams.id;
  }

  const service: ServiceItem | undefined = SAMPLE_SERVICES.find(
    (s) => s.id.toLowerCase() === (resolvedId || '').toLowerCase()
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingCity, setBookingCity] = useState(
    service?.provider.user?.profile?.city || 'Karachi'
  );
  const [bookingAddress, setBookingAddress] = useState('DHA Phase 5, Commercial Area');
  const [bookingPhone, setBookingPhone] = useState('+92 300 1234567');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingSlot, setBookingSlot] = useState('10:00 AM - 01:00 PM');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'JAZZCASH' | 'EASYPAISA'>('COD');
  const [confirmedBookingCode, setConfirmedBookingCode] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white">
            Service Not Found
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            We couldn&apos;t find any verified service matching ID{' '}
            <code className="px-2 py-0.5 rounded bg-[#0a1024] text-cyan-400 font-mono text-xs border border-cyan-500/20">
              {resolvedId || 'unknown'}
            </code>
            .
          </p>
        </div>
        <div className="pt-4 flex items-center justify-center gap-4">
          <Link
            href="/services"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-sm shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse All Services</span>
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl border border-cyan-500/20 text-slate-300 hover:text-white hover:bg-slate-900 font-bold text-sm transition-all"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const providerUser = service.provider.user;
  const providerProfile = providerUser?.profile;
  const providerCity = providerProfile?.city || 'Karachi';
  const providerRating = service.provider.rating || 4.9;
  const totalReviews = service.provider.totalReviews || 128;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleConfirmQuickBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `SCPK-${Math.floor(10000 + Math.random() * 90000)}`;
    setConfirmedBookingCode(code);

    try {
      const newBooking = {
        id: `book-${Date.now()}`,
        bookingCode: code,
        serviceId: service.id,
        service: service,
        address: `${bookingAddress}, ${bookingCity}, Pakistan`,
        phone: bookingPhone,
        scheduledAt: `${bookingDate} ${bookingSlot}`,
        totalAmount: service.basePrice,
        providerEarning: Math.round(service.basePrice * 0.85),
        status: 'PENDING',
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        paymentMethod,
        provider: {
          profile: {
            firstName: providerProfile?.firstName || 'Verified',
            lastName: providerProfile?.lastName || 'Artisan',
          },
          cnicNumber: service.provider.cnicNumber || '42101-1234567-1',
          hourlyRate: service.provider.hourlyRate || service.basePrice,
          rating: providerRating,
          serviceRadiusKm: service.provider.serviceRadiusKm || 25,
        },
      };

      const existing = localStorage.getItem('skillconnect_user_bookings');
      const parsed = existing ? JSON.parse(existing) : [];
      localStorage.setItem('skillconnect_user_bookings', JSON.stringify([newBooking, ...parsed]));
    } catch {
      // LocalStorage fallback
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navigation Breadcrumbs & Back Button */}
      <div className="flex items-center justify-between">
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-medium text-slate-400">
          <Link href="/" className="hover:text-cyan-300 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href="/services" className="hover:text-cyan-300 transition-colors">
            Services
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-white font-semibold truncate max-w-[200px] sm:max-w-none">
            {service.title}
          </span>
        </nav>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleShare}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/20 text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-[#0a1024] transition-all cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-cyan-300">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Share</span>
              </>
            )}
          </button>
          <Link
            href="/services"
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#0a1024] border border-cyan-500/20 text-xs font-bold text-slate-200 hover:text-cyan-300 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Services</span>
          </Link>
        </div>
      </div>

      {/* Main Service Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Service Details & Provider */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <div className="rounded-3xl border border-cyan-500/20 bg-[#0a1024]/85 p-6 sm:p-8 space-y-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs uppercase font-mono px-3 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                {service.category.name}
              </span>
              <div className="flex items-center space-x-2 text-xs font-medium text-cyan-300 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/30">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Available for Booking Today</span>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                {service.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
              <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-[#050814] border border-cyan-500/15">
                <Clock className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400">Duration</p>
                  <p className="font-bold text-white font-mono">~{service.durationMinutes} Minutes</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-[#050814] border border-cyan-500/15">
                <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400">Coverage Hub</p>
                  <p className="font-bold text-white">{providerCity} & Surroundings</p>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center space-x-3 p-3.5 rounded-2xl bg-[#050814] border border-cyan-500/15">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400">Verification</p>
                  <p className="font-bold text-cyan-300">NADRA CNIC Verified</p>
                </div>
              </div>
            </div>
          </div>

          {/* Provider Card */}
          <div className="rounded-3xl border border-cyan-500/20 bg-[#0a1024]/85 p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <span>Verified Service Provider</span>
              </h2>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                Top Rated Specialist
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#050814] border border-cyan-500/15">
              <div className="flex items-center space-x-4">
                <img
                  src={providerUser?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                  alt={providerProfile?.firstName || 'Provider'}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)]"
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-base text-white">
                      {providerProfile?.firstName} {providerProfile?.lastName}
                    </h3>
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  </div>
                  <p className="text-xs text-slate-400 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{providerCity}, Pakistan</span>
                  </p>
                  <p className="text-[11px] font-mono text-cyan-400/80">
                    CNIC: {service.provider.cnicNumber || '42101-1234567-1'}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <div className="flex items-center space-x-1 bg-amber-500/10 px-2.5 py-1 rounded-xl text-amber-400 font-bold text-xs border border-amber-500/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{providerRating.toFixed(1)}</span>
                  <span className="text-slate-500 font-normal">({totalReviews} reviews)</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 mt-1">
                  Radius: {service.provider.serviceRadiusKm || 25} km
                </span>
              </div>
            </div>

            {/* Verification Guarantee */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Safety & Quality Assurance
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Government NADRA CNIC Verified</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Transparent PKR pricing with no surprise fees</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Cash on Delivery (COD) & JazzCash supported</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>SkillConnect dispute protection guarantee</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Booking Action Card */}
        <div className="space-y-6">
          <div className="sticky top-24 rounded-3xl border border-cyan-500/25 bg-[#0a1024]/90 p-6 sm:p-8 space-y-6 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Standard Fixed Rate
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-cyan-300">
                  PKR {service.basePrice.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ job estimate</span>
              </div>
              <p className="text-[11px] text-cyan-400 font-medium flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Zero advance deposit required for COD</span>
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href={`/booking?service=${encodeURIComponent(service.id)}&provider=${encodeURIComponent(service.provider.id)}`}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-sm shadow-[0_0_20px_rgba(0,242,254,0.35)] flex items-center justify-center space-x-2 transition-all cursor-pointer text-center"
              >
                <span>Book This Service Now</span>
                <ChevronRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3 px-4 rounded-2xl border border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/40 font-bold text-xs transition-all cursor-pointer"
              >
                Quick Booking Modal
              </button>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span>Payment Options</span>
                <span className="font-semibold text-white">COD, JazzCash, EasyPaisa</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Confirmation</span>
                <span className="font-semibold text-white">Instant SMS & SCPK Code</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Cancellation</span>
                <span className="font-semibold text-cyan-400">Free before dispatch</span>
              </div>
            </div>

            {/* Need Help Phone CTA */}
            <div className="p-4 rounded-2xl bg-[#050814] border border-cyan-500/15 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-white">Need help booking?</p>
                <p className="text-[11px] font-mono text-cyan-400">UAN Helpline: 0800-SKILL (PK)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#050814]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a1024] border border-cyan-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-[0_0_50px_rgba(0,242,254,0.25)] relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setConfirmedBookingCode(null);
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {confirmedBookingCode ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,242,254,0.3)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">
                    Booking Confirmed!
                  </h3>
                  <p className="text-xs text-slate-400">
                    Your request has been dispatched to {providerProfile?.firstName || 'the provider'}.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#050814] border border-cyan-500/25 space-y-1 font-mono text-xs">
                  <span className="text-slate-400 block text-[10px]">Booking Reference Code</span>
                  <span className="font-bold text-lg text-cyan-300">
                    {confirmedBookingCode}
                  </span>
                </div>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <Link
                    href="/dashboard/customer"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs text-center shadow-md"
                  >
                    View in Customer Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmQuickBooking} className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-mono text-cyan-400">
                    Quick Booking
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Total Estimated Fee: <strong className="text-cyan-300 font-mono">PKR {service.basePrice.toLocaleString()}</strong>
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      City / Location
                    </label>
                    <select
                      value={bookingCity}
                      onChange={(e) => setBookingCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#050814] border border-cyan-500/25 text-white focus:outline-none focus:border-cyan-400"
                    >
                      {PAKISTAN_CITIES.map((c) => (
                        <option key={c} value={c} className="bg-[#0a1024] text-white">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Complete Address / Street
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingAddress}
                      onChange={(e) => setBookingAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#050814] border border-cyan-500/25 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Phone Number (Pakistan format)
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#050814] border border-cyan-500/25 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#050814] border border-cyan-500/25 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Time Window
                      </label>
                      <select
                        value={bookingSlot}
                        onChange={(e) => setBookingSlot(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#050814] border border-cyan-500/25 text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option className="bg-[#0a1024]">10:00 AM - 01:00 PM</option>
                        <option className="bg-[#0a1024]">02:00 PM - 05:00 PM</option>
                        <option className="bg-[#0a1024]">05:00 PM - 08:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('COD')}
                        className={`p-2 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer ${
                          paymentMethod === 'COD'
                            ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300'
                            : 'border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Cash (COD)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('JAZZCASH')}
                        className={`p-2 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer ${
                          paymentMethod === 'JAZZCASH'
                            ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300'
                            : 'border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        JazzCash
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('EASYPAISA')}
                        className={`p-2 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer ${
                          paymentMethod === 'EASYPAISA'
                            ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300'
                            : 'border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        EasyPaisa
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center space-x-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
                  >
                    Confirm Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-3 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
