"use client";

import { useMemo, useState } from "react";

type Reservation = {
  id: number;
  customerName: string;
  mobile: string;
  quantity: number;
  status: string;
};

type TimeSlot = {
  id: number;
  startTime: string;
  endTime: string;
  reservations: Reservation[];
};

export default function SearchableCollectionList({
  timeSlots,
}: {
  timeSlots: TimeSlot[];
}) {
  const [search, setSearch] = useState("");

  const filteredTimeSlots = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return timeSlots;

    return timeSlots
      .map((slot) => ({
        ...slot,
        reservations: slot.reservations.filter(
          (reservation) =>
            reservation.customerName.toLowerCase().includes(term) ||
            reservation.mobile.toLowerCase().includes(term)
        ),
      }))
      .filter((slot) => slot.reservations.length > 0);
  }, [search, timeSlots]);

  return (
    <>
      <div className="mb-6 rounded-2xl bg-white p-5 shadow">
        <label className="mb-2 block font-bold text-green-900">
          Search customer or mobile
        </label>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Type a name or phone number..."
          className="w-full rounded-xl border p-4 text-lg"
        />
      </div>

      <div className="space-y-6">
        {filteredTimeSlots.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow">
            <p className="text-lg font-semibold text-gray-600">
              No matching reservations found.
            </p>
          </div>
        ) : (
          filteredTimeSlots.map((slot) => (
            <section key={slot.id} className="rounded-2xl bg-white p-6 shadow">
              <h2 className="mb-4 text-2xl font-bold text-green-900">
                {slot.startTime} – {slot.endTime}
              </h2>

              <div className="space-y-4">
                {slot.reservations.map((reservation) => {
                  const isCollected = reservation.status === "collected";

                  return (
                    <div
                      key={reservation.id}
                      className={`rounded-xl border p-5 ${
                        isCollected
                          ? "border-green-200 bg-green-50"
                          : "bg-white"
                      }`}
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-2xl font-bold">
                            {reservation.customerName}
                          </p>

                          <p className="mt-1 text-lg text-gray-700">
                            {reservation.mobile}
                          </p>

                          <p className="mt-2 text-2xl font-bold text-green-900">
                            {reservation.quantity} chickens
                          </p>
                        </div>

                        {isCollected ? (
                          <span className="rounded-xl bg-green-200 px-6 py-4 text-center text-xl font-bold text-green-900">
                            ✓ Collected
                          </span>
                        ) : (
                          <form action={`/admin/reservations/${reservation.id}/collect`}>
                            <button className="w-full rounded-xl bg-green-800 px-8 py-5 text-xl font-bold text-white hover:bg-green-900 md:w-auto">
                              Collect
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>
    </>
  );
}