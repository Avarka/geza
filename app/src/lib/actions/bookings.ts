"use server";

import { bookings, bookingsToRules, user } from "../db/schema";
import { db } from "../db/instance";
import { validateSession } from "../helpers/permissionValidation";
import { eq } from "drizzle-orm";
import * as z from "zod";
import { newBookingFormSchema } from "../schemas/bookingForm";

export async function createBooking(data: typeof bookings.$inferInsert) {
  await validateSession("booking", ["make"]);

  await db.insert(bookings).values(data);
}

function parseTime(date: Date, timeString?: string) {
  if (!timeString) {
    return date;
  }
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, seconds || 0, 0);
  return newDate;
}

export async function createBookingsForEvents({
  event, userLdap, ...formValues
}: { event: {lenght: number, location?: string, neptunCode?: string}, userLdap: string } & z.infer<typeof newBookingFormSchema>) {
  await validateSession("booking", ["make"]);

  const userRecord = await db.query.user.findFirst({
    where: eq(user.name, userLdap),
  });

  if (!userRecord) {
    throw new Error("User not found");
  }

  console.log(formValues.startTime, formValues.endTime);

  const bookingInserts = formValues.listOfEvents.map(date => ({
    userId: userRecord.id,
    startTime: parseTime(new Date(date), formValues.startTime),
    endTime: parseTime(new Date(new Date(date).getTime() + event.lenght * 60 * 60 * 1000), formValues.endTime),
    note: formValues.note || null,
    classroom: event.location || "N/A",
    course: event.neptunCode || "N/A",
  }));

  await db.transaction(async tx => {
    const insertedBookings = await tx.insert(bookings).values(bookingInserts).$returningId();

    if (formValues.listOfRules.length > 0) {
      const bookingRuleInserts = insertedBookings.flatMap(bookingId =>
        formValues.listOfRules.map(ruleId => ({
          bookingId: bookingId.id,
          ruleId: parseInt(ruleId),
        }))
      );

      await tx.insert(bookingsToRules).values(bookingRuleInserts);
    }
  })
}

export async function deleteBooking(id: number) {
  await validateSession("booking", ["make"]);

  await db.delete(bookings).where(eq(bookings.id, id)).limit(1);
}

export async function getMyBookings(userId: string) {
  return await db.query.bookings.findMany({
    where: eq(bookings.userId, userId),
    orderBy: (bookings, { desc }) => [desc(bookings.startTime)],
  });
}

export async function getAllBookings() {
  await validateSession("booking", ["view"]);

  return await db.query.bookings.findMany({
    orderBy: (bookings, { desc }) => [desc(bookings.startTime)],
  });
}

export async function updateBooking(
  id: number,
  startTime: string | undefined,
  endTime: string | undefined,
  note: string | undefined
) {
  await validateSession("booking", ["make"]);

  const currentBooking = await db.query.bookings.findFirst({
    where: eq(bookings.id, id),
  });

  if (!currentBooking) {
    throw new Error("Booking not found");
  }

  const updatedStartTime = startTime
    ? parseTime(currentBooking.startTime, startTime)
    : currentBooking.startTime;
  const updatedEndTime = endTime
    ? parseTime(currentBooking.endTime, endTime)
    : currentBooking.endTime;

  await db.update(bookings)
    .set({ startTime: updatedStartTime, endTime: updatedEndTime, note: note })
    .where(eq(bookings.id, id))
    .limit(1);
}

export async function permitBooking(id: number) {
  await validateSession("booking", ["decide"]);

  await db
    .update(bookings)
    .set({ status: "permitted" })
    .where(eq(bookings.id, id))
    .limit(1);
}

export async function declineBooking(id: number) {
  await validateSession("booking", ["decide"]);

  await db
    .update(bookings)
    .set({ status: "declined" })
    .where(eq(bookings.id, id))
    .limit(1);
}
