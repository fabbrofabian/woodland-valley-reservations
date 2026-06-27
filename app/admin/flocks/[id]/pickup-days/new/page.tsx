import Link from "next/link";
import { createPickupDay } from "./actions";

export default async function NewPickupDayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const flockId = Number(id);

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <Link
            href={`/admin/flocks/${flockId}`}
            className="text-green-800 underline"
          >
            ← Back to flock
          </Link>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-lg">
          <h1 className="mb-8 text-3xl font-bold text-green-900">
            Add Pickup Day
          </h1>

          <form action={createPickupDay.bind(null, flockId)} className="space-y-6">
            <div>
              <label className="mb-2 block font-semibold">Pickup Date</label>
              <input
                name="pickupDate"
                type="date"
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block font-semibold">Start Time</label>
                <input
                  name="startTime"
                  type="time"
                  required
                  defaultValue="08:00"
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">Finish Time</label>
                <input
                  name="endTime"
                  type="time"
                  required
                  defaultValue="11:00"
                  className="w-full rounded-lg border p-3"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Slot Length / Minutes
              </label>
              <input
                name="slotMinutes"
                type="number"
                required
                defaultValue="15"
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Maximum Chickens Per Slot
              </label>
              <input
                name="slotCapacity"
                type="number"
                required
                defaultValue="10"
                className="w-full rounded-lg border p-3"
              />
            </div>

            <button className="w-full rounded-lg bg-green-800 py-4 text-lg font-bold text-white hover:bg-green-900">
              Save Pickup Day
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}