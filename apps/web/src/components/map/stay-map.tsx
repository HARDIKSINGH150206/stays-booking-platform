import { Card } from "@/components/common/card";
import type { Stay } from "@/lib/types";
import { clamp, formatCurrency, getStayLocation } from "@/lib/utils";

export function StayMap({ stay }: Readonly<{ stay: Stay }>) {
  const markerTop = `${clamp(50 - stay.latitude / 2.2, 12, 78)}%`;
  const markerLeft = `${clamp(50 + stay.longitude / 4.5, 12, 82)}%`;

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-[var(--line)] px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
              Location
            </p>
            <h3 className="stays-heading mt-1 text-2xl">{stay.name}</h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">{getStayLocation(stay)}</p>
          </div>
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-soft)] px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Nightly
            </p>
            <p className="text-lg font-semibold">{formatCurrency(stay.pricePerNight)}</p>
            <p className="text-xs text-[var(--text-muted)]">Up to {stay.maxGuests} guests</p>
          </div>
        </div>
      </div>

      <div className="relative min-h-[22rem] overflow-hidden bg-[linear-gradient(135deg,rgba(122,93,62,0.08),rgba(31,41,35,0.05))]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.65),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.45),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.5),rgba(255,255,255,0.1))]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-60" />
        <div
          className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-[var(--accent)] shadow-[0_0_0_10px_rgba(122,93,62,0.12)]"
          style={{ top: markerTop, left: markerLeft }}
          aria-hidden="true"
        />
        <div
          className="absolute max-w-[16rem] -translate-x-1/2 -translate-y-[calc(100%+1rem)] rounded-3xl border border-[rgba(255,255,255,0.72)] bg-white/90 p-4 shadow-[0_16px_32px_rgba(31,41,35,0.14)]"
          style={{ top: markerTop, left: markerLeft }}
        >
          <p className="text-sm font-semibold text-[var(--text)]">{stay.name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Map provider not configured
          </p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Latitude {stay.latitude.toFixed(4)}, longitude {stay.longitude.toFixed(4)}
          </p>
        </div>
        <div className="absolute bottom-4 left-4 rounded-2xl border border-[rgba(255,255,255,0.74)] bg-white/90 px-4 py-3 text-sm text-[var(--text-muted)] shadow-[0_10px_24px_rgba(31,41,35,0.1)]">
          Interactive map can be connected once the selected provider is configured.
        </div>
      </div>
    </Card>
  );
}
