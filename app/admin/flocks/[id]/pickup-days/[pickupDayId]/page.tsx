import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SearchableCollectionList from "./SearchableCollectionList";

export default async function PickupDayPage({
  params,
}: {
  params: Promise<{ id: string; pickupDayId: string }>;
}) {
  const { id, pickupDayId } = await params;
  const flockId = Number(id);
  const pickupDayIdNumber = Number(pickupDayId);

  const pickupDay = await prisma.pickupDay.findUnique({
    where: { id: pickupDayIdNumber },
    include: {
      flock: true,
      timeSlots: {
        orderBy: { startTime: "asc" },
        include: {
          reservations: {
            orderBy: [{ status: "asc" }, { customerName: "asc" }],
          },
        },
      },
    },
  });

  if (!pickupDay) notFound();

  const allReservations = pickupDay.timeSlots.flatMap(
    (slot) => slot.reservations
  );

  const totalCustomers = allReservations.length;

  const totalChickens = allReservations.reduce(
    (total, reservation) => total + reservation.quantity,
    0
  );

  const collectedCount = allReservations.filter(
    (reservation) => reservation.status === "collected"
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/admin/flocks/${flockId}`}
          className="mb-6 inline-block text-green-800 underline"
        >
          ← Back to flock
        </Link>

        <div className="mb-6 rounded-2xl bg-white p-8 shadow">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-900">
            Woodland Valley Farm
          </p>

          <h1 className="mt-2 text-4xl font-bold text-green-950">
            Collection Screen
          </h1>

          <p className="mt-3 text-xl text-gray-700">
            {pickupDay.pickupDate.toLocaleDateString("en-AU", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          <p className="mt-1 text-gray-600">{pickupDay.flock.name}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-green-50 p-5">
              <p className="text-sm text-gray-600">Customers</p>
              <p className="text-3xl font-bold">{totalCustomers}</p>
            </div>

            <div className="rounded-xl bg-green-50 p-5">
              <p className="text-sm text-gray-600">Chickens Booked</p>
              <p className="text-3xl font-bold">{totalChickens}</p>
            </div>

            <div className="rounded-xl bg-green-50 p-5">
              <p className="text-sm text-gray-600">Collected</p>
              <p className="text-3xl font-bold">{collectedCount}</p>
            </div>
          </div>
        </div>

        <SearchableCollectionList
          timeSlots={pickupDay.timeSlots.map((slot) => ({
            id: slot.id,
            startTime: slot.startTime,
            endTime: slot.endTime,
            reservations: slot.reservations.map((reservation) => ({
              id: reservation.id,
              customerName: reservation.customerName,
              mobile: reservation.mobile,
              quantity: reservation.quantity,
              status: reservation.status,
            })),
          }))}
        />
      </div>
    </main>
  );
}