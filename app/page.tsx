import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f1e8] text-[#243b2a]">
      <section className="relative min-h-screen overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt="Woodland Valley Farm"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-12 text-center text-white">
          <Image
            src="/woodland-valley-logo.png"
            alt="Woodland Valley Farm"
            width={190}
            height={190}
            className="mb-8"
            priority
          />

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em]">
            Woodland Valley Farm
          </p>

          <h1 className="mb-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
            Reserve your live chickens online
          </h1>

          <p className="mb-8 max-w-2xl text-lg leading-8">
            Choose your pickup day, select your preferred collection time, and
            reserve the number of chickens you need.
          </p>

          <Link
            href="/book"
            className="rounded-full bg-[#e9c46a] px-8 py-4 text-lg font-bold text-[#243b2a] shadow-lg"
          >
            Reserve Chickens
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-3">
        <div>
          <h2 className="mb-3 text-2xl font-bold">Guaranteed availability</h2>
          <p>Reserve your chickens before you arrive and avoid missing out.</p>
        </div>

        <div>
          <h2 className="mb-3 text-2xl font-bold">Choose your pickup time</h2>
          <p>Select a time slot so collection is organised and fast.</p>
        </div>

        <div>
          <h2 className="mb-3 text-2xl font-bold">Simple farm collection</h2>
          <p>Arrive, give your name, collect your chickens, and head home.</p>
        </div>
      </section>
    </main>
  );
}