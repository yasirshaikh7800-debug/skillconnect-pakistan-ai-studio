'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CATEGORIES, SAMPLE_SERVICES, PAKISTAN_CITIES } from '@/lib/mockData';
import CitySearchSelect from '@/components/CitySearchSelect';
import { ServiceItem } from '@/lib/types';
import { Search, MapPin, CheckCircle2, Star, X, Filter } from 'lucide-react';

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState('Karachi');
  const [serviceLocation, setServiceLocation] = useState('Karachi');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [bookingConfirmedCode, setBookingConfirmedCode] = useState<string | null>(null);
  const [bookingAddress, setBookingAddress] = useState('');
  const [bookingPhone, setBookingPhone] = useState('+923001234567');

  // Automatically sync Service Location when top Location changes
  useEffect(() => {
    setServiceLocation(selectedCity);
  }, [selectedCity]);

  const filteredServices = SAMPLE_SERVICES.filter((srv) => {
    const matchesCat = selectedCategory === 'all' || srv.category.slug === selectedCategory;
    const matchesSearch =
      srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

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
        <p className="text-xs text-slate-500">
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
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
            <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <Filter className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent font-semibold cursor-pointer focus:outline-none text-slate-900 dark:text-white w-full"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
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
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Automatically filled from Location</span>
            </p>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {service.category.name}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  ~{service.durationMinutes} mins
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {service.title}
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                {service.description}
              </p>

              {/* Provider info */}
              <div className="flex items-center space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <img
                  src={service.provider.user?.avatarUrl}
                  alt={service.provider.user?.profile?.firstName}
                  className="w-8 h-8 rounded-full object-cover border border-emerald-500"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-200 flex items-center space-x-1">
                    <span>
                      {service.provider.user?.profile?.firstName}{' '}
                      {service.provider.user?.profile?.lastName}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </p>
                  <p className="text-[10px] text-slate-400">
                    CNIC Verified | {selectedCity}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Estimated Fee</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  PKR {service.basePrice.toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => handleBook(service)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Book Visit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 p-2 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            {!bookingConfirmedCode ? (
              <form onSubmit={handleConfirm} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Confirm Service Visit
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedService.title} in {selectedCity}
                </p>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-1">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Technician: {selectedService.provider.user?.profile?.firstName}{' '}
                    {selectedService.provider.user?.profile?.lastName}
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold">
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
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                >
                  Book Instant Visit
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-500 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-slate-900 dark:text-white">Visit Scheduled!</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Booking Code: <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{bookingConfirmedCode}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/dashboard/customer"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-center transition-colors"
                  >
                    View in Dashboard
                  </Link>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors"
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
