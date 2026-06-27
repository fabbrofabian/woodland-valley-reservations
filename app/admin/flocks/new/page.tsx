import { createFlock } from "./actions";

export default function NewFlockPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-8 text-3xl font-bold text-green-900">
          Create New Flock
        </h1>

        <form action={createFlock} className="space-y-6">
          <div>
            <label className="mb-2 block font-semibold">Flock Name</label>
            <input
              name="name"
              required
              className="w-full rounded-lg border p-3"
              placeholder="July 2026 Meat Chickens"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">Total Chickens</label>
            <input
              name="totalChickens"
              type="number"
              required
              min="1"
              className="w-full rounded-lg border p-3"
              placeholder="500"
            />
          </div>

          <button className="w-full rounded-lg bg-green-800 py-4 font-bold text-white hover:bg-green-900">
            Save Flock
          </button>
        </form>
      </div>
    </main>
  );
}