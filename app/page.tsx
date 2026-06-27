export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f1e8] text-[#243b2a]">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-12 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em]">
          Woodland Valley Farm
        </p>

        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
          Reserve your chickens online
        </h1>

        <p className="mb-8 max-w-2xl text-lg leading-8">
          Choose your pickup day, select a time slot, and reserve the number of
          chickens you need. Availability updates automatically as bookings are
          made.
        </p>

        <button className="rounded-full bg-[#243b2a] px-8 py-4 text-lg font-semibold text-white shadow-lg">
          Reserve Chickens
        </button>

        <p className="mt-8 text-sm opacity-70">
          Live chicken reservations for Woodland Valley Farm customers.
        </p>
      </section>
    </main>
  );
}