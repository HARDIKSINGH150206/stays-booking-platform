'use client';

import Script from 'next/script';
import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  checkAvailability,
  createBooking,
  createPaymentOrder,
  getBookingQuote,
  getStay,
  verifyPayment,
} from '@/lib/api';
import { getAccessToken } from '@/lib/auth';
import type { BookingQuote, Stay } from '@/lib/types';

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
};

type RazorpayPaymentResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = {
  open: () => void;
};

export default function BookingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const stayId = params.id;

  const [stay, setStay] = useState<Stay | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const [quote, setQuote] = useState<BookingQuote | null>(null);
  const [loadingStay, setLoadingStay] = useState(true);
  const [checking, setChecking] = useState(false);
  const [creating, setCreating] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [available, setAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadStay() {
      try {
        const data = await getStay(stayId);
        setStay(data);
      } catch {
        setError('Unable to load this stay.');
      } finally {
        setLoadingStay(false);
      }
    }

    loadStay();
  }, [stayId]);

  async function handleCheckAvailability(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');
    setQuote(null);
    setAvailable(null);

    if (!checkIn || !checkOut) {
      setError('Please select both check-in and check-out dates.');
      return;
    }

    if (checkOut <= checkIn) {
      setError('Check-out must be after check-in.');
      return;
    }

    if (guests < 1 || guests > stay!.maxGuests) {
      setError(
        `This stay allows a maximum of ${stay!.maxGuests} guests.`,
      );
      return;
    }

    setChecking(true);

    try {
      const availability = await checkAvailability(
        stayId,
        checkIn,
        checkOut,
      );

      setAvailable(availability.available);

      if (!availability.available) {
        setError('This stay is not available for those dates.');
        return;
      }

      const bookingQuote = await getBookingQuote({
        stayId,
        checkIn,
        checkOut,
        guests,
      });

      setQuote(bookingQuote);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to check availability.',
      );
    } finally {
      setChecking(false);
    }
  }

  async function handleCreateBooking() {
    if (!quote || !stay) return;

    const token = getAccessToken();

    if (!token) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          `/stays/${stayId}/book`,
        )}`,
      );
      return;
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      setError('Razorpay is not configured.');
      return;
    }

    if (!window.Razorpay) {
      setError(
        'Razorpay Checkout is still loading. Please try again.',
      );
      return;
    }

    setCreating(true);
    setError('');

    try {
      const booking = await createBooking(token, {
        stayId,
        checkIn,
        checkOut,
        guests,
      });

      const paymentOrder = await createPaymentOrder(
        token,
        booking.id,
      );

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: paymentOrder.amount * 100,
        currency: paymentOrder.currency ?? 'INR',
        name: 'Stays Booking',
        description: `Booking for ${stay.name}`,
        order_id: paymentOrder.razorpayOrderId,

        handler: async (
          response: RazorpayPaymentResponse,
        ) => {
          setCreating(false);
          setVerifying(true);
          setError('');

          try {
            const verification = await verifyPayment(
              token,
              {
                paymentId: paymentOrder.paymentId,
                bookingId: booking.id,
                razorpayOrderId:
                  response.razorpay_order_id,
                razorpayPaymentId:
                  response.razorpay_payment_id,
                razorpaySignature:
                  response.razorpay_signature,
              },
            );

            if (
              verification.status !== 'SUCCESS' ||
              verification.bookingStatus !== 'CONFIRMED'
            ) {
              throw new Error(
                'Payment verification did not confirm the booking.',
              );
            }

            setSuccess(true);
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : 'Payment verification failed.',
            );
          } finally {
            setVerifying(false);
          }
        },

        modal: {
          ondismiss: () => {
            setCreating(false);
            setError(
              'Payment was cancelled. Your booking remains pending.',
            );
          },
        },
      });

      razorpay.open();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create booking or payment.',
      );
      setCreating(false);
    }
  }

  if (loadingStay) {
    return (
      <main className="min-h-screen bg-white px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <p className="text-gray-500">Loading stay...</p>
        </div>
      </main>
    );
  }

  if (!stay) {
    return (
      <main className="min-h-screen bg-white px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <p className="text-red-600">
            {error || 'Stay not found.'}
          </p>

          <Link
            href="/stays"
            className="mt-4 inline-block text-sm font-medium underline"
          >
            Back to stays
          </Link>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />

        <main className="min-h-screen bg-white px-6 py-12">
          <div className="mx-auto max-w-xl text-center">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-8">
              <div className="text-4xl">✓</div>

              <h1 className="mt-4 text-2xl font-bold text-gray-950">
                Booking confirmed
              </h1>

              <p className="mt-2 text-gray-600">
                Your payment was verified successfully.
              </p>

              <Link
                href="/stays"
                className="mt-6 inline-block rounded-xl bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
              >
                Browse more stays
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      <main className="min-h-screen bg-white px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <Link
            href={`/stays/${stay.id}`}
            className="text-sm font-medium text-gray-600 hover:text-black"
          >
            ← Back to stay
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
            <section className="rounded-2xl border border-gray-200 p-6 sm:p-8">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">
                Reserve
              </p>

              <h1 className="mt-2 text-3xl font-bold text-gray-950">
                {stay.name}
              </h1>

              <p className="mt-2 text-gray-600">
                {stay.city}, {stay.state}
              </p>

              <form
                onSubmit={handleCheckAvailability}
                className="mt-8 space-y-6"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-800">
                      Check-in
                    </span>

                    <input
                      type="date"
                      value={checkIn}
                      onChange={(event) => {
                        setCheckIn(event.target.value);
                        setQuote(null);
                        setAvailable(null);
                        setError('');
                      }}
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-800">
                      Check-out
                    </span>

                    <input
                      type="date"
                      value={checkOut}
                      onChange={(event) => {
                        setCheckOut(event.target.value);
                        setQuote(null);
                        setAvailable(null);
                        setError('');
                      }}
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                      required
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-medium text-gray-800">
                    Guests
                  </span>

                  <input
                    type="number"
                    min={1}
                    max={stay.maxGuests}
                    value={guests}
                    onChange={(event) => {
                      setGuests(Number(event.target.value));
                      setQuote(null);
                      setAvailable(null);
                      setError('');
                    }}
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    required
                  />

                  <span className="mt-2 block text-xs text-gray-500">
                    Maximum {stay.maxGuests} guests
                  </span>
                </label>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {available === true && !error && (
                  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    Stay is available for your selected dates.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={checking || creating || verifying}
                  className="w-full rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {checking
                    ? 'Checking...'
                    : 'Check availability'}
                </button>
              </form>
            </section>

            <aside className="h-fit rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-950">
                Booking summary
              </h2>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Stay</span>
                  <span className="text-right font-medium">
                    {stay.name}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Guests</span>
                  <span>{guests}</span>
                </div>

                {quote && (
                  <>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Nights</span>
                      <span>{quote.nights}</span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">
                        Price / night
                      </span>
                      <span>
                        ₹
                        {quote.pricePerNight.toLocaleString(
                          'en-IN',
                        )}
                      </span>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between gap-4 text-base font-bold">
                        <span>Total</span>
                        <span>
                          ₹
                          {quote.totalAmount.toLocaleString(
                            'en-IN',
                          )}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCreateBooking}
                      disabled={
                        creating ||
                        verifying
                      }
                      className="w-full rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {verifying
                        ? 'Verifying payment...'
                        : creating
                          ? 'Opening payment...'
                          : 'Book & Pay'}
                    </button>
                  </>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
