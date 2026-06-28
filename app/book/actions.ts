"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createReservation(formData: FormData) {
  const flockId = Number(formData.get("flockId"));
  const pickupDayId = Number(formData.get("pickupDayId"));
  const timeSlotId = Number(formData.get("timeSlotId"));
  const customerName = String(formData.get("customerName") || "").trim();
  const mobile = String(formData.get("mobile") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const quantity = Number(formData.get("quantity"));

  if (!flockId || !pickupDayId || !timeSlotId) {
    throw new Error("Pickup details are missing.");
  }

  if (!customerName || !mobile || !quantity || quantity < 1) {
    throw new Error("Missing required booking details.");
  }

  const flock = await prisma.flock.findUnique({
    where: { id: flockId },
    include: {
      reservations: {
        where: {
          status: "reserved",
        },
      },
    },
  });

  if (!flock) {
    throw new Error("Flock not found.");
  }

  const totalReserved = flock.reservations.reduce(
    (total, reservation) => total + reservation.quantity,
    0
  );

  const flockRemaining = flock.totalChickens - totalReserved;

  if (quantity > flockRemaining) {
    throw new Error("Not enough chickens remaining in this flock.");
  }

  const slot = await prisma.timeSlot.findUnique({
    where: { id: timeSlotId },
    include: {
      reservations: {
        where: {
          status: "reserved",
        },
      },
    },
  });

  if (!slot) {
    throw new Error("Pickup time slot not found.");
  }

  const slotReserved = slot.reservations.reduce(
    (total, reservation) => total + reservation.quantity,
    0
  );

  const slotRemaining = slot.capacity - slotReserved;

  if (quantity > slotRemaining) {
    throw new Error("Not enough capacity remaining in this pickup time.");
  }

  const reservation = await prisma.reservation.create({
    data: {
      flockId,
      pickupDayId,
      timeSlotId,
      customerName,
      mobile,
      email: email || null,
      quantity,
    },
  });

  redirect(`/book/confirmed/${reservation.id}`);
}