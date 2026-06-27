"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createFlock(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const totalChickens = Number(formData.get("totalChickens"));

  if (!name) {
    throw new Error("Flock name is required");
  }

  if (!totalChickens || totalChickens < 1) {
    throw new Error("Total chickens must be greater than zero");
  }

  await prisma.flock.create({
    data: {
      name,
      totalChickens,
    },
  });

  redirect("/admin");
}