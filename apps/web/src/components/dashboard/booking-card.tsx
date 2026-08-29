import Link from "next/link";
import { Badge } from "@/components/common/badge";
import { Card } from "@/components/common/card";
import type { Booking } from "@/lib/types";
import { routes } from "@/lib/routes";
import {
  describeBookingDates,
  formatCurrency,
  getBookingStatusTone,
  getStayLocation,
  getPaymentStatusTone,
} from "@/lib/utils";

export function BookingCard({ booking }: Readonly<{ booking: Booking }>) {
  const bookingTone = getBookingStatusTone(booking.status);
  const paymentTone = booking.payments?.[0]
    ? getPaymentStatusTone(booking.payments[0].status)
    : null;

  return (
    <Card className="p-5">
      <div className="grid gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Booking {booking.id.slice(0, 8)}
            </p>
            <h3 className="stays-heading mt-1 text-2xl">
              {booking.stay?.name ?? "Stay details unavailable"}
            </h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {booking.stay ? getStayLocation(booking.stay) : "Stay information pending"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone={bookingTone}>{booking.status}</Badge>
            {paymentTone ? <Badge tone={paymentTone}>{booking.payments?.[0]?.status}</Badge> : null}
          </div>
        </div>

        <dl className="grid gap-3 rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[var(--text-muted)]">Dates</dt>
            <dd className="mt-1 font-medium text-[var(--text)]">
              {describeBookingDates(booking)}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--text-muted)]">Guests</dt>
            <dd className="mt-1 font-medium text-[var(--text)]">{booking.guests}</dd>
          </div>
          <div>
            <dt className="text-[var(--text-muted)]">Amount</dt>
            <dd className="mt-1 font-medium text-[var(--text)]">
              {formatCurrency(booking.totalAmount)}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--text-muted)]">Stay</dt>
            <dd className="mt-1 font-medium text-[var(--text)]">
              {booking.stay?.city ?? "—"}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-3">
          <Link href={routes.confirmation(booking.id)} className="text-sm font-medium text-[var(--accent-strong)] underline-offset-4 hover:underline">
            View confirmation
          </Link>
          <Link href={routes.stay(booking.stayId)} className="text-sm font-medium text-[var(--text-muted)] underline-offset-4 hover:underline">
            Open stay
          </Link>
        </div>
      </div>
    </Card>
  );
}
