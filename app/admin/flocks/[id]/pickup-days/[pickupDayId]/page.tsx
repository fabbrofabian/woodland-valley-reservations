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
            orderBy: { customerName: "asc" },
          },
        },
      },
    },
  });

  if (!pickupDay) notFound();

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/admin/flocks/${pickupDay.flockId}`}
          className="mb-8 inline-block text-green-800 underline"
        >
          ← Back to flock
        </Link>

        <div className="mb-8 rounded-xl bg-white p-8 shadow">
          <h1 className="text-4xl font-bold text-green-900">
            Pickup Day Collections
          </h1>

          <p className="mt-2 text-xl">
            {pickupDay.pickupDate.toLocaleDateString("en-AU", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          <p className="mt-2 text-gray-600">{pickupDay.flock.name}</p>
        </div>

        <div className="space-y-6">
          {pickupDay.timeSlots.map((slot) => (
            <div key={slot.id} className="rounded-xl bg-white p-6 shadow">
              <h2 className="mb-4 text-2xl font-bold text-green-900">
                {slot.startTime} – {slot.endTime}
              </h2>

              {slot.reservations.length === 0 ? (
                <p className="text-gray-500">No reservations in this slot.</p>
              ) : (
                <div className="space-y-3">
                  {slot.reservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="text-lg font-bold">
                          {reservation.customerName}
                        </p>
                        <p className="text-gray-600">{reservation.mobile}</p>
                        <p className="font-semibold">
                          {reservation.quantity} chickens
                        </p>
                      </div>

                      {reservation.status === "collected" ? (
                        <span className="rounded bg-green-100 px-4 py-2 font-bold text-green-800">
                          Collected
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
                          <button className="rounded bg-green-800 px-5 py-3 font-bold text-white hover:bg-green-900">
                            Collected
                          </button>
                        </form>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}