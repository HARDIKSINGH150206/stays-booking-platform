import { requestJson } from "@/lib/api/client";
import {
  normalizeBookingList,
  normalizeSingleBooking,
  normalizeSingleQuote,
} from "@/lib/api/normalize";
import type { Booking, BookingInput, BookingQuote } from "@/lib/types";

export async function quoteBooking(input: BookingInput): Promise<BookingQuote> {
  const payload = await requestJson<unknown>("/bookings/quote", {
    method: "POST",
    body: JSON.stringify(input),
  });

  const quote = normalizeSingleQuote(payload);
  if (!quote) {
    throw new Error("Booking quote response was incomplete.");
  }

  return quote;
}

export async function createBooking(input: BookingInput): Promise<Booking> {
  const payload = await requestJson<unknown>("/bookings", {
    method: "POST",
    body: JSON.stringify(input),
  });

  const booking = normalizeSingleBooking(payload);
  if (!booking) {
    throw new Error("Booking response was incomplete.");
  }

  return booking;
}

export async function listBookings(): Promise<Booking[]> {
  const payload = await requestJson<unknown>("/bookings");
  return normalizeBookingList(payload);
}

export async function getBooking(bookingId: string): Promise<Booking | null> {
  const payload = await requestJson<unknown>(`/bookings/${bookingId}`);
  return normalizeSingleBooking(payload);
}
