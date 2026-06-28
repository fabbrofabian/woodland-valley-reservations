import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { markReservationCollected } from "./actions";

export default async function ManageFlockPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const flockId = Number(id);

  const flock = await prisma.flock.findUnique({
    where: { id: flockId },
    include: {
      reservations: {
        include: {
          pickupDay: true,
          timeSlot: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      pickupDays: {
        orderBy: {
          pickupDate: "asc",
        },
        include: {
          reservations: true,
          timeSlots: true,
        },
      },
    },
  });

  if (!flock) notFound();

  const reserved = flock.reservations.reduce(
    (total, reservation) => total + reservation.quantity,
    0
  );

  const remaining = flock.totalChickens - reserved;

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="mb-8 inline-block text-green-800 underline">
          ← Back to Dashboard
        </Link>

        <div className="mb-8 rounded-xl bg-white p-8 shadow">
          <h1 className="text-4xl font-bold text-green-900">{flock.name}</h1>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-slate-100 p-4">
              <p className="text-sm text-gray-600">Total Chickens</p>
              <p className="text-3xl font-bold">{flock.totalChickens}</p>
            </div>

            <div className="rounded-lg bg-slate-100 p-4">
              <p className="text-sm text-gray-600">Reserved</p>
              <p className="text-3xl font-bold">{reserved}</p>
            </div>

            <div className="rounded-lg bg-slate-100 p-4">
              <p className="text-sm text-gray-600">Remaining</p>
              <p className="text-3xl font-bold text-green-800">{remaining}</p>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-xl bg-white p-8 shadow">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Pickup Days</h2>

            <Link
              href={`/admin/flocks/${flock.id}/pickup-days/new`}
              className="rounded-lg bg-green-800 px-5 py-3 font-bold text-white"
            >
              + Add Pickup Day
            </Link>
          </div>

          <div className="space-y-4">
            {flock.pickupDays.map((day) => {
              const dayReserved = day.reservations.reduce(
                (total, reservation) => total + reservation.quantity,
                0
              );

              return (
                <div key={day.id} className="rounded-lg border p-5">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-xl font-bold">
                        {day.pickupDate.toLocaleDateString("en-AU", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </h3>

                      <p className="text-gray-600">
                        {day.startTime} – {day.endTime}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold">{dayReserved} chickens reserved</p>

                      <p className="text-sm text-gray-600">
                        {day.timeSlots.length} time slots
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl bg-white p-8 shadow">
          <h2 className="mb-6 text-2xl font-bold">Reservations</h2>

          {flock.reservations.length === 0 ? (
            <p>No reservations yet.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3">Customer</th>
                  <th>Mobile</th>
                  <th>Pickup Day</th>
                  <th>Time</th>
                  <th>Qty</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {flock.reservations.map((reservation) => (
                  <tr key={reservation.id} className="border-b">
                    <td className="py-3 font-semibold">
                      {reservation.customerName}
                    </td>

                    <td>{reservation.mobile}</td>

                    <td>
                      {reservation.pickupDay.pickupDate.toLocaleDateString(
                        "en-AU",
                        {
                          day: "numeric",
                          month: "short",
                        }
                      )}
                    </td>

                    <td>{reservation.timeSlot.startTime}</td>

                    <td className="font-bold">{reservation.quantity}</td>

                    <td>
                      {reservation.status === "collected" ? (
                        <span className="rounded bg-green-100 px-3 py-1 font-semibold text-green-800">
                          Collected
                        </span>
                      ) : (
                        <form
                          action={async () => {
                            "use server";
                            await markReservationCollected(
                              reservation.id,
                              flock.id
                            );
                          }}
                        >
                          <button className="rounded bg-green-800 px-4 py-2 text-white hover:bg-green-900">
                            Collect
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}