import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const reservation = await prisma.reservation.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      pickupDay: true,
      timeSlot: true,
    },
  });

  if (!reservation) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f5f3ec] p-8">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-10 shadow">

        <div className="mb-8 text-center">
          <div className="mb-4 text-6xl">🐔</div>

          <h1 className="text-4xl font-bold text-green-900">
            Reservation Confirmed
          </h1>

          <p className="mt-3 text-gray-600">
            Thank you for supporting Woodland Valley Farm.
          </p>
        </div>

        <div className="rounded-lg bg-green-50 p-6">

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <p className="text-sm text-gray-600">
                Booking Number
              </p>

              <p className="text-2xl font-bold">
                #{reservation.id}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Customer
              </p>

              <p className="text-xl font-semibold">
                {reservation.customerName}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Chickens Reserved
              </p>

              <p className="text-2xl font-bold">
                {reservation.quantity}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Mobile
              </p>

              <p className="font-semibold">
                {reservation.mobile}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Pickup Day
              </p>

              <p className="font-semibold">
                {reservation.pickupDay.pickupDate.toLocaleDateString(
                  "en-AU",
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Pickup Time
              </p>

              <p className="font-semibold">
                {reservation.timeSlot.startTime} – {reservation.timeSlot.endTime}
              </p>
            </div>

          </div>

        </div>

        <div className="mt-8 rounded-lg border-l-4 border-green-700 bg-green-50 p-5">
          <h2 className="mb-2 font-bold">
            Pickup Instructions
          </h2>

          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            <li>Please arrive during your selected pickup time.</li>
            <li>Bring suitable boxes or crates to transport your chickens.</li>
            <li>If you cannot attend, please contact Woodland Valley Farm as soon as possible.</li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/book"
            className="rounded-lg bg-green-800 px-6 py-3 font-bold text-white hover:bg-green-900"
          >
            Make Another Reservation
          </Link>
        </div>

      </div>
    </main>
  );
}