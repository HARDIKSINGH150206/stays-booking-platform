import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/common/badge";
import { Card } from "@/components/common/card";
import { LinkButton } from "@/components/common/button";
import { routes } from "@/lib/routes";
import type { Stay } from "@/lib/types";
import { formatCurrency, getStayAmenities, getStayLocation, getStayType } from "@/lib/utils";

const placeholderImage = "/stay-placeholder.svg";

export function StayCard({ stay }: Readonly<{ stay: Stay }>) {
  const amenities = getStayAmenities(stay).slice(0, 3);
  const type = getStayType(stay);

  return (
    <Card className="overflow-hidden">
      <div className="grid gap-0">
        <Link href={routes.stay(stay.id)} className="group block">
          <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface-soft)]">
            <Image
              src={placeholderImage}
              alt={`${stay.name} stay preview`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(31,41,35,0.36)] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
              <Badge tone="accent">{type ?? "Curated stay"}</Badge>
              <Badge>{stay.rating ? `${stay.rating.toFixed(1)} rating` : "Rated stay"}</Badge>
            </div>
          </div>
        </Link>
        <div className="grid gap-4 p-5">
          <div className="grid gap-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="stays-heading text-2xl">{stay.name}</h3>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{getStayLocation(stay)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  From
                </p>
                <p className="text-lg font-semibold text-[var(--text)]">
                  {formatCurrency(stay.pricePerNight)}
                </p>
                <p className="text-xs text-[var(--text-muted)]">per night</p>
              </div>
            </div>
            <p className="line-clamp-3 text-sm leading-6 text-[var(--text-muted)]">
              {stay.description}
            </p>
          </div>
          {amenities.length ? (
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity) => (
                <Badge key={amenity}>{amenity}</Badge>
              ))}
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-[var(--text-muted)]">Up to {stay.maxGuests} guests</p>
            <LinkButton href={routes.stay(stay.id)} size="sm">
              View stay
            </LinkButton>
          </div>
        </div>
      </div>
    </Card>
  );
}
