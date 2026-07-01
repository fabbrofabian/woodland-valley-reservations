"use client";

import { useState } from "react";
import { createReservation } from "./actions";

type TimeSlot = {
  id: number;
  startTime: string;
  endTime: string;
  capacity: number;
  remaining: number;
};

type PickupDay = {
  id: number;
  label: string;
  timeSlots: TimeSlot[];
};

export default function BookingForm({
  flockId,
  pickupDays,
  remaining,
}: {
  flockId: number;
  pickupDays: PickupDay[];
  remaining: number;
}) {
  const [selectedPickupDayId, setSelectedPickupDayId] = useState(
    pickupDays[0]?.id
  );

  const selectedPickupDay = pickupDays.find(
    (day) => day.id === selectedPickupDayId
  );

  const availableSlots =
    selectedPickupDay?.timeSlots.filter((slot) => slot.remaining > 0) ?? [];

  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState(
    availableSlots[0]?.id
  );

  const selectedTimeSlot = selectedPickupDay?.timeSlots.find(
    (slot) => slot.id === selectedTimeSlotId
  );

  const maxQuantity = Math.min(
    remaining,
    selectedTimeSlot?.remaining ?? 0
  );

  return (
    <form action={createReservation} className="space-y-6">
      <input type="hidden" name="flockId" value={flockId} />

      <div>
        <label className="mb-2 block font-semibold">Pickup Day</label>

        <select
          name="pickupDayId"
          required
          value={selectedPickupDayId}
          onChange={(event) => {
            const newDayId = Number(event.target.value);
            setSelectedPickupDayId(newDayId);

            const newDay = pickupDays.find((day) => day.id === newDayId);
            const firstAvailableSlot = newDay?.timeSlots.find(
              (slot) => slot.remaining > 0
            );

            if (firstAvailableSlot?.id !== undefined) {
              setSelectedTimeSlotId(firstAvailableSlot.id);
            }
          }}
          className="w-full rounded-lg border p-3"
        >
          {pickupDays.map((day) => (
            <option key={day.id} value={day.id}>
              {day.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-3 block font-semibold">Pickup Time</label>

        <div className="grid gap-3 sm:grid-cols-2">
          {selectedPickupDay?.timeSlots.map((slot) => {
            const isFull = slot.remaining <= 0;
            const isSelected = selectedTimeSlotId === slot.id;

            return (
              <label
                key={slot.id}
                className={`rounded-lg border p-4 ${
                  isFull
                    ? "cursor-not-allowed bg-gray-100 text-gray-400"
                    : isSelected
                      ? "cursor-pointer border-green-900 bg-green-50"
                      : "cursor-pointer hover:border-green-800 hover:bg-green-50"
                }`}
              >
                <input
                  type="radio"
                  name="timeSlotId"
                  value={slot.id}
                  required
                  checked={isSelected}
                  disabled={isFull}
                  onChange={() => setSelectedTimeSlotId(slot.id)}
                  className="mr-2"
                />

                <span className="font-semibold">
                  {slot.startTime}–{slot.endTime}
                </span>

                <p className="mt-2 text-sm">
                  {isFull ? "FULL" : `${slot.remaining} chickens available`}
                </p>
              </label>
            );
          })}
        </div>
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
        <label className="mb-2 block font-semibold">Number of chickens</label>

        {maxQuantity > 0 ? (
          <select
            name="quantity"
            required
            className="w-full rounded-lg border p-3"
          >
            {Array.from({ length: maxQuantity }, (_, index) => index + 1).map(
              (quantity) => (
                <option key={quantity} value={quantity}>
                  {quantity}
                </option>
              )
            )}
          </select>
        ) : (
          <p className="rounded-lg bg-red-50 p-3 font-semibold text-red-700">
            No chickens available for this selected time.
          </p>
        )}
      </div>

      <button
        disabled={maxQuantity <= 0}
        className="w-full rounded-lg bg-green-800 py-4 text-lg font-bold text-white hover:bg-green-900 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        Reserve My Chickens
      </button>
    </form>
  );
}