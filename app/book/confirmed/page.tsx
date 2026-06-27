import Link from "next/link";

export default function ConfirmedPage() {
  return (
    <main className="min-h-screen bg-[#f4f1e8] p-10 text-[#243b2a]">
      <div className="mx-auto max-w-xl rounded-xl bg-white p-8 text-center shadow">
        <h1 className="mb-4 text-3xl font-bold">Reservation confirmed</h1>
        <p className="mb-8">
          Thank you. Your chicken reservation has been received.
        </p>
        <Link href="/" className="rounded-lg bg-green-800 px-6 py-3 font-bold text-white">
          Back Home
        </Link>
      </div>
    </main>
  );
}