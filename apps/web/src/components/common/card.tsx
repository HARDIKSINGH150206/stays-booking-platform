import type { HTMLAttributes, ReactNode } from "react";

export function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={`stays-card ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function StrongCard({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={`stays-card-strong ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
