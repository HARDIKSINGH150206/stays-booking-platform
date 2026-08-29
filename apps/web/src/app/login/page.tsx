"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { Card } from "@/components/common/card";
import { LinkButton } from "@/components/common/button";
import { LoadingState } from "@/components/common/feedback";
import { routes } from "@/lib/routes";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? undefined;

  return (
    <div className="stays-container py-10 sm:py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-6 sm:p-8 lg:p-10">
          <div className="grid gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                Welcome back
              </p>
              <h1 className="stays-heading mt-2 text-4xl">Login to continue</h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--text-muted)] sm:text-base">
                Sign in to access the dashboard, booking flow, and your reservation
                history.
              </p>
            </div>

            <div className="grid gap-3">
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
                <p className="text-sm font-semibold text-[var(--accent-strong)]">
                  Demo account
                </p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  demo@stays.local
                </p>
              </div>
              <p className="text-sm text-[var(--text-muted)]">
                If the backend is not connected yet, the form will explain the current
                integration boundary rather than faking a login.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <LinkButton href={routes.stays} variant="secondary">
                Explore stays
              </LinkButton>
              <LinkButton href={routes.register} variant="ghost">
                Register instead
              </LinkButton>
            </div>
          </div>
        </Card>

        <LoginForm returnTo={returnTo} />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="stays-container py-10 sm:py-16">
          <LoadingState title="Loading login" description="Preparing the sign-in form." />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
