"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, LinkButton } from "@/components/common/button";
import { useSession } from "@/components/providers/session-provider";
import { routes } from "@/lib/routes";

const publicLinks = [
  { href: routes.stays, label: "Stays" },
  { href: routes.login, label: "Login" },
  { href: routes.register, label: "Register" },
];

const privateLinks = [
  { href: routes.stays, label: "Stays" },
  { href: routes.bookings, label: "My Bookings" },
  { href: routes.dashboard, label: "Dashboard" },
];

export function AppHeader() {
  const { isAuthenticated, signOut, isReady } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const links = isAuthenticated ? privateLinks : publicLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(221,210,196,0.8)] bg-[rgba(246,240,231,0.9)] backdrop-blur-md">
      <div className="stays-container flex min-h-20 flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
        <Link href={routes.home} className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-sm font-semibold tracking-[0.24em] text-[var(--accent-strong)]">
            S
          </span>
          <span className="flex flex-col leading-tight">
            <span className="stays-heading text-xl">STAYS</span>
            <span className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
              hospitality booking
            </span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[rgba(122,93,62,0.12)] text-[var(--accent-strong)]"
                    : "text-[var(--text-muted)] hover:bg-[rgba(122,93,62,0.08)] hover:text-[var(--text)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <div className="hidden sm:block">
                <LinkButton href={routes.stays} variant="secondary" size="sm">
                  Explore
                </LinkButton>
              </div>
              <div className="sm:hidden">
                <LinkButton href={routes.stays} variant="secondary" size="sm">
                  Stays
                </LinkButton>
              </div>
            </>
          ) : (
            <>
              <span className="hidden rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-sm text-[var(--text-muted)] sm:inline-flex">
                {isReady ? "Signed in" : "Loading session"}
              </span>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => {
                  signOut();
                  router.push(routes.home);
                }}
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
