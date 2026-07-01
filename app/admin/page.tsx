import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { setFlockActive } from "./flocks/[id]/actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const flocks = await prisma.flock.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      reservations: true,
      pickupDays: true,
    },
  });

  const activeFlocks = flocks.filter((flock) => flock.isActive);
  const inactiveFlocks = flocks.filter((flock) => !flock.isActive);

  function FlockCard({ flock }: { flock: (typeof flocks)[number] }) {
    const reserved = flock.reservations.reduce(
      (total, reservation) => total + reservation.quantity,
      0
    );

    const remaining = flock.totalChickens - reserved;

    return (
      <div className="rounded-xl bg-white p-8 shadow">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-green-900">{flock.name}</h2>
            <p className="mt-2 text-gray-600">
              {flock.totalChickens} chickens total
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/admin/flocks/${flock.id}`}
              className="rounded-lg bg-green-800 px-5 py-3 font-bold text-white hover:bg-green-900"
            >
              Manage
            </Link>

            <form
              action={async () => {
                "use server";
                await setFlockActive(flock.id, !flock.isActive);
              }}
            >
              <button className="rounded-lg bg-slate-700 px-5 py-3 font-bold text-white hover:bg-slate-800">
                {flock.isActive ? "Deactivate" : "Reactivate"}
              </button>
            </form>
          </div>
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
            <p className="text-2xl font-bold">{flock.pickupDays.length}</p>
          </div>
        </div>
      </div>
    );
  }

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

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold text-green-900">
            Active Flocks
          </h2>

          {activeFlocks.length === 0 ? (
            <div className="rounded-xl bg-white p-8 shadow">
              <p className="text-gray-600">No active flocks.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {activeFlocks.map((flock) => (
                <FlockCard key={flock.id} flock={flock} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-slate-700">
            Inactive Flocks
          </h2>

          {inactiveFlocks.length === 0 ? (
            <div className="rounded-xl bg-white p-8 shadow">
              <p className="text-gray-600">No inactive flocks.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {inactiveFlocks.map((flock) => (
                <FlockCard key={flock.id} flock={flock} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}