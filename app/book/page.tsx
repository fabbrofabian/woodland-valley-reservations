import { prisma } from "@/lib/prisma";
import { createReservation } from "./actions";

export default async function BookPage() {
  const flocks = await prisma.flock.findMany({
    where: {
      isActive: true,
    },
    include: {
      reservations: true,
      pickupDays: {
        where: {
          isPublished: true,
        },
        orderBy: {
          pickupDate: "asc",
        },
        include: {
          timeSlots: {
            orderBy: {
              startTime: "asc",
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const flock = flocks[0];

  if (!flock || flock.pickupDays.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f3ec] p-10 text-[#243b2a]">
        <div className="max-w-xl rounded-xl bg-white p-8 text-center shadow">
          <h1 className="mb-4 text-3xl font-bold">
            No chicken pickup days are currently available.
          </h1>
          <p>Please check back soon.</p>
        </div>
      </main>
    );
  }

  const totalReserved = flock.reservations.reduce(
    (total, reservation) => total + reservation.quantity,
    0
  );

  const remaining = flock.totalChickens - totalReserved;

  return (
    <main className="min-h-screen bg-[#f5f3ec] p-6 text-[#243b2a]">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-green-900">
          Woodland Valley Farm
        </p>

        <h1 className="mb-4 text-4xl font-bold text-green-950">
          Reserve your live chickens
        </h1>

        <p className="mb-8 text-gray-700">
          Choose your pickup day, pickup time and number of chickens. Your
          reservation will come off the flock availability immediately.
        </p>

        <div className="mb-8 grid gap-4 rounded-xl bg-green-50 p-5 md:grid-cols-3">
          <div>
            <p className="text-sm text-gray-600">Flock</p>
            <p className="font-bold">{flock.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Remaining</p>
            <p className="text-2xl font-bold">{remaining}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Pickup Days</p>
            <p className="text-2xl font-bold">{flock.pickupDays.length}</p>
          </div>
        </div>

        <form action={createReservation} className="space-y-6">
          <input type="hidden" name="flockId" value={flock.id} />

          <div>
            <label className="mb-2 block font-semibold">Pickup Day</label>

            <select
              name="pickupDayId"
              required
              className="w-full rounded-lg border p-3"
            >
              {flock.pickupDays.map((day) => (
                <option key={day.id} value={day.id}>
                  {day.pickupDate.toLocaleDateString("en-AU", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-semibold">Pickup Time</label>

            <select
              name="timeSlotId"
              required
              className="w-full rounded-lg border p-3"
            >
              {flock.pickupDays.flatMap((day) =>
                day.timeSlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {day.pickupDate.toLocaleDateString("en-AU", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    — {slot.startTime}–{slot.endTime}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-semibold">Name</label>
            <input
              name="customerName"
              required
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">Mobile</label>
            <input
              name="mobile"
              required
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">Email optional</label>
            <input
              name="email"
              type="email"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Number of chickens
            </label>
            <input
              name="quantity"
              type="number"
              min="1"
              max={remaining}
              required
              className="w-full rounded-lg border p-3"
            />
          </div>

          <button className="w-full rounded-lg bg-green-800 py-4 text-lg font-bold text-white hover:bg-green-900">
            Reserve My Chickens
          </button>
        </form>
      </div>
    </main>
  );
}