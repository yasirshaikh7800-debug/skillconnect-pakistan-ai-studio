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

  // Resolve dynamic id parameter safely across Next.js versions
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

  // Find requested service from SAMPLE_SERVICES
  const service: ServiceItem | undefined = SAMPLE_SERVICES.find(
    (s) => s.id.toLowerCase() === (resolvedId || '').toLowerCase()
  );

  // Quick Booking Modal State
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

  // If service is not found, display proper clean not-found state
  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto shadow-lg">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-900">
            Service Not Found
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-600 max-w-md mx-auto">
            We couldn&apos;t find any verified service matching ID{' '}
            <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-50 text-blue-600 font-mono text-xs">
              {resolvedId || 'unknown'}
            </code>
            . It may have been updated or removed.
          </p>
        </div>
        <div className="pt-4 flex items-center justify-center gap-4">
          <Link
            href="/services"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse All Services</span>
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-200 text-slate-700 dark:text-slate-700 hover:bg-slate-100 hover:bg-slate-100 font-bold text-sm transition-all"
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
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-medium text-slate-500 dark:text-slate-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/services" className="hover:text-blue-600 transition-colors">
            Services
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 dark:text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-none">
            {service.title}
          </span>
        </nav>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleShare}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-200 text-xs font-semibold text-slate-600 dark:text-slate-700 hover:bg-slate-100 hover:bg-slate-100 transition-all cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-blue-600 dark:text-blue-600">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>
          <Link
            href="/services"
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-50 text-xs font-bold text-slate-700 dark:text-slate-800 hover:text-blue-600 dark:hover:text-blue-600 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Services</span>
          </Link>
        </div>
      </div>

      {/* Main Service Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Service Details, Description & Provider */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-200 bg-white dark:bg-white p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-lg bg-blue-600/10 border border-blue-600/30 text-blue-600 dark:text-blue-600">
                {service.category.name}
              </span>
              <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 dark:text-blue-600 bg-blue-50 dark:bg-blue-50 px-3 py-1 rounded-full border border-blue-600/20">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>Available for Booking Today</span>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-900">
                {service.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-700 leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-200 text-xs">
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-50/60">
                <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400">Estimated Duration</p>
                  <p className="font-bold text-slate-900 dark:text-slate-900">~{service.durationMinutes} Minutes</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-50/60">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400">Service Coverage</p>
                  <p className="font-bold text-slate-900 dark:text-slate-900">{providerCity} & Surroundings</p>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-50/60">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400">Verification</p>
                  <p className="font-bold text-blue-600 dark:text-blue-600">NADRA CNIC Verified</p>
                </div>
              </div>
            </div>
          </div>

          {/* Provider Card */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-200 bg-white dark:bg-white p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-900 flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>Verified Service Provider</span>
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-600 border border-blue-600/20">
                Top Rated
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-50/50 border border-slate-100 dark:border-slate-200">
              <div className="flex items-center space-x-4">
                <img
                  src={providerUser?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                  alt={providerProfile?.firstName || 'Provider'}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-600 shadow-md"
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-900">
                      {providerProfile?.firstName} {providerProfile?.lastName}
                    </h3>
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-600 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{providerCity}, Pakistan</span>
                  </p>
                  <p className="text-[11px] font-mono text-slate-400">
                    CNIC: {service.provider.cnicNumber || '42101-1234567-1'}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-300">
                <div className="flex items-center space-x-1 bg-amber-500/10 px-2.5 py-1 rounded-xl text-amber-600 dark:text-amber-400 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{providerRating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({totalReviews} reviews)</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-600 mt-1">
                  Radius: {service.provider.serviceRadiusKm || 25} km
                </span>
              </div>
            </div>

            {/* Verification Guarantee */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Safety & Quality Assurance
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-700">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Government NADRA CNIC Verified</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Transparent PKR pricing with no surprise fees</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Cash on Delivery (COD) & JazzCash supported</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>SkillConnect dispute protection guarantee</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Booking Action Card */}
        <div className="space-y-6">
          <div className="sticky top-24 rounded-3xl border border-slate-200 dark:border-slate-200 bg-white dark:bg-white p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Standard Fixed Rate
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-900">
                  PKR {service.basePrice.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ job estimate</span>
              </div>
              <p className="text-[11px] text-blue-600 dark:text-blue-600 font-semibold flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Zero advance deposit required for COD</span>
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* Direct Link to full booking page */}
              <Link
                href={`/booking?service=${encodeURIComponent(service.id)}&provider=${encodeURIComponent(service.provider.id)}`}
                className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer text-center"
              >
                <span>Book This Service Now</span>
                <ChevronRight className="w-4 h-4" />
              </Link>

              {/* Quick modal booking button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-200 text-slate-700 dark:text-slate-800 hover:bg-slate-100 hover:bg-slate-100 font-bold text-xs transition-all cursor-pointer"
              >
                Quick Booking Modal
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-200 space-y-3 text-xs text-slate-500 dark:text-slate-600">
              <div className="flex items-center justify-between">
                <span>Payment Options</span>
                <span className="font-semibold text-slate-900 dark:text-slate-900">COD, JazzCash, EasyPaisa</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Confirmation</span>
                <span className="font-semibold text-slate-900 dark:text-slate-900">Instant SMS & SCPK Code</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Cancellation</span>
                <span className="font-semibold text-blue-600 dark:text-blue-600">Free before dispatch</span>
              </div>
            </div>

            {/* Need Help Phone CTA */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-50/60 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-600 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900 dark:text-slate-900">Need help booking?</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-600">UAN Helpline: 0800-SKILL (PK)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-white border border-slate-200 dark:border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setConfirmedBookingCode(null);
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {confirmedBookingCode ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-900">
                    Booking Confirmed!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-600">
                    Your request has been dispatched to {providerProfile?.firstName || 'the provider'}.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-50 border border-slate-200 dark:border-slate-300 space-y-1 font-mono text-xs">
                  <span className="text-slate-400 block text-[10px]">Booking Reference Code</span>
                  <span className="font-bold text-lg text-blue-600 dark:text-blue-600">
                    {confirmedBookingCode}
                  </span>
                </div>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <Link
                    href="/dashboard/customer"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                  >
                    View in Customer Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmQuickBooking} className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-600">
                    Quick Booking
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-900">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Total Estimated Fee: <strong className="text-slate-900 dark:text-slate-900">PKR {service.basePrice.toLocaleString()}</strong>
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-700 font-semibold mb-1">
                      City / Location
                    </label>
                    <select
                      value={bookingCity}
                      onChange={(e) => setBookingCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-50 border border-slate-200 dark:border-slate-300 text-slate-900 dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {PAKISTAN_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-700 font-semibold mb-1">
                      Complete Address / Street
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingAddress}
                      onChange={(e) => setBookingAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-50 border border-slate-200 dark:border-slate-300 text-slate-900 dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-700 font-semibold mb-1">
                      Phone Number (Pakistan format)
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-50 border border-slate-200 dark:border-slate-300 text-slate-900 dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-700 font-semibold mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-50 border border-slate-200 dark:border-slate-300 text-slate-900 dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-700 font-semibold mb-1">
                        Time Window
                      </label>
                      <select
                        value={bookingSlot}
                        onChange={(e) => setBookingSlot(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-50 border border-slate-200 dark:border-slate-300 text-slate-900 dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option>10:00 AM - 01:00 PM</option>
                        <option>02:00 PM - 05:00 PM</option>
                        <option>05:00 PM - 08:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-700 font-semibold mb-1">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('COD')}
                        className={`p-2 rounded-xl border text-[11px] font-bold text-center transition-all ${
                          paymentMethod === 'COD'
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-50 text-blue-600 dark:text-blue-600'
                            : 'border-slate-200 dark:border-slate-300 text-slate-500'
                        }`}
                      >
                        Cash (COD)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('JAZZCASH')}
                        className={`p-2 rounded-xl border text-[11px] font-bold text-center transition-all ${
                          paymentMethod === 'JAZZCASH'
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-50 text-blue-600 dark:text-blue-600'
                            : 'border-slate-200 dark:border-slate-300 text-slate-500'
                        }`}
                      >
                        JazzCash
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('EASYPAISA')}
                        className={`p-2 rounded-xl border text-[11px] font-bold text-center transition-all ${
                          paymentMethod === 'EASYPAISA'
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-50 text-blue-600 dark:text-blue-600'
                            : 'border-slate-200 dark:border-slate-300 text-slate-500'
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
                    className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                  >
                    Confirm Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-300 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs font-semibold"
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
