import type { ReactNode } from "react";

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "accent";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-white text-[var(--text-muted)] border-[var(--line)]",
  success: "bg-[rgba(47,107,79,0.1)] text-[var(--success)] border-[rgba(47,107,79,0.18)]",
  warning: "bg-[rgba(138,90,24,0.1)] text-[var(--warning)] border-[rgba(138,90,24,0.18)]",
  danger: "bg-[rgba(154,65,52,0.1)] text-[var(--danger)] border-[rgba(154,65,52,0.18)]",
  accent: "bg-[rgba(122,93,62,0.1)] text-[var(--accent-strong)] border-[rgba(122,93,62,0.18)]",
};

export function Badge({
  children,
  tone = "neutral",
}: Readonly<{
  children: ReactNode;
  tone?: BadgeTone;
}>) {
  return (
    <span className={`stays-badge border ${toneClasses[tone]}`.trim()}>{children}</span>
  );
}
