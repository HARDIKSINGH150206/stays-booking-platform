"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, LinkButton } from "@/components/common/button";
import { Card } from "@/components/common/card";
import { Input } from "@/components/common/input";
import { InlineNotice } from "@/components/common/feedback";
import { useSession } from "@/components/providers/session-provider";
import { register } from "@/lib/api/auth";
import { isApiUnavailableError, toErrorMessage } from "@/lib/api/client";
import { routes } from "@/lib/routes";

interface FormState {
  name: string;
  email: string;
  password: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  password: "",
};

export function RegisterForm({ returnTo }: Readonly<{ returnTo?: string }>) {
  const [state, setState] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { signIn } = useSession();

  const canSubmit = useMemo(
    () =>
      state.name.trim().length > 0 &&
      state.email.trim().length > 0 &&
      state.password.trim().length > 0,
    [state.email, state.name, state.password],
  );

  function validate(next: FormState): Partial<FormState> {
    const nextErrors: Partial<FormState> = {};
    if (!next.name.trim()) {
      nextErrors.name = "Name is required.";
    }
    if (!next.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!next.password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (next.password.length < 8) {
      nextErrors.password = "Use at least 8 characters.";
    }
    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(state);
    setErrors(nextErrors);
    setErrorMessage(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const session = await register({
        name: state.name.trim(),
        email: state.email.trim(),
        password: state.password,
      });
      signIn(session);
      router.replace(returnTo ?? routes.dashboard);
    } catch (error) {
      if (isApiUnavailableError(error)) {
        setErrorMessage(
          "Authentication backend is not connected yet. The registration UI is ready, but live sign-up is unavailable.",
        );
      } else {
        setErrorMessage(toErrorMessage(error));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <div>
          <h1 className="stays-heading text-3xl">Create account</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Start with STAYS to discover a stay and move through booking securely.
          </p>
        </div>

        {errorMessage ? <InlineNotice tone="danger">{errorMessage}</InlineNotice> : null}

        <Input
          label="Name"
          autoComplete="name"
          value={state.name}
          error={errors.name}
          onChange={(event) => setState((current) => ({ ...current, name: event.target.value }))}
          placeholder="Aryan"
        />

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={state.email}
          error={errors.email}
          onChange={(event) => setState((current) => ({ ...current, email: event.target.value }))}
          placeholder="demo@stays.local"
        />

        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          value={state.password}
          error={errors.password}
          onChange={(event) =>
            setState((current) => ({ ...current, password: event.target.value }))
          }
          placeholder="Choose a secure password"
        />

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "Creating account..." : "Register"}
          </Button>
          <LinkButton href={routes.login} variant="secondary">
            I already have an account
          </LinkButton>
        </div>
      </form>
    </Card>
  );
}
