"use client";

import { useEffect, useState } from "react";
import { LinkButton } from "@/components/common/button";
import { Card, StrongCard } from "@/components/common/card";
import { EmptyState, ErrorState, LoadingState, SectionHeading } from "@/components/common/feedback";
import { BookingList } from "@/components/dashboard/booking-list";
import { useSession } from "@/components/providers/session-provider";
import { listBookings } from "@/lib/api/bookings";
import { isApiUnavailableError, toErrorMessage } from "@/lib/api/client";
import { routes } from "@/lib/routes";
import type { Booking } from "@/lib/types";

export default function DashboardPage() {
  const { session, isAuthenticated, isReady } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!isAuthenticated) {
        if (active) {
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const nextBookings = await listBookings();
        if (active) {
          setBookings(nextBookings);
        }
      } catch (error) {
        if (active) {
          setError(
            isApiUnavailableError(error)
              ? "Booking history backend is not connected yet."
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
  }, [isAuthenticated]);

  if (!isReady) {
    return (
      <div className="stays-container py-10 sm:py-16">
        <LoadingState title="Loading session" description="Checking your signed-in state." />
      </div>
    );
  }

  if (!isAuthenticated || !session) {
    return (
      <div className="stays-container py-10 sm:py-16">
        <StrongCard className="p-6 sm:p-8 lg:p-10">
          <div className="grid gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                Protected area
              </p>
              <h1 className="stays-heading mt-2 text-4xl">Sign in to open the dashboard</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)] sm:text-base">
                The dashboard stays behind authentication. Once backend sign-in is
                available, this page will show your profile summary and bookings.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <LinkButton href={routes.login}>Login</LinkButton>
              <LinkButton href={routes.register} variant="secondary">
                Register
              </LinkButton>
              <LinkButton href={routes.stays} variant="ghost">
                Explore stays
              </LinkButton>
            </div>
          </div>
        </StrongCard>
      </div>
    );
  }

  return (
    <div className="stays-container py-10 sm:py-16">
      <div className="grid gap-8">
        <SectionHeading
          eyebrow="Dashboard"
          title={`Welcome, ${session.user.name}`}
          description="Your dashboard keeps the flow small: discover a stay, complete a booking, and review the result."
          actions={
            <div className="flex flex-wrap gap-3">
              <LinkButton href={routes.stays}>Explore stays</LinkButton>
              <LinkButton href={routes.bookings} variant="secondary">
                My bookings
              </LinkButton>
            </div>
          }
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-5 sm:col-span-2">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
              Account
            </p>
            <h2 className="stays-heading mt-2 text-3xl">Profile summary</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Name
                </p>
                <p className="mt-1 font-medium">{session.user.name}</p>
              </div>
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Email
                </p>
                <p className="mt-1 font-medium">{session.user.email}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
              Next step
            </p>
            <h2 className="stays-heading mt-2 text-2xl">Go browse stays</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
              Discover the seeded stays, open a detail page, and continue into the
              booking flow.
            </p>
            <div className="mt-5">
              <LinkButton href={routes.stays}>Explore stays</LinkButton>
            </div>
          </Card>
        </div>

        {loading ? (
          <LoadingState
            title="Loading bookings"
            description="Fetching your recent booking records from the backend."
          />
        ) : error ? (
          <ErrorState
            description={error}
            actionLabel="Explore stays"
            actionHref={routes.stays}
          />
        ) : bookings.length ? (
          <BookingList bookings={bookings.slice(0, 3)} />
        ) : (
          <EmptyState
            title="No bookings yet"
            description="Once bookings exist, they will appear here with payment and status details."
            actionLabel="Explore stays"
            actionHref={routes.stays}
          />
        )}
      </div>
    </div>
  );
}
