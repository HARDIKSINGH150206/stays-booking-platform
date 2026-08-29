"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/common/badge";
import { Card, StrongCard } from "@/components/common/card";
import { EmptyState, ErrorState, LoadingState, SectionHeading } from "@/components/common/feedback";
import { StayMap } from "@/components/map/stay-map";
import { LinkButton } from "@/components/common/button";
import { getStay } from "@/lib/api/stays";
import { isApiUnavailableError, toErrorMessage } from "@/lib/api/client";
import { routes } from "@/lib/routes";
import type { Stay } from "@/lib/types";
import { formatCurrency, getStayAmenities, getStayLocation, getStayType } from "@/lib/utils";

export default function StayDetailsPage() {
  const params = useParams<{ id: string }>();
  const stayId = useMemo(() => params?.id, [params]);
  const [stay, setStay] = useState<Stay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!stayId) {
        if (active) {
          setError("Missing stay id.");
          setLoading(false);
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
              ? "Stay details backend is not connected yet."
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
        <LoadingState title="Loading stay" description="Fetching stay details and location." />
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
          description="The selected stay no longer exists or the backend did not return a record."
          actionLabel="Back to stays"
          actionHref={routes.stays}
        />
      </div>
    );
  }

  const amenities = getStayAmenities(stay);
  const stayType = getStayType(stay);

  return (
    <div className="stays-container py-10 sm:py-16">
      <div className="grid gap-8">
        <SectionHeading
          eyebrow="Stay details"
          title={stay.name}
          description={getStayLocation(stay)}
          actions={
            <div className="flex flex-wrap gap-3">
              <LinkButton href={routes.booking(stay.id)}>Book now</LinkButton>
              <LinkButton href={routes.stays} variant="secondary">
                Back to stays
              </LinkButton>
            </div>
          }
        />

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-6">
            <StrongCard className="overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--surface-soft)]">
                <Image
                  src="/stay-placeholder.svg"
                  alt={`${stay.name} stay preview`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(31,41,35,0.32)] via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                  {stayType ? <Badge tone="accent">{stayType}</Badge> : null}
                  {stay.rating ? <Badge>{stay.rating.toFixed(1)} rating</Badge> : null}
                </div>
              </div>
            </StrongCard>

            <Card className="p-6">
              <div className="grid gap-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                      About the stay
                    </p>
                    <h2 className="stays-heading mt-2 text-3xl">{stay.city}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      Price per night
                    </p>
                    <p className="text-2xl font-semibold text-[var(--accent-strong)]">
                      {formatCurrency(stay.pricePerNight)}
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-7 text-[var(--text-muted)] sm:text-base">
                  {stay.description}
                </p>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      Guests
                    </p>
                    <p className="mt-1 text-lg font-semibold">{stay.maxGuests}</p>
                  </div>
                  <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      Rating
                    </p>
                    <p className="mt-1 text-lg font-semibold">{stay.rating ?? "—"}</p>
                  </div>
                  <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      Location
                    </p>
                    <p className="mt-1 text-lg font-semibold">{getStayLocation(stay)}</p>
                  </div>
                </div>

                {amenities.length ? (
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((amenity) => (
                      <Badge key={amenity}>{amenity}</Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            </Card>
          </div>

          <div className="grid gap-6">
            <StayMap stay={stay} />
            <Card className="p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                Booking entry point
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                Proceed to the booking flow to select dates, validate availability, and
                get a server-calculated quote.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <LinkButton href={routes.booking(stay.id)}>Book this stay</LinkButton>
                <LinkButton href={routes.bookings} variant="secondary">
                  My bookings
                </LinkButton>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
