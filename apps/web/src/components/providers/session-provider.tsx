"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { AuthSession } from "@/lib/types";

const STORAGE_KEY = "stays.session";

interface SessionContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isReady: boolean;
  signIn: (session: AuthSession) => void;
  signOut: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

function readSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.user?.id || !parsed?.user?.email || !parsed?.user?.name) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function SessionProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [sessionState, setSessionState] = useState<AuthSession | null>(null);
  const session = useSyncExternalStore(subscribe, readSession, () => null) ?? sessionState;

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session?.user),
      isReady: true,
      signIn(nextSession) {
        setSessionState(nextSession);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
        }
      },
      signOut() {
        setSessionState(null);
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(STORAGE_KEY);
          window.dispatchEvent(new Event("storage"));
        }
      },
    }),
    [session],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used inside SessionProvider.");
  }

  return context;
}
