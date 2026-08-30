import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-center px-6 py-20">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Dhyana Stays
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
            Find a stay worth coming home to.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
            Discover comfortable stays, check availability, book your
            dates, and pay securely in one simple flow.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/stays"
              className="rounded-xl bg-zinc-950 px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Explore stays
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-zinc-200 px-6 py-3 text-center text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
