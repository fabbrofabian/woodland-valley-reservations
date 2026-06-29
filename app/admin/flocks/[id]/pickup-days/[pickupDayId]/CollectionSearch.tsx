"use client";

export default function CollectionSearch() {
  return (
    <div className="mb-6 rounded-2xl bg-white p-5 shadow">
      <label className="mb-2 block font-bold text-green-900">
        Search customer or mobile
      </label>

      <input
        placeholder="Type a name or phone number..."
        className="w-full rounded-xl border p-4 text-lg"
      />
    </div>
  );
}