import { Badge } from "@/components/common/badge";
import { Card, StrongCard } from "@/components/common/card";
import { LinkButton } from "@/components/common/button";
import { routes } from "@/lib/routes";

const steps = [
  "Discover a stay from the seeded catalogue.",
  "Review location, details, and availability.",
  "Book securely, pay with Razorpay, and track the result.",
];

export default function HomePage() {
  return (
    <div className="stays-container">
      <section className="stays-section py-12 sm:py-16">
        <StrongCard className="overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-7 sm:p-10 lg:p-12">
              <Badge tone="accent">Focused hospitality booking</Badge>
              <h1 className="stays-heading mt-5 max-w-xl text-4xl leading-tight sm:text-5xl">
                Find a stay, view the details, and book securely.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-muted)] sm:text-lg">
                STAYS is a compact booking platform built to demonstrate a clean
                travel journey: discovery, map context, server-authored pricing, and
                verified payment.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <LinkButton href={routes.stays}>Explore stays</LinkButton>
                <LinkButton href={routes.login} variant="secondary">
                  Login
                </LinkButton>
                <LinkButton href={routes.register} variant="ghost">
                  Register
                </LinkButton>
              </div>
            </div>
            <div className="border-t border-[var(--line)] bg-[var(--surface-soft)] p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <div className="grid h-full gap-4">
                <Card className="p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                    Product journey
                  </p>
                  <h2 className="stays-heading mt-2 text-3xl">Built for a simple demo flow</h2>
                  <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                    This version stays intentionally small, with real pages for
                    authentication, discovery, booking, payment, and booking history.
                  </p>
                </Card>
                <div className="grid gap-3">
                  {steps.map((step, index) => (
                    <Card key={step} className="flex items-start gap-4 p-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-white text-sm font-semibold text-[var(--accent-strong)]">
                        {index + 1}
                      </span>
                      <p className="text-sm leading-6 text-[var(--text-muted)]">{step}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </StrongCard>
      </section>

      <section className="stays-section">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <p className="text-sm font-semibold text-[var(--accent-strong)]">Discover</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              Browse the stay catalogue and open any stay detail page.
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-sm font-semibold text-[var(--accent-strong)]">Plan</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              Select dates and guest count, then request a server quote.
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-sm font-semibold text-[var(--accent-strong)]">Confirm</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              Continue through payment verification and review your bookings later.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
