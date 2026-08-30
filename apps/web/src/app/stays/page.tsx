"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/common/card";
import { EmptyState, ErrorState, LoadingState, SectionHeading } from "@/components/common/feedback";
import { StayList } from "@/components/stays/stay-list";
import { listStays } from "@/lib/api/stays";
import { isApiUnavailableError, toErrorMessage } from "@/lib/api/client";
import { routes } from "@/lib/routes";
import type { Stay } from "@/lib/types";

export default function StaysPage() {
  const [stays, setStays] = useState<Stay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const nextStays = await listStays();
        if (active) {
          setStays(nextStays);
        }
      } catch (error) {
        if (active) {
          setError(
            isApiUnavailableError(error)
              ? "Stay catalogue backend is not connected yet."
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
  }, []);

  return (
    <div className="stays-container py-10 sm:py-16">
      <div className="grid gap-8">
        <SectionHeading
          eyebrow="Stay discovery"
          title="Browse the seeded stay catalogue"
          description="Keep the catalogue focused: each stay card shows location, price, basic metadata, and a clear route to the detail page."
        />

        {loading ? (
          <LoadingState title="Loading stays" description="Fetching the catalogue from the backend." />
        ) : error ? (
          <ErrorState
            description={error}
            actionLabel="Go home"
            actionHref={routes.home}
          />
        ) : stays.length ? (
          <StayList stays={stays} />
        ) : (
          <EmptyState
            title="No stays available"
            description="The catalogue is currently empty. When seeded stays are exposed through the API, they will appear here."
            actionLabel="Return home"
            actionHref={routes.home}
          />
        )}

        <Card className="p-5">
          <p className="text-sm leading-6 text-[var(--text-muted)]">
            This route intentionally keeps filters minimal. The first version focuses on
            a clean discovery flow instead of a noisy marketplace interface.
          </p>
        </Card>
      </div>
    </div>
  );
}
