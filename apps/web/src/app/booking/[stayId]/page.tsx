"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BookingForm } from "@/components/booking/booking-form";
import { Card } from "@/components/common/card";
import { EmptyState, ErrorState, LoadingState, SectionHeading } from "@/components/common/feedback";
import { getStay } from "@/lib/api/stays";
import { isApiUnavailableError, toErrorMessage } from "@/lib/api/client";
import { routes } from "@/lib/routes";
import type { Stay } from "@/lib/types";
import { useSession } from "@/components/providers/session-provider";
import { LinkButton } from "@/components/common/button";

export default function BookingPage() {
  const { isAuthenticated } = useSession();
  const params = useParams<{ stayId: string }>();
  const stayId = params?.stayId;
  const [stay, setStay] = useState<Stay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!stayId) {
        if (active) {
          setLoading(false);
          setError("Missing stay id.");
        }
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const nextStay = await getStay(stayId);
        if (active) {
          setStay(nextStay);
        }
      } catch (error) {
        if (active) {
          setError(
            isApiUnavailableError(error)
              ? "Booking stay data backend is not connected yet."
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
  }, [stayId]);

  if (loading) {
    return (
      <div className="stays-container py-10 sm:py-16">
        <LoadingState title="Loading booking" description="Fetching stay details for booking." />
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

  if (!stay) {
    return (
      <div className="stays-container py-10 sm:py-16">
        <EmptyState
          title="Stay not found"
          description="The booking page could not load the selected stay."
          actionLabel="Back to stays"
          actionHref={routes.stays}
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
              title="Sign in to continue"
              description="Bookings require an authenticated session. Once login is available, this page will continue into quote and payment."
            />
            <div className="flex flex-wrap gap-3">
              <LinkButton href={routes.login}>Login</LinkButton>
              <LinkButton href={routes.register} variant="secondary">
                Register
              </LinkButton>
              <LinkButton href={routes.stay(stay.id)} variant="ghost">
                Back to stay
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
          eyebrow="Booking"
          title={`Book ${stay.name}`}
          description="Choose dates and guests, then let the server calculate availability and price."
          actions={
            <div className="flex flex-wrap gap-3">
              <LinkButton href={routes.stay(stay.id)} variant="secondary">
                Back to stay
              </LinkButton>
            </div>
          }
        />
        <BookingForm stay={stay} />
      </div>
    </div>
  );
}
