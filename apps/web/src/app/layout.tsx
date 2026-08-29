import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppFooter } from "@/components/layout/app-footer";
import { AppHeader } from "@/components/layout/app-header";
import { SessionProvider } from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: {
    default: "STAYS",
    template: "%s · STAYS",
  },
  description:
    "STAYS is a focused hospitality booking platform for discovering stays, booking securely, and managing reservations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[var(--bg)] text-[var(--text)] antialiased">
        <SessionProvider>
          <div className="flex min-h-screen flex-col">
            <AppHeader />
            <main className="flex-1">{children}</main>
            <AppFooter />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
