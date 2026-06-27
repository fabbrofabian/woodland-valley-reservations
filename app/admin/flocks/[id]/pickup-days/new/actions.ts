"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createPickupDay(
  flockId: number,
  formData: FormData
) {
  const pickupDate = new Date(String(formData.get("pickupDate")));
  const startTime = String(formData.get("startTime"));
  const endTime = String(formData.get("endTime"));
  const slotMinutes = Number(formData.get("slotMinutes"));
  const slotCapacity = Number(formData.get("slotCapacity"));

  const pickupDay = await prisma.pickupDay.create({
    data: {
      flockId,
      pickupDate,
      startTime,
      endTime,
      slotMinutes,
      slotCapacity,
      isPublished: true,
    },
  });

  // Automatically create time slots
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let current = new Date(pickupDate);
  current.setHours(startHour, startMinute, 0, 0);

  const finish = new Date(pickupDate);
  finish.setHours(endHour, endMinute, 0, 0);

  while (current < finish) {
    const slotStart = current.toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const next = new Date(current);
    next.setMinutes(next.getMinutes() + slotMinutes);

    const slotEnd = next.toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    await prisma.timeSlot.create({
      data: {
        pickupDayId: pickupDay.id,
        startTime: slotStart,
        endTime: slotEnd,
        capacity: slotCapacity,
      },
    });

    current = next;
  }

  redirect(`/admin/flocks/${flockId}`);
}