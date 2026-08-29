import { Card } from "@/components/common/card";
import type { BookingQuote, Stay } from "@/lib/types";
import { describeBookingDates, formatCurrency, getNights, getStayLocation } from "@/lib/utils";

export function BookingSummary({
  stay,
  quote,
  checkIn,
  checkOut,
  guests,
}: Readonly<{
  stay: Stay;
  quote?: BookingQuote | null;
  checkIn: string;
  checkOut: string;
  guests: number;
}>) {
  const nights = getNights(checkIn, checkOut);
  const amount = quote?.totalAmount;

  return (
    <Card className="p-6">
      <div className="grid gap-5">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
            Booking summary
          </p>
          <h3 className="stays-heading mt-2 text-2xl">{stay.name}</h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{getStayLocation(stay)}</p>
        </div>

        <dl className="grid gap-3 text-sm">
          <div className="flex items-center justify-between gap-4 border-b border-dashed border-[var(--line)] pb-3">
            <dt className="text-[var(--text-muted)]">Dates</dt>
            <dd className="font-medium text-[var(--text)]">
              {checkIn && checkOut ? describeBookingDates({ checkIn, checkOut }) : "Select dates"}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-b border-dashed border-[var(--line)] pb-3">
            <dt className="text-[var(--text-muted)]">Nights</dt>
            <dd className="font-medium text-[var(--text)]">{nights || "—"}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-b border-dashed border-[var(--line)] pb-3">
            <dt className="text-[var(--text-muted)]">Guests</dt>
            <dd className="font-medium text-[var(--text)]">{guests}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-b border-dashed border-[var(--line)] pb-3">
            <dt className="text-[var(--text-muted)]">Price per night</dt>
            <dd className="font-medium text-[var(--text)]">{formatCurrency(stay.pricePerNight)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1">
            <dt className="text-[var(--text-muted)]">Server total</dt>
            <dd className="text-lg font-semibold text-[var(--accent-strong)]">
              {amount !== undefined ? formatCurrency(amount) : "Waiting for quote"}
            </dd>
          </div>
        </dl>

        <p className="text-xs leading-5 text-[var(--text-muted)]">
          The backend is authoritative for total pricing. The displayed total is only
          trusted after the quote endpoint responds.
        </p>
      </div>
    </Card>
  );
}
