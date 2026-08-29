import Link from "next/link";
import { routes } from "@/lib/routes";

export function AppFooter() {
  return (
    <footer className="border-t border-[rgba(221,210,196,0.8)] bg-[rgba(251,247,242,0.72)]">
      <div className="stays-container flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <p className="stays-heading text-lg">STAYS</p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            A compact hospitality booking journey for discovery, booking, payment, and
            confirmation.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
          <Link href={routes.stays} className="hover:text-[var(--text)]">
            Explore stays
          </Link>
          <Link href={routes.login} className="hover:text-[var(--text)]">
            Login
          </Link>
          <Link href={routes.register} className="hover:text-[var(--text)]">
            Register
          </Link>
        </div>
      </div>
    </footer>
  );
}
