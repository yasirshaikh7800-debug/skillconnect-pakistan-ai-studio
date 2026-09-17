'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SAMPLE_SERVICES, SAMPLE_PROVIDERS, PAKISTAN_CITIES } from '@/lib/mockData';
import { ServiceItem, ProviderProfile } from '@/lib/types';
import { ShieldCheck, Calendar, Clock, MapPin, Phone, CreditCard, CheckCircle2, ArrowRight, ArrowLeft, UserCheck, Star } from 'lucide-react';
import BookingSuccess3DModal from '@/components/BookingSuccess3DModal';

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceId = searchParams.get('service') || searchParams.get('id');
  const providerId = searchParams.get('provider');
  const fromCat = searchParams.get('fromCat');

  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ProviderProfile | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 01:00 PM');
  const [city, setCity] = useState('Karachi');
  const [address, setAddress] = useState('DHA Phase 5, Commercial Area');
  const [phone, setPhone] = useState('+92 300 1234567');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'JAZZCASH' | 'EASYPAISA'>('COD');
  const [confirmedCode, setConfirmedCode] = useState<string | null>(null);

  useEffect(() => {
    let serviceFound: ServiceItem | undefined;
    if (serviceId) {
      serviceFound = SAMPLE_SERVICES.find((s) => s.id.toLowerCase() === serviceId.toLowerCase());
    }
    if (!serviceFound) {
      serviceFound = SAMPLE_SERVICES[0];
    }

    setSelectedService(serviceFound);

    // Resolve provider
    if (providerId) {
      const pFound = SAMPLE_PROVIDERS.find((p) => p.id === providerId);
      if (pFound) {
        setSelectedProvider(pFound);
        if (pFound.user?.profile?.city) {
          setCity(pFound.user.profile.city);
        }
        return;
      }
    }

    if (serviceFound?.provider) {
      setSelectedProvider(serviceFound.provider);
      if (serviceFound.provider.user?.profile?.city) {
        setCity(serviceFound.provider.user.profile.city);
      }
    }
  }, [serviceId, providerId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `SCPK-${Math.floor(10000 + Math.random() * 90000)}`;
    setConfirmedCode(code);

    const activeProvider = selectedProvider || selectedService?.provider;

    try {
      const newBooking = {
        id: `book-${Date.now()}`,
        bookingCode: code,
        serviceId: selectedService?.id || 'elec-1',
        service: selectedService,
        address: `${address}, ${city}, Pakistan`,
        phone,
        notes,
        scheduledAt: `${date} ${timeSlot}`,
        totalAmount: selectedService?.basePrice || 2500,
        providerEarning: Math.round((selectedService?.basePrice || 2500) * 0.85),
        status: 'PENDING',
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        paymentMethod,
        provider: activeProvider
          ? {
              id: activeProvider.id,
              profile: {
                firstName: activeProvider.user?.profile?.firstName || 'Verified',
                lastName: activeProvider.user?.profile?.lastName || 'Worker',
                city: activeProvider.user?.profile?.city || city,
                avatarUrl: activeProvider.user?.avatarUrl,
              },
              cnicNumber: activeProvider.cnicNumber,
              isVerified: activeProvider.isVerified,
              rating: activeProvider.rating,
              hourlyRate: activeProvider.hourlyRate,
            }
          : {
              profile: { firstName: 'Verified', lastName: 'Technician' },
              cnicNumber: '42101-1234567-1',
              isVerified: true,
            },
        createdAt: new Date().toISOString(),
      };
      const existing = JSON.parse(localStorage.getItem('skillconnect_user_bookings') || '[]');
      localStorage.setItem('skillconnect_user_bookings', JSON.stringify([newBooking, ...existing]));
    } catch {
      // Storage fallback
    }
  };

  if (!selectedService) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-slate-500">Loading service details...</p>
      </div>
    );
  }

  const backLink = selectedService
    ? `/services/${selectedService.id}${fromCat ? `?fromCat=${fromCat}` : ''}`
    : '/services';

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Back link */}
      <div>
        <Link
          href={backLink}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {selectedService?.title ? `Service Details (${selectedService.title})` : 'Services'}</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Book Verified Service
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            NADRA CNIC-verified skilled workers across Pakistan with upfront PKR pricing
          </p>
        </div>
        <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-600/10 px-3 py-1.5 rounded-full border border-blue-600/20">
          <ShieldCheck className="w-4 h-4" />
          <span>SkillConnect Guarantee</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Schedule & Location Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Preferred Date</span>
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Arrival Time Slot</span>
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600"
                >
                  <option value="09:00 AM - 12:00 PM" className="dark:bg-slate-900">Morning (09:00 AM - 12:00 PM)</option>
                  <option value="01:00 PM - 04:00 PM" className="dark:bg-slate-900">Afternoon (01:00 PM - 04:00 PM)</option>
                  <option value="05:00 PM - 08:00 PM" className="dark:bg-slate-900">Evening (05:00 PM - 08:00 PM)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>City</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                >
                  {PAKISTAN_CITIES.slice(0, 15).map((c) => (
                    <option key={c} value={c} className="dark:bg-slate-900">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phone Number (for Worker SMS)</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                House / Building Address & Sector
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. House 42, Street 8, Sector F-7/2 or Gulberg III"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Problem Description (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe the issue (e.g. UPS not shifting load, AC water leakage)..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Payment Option in Pakistan
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                    paymentMethod === 'COD'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 ring-2 ring-blue-600/20'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Cash on Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('JAZZCASH')}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                    paymentMethod === 'JAZZCASH'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 ring-2 ring-blue-600/20'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  JazzCash
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('EASYPAISA')}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                    paymentMethod === 'EASYPAISA'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 ring-2 ring-blue-600/20'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  EasyPaisa
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Confirm & Dispatch Verified Worker</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Order Summary Card */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Order Summary
            </h3>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                {selectedService.category?.name || 'Home Service'}
              </span>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                {selectedService.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {selectedService.description}
              </p>
            </div>

            {/* Assigned / Selected Specialist */}
            {selectedProvider && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Assigned Verified Specialist
                </span>
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      selectedProvider.user?.avatarUrl ||
                      'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80'
                    }
                    alt={selectedProvider.user?.profile?.firstName}
                    className="w-10 h-10 rounded-xl object-cover border border-blue-600 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                      <span className="truncate">
                        {selectedProvider.user?.profile?.firstName}{' '}
                        {selectedProvider.user?.profile?.lastName}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {selectedProvider.user?.profile?.city || city} • ★{' '}
                      {selectedProvider.rating.toFixed(1)} ({selectedProvider.totalReviews} reviews)
                    </p>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                      CNIC: {selectedProvider.cnicNumber}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Standard Visiting Fee</span>
                <span className="font-bold text-slate-900 dark:text-white">PKR {selectedService.basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-blue-600 dark:text-blue-400 font-semibold">
                <span>Platform Guarantee & Insurance</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Total Payable</span>
                <span className="text-blue-600 dark:text-blue-400">PKR {selectedService.basePrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Zero hidden charges on home inspection</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>NADRA CNIC verification checked</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>7-Day SkillConnect service warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Success Confirmation Modal */}
      {confirmedCode && (
        <BookingSuccess3DModal
          bookingCode={confirmedCode}
          serviceTitle={selectedService.title}
          onClose={() => router.push('/dashboard/customer')}
        />
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-slate-500">Loading booking page...</div>}>
      <BookingContent />
    </Suspense>
  );
}
