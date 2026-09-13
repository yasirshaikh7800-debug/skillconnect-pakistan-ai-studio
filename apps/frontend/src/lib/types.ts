export type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';

export interface UserProfile {
  firstName: string;
  lastName: string;
  city: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  bio?: string;
}

export interface ProviderProfile {
  id: string;
  cnicNumber: string;
  isVerified: boolean;
  hourlyRate: number;
  rating: number;
  totalReviews: number;
  serviceRadiusKm: number;
  user?: {
    id: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    profile?: UserProfile;
  };
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconUrl?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  durationMinutes: number;
  isAvailable: boolean;
  category: ServiceCategory;
  provider: ProviderProfile;
}

export interface BookingItem {
  id: string;
  bookingCode: string;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  scheduledAt: string;
  totalAmount: number;
  commissionFee: number;
  providerEarning: number;
  address: string;
  service: ServiceItem;
  customer?: { profile?: UserProfile; email: string };
  provider?: { profile?: UserProfile; email: string; cnicNumber?: string };
  paymentStatus?: 'PENDING' | 'PAID' | 'REFUNDED';
  paymentMethod?: string;
  notes?: string;
}
