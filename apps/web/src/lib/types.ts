export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface ApiErrorPayload {
  message?: string;
  error?: string;
  code?: string;
  details?: JsonValue;
}

export interface ApiFailure {
  message: string;
  status?: number;
  code: string;
  details?: JsonValue;
  raw?: unknown;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface AuthSession {
  user: AuthUser;
  token?: string | null;
}

export interface Stay {
  id: string;
  name: string;
  description: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  pricePerNight: number;
  maxGuests: number;
  rating?: number | null;
  metadata?: Record<string, JsonValue> | null;
  createdAt?: string;
  updatedAt?: string;
}

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "FAILED";
export type PaymentStatus = "CREATED" | "PENDING" | "SUCCESS" | "FAILED";

export interface Booking {
  id: string;
  userId: string;
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  status: BookingStatus;
  createdAt?: string;
  updatedAt?: string;
  stay?: Stay;
  payments?: Payment[];
}

export interface Payment {
  id: string;
  bookingId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string | null;
  amount: number;
  status: PaymentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookingQuote {
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights?: number;
  totalAmount: number;
}

export interface BookingInput {
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface RazorpayOrder {
  orderId: string;
  amount: number;
  currency?: string;
  bookingId?: string;
  keyId?: string;
  notes?: Record<string, string>;
}

export interface RazorpayVerificationInput {
  bookingId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}
