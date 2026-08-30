import Link from 'next/link';
import type { Stay } from '@/lib/types';

interface StayCardProps {
  stay: Stay;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN').format(price);
}

export function StayCard({ stay }: StayCardProps) {
  const rating =
    stay.rating !== null && stay.rating !== undefined
      ? Number(stay.rating)
      : null;

  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex h-44 items-center justify-center bg-zinc-100">
        <span className="text-sm text-zinc-400">
          Stay image
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">
              {stay.name}
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {stay.city}, {stay.state}
            </p>
          </div>

          {rating !== null && (
            <span className="rounded-lg bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
              ★ {rating.toFixed(1)}
            </span>
          )}
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-6 text-zinc-600">
          {stay.description}
        </p>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <span className="text-lg font-semibold text-zinc-950">
              ₹{formatPrice(stay.pricePerNight)}
            </span>
            <span className="text-sm text-zinc-500">
              {' '}
              / night
            </span>
          </div>

          <span className="text-xs text-zinc-500">
            Up to {stay.maxGuests} guests
          </span>
        </div>

        <Link
          href={`/stays/${stay.id}`}
          className="mt-5 block rounded-xl bg-zinc-950 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          View stay
        </Link>
      </div>
    </article>
  );
}
