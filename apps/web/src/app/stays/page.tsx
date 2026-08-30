import { getStays } from '@/lib/api';
import { StayCard } from '@/components/stay-card';
import { StaySearch } from '@/components/stay-search';

interface StaysPageProps {
  searchParams: Promise<{
    city?: string;
    state?: string;
    guests?: string;
    checkIn?: string;
    checkOut?: string;
    page?: string;
  }>;
}

export default async function StaysPage({
  searchParams,
}: StaysPageProps) {
  const params = await searchParams;

  const guests = params.guests
    ? Number(params.guests)
    : undefined;

  let result;

  try {
    result = await getStays({
      city: params.city,
      state: params.state,
      guests,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      page: params.page ? Number(params.page) : 1,
      limit: 20,
    });
  } catch {
    result = null;
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Explore
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            Find your next stay
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
            Search available stays by destination, dates, and
            number of guests.
          </p>
        </div>

        <StaySearch />

        <div className="mt-10">
          {!result ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              We couldn&apos;t load the stays. Make sure the API
              server is running and try again.
            </div>
          ) : result.data.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
              <h2 className="text-lg font-semibold text-zinc-950">
                No stays found
              </h2>

              <p className="mt-2 text-sm text-zinc-600">
                Try a different destination, date, or guest count.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm text-zinc-600">
                  {result.pagination.total}{' '}
                  {result.pagination.total === 1
                    ? 'stay'
                    : 'stays'}{' '}
                  found
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {result.data.map((stay) => (
                  <StayCard key={stay.id} stay={stay} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
