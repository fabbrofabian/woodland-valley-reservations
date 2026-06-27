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

  if (!customerName || !mobile || !quantity || quantity < 1) {
    throw new Error("Missing required booking details.");
  }

  await prisma.reservation.create({
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

  redirect("/book/confirmed");
}