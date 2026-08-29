import type { ReactNode } from "react";
import { Card } from "@/components/common/card";
import { Button, LinkButton } from "@/components/common/button";

export function LoadingState({
  title = "Loading",
  description = "Please wait while the STAYS experience loads.",
}: Readonly<{
  title?: string;
  description?: string;
}>) {
  return (
    <Card className="p-6 sm:p-8">
      <div className="grid gap-4">
        <div className="h-6 w-32 rounded-full stays-skeleton" />
        <div className="h-4 w-full max-w-xl rounded-full stays-skeleton" />
        <div className="h-4 w-3/4 rounded-full stays-skeleton" />
        <div className="grid gap-3 pt-2">
          <div className="h-36 rounded-3xl stays-skeleton" />
          <div className="h-12 w-full rounded-full stays-skeleton" />
        </div>
        <p className="text-sm text-[var(--text-muted)]">{title}: {description}</p>
      </div>
    </Card>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: Readonly<{
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}>) {
  return (
    <Card className="p-6 sm:p-8">
      <div className="grid gap-4">
        <div>
          <h3 className="stays-heading text-2xl">{title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
            {description}
          </p>
        </div>
        {actionLabel && actionHref ? (
          <div>
            <LinkButton href={actionHref}>{actionLabel}</LinkButton>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export function ErrorState({
  title = "We couldn’t load this section",
  description,
  actionLabel,
  actionHref,
  onRetry,
}: Readonly<{
  title?: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onRetry?: () => void;
}>) {
  return (
    <Card className="p-6 sm:p-8">
      <div className="grid gap-4">
        <div>
          <h3 className="stays-heading text-2xl">{title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {onRetry ? (
            <Button type="button" onClick={onRetry}>
              Retry
            </Button>
          ) : null}
          {actionLabel && actionHref ? (
            <LinkButton href={actionHref} variant="secondary">
              {actionLabel}
            </LinkButton>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  actions,
}: Readonly<{
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}>) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="stays-heading mt-2 text-3xl sm:text-4xl">{title}</h2>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)] sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}

export function SmallNote({ children }: Readonly<{ children: ReactNode }>) {
  return <p className="text-sm leading-6 text-[var(--text-muted)]">{children}</p>;
}

export function InlineNotice({
  children,
  tone = "neutral",
}: Readonly<{
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
}>) {
  const toneClass =
    tone === "success"
      ? "border-[rgba(47,107,79,0.2)] bg-[rgba(47,107,79,0.08)] text-[var(--success)]"
      : tone === "warning"
        ? "border-[rgba(138,90,24,0.2)] bg-[rgba(138,90,24,0.08)] text-[var(--warning)]"
        : tone === "danger"
          ? "border-[rgba(154,65,52,0.2)] bg-[rgba(154,65,52,0.08)] text-[var(--danger)]"
          : "border-[var(--line)] bg-white text-[var(--text-muted)]";

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${toneClass}`}>{children}</div>;
}
