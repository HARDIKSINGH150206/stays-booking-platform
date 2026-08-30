'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import { clearAccessToken, getAccessToken } from '@/lib/auth';

const emptySubscribe = () => () => { };

function getAuthenticatedSnapshot() {
  return Boolean(getAccessToken());
}

function getServerAuthenticatedSnapshot() {
  return false;
}

export function Navbar() {
  const router = useRouter();

  const authenticated = useSyncExternalStore(
    emptySubscribe,
    getAuthenticatedSnapshot,
    getServerAuthenticatedSnapshot,
  );

  function logout() {
    clearAccessToken();
    router.push('/');
    router.refresh();
  }

  return (
    <header className="border-b border-zinc-100 bg-white">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-zinc-950"
        >
          Dhyana Stays
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/stays"
            className="hidden text-sm text-zinc-600 transition hover:text-zinc-950 sm:block"
          >
            Explore
          </Link>

          {authenticated ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Dashboard
              </Link>

              <button
                type="button"
                onClick={logout}
                className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}