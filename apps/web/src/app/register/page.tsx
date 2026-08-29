"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { Card } from "@/components/common/card";
import { LinkButton } from "@/components/common/button";
import { LoadingState } from "@/components/common/feedback";
import { routes } from "@/lib/routes";

function RegisterPageContent() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? undefined;

  return (
    <div className="stays-container py-10 sm:py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="order-2 p-6 sm:p-8 lg:order-1 lg:p-10">
          <div className="grid gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                Join STAYS
              </p>
              <h1 className="stays-heading mt-2 text-4xl">Create your account</h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--text-muted)] sm:text-base">
                Register once, then move from discovery to booking and confirmation in
                one flow.
              </p>
            </div>

            <div className="grid gap-3">
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
                <p className="text-sm font-semibold text-[var(--accent-strong)]">
                  Built for a focused demo
                </p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  No fake profile data, no noisy features, no unrelated dashboards.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <LinkButton href={routes.stays} variant="secondary">
                Explore stays
              </LinkButton>
              <LinkButton href={routes.login} variant="ghost">
                Login instead
              </LinkButton>
            </div>
          </div>
        </Card>

        <div className="order-1 lg:order-2">
          <RegisterForm returnTo={returnTo} />
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="stays-container py-10 sm:py-16">
          <LoadingState title="Loading register" description="Preparing the sign-up form." />
        </div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}
