export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'FAILED';

export type PaymentStatus =
  | 'CREATED'
  | 'PENDING'
  | 'SUCCESS'
  | 'FAILED';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Stay {
  id: string;
  name: string;
  description: string;
  city: string;
  state: string;
  latitude: number | string;
  longitude: number | string;
  pricePerNight: number;
  maxGuests: number;
  rating?: number | string | null;
  metadata?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface StayListResponse {
  data: Stay[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BookingPayment {
  id: string;
  bookingId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string | null;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  stay?: Stay;
  payments?: BookingPayment[];
}

export interface BookingQuote {
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  totalAmount: number;
}

export interface AvailabilityResponse {
  available: boolean;
}

export interface PaymentOrder {
  paymentId: string;
  razorpayOrderId: string;
  amount: number;
  currency?: string;
  status: PaymentStatus;
}

export interface PaymentVerificationResponse {
  paymentId: string;
  bookingId: string;
  razorpayPaymentId?: string | null;
  status: PaymentStatus;
  bookingStatus: BookingStatus;
}
