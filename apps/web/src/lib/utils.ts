import type { Booking, BookingStatus, JsonValue, PaymentStatus, Stay } from "@/lib/types";

export function formatCurrency(value: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export function getNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end.getTime() - start.getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

export function getStayLocation(stay: Pick<Stay, "city" | "state">): string {
  return [stay.city, stay.state].filter(Boolean).join(", ");
}

export function getStayAmenities(stay: Pick<Stay, "metadata">): string[] {
  const amenities = stay.metadata?.amenities;
  if (!Array.isArray(amenities)) {
    return [];
  }

  return amenities.filter((item): item is string => typeof item === "string");
}

export function getStayType(stay: Pick<Stay, "metadata">): string | undefined {
  const type = stay.metadata?.type;
  return typeof type === "string" ? type : undefined;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function getString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export function getNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function getStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

export function normalizeDateInput(value: string): string {
  return new Date(`${value}T00:00:00`).toISOString();
}

export function getBookingStatusTone(status: BookingStatus): "success" | "warning" | "danger" | "neutral" {
  switch (status) {
    case "CONFIRMED":
      return "success";
    case "PENDING":
      return "warning";
    case "CANCELLED":
    case "FAILED":
      return "danger";
    default:
      return "neutral";
  }
}

export function getPaymentStatusTone(status: PaymentStatus): "success" | "warning" | "danger" | "neutral" {
  switch (status) {
    case "SUCCESS":
      return "success";
    case "CREATED":
    case "PENDING":
      return "warning";
    case "FAILED":
      return "danger";
    default:
      return "neutral";
  }
}

export function describeBookingDates(booking: Pick<Booking, "checkIn" | "checkOut">): string {
  return `${formatDate(booking.checkIn)} to ${formatDate(booking.checkOut)}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function safeJsonValue(value: JsonValue | undefined): string {
  if (typeof value === "string") {
    return value;
  }

  return "";
}
