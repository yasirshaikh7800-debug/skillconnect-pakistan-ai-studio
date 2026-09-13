import { ServiceCategory, ServiceItem, ProviderProfile, BookingItem } from './types';
import { PAKISTAN_CITIES_FULL, PAKISTAN_CITIES } from './citiesData';
import { ALL_CATEGORIES, ALL_PROVIDERS, ALL_100_SERVICES } from './servicesData';

export { PAKISTAN_CITIES_FULL, PAKISTAN_CITIES };
export const CATEGORIES: ServiceCategory[] = ALL_CATEGORIES;
export const SAMPLE_PROVIDERS: ProviderProfile[] = ALL_PROVIDERS;
export const SAMPLE_SERVICES: ServiceItem[] = ALL_100_SERVICES;

export const SAMPLE_BOOKINGS: BookingItem[] = [
  {
    id: 'bk-1001',
    bookingCode: 'SCPK-89210',
    status: 'IN_PROGRESS',
    scheduledAt: '2026-08-09T10:00:00Z',
    totalAmount: 2500,
    commissionFee: 250,
    providerEarning: 2250,
    address: 'House #42, Street 12, DHA Phase 5, Karachi',
    service: ALL_100_SERVICES[0],
    customer: {
      email: 'bilal.customer@gmail.com',
      profile: {
        firstName: 'Bilal',
        lastName: 'Ahmed',
        city: 'Karachi',
        address: 'DHA Phase 5, Karachi',
      },
    },
    provider: {
      email: 'tariq.electrician@gmail.com',
      profile: {
        firstName: 'Tariq',
        lastName: 'Mahmood',
        city: 'Karachi',
      },
    },
  },
  {
    id: 'bk-1002',
    bookingCode: 'SCPK-74312',
    status: 'COMPLETED',
    scheduledAt: '2026-08-05T14:30:00Z',
    totalAmount: 1500,
    commissionFee: 150,
    providerEarning: 1350,
    address: 'Flat 304, Al-Mustafa Heights, Gulshan-e-Iqbal, Karachi',
    service: ALL_100_SERVICES[1],
    customer: {
      email: 'sara.khan@gmail.com',
      profile: {
        firstName: 'Sara',
        lastName: 'Khan',
        city: 'Karachi',
      },
    },
    provider: {
      email: 'usman.ac@gmail.com',
      profile: {
        firstName: 'Usman',
        lastName: 'Ali',
        city: 'Lahore',
      },
    },
  },
];
