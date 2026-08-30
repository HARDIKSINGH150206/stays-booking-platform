'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCurrentUser, getMyBookings } from '@/lib/api';
import { getAccessToken } from '@/lib/auth';
import type { Booking, User } from '@/lib/types';

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function statusClass(status: Booking['status']) {
  switch (status) {
    case 'CONFIRMED':
      return 'bg-emerald-50 text-emerald-700';
    case 'PENDING':
      return 'bg-amber-50 text-amber-700';
    case 'CANCELLED':
      return 'bg-red-50 text-red-700';
    case 'FAILED':
      return 'bg-red-50 text-red-700';
    default:
      return 'bg-zinc-100 text-zinc-700';
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      const token = getAccessToken();

      if (!token) {
        window.location.href = '/login?redirect=%2Fdashboard';
        return;
      }

      try {
        const [currentUser, myBookings] = await Promise.all([
          getCurrentUser(token),
          getMyBookings(token),
        ]);

        setUser(currentUser);
        setBookings(myBookings);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Unable to load dashboard.';

        if (
          message.toLowerCase().includes('token') ||
          message.toLowerCase().includes('unauthorized')
        ) {
          window.location.href = '/login?redirect=%2Fdashboard';
          return;
        }

        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-50 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-zinc-500">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">
            Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">
            Welcome{user?.name ? `, ${user.name}` : ''}
          </h1>

          <p className="mt-2 text-zinc-600">
            Manage your stays and reservations.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-zinc-950">
                My bookings
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                {bookings.length === 0
                  ? 'You have no bookings yet.'
                  : `${bookings.length} booking${bookings.length === 1 ? '' : 's'}`}
              </p>
            </div>

            <Link
              href="/stays"
              className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Explore stays
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
              <h3 className="text-lg font-semibold text-zinc-950">
                No bookings yet
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                Find a stay and make your first reservation.
              </p>

              <Link
                href="/stays"
                className="mt-6 inline-flex rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                Browse stays
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const payment = booking.payments?.[0];

                return (
                  <article
                    key={booking.id}
                    className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-zinc-950">
                            {booking.stay?.name ?? 'Stay'}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                              booking.status,
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-zinc-500">
                          {booking.stay
                            ? `${booking.stay.city}, ${booking.stay.state}`
                            : 'Location unavailable'}
                        </p>
                      </div>

                      <div className="md:text-right">
                        <p className="text-xl font-bold text-zinc-950">
                          ₹{booking.totalAmount.toLocaleString('en-IN')}
                        </p>

                        <p className="text-sm text-zinc-500">total</p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 border-t border-zinc-100 pt-6 sm:grid-cols-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-400">
                          Check-in
                        </p>
                        <p className="mt-1 text-sm font-medium text-zinc-800">
                          {formatDate(booking.checkIn)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-400">
                          Check-out
                        </p>
                        <p className="mt-1 text-sm font-medium text-zinc-800">
                          {formatDate(booking.checkOut)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-400">
                          Guests
                        </p>
                        <p className="mt-1 text-sm font-medium text-zinc-800">
                          {booking.guests}
                        </p>
                      </div>
                    </div>

                    {payment && (
                      <div className="mt-5 text-xs text-zinc-500">
                        Payment: {payment.status}
                      </div>
                    )}

                    {booking.stay && (
                      <div className="mt-5">
                        <Link
                          href={`/stays/${booking.stay.id}`}
                          className="text-sm font-medium text-zinc-700 hover:text-zinc-950"
                        >
                          View stay →
                        </Link>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
