import type {
  AuthSession,
  AuthUser,
  Booking,
  BookingQuote,
  JsonValue,
  Payment,
  RazorpayOrder,
  Stay,
} from "@/lib/types";
import { getNumber, getString, isRecord } from "@/lib/utils";

function normalizeUser(input: unknown): AuthUser | null {
  if (!isRecord(input)) {
    return null;
  }

  const id = getString(input.id);
  const name = getString(input.name);
  const email = getString(input.email);

  if (!id || !name || !email) {
    return null;
  }

  return {
    id,
    name,
    email,
    createdAt: getString(input.createdAt),
  };
}

export function extractSession(payload: unknown): AuthSession {
  const candidate = isRecord(payload) && isRecord(payload.data) ? payload.data : payload;
  const user =
    normalizeUser(
      isRecord(candidate)
        ? candidate.user ?? candidate.account ?? candidate.profile ?? candidate
        : candidate,
    ) ??
    normalizeUser(isRecord(payload) ? payload.user : null);

  const token =
    (isRecord(candidate)
      ? getString(candidate.token) ??
        getString(candidate.accessToken) ??
        getString(candidate.sessionToken)
      : undefined) ??
    (isRecord(payload) ? getString(payload.token) ?? getString(payload.accessToken) : undefined);

  if (!user) {
    throw new Error("Auth response did not include a user.");
  }

  return { user, token };
}

function normalizeStay(input: unknown): Stay | null {
  if (!isRecord(input)) {
    return null;
  }

  const id = getString(input.id);
  const name = getString(input.name);
  const description = getString(input.description);
  const city = getString(input.city);
  const state = getString(input.state);
  const latitude = getNumber(input.latitude);
  const longitude = getNumber(input.longitude);
  const pricePerNight = getNumber(input.pricePerNight);
  const maxGuests = getNumber(input.maxGuests);

  if (
    !id ||
    !name ||
    !description ||
    !city ||
    !state ||
    latitude === undefined ||
    longitude === undefined ||
    pricePerNight === undefined ||
    maxGuests === undefined
  ) {
    return null;
  }

  const rating = getNumber(input.rating);

  return {
    id,
    name,
    description,
    city,
    state,
    latitude,
    longitude,
    pricePerNight,
    maxGuests,
    rating,
    metadata: isRecord(input.metadata)
      ? (input.metadata as Record<string, JsonValue>)
      : null,
    createdAt: getString(input.createdAt),
    updatedAt: getString(input.updatedAt),
  };
}

function normalizeBooking(input: unknown): Booking | null {
  if (!isRecord(input)) {
    return null;
  }

  const id = getString(input.id);
  const userId = getString(input.userId);
  const stayId = getString(input.stayId);
  const checkIn = getString(input.checkIn);
  const checkOut = getString(input.checkOut);
  const guests = getNumber(input.guests);
  const totalAmount = getNumber(input.totalAmount);
  const status = getString(input.status);

  if (
    !id ||
    !userId ||
    !stayId ||
    !checkIn ||
    !checkOut ||
    guests === undefined ||
    totalAmount === undefined ||
    !status
  ) {
    return null;
  }

  return {
    id,
    userId,
    stayId,
    checkIn,
    checkOut,
    guests,
    totalAmount,
    status: status as Booking["status"],
    createdAt: getString(input.createdAt),
    updatedAt: getString(input.updatedAt),
    stay: normalizeStay(input.stay ?? input.stayDetails ?? input.listing ?? null) ?? undefined,
    payments: Array.isArray(input.payments)
      ? input.payments
          .map(normalizePayment)
          .filter((item): item is Payment => item !== null)
      : undefined,
  };
}

function normalizePayment(input: unknown): Payment | null {
  if (!isRecord(input)) {
    return null;
  }

  const id = getString(input.id);
  const bookingId = getString(input.bookingId);
  const razorpayOrderId = getString(input.razorpayOrderId);
  const amount = getNumber(input.amount);
  const status = getString(input.status);

  if (!id || !bookingId || !razorpayOrderId || amount === undefined || !status) {
    return null;
  }

  return {
    id,
    bookingId,
    razorpayOrderId,
    razorpayPaymentId: getString(input.razorpayPaymentId),
    amount,
    status: status as Payment["status"],
    createdAt: getString(input.createdAt),
    updatedAt: getString(input.updatedAt),
  };
}

function normalizeBookingQuote(input: unknown): BookingQuote | null {
  if (!isRecord(input)) {
    return null;
  }

  const stayId = getString(input.stayId);
  const checkIn = getString(input.checkIn);
  const checkOut = getString(input.checkOut);
  const guests = getNumber(input.guests);
  const totalAmount = getNumber(input.totalAmount);

  if (!stayId || !checkIn || !checkOut || guests === undefined || totalAmount === undefined) {
    return null;
  }

  return {
    stayId,
    checkIn,
    checkOut,
    guests,
    nights: getNumber(input.nights),
    totalAmount,
  };
}

function normalizeRazorpayOrder(input: unknown): RazorpayOrder | null {
  if (!isRecord(input)) {
    return null;
  }

  const orderId = getString(input.orderId) ?? getString(input.razorpayOrderId);
  const amount = getNumber(input.amount);

  if (!orderId || amount === undefined) {
    return null;
  }

  return {
    orderId,
    amount,
    currency: getString(input.currency),
    bookingId: getString(input.bookingId),
    keyId: getString(input.keyId) ?? getString(input.razorpayKeyId),
    notes: isRecord(input.notes)
      ? Object.fromEntries(
          Object.entries(input.notes).flatMap(([key, value]) =>
            typeof value === "string" ? [[key, value]] : [],
          ),
        )
      : undefined,
  };
}

function extractCollection<T>(
  payload: unknown,
  normalizer: (value: unknown) => T | null,
  keys: string[],
): T[] {
  const candidate = isRecord(payload) && isRecord(payload.data) ? payload.data : payload;

  for (const key of keys) {
    const value = isRecord(candidate) ? candidate[key] : undefined;
    if (Array.isArray(value)) {
      return value.map(normalizer).filter((item): item is T => item !== null);
    }
  }

  if (Array.isArray(candidate)) {
    return candidate.map(normalizer).filter((item): item is T => item !== null);
  }

  const single = normalizer(candidate);
  return single ? [single] : [];
}

export function normalizeStayList(payload: unknown): Stay[] {
  return extractCollection(payload, normalizeStay, ["stays", "items", "data"]);
}

export function normalizeBookingList(payload: unknown): Booking[] {
  return extractCollection(payload, normalizeBooking, ["bookings", "items", "data"]);
}

export function normalizeSingleStay(payload: unknown): Stay | null {
  return normalizeStay(isRecord(payload) && isRecord(payload.data) ? payload.data : payload);
}

export function normalizeSingleBooking(payload: unknown): Booking | null {
  return normalizeBooking(isRecord(payload) && isRecord(payload.data) ? payload.data : payload);
}

export function normalizeSinglePayment(payload: unknown): Payment | null {
  return normalizePayment(isRecord(payload) && isRecord(payload.data) ? payload.data : payload);
}

export function normalizeSingleQuote(payload: unknown): BookingQuote | null {
  return normalizeBookingQuote(isRecord(payload) && isRecord(payload.data) ? payload.data : payload);
}

export function normalizeSingleOrder(payload: unknown): RazorpayOrder | null {
  return normalizeRazorpayOrder(isRecord(payload) && isRecord(payload.data) ? payload.data : payload);
}
