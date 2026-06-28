import { prisma } from "@/lib/prisma";
import BookingForm from "./BookingForm";

export default async function BookPage() {
  const flocks = await prisma.flock.findMany({
    where: {
      isActive: true,
    },
    include: {
      reservations: {
        where: {
          status: "reserved",
        },
      },
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
            include: {
              reservations: {
                where: {
                  status: "reserved",
                },
              },
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

  const pickupDays = flock.pickupDays.map((day) => ({
    id: day.id,
    label: day.pickupDate.toLocaleDateString("en-AU", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    timeSlots: day.timeSlots.map((slot) => {
      const slotReserved = slot.reservations.reduce(
        (total, reservation) => total + reservation.quantity,
        0
      );

      return {
        id: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        capacity: slot.capacity,
        remaining: slot.capacity - slotReserved,
      };
    }),
  }));

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
          Choose your pickup day, pickup time and number of chickens.
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

        <BookingForm
          flockId={flock.id}
          pickupDays={pickupDays}
          remaining={remaining}
        />
      </div>
    </main>
  );
}