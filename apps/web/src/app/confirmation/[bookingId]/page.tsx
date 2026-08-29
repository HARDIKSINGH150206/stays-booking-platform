"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, StrongCard } from "@/components/common/card";
import { EmptyState, ErrorState, LoadingState, SectionHeading, InlineNotice } from "@/components/common/feedback";
import { PaymentStatusPill } from "@/components/payments/payment-status";
import { getBooking } from "@/lib/api/bookings";
import { isApiUnavailableError, toErrorMessage } from "@/lib/api/client";
import { routes } from "@/lib/routes";
import type { Booking } from "@/lib/types";
import { LinkButton } from "@/components/common/button";
import { describeBookingDates, formatCurrency } from "@/lib/utils";

export default function ConfirmationPage() {
  const params = useParams<{ bookingId: string }>();
  const bookingId = params?.bookingId;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!bookingId) {
        if (active) {
          setLoading(false);
          setError("Missing booking id.");
        }
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const nextBooking = await getBooking(bookingId);
        if (active) {
          setBooking(nextBooking);
        }
      } catch (error) {
        if (active) {
          setError(
            isApiUnavailableError(error)
              ? "Confirmation backend is not connected yet."
              : toErrorMessage(error),
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [bookingId]);

  if (loading) {
    return (
      <div className="stays-container py-10 sm:py-16">
        <LoadingState title="Loading confirmation" description="Fetching booking status." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="stays-container py-10 sm:py-16">
        <ErrorState description={error} actionLabel="Back to bookings" actionHref={routes.bookings} />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="stays-container py-10 sm:py-16">
        <EmptyState
          title="Confirmation unavailable"
          description="The backend did not return a booking for this confirmation page."
          actionLabel="Back to bookings"
          actionHref={routes.bookings}
        />
      </div>
    );
  }

  const isConfirmed = booking.status === "CONFIRMED";
  const paymentStatus = booking.payments?.[0]?.status ?? "CREATED";

  return (
    <div className="stays-container py-10 sm:py-16">
      <div className="grid gap-8">
        <SectionHeading
          eyebrow="Confirmation"
          title={isConfirmed ? "Your booking is confirmed" : "Booking status"}
          description="This page only shows success when the backend confirms the booking and payment state."
        />

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <StrongCard className="p-6 sm:p-8">
            <div className="grid gap-5">
              {isConfirmed ? (
                <InlineNotice tone="success">
                  Payment verification completed and the booking is confirmed.
                </InlineNotice>
              ) : (
                <InlineNotice tone="warning">
                  The booking has not been confirmed yet. Wait for payment verification
                  or return to the payment page.
                </InlineNotice>
              )}

              <dl className="grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-4 border-b border-dashed border-[var(--line)] pb-3">
                  <dt className="text-[var(--text-muted)]">Booking ID</dt>
                  <dd className="font-medium">{booking.id}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-dashed border-[var(--line)] pb-3">
                  <dt className="text-[var(--text-muted)]">Stay</dt>
                  <dd className="font-medium">{booking.stay?.name ?? "Unavailable"}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-dashed border-[var(--line)] pb-3">
                  <dt className="text-[var(--text-muted)]">Dates</dt>
                  <dd className="font-medium">{describeBookingDates(booking)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-dashed border-[var(--line)] pb-3">
                  <dt className="text-[var(--text-muted)]">Guests</dt>
                  <dd className="font-medium">{booking.guests}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-dashed border-[var(--line)] pb-3">
                  <dt className="text-[var(--text-muted)]">Amount</dt>
                  <dd className="font-medium">{formatCurrency(booking.totalAmount)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[var(--text-muted)]">Payment</dt>
                  <dd className="font-medium">
                    <PaymentStatusPill status={paymentStatus} />
                  </dd>
                </div>
              </dl>
            </div>
          </StrongCard>

          <Card className="p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
              Next steps
            </p>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-[var(--text-muted)]">
              <p>Review the booking in your bookings list.</p>
              <p>Return to the stay if you want to inspect details again.</p>
              <p>
                Payment verification and booking confirmation are only final once the
                backend returns them.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton href={routes.bookings}>My bookings</LinkButton>
              <LinkButton href={booking.stayId ? routes.stay(booking.stayId) : routes.stays} variant="secondary">
                Back to stay
              </LinkButton>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
