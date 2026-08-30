"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/common/card";
import { EmptyState, ErrorState, LoadingState, SectionHeading, InlineNotice } from "@/components/common/feedback";
import { RazorpayCheckout } from "@/components/payments/razorpay-checkout";
import { getBooking } from "@/lib/api/bookings";
import { isApiUnavailableError, toErrorMessage } from "@/lib/api/client";
import { routes } from "@/lib/routes";
import type { Booking } from "@/lib/types";
import { useSession } from "@/components/providers/session-provider";
import { LinkButton } from "@/components/common/button";
import { describeBookingDates, formatCurrency } from "@/lib/utils";
import { PaymentStatusPill } from "@/components/payments/payment-status";

export default function PaymentPage() {
  const { isAuthenticated } = useSession();
  const params = useParams<{ bookingId: string }>();
  const bookingId = params?.bookingId;
  const router = useRouter();
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
              ? "Booking payment backend is not connected yet."
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
        <LoadingState title="Loading payment" description="Fetching the booking to prepare payment." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="stays-container py-10 sm:py-16">
        <ErrorState description={error} actionLabel="Back to stays" actionHref={routes.stays} />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="stays-container py-10 sm:py-16">
        <EmptyState
          title="Booking not found"
          description="The payment page could not locate the booking record."
          actionLabel="Back to bookings"
          actionHref={routes.bookings}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="stays-container py-10 sm:py-16">
        <Card className="p-6 sm:p-8">
          <div className="grid gap-4">
            <SectionHeading
              eyebrow="Protected step"
              title="Sign in to complete payment"
              description="Payment can only be completed while signed in."
            />
            <div className="flex flex-wrap gap-3">
              <LinkButton href={routes.login}>Login</LinkButton>
              <LinkButton href={routes.register} variant="secondary">
                Register
              </LinkButton>
              <LinkButton href={routes.bookings} variant="ghost">
                My bookings
              </LinkButton>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="stays-container py-10 sm:py-16">
      <div className="grid gap-8">
        <SectionHeading
          eyebrow="Payment"
          title="Complete your Razorpay checkout"
          description="Razorpay order creation and verification happen through the backend. The frontend only launches checkout when those endpoints are live."
          actions={
            <div className="flex flex-wrap gap-3">
              <LinkButton href={routes.confirmation(booking.id)} variant="secondary">
                Confirmation
              </LinkButton>
            </div>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="p-6">
            <div className="grid gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                  Booking details
                </p>
                <h2 className="stays-heading mt-2 text-3xl">
                  {booking.stay?.name ?? "Stay booking"}
                </h2>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  {booking.stay ? booking.stay.city : "Stay information unavailable"}
                </p>
              </div>

              <div className="grid gap-3 rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--text-muted)]">Booking id</span>
                  <span className="font-medium">{booking.id}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--text-muted)]">Dates</span>
                  <span className="font-medium">{describeBookingDates(booking)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--text-muted)]">Guests</span>
                  <span className="font-medium">{booking.guests}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--text-muted)]">Total</span>
                  <span className="font-medium">{formatCurrency(booking.totalAmount)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--text-muted)]">Status</span>
                  <span className="font-medium">{booking.status}</span>
                </div>
              </div>

              {booking.status === "CONFIRMED" ? (
                <InlineNotice tone="success">
                  This booking is already confirmed. Payment has either succeeded or
                  already been verified.
                </InlineNotice>
              ) : null}

              <RazorpayCheckout
                booking={booking}
                onConfirmed={(confirmedBookingId) => {
                  router.push(routes.confirmation(confirmedBookingId));
                }}
              />
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
              Payment rules
            </p>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-[var(--text-muted)]">
              <li>The backend creates the Razorpay order.</li>
              <li>The frontend opens checkout with the public key only.</li>
              <li>Verification happens on the server before confirmation.</li>
              <li>The booking is never marked complete from the browser alone.</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton href={routes.bookings}>Back to bookings</LinkButton>
              <LinkButton href={booking.stayId ? routes.stay(booking.stayId) : routes.stays} variant="secondary">
                Return to stay
              </LinkButton>
            </div>
            <div className="mt-6">
              <PaymentStatusPill status={booking.payments?.[0]?.status ?? "CREATED"} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
