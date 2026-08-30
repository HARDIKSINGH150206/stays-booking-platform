import Link from 'next/link';
import { getStay } from '@/lib/api';
import type { Stay } from '@/lib/types';
import StayMap from '@/components/stay-map';

export default async function StayDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let stay: Stay;

  try {
    stay = await getStay(id);
  } catch {
    return (
      <main className="min-h-screen bg-white px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-red-600">Unable to load this stay.</p>

          <Link
            href="/stays"
            className="mt-4 inline-block text-sm font-medium text-gray-600 hover:text-black"
          >
            ← Back to stays
          </Link>
        </div>
      </main>
    );
  }

  const metadata = stay.metadata as
    | {
        type?: string;
        amenities?: string[];
      }
    | null
    | undefined;

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/stays"
          className="text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Back to stays
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
          {/* Stay image placeholder */}
          <div className="flex h-80 items-center justify-center bg-gray-100 text-gray-400">
            Stay image
          </div>

          <div className="p-8">
            {/* Header */}
            <div className="flex flex-col gap-6 md:flex-row md:justify-between">
              <div>
                <div className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">
                  {metadata?.type ?? 'Stay'}
                </div>

                <h1 className="text-3xl font-bold text-gray-950">
                  {stay.name}
                </h1>

                <p className="mt-2 text-gray-600">
                  {stay.city}, {stay.state}
                </p>

                {stay.rating && (
                  <div className="mt-4 inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm">
                    ★ {stay.rating}
                  </div>
                )}
              </div>

              <div className="md:text-right">
                <p className="text-2xl font-bold text-gray-950">
                  ₹{Number(stay.pricePerNight).toLocaleString('en-IN')}
                </p>

                <p className="text-sm text-gray-500">
                  per night
                </p>
              </div>
            </div>

            {/* About */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-lg font-semibold text-gray-950">
                About this stay
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-gray-600">
                {stay.description}
              </p>
            </div>

            {/* Amenities */}
            {metadata?.amenities &&
              metadata.amenities.length > 0 && (
                <div className="mt-8 border-t border-gray-200 pt-8">
                  <h2 className="text-lg font-semibold text-gray-950">
                    Amenities
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {metadata.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Location / Map */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-lg font-semibold text-gray-950">
                Location
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                {stay.city}, {stay.state}
              </p>

              <div className="mt-4">
                <StayMap
                  latitude={stay.latitude}
                  longitude={stay.longitude}
                  name={stay.name}
                  city={stay.city}
                />
              </div>
            </div>

            {/* Reservation */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                  Up to {stay.maxGuests} guests
                </p>

                <Link
                  href={`/stays/${stay.id}/book`}
                  className="rounded-xl bg-black px-6 py-3 text-center text-sm font-semibold text-white hover:bg-gray-800"
                >
                  Reserve this stay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}