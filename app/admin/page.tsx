import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const flocks = await prisma.flock.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      reservations: true,
      pickupDays: true,
    },
  });

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-green-900">
              Woodland Valley Reservations
            </h1>
            <p className="text-gray-600">Chicken Reservation Administration</p>
          </div>

          <Link
            href="/admin/flocks/new"
            className="rounded-lg bg-green-800 px-6 py-3 font-bold text-white hover:bg-green-900"
          >
            + Create New Flock
          </Link>
        </div>

        {flocks.length === 0 ? (
          <div className="rounded-xl bg-white p-8 shadow">
            <h2 className="mb-6 text-2xl font-bold">No flocks created yet</h2>
            <p className="mb-6 text-gray-600">
              Create your first flock to begin accepting reservations.
            </p>

            <Link
              href="/admin/flocks/new"
              className="inline-block rounded-lg bg-green-800 px-6 py-3 font-bold text-white hover:bg-green-900"
            >
              Create First Flock
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {flocks.map((flock) => {
              const reserved = flock.reservations.reduce(
                (total, reservation) => total + reservation.quantity,
                0
              );

              const remaining = flock.totalChickens - reserved;

              return (
                <div key={flock.id} className="rounded-xl bg-white p-8 shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-green-900">
                        {flock.name}
                      </h2>

                      <p className="mt-2 text-gray-600">
                        {flock.totalChickens} chickens total
                      </p>
                    </div>

                    <Link
                      href={`/admin/flocks/${flock.id}`}
                      className="rounded-lg bg-green-800 px-5 py-3 font-bold text-white hover:bg-green-900"
                    >
                      Manage
                    </Link>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg bg-slate-100 p-4">
                      <p className="text-sm text-gray-600">Reserved</p>
                      <p className="text-2xl font-bold">{reserved}</p>
                    </div>

                    <div className="rounded-lg bg-slate-100 p-4">
                      <p className="text-sm text-gray-600">Remaining</p>
                      <p className="text-2xl font-bold">{remaining}</p>
                    </div>

                    <div className="rounded-lg bg-slate-100 p-4">
                      <p className="text-sm text-gray-600">Pickup Days</p>
                      <p className="text-2xl font-bold">
                        {flock.pickupDays.length}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}