import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

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
      reservations: true,
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

  if (!flock) {
    notFound();
  }

  const reserved = flock.reservations.reduce(
    (total, reservation) => total + reservation.quantity,
    0
  );

  const remaining = flock.totalChickens - reserved;

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <Link
            href="/admin"
            className="text-green-800 underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="mb-8 rounded-xl bg-white p-8 shadow">
          <h1 className="text-4xl font-bold text-green-900">
            {flock.name}
          </h1>

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <div className="rounded-lg bg-slate-100 p-4">
              <p className="text-sm text-gray-600">
                Total Chickens
              </p>

              <p className="text-3xl font-bold">
                {flock.totalChickens}
              </p>
            </div>

            <div className="rounded-lg bg-slate-100 p-4">
              <p className="text-sm text-gray-600">
                Reserved
              </p>

              <p className="text-3xl font-bold">
                {reserved}
              </p>
            </div>

            <div className="rounded-lg bg-slate-100 p-4">
              <p className="text-sm text-gray-600">
                Remaining
              </p>

              <p className="text-3xl font-bold">
                {remaining}
              </p>
            </div>

          </div>
        </div>

        <div className="rounded-xl bg-white p-8 shadow">

          <div className="mb-6 flex items-center justify-between">

            <h2 className="text-2xl font-bold text-green-900">
              Pickup Days
            </h2>

            <Link
              href={`/admin/flocks/${flock.id}/pickup-days/new`}
              className="rounded-lg bg-green-800 px-5 py-3 font-bold text-white hover:bg-green-900"
            >
              + Add Pickup Day
            </Link>

          </div>

          {flock.pickupDays.length === 0 ? (

            <p className="text-gray-600">
              No pickup days have been created yet.
            </p>

          ) : (

            <div className="space-y-4">

              {flock.pickupDays.map((day) => {

                const dayReserved = day.reservations.reduce(
                  (total, reservation) => total + reservation.quantity,
                  0
                );

                return (

                  <div
                    key={day.id}
                    className="rounded-lg border p-5 md:flex md:items-center md:justify-between"
                  >

                    <div>

                      <p className="text-xl font-bold">
                        {day.pickupDate.toLocaleDateString("en-AU", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>

                      <p className="text-gray-600">
                        {day.startTime} – {day.endTime}
                      </p>

                    </div>

                    <div className="mt-4 md:mt-0 text-right">

                      <p className="font-bold">
                        {dayReserved} chickens reserved
                      </p>

                      <p className="text-sm text-gray-600">
                        Slot Capacity: {day.slotCapacity} chickens
                      </p>

                      <p className="text-sm text-gray-600">
                        Time Slots: {day.timeSlots.length}
                      </p>

                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </div>

      </div>
    </main>
  );
}