"use client";

import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

function buttonClasses(variant: ButtonVariant, size: ButtonSize, className = ""): string {
  const base =
    "stays-focus-visible inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60";
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-3 text-sm sm:text-base",
  };
  const variants = {
    primary:
      "bg-[var(--accent)] text-white shadow-[0_10px_24px_rgba(122,93,62,0.18)] hover:bg-[var(--accent-strong)]",
    secondary:
      "bg-[var(--surface)] text-[var(--text)] border border-[var(--line)] hover:border-[var(--accent)] hover:text-[var(--accent-strong)]",
    ghost:
      "bg-transparent text-[var(--text)] hover:bg-[rgba(122,93,62,0.08)]",
    danger:
      "bg-[var(--danger)] text-white hover:bg-[#7f3127]",
  };

  return `${base} ${sizes[size]} ${variants[variant]} ${className}`.trim();
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: ButtonBaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
