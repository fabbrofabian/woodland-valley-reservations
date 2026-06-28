import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { markReservationCollected } from "../../flocks/[id]/actions";

export default async function PickupDayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pickupDayId = Number(id);

  const pickupDay = await prisma.pickupDay.findUnique({
    where: { id: pickupDayId },
    include: {
      flock: true,
      timeSlots: {
        orderBy: { startTime: "asc" },
        include: {
          reservations: {
            orderBy: [
              { status: "asc" },
              { customerName: "asc" },
            ],
          },
        },
      },
    },
  });

  if (!pickupDay) notFound();

  const allReservations = pickupDay.timeSlots.flatMap(
    (slot) => slot.reservations
  );

  const totalCustomers = allReservations.length;

  const totalChickens = allReservations.reduce(
    (total, reservation) => total + reservation.quantity,
    0
  );

  const collectedCount = allReservations.filter(
    (reservation) => reservation.status === "collected"
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/admin/flocks/${pickupDay.flockId}`}
          className="mb-6 inline-block text-green-800 underline"
        >
          ← Back to flock
        </Link>

        <div className="mb-6 rounded-2xl bg-white p-8 shadow">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-900">
            Woodland Valley Farm
          </p>

          <h1 className="mt-2 text-4xl font-bold text-green-950">
            Collection Screen
          </h1>

          <p className="mt-3 text-xl text-gray-700">
            {pickupDay.pickupDate.toLocaleDateString("en-AU", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          <p className="mt-1 text-gray-600">{pickupDay.flock.name}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-green-50 p-5">
              <p className="text-sm text-gray-600">Customers</p>
              <p className="text-3xl font-bold">{totalCustomers}</p>
            </div>

            <div className="rounded-xl bg-green-50 p-5">
              <p className="text-sm text-gray-600">Chickens Booked</p>
              <p className="text-3xl font-bold">{totalChickens}</p>
            </div>

            <div className="rounded-xl bg-green-50 p-5">
              <p className="text-sm text-gray-600">Collected</p>
              <p className="text-3xl font-bold">{collectedCount}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {pickupDay.timeSlots.map((slot) => (
            <section key={slot.id} className="rounded-2xl bg-white p-6 shadow">
              <h2 className="mb-4 text-2xl font-bold text-green-900">
                {slot.startTime} – {slot.endTime}
              </h2>

              {slot.reservations.length === 0 ? (
                <p className="text-gray-500">No reservations in this slot.</p>
              ) : (
                <div className="space-y-4">
                  {slot.reservations.map((reservation) => {
                    const isCollected = reservation.status === "collected";

                    return (
                      <div
                        key={reservation.id}
                        className={`rounded-xl border p-5 ${
                          isCollected
                            ? "border-green-200 bg-green-50"
                            : "bg-white"
                        }`}
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="text-2xl font-bold">
                              {reservation.customerName}
                            </p>

                            <p className="mt-1 text-lg text-gray-700">
                              {reservation.mobile}
                            </p>

                            <p className="mt-2 text-2xl font-bold text-green-900">
                              {reservation.quantity} chickens
                            </p>
                          </div>

                          {isCollected ? (
                            <span className="rounded-xl bg-green-200 px-6 py-4 text-center text-xl font-bold text-green-900">
                              ✓ Collected
                            </span>
                          ) : (
                            <form
                              action={async () => {
                                "use server";
                                await markReservationCollected(
                                  reservation.id,
                                  pickupDay.flockId
                                );
                              }}
                            >
                              <button className="w-full rounded-xl bg-green-800 px-8 py-5 text-xl font-bold text-white hover:bg-green-900 md:w-auto">
                                Collect
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}