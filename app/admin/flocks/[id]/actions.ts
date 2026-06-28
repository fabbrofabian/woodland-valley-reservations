"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function markReservationCollected(
  reservationId: number,
  flockId: number
) {
  await prisma.reservation.update({
    where: {
      id: reservationId,
    },
    data: {
      status: "collected",
    },
  });

  revalidatePath(`/admin/flocks/${flockId}`);
}