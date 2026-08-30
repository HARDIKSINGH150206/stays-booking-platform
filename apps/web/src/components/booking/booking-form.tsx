"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/button";
import { Card } from "@/components/common/card";
import { Input } from "@/components/common/input";
import { InlineNotice, SmallNote } from "@/components/common/feedback";
import { useSession } from "@/components/providers/session-provider";
import { createBooking, quoteBooking } from "@/lib/api/bookings";
import { isApiUnavailableError, toErrorMessage } from "@/lib/api/client";
import { routes } from "@/lib/routes";
import type { BookingQuote, Stay } from "@/lib/types";
import { formatCurrency, getNights } from "@/lib/utils";

interface FormState {
  checkIn: string;
  checkOut: string;
  guests: number;
}

const initialState: FormState = {
  checkIn: "",
  checkOut: "",
  guests: 1,
};

interface FormErrors {
  checkIn?: string;
  checkOut?: string;
  guests?: string;
}

export function BookingForm({ stay }: Readonly<{ stay: Stay }>) {
  const { isAuthenticated } = useSession();
  const [state, setState] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [quote, setQuote] = useState<BookingQuote | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const router = useRouter();

  const nights = useMemo(
    () => (state.checkIn && state.checkOut ? getNights(state.checkIn, state.checkOut) : 0),
    [state.checkIn, state.checkOut],
  );

  function validate(next: FormState): FormErrors {
    const nextErrors: FormErrors = {};
    if (!next.checkIn) {
      nextErrors.checkIn = "Select a check-in date.";
    }
    if (!next.checkOut) {
      nextErrors.checkOut = "Select a check-out date.";
    }
    if (next.checkIn && next.checkOut && new Date(next.checkOut) <= new Date(next.checkIn)) {
      nextErrors.checkOut = "Check-out must be after check-in.";
    }
    if (next.guests < 1) {
      nextErrors.guests = "Guests must be at least 1.";
    } else if (next.guests > stay.maxGuests) {
      nextErrors.guests = `This stay supports up to ${stay.maxGuests} guests.`;
    }
    return nextErrors;
  }

  async function handleQuote() {
    const nextErrors = validate(state);
    setErrors(nextErrors);
    setErrorMessage(null);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setQuoteLoading(true);
    try {
      const nextQuote = await quoteBooking({
        stayId: stay.id,
        checkIn: state.checkIn,
        checkOut: state.checkOut,
        guests: state.guests,
      });
      setQuote(nextQuote);
    } catch (error) {
      if (isApiUnavailableError(error)) {
        setErrorMessage(
          "Booking quote service is not connected yet. The form is ready, but live pricing is unavailable.",
        );
      } else {
        setErrorMessage(toErrorMessage(error));
      }
    } finally {
      setQuoteLoading(false);
    }
  }

  async function handleContinue() {
    const nextErrors = validate(state);
    setErrors(nextErrors);
    setErrorMessage(null);

    if (Object.keys(nextErrors).length > 0 || !quote) {
      return;
    }

    setBookingLoading(true);
    try {
      const booking = await createBooking({
        stayId: stay.id,
        checkIn: state.checkIn,
        checkOut: state.checkOut,
        guests: state.guests,
      });
      router.push(routes.payment(booking.id));
    } catch (error) {
      if (isApiUnavailableError(error)) {
        setErrorMessage(
          "Booking creation is not connected yet. The frontend flow is ready, but the backend endpoint is unavailable.",
        );
      } else {
        setErrorMessage(toErrorMessage(error));
      }
    } finally {
      setBookingLoading(false);
    }
  }

  const bookingReady = Boolean(quote && !quoteLoading);

  return (
    <Card className="p-6 sm:p-8">
      <div className="grid gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
            Book this stay
          </p>
          <h3 className="stays-heading mt-2 text-3xl">Select dates and guests</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
            The backend calculates availability and final pricing. We only use the
            response it returns.
          </p>
        </div>

        {!isAuthenticated ? (
          <InlineNotice tone="warning">
            You need to be signed in before creating a booking.{" "}
            <a href={routes.login} className="font-semibold underline">
              Login
            </a>{" "}
            or{" "}
            <a href={routes.register} className="font-semibold underline">
              register
            </a>{" "}
            to continue.
          </InlineNotice>
        ) : null}

        {errorMessage ? <InlineNotice tone="danger">{errorMessage}</InlineNotice> : null}

        <div className="stays-grid">
          <div className="stays-grid stays-grid-3">
            <Input
              label="Check-in"
              type="date"
              value={state.checkIn}
              error={errors.checkIn}
              onChange={(event) => {
                setState((current) => ({ ...current, checkIn: event.target.value }));
                setQuote(null);
              }}
            />
            <Input
              label="Check-out"
              type="date"
              value={state.checkOut}
              error={errors.checkOut}
              onChange={(event) => {
                setState((current) => ({ ...current, checkOut: event.target.value }));
                setQuote(null);
              }}
            />
            <Input
              label="Guests"
              type="number"
              min={1}
              max={stay.maxGuests}
              value={state.guests}
              error={errors.guests}
              onChange={(event) => {
                const nextValue = Number(event.target.value);
                setState((current) => ({
                  ...current,
                  guests: Number.isFinite(nextValue) ? nextValue : 1,
                }));
                setQuote(null);
              }}
            />
          </div>

          <div className="rounded-[1.35rem] border border-[var(--line)] bg-[var(--surface-soft)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  Client estimate
                </p>
                <p className="mt-1 text-lg font-semibold text-[var(--text)]">
                  {nights ? `${nights} night${nights === 1 ? "" : "s"}` : "Select dates"}
                </p>
              </div>
              <p className="text-sm text-[var(--text-muted)]">
                Up to {stay.maxGuests} guests
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button type="button" onClick={handleQuote} disabled={quoteLoading || !isAuthenticated}>
                {quoteLoading ? "Checking..." : "Check availability & quote"}
              </Button>
              {quote ? (
                <span className="rounded-full border border-[rgba(47,107,79,0.18)] bg-[rgba(47,107,79,0.08)] px-4 py-2 text-sm font-medium text-[var(--success)]">
                  Server total {formatCurrency(quote.totalAmount)}
                </span>
              ) : null}
            </div>
          </div>

          {quote ? (
            <div className="rounded-[1.35rem] border border-[rgba(47,107,79,0.18)] bg-[rgba(47,107,79,0.06)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--success)]">
                    Quote received
                  </p>
                  <p className="mt-1 text-lg font-semibold text-[var(--text)]">
                    {formatCurrency(quote.totalAmount)}
                  </p>
                </div>
                <p className="text-sm text-[var(--text-muted)]">
                  The backend has validated the selected stay, dates, and guest count.
                </p>
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={handleContinue}
              disabled={!bookingReady || bookingLoading || !isAuthenticated}
            >
              {bookingLoading ? "Creating booking..." : "Continue to payment"}
            </Button>
            <SmallNote>
              {quote
                ? "Payment begins only after the backend creates the booking."
                : "Check the quote first to see the authoritative amount."}
            </SmallNote>
          </div>
        </div>
      </div>
    </Card>
  );
}
