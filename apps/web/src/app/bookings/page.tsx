"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/common/card";
import { EmptyState, ErrorState, LoadingState, SectionHeading } from "@/components/common/feedback";
import { BookingList } from "@/components/dashboard/booking-list";
import { listBookings } from "@/lib/api/bookings";
import { isApiUnavailableError, toErrorMessage } from "@/lib/api/client";
import { routes } from "@/lib/routes";
import type { Booking } from "@/lib/types";
import { LinkButton } from "@/components/common/button";
import { useSession } from "@/components/providers/session-provider";

export default function BookingsPage() {
  const { isAuthenticated, isReady } = useSession();
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
              ? "Booking list backend is not connected yet."
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
        <LoadingState title="Loading session" description="Checking authentication state." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="stays-container py-10 sm:py-16">
        <Card className="p-6 sm:p-8">
          <div className="grid gap-4">
            <SectionHeading
              eyebrow="Protected area"
              title="Sign in to see bookings"
              description="Bookings are shown only for authenticated users."
            />
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
        </Card>
      </div>
    );
  }

  return (
    <div className="stays-container py-10 sm:py-16">
      <div className="grid gap-8">
        <SectionHeading
          eyebrow="My bookings"
          title="Booking history"
          description="Track booking status, payment state, and open the confirmation page when a booking is ready."
        />

        {loading ? (
          <LoadingState title="Loading bookings" description="Fetching booking history." />
        ) : error ? (
          <ErrorState
            description={error}
            actionLabel="Explore stays"
            actionHref={routes.stays}
          />
        ) : bookings.length ? (
          <BookingList bookings={bookings} />
        ) : (
          <EmptyState
            title="No bookings yet"
            description="Once the booking backend returns records, they will appear here."
            actionLabel="Explore stays"
            actionHref={routes.stays}
          />
        )}
      </div>
    </div>
  );
}
