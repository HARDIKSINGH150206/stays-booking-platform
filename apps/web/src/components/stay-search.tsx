'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function StaySearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [city, setCity] = useState(
    searchParams.get('city') ?? '',
  );
  const [guests, setGuests] = useState(
    searchParams.get('guests') ?? '',
  );
  const [checkIn, setCheckIn] = useState(
    searchParams.get('checkIn') ?? '',
  );
  const [checkOut, setCheckOut] = useState(
    searchParams.get('checkOut') ?? '',
  );

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (city.trim()) {
      params.set('city', city.trim());
    }

    if (guests) {
      params.set('guests', guests);
    }

    if (checkIn) {
      params.set('checkIn', checkIn);
    }

    if (checkOut) {
      params.set('checkOut', checkOut);
    }

    params.set('page', '1');

    router.push(`/stays?${params.toString()}`);
  }

  function clear() {
    setCity('');
    setGuests('');
    setCheckIn('');
    setCheckOut('');
    router.push('/stays');
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
    >
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <label
            htmlFor="city"
            className="mb-1.5 block text-xs font-medium text-zinc-700"
          >
            City
          </label>

          <input
            id="city"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="e.g. Bengaluru"
            className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-zinc-500"
          />
        </div>

        <div>
          <label
            htmlFor="check-in"
            className="mb-1.5 block text-xs font-medium text-zinc-700"
          >
            Check-in
          </label>

          <input
            id="check-in"
            type="date"
            value={checkIn}
            onChange={(event) => setCheckIn(event.target.value)}
            className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-zinc-500"
          />
        </div>

        <div>
          <label
            htmlFor="check-out"
            className="mb-1.5 block text-xs font-medium text-zinc-700"
          >
            Check-out
          </label>

          <input
            id="check-out"
            type="date"
            value={checkOut}
            onChange={(event) => setCheckOut(event.target.value)}
            className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-zinc-500"
          />
        </div>

        <div>
          <label
            htmlFor="guests"
            className="mb-1.5 block text-xs font-medium text-zinc-700"
          >
            Guests
          </label>

          <input
            id="guests"
            type="number"
            min="1"
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
            placeholder="2"
            className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-zinc-500"
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Search
          </button>

          <button
            type="button"
            onClick={clear}
            className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
}
