"use server";

import { bookings, bookingsToRules, user } from "../db/schema";
import { db } from "../db/instance";
import { validateSession } from "../helpers/permissionValidation";
import { eq } from "drizzle-orm";
import { CalendarEvent } from "@ilamy/calendar";
import * as z from "zod";
import { bookingFormSchema } from "../schemas/bookingForm";

export async function createBooking(data: typeof bookings.$inferInsert) {
  await validateSession("booking", ["make"]);

  await db.insert(bookings).values(data);
}

export async function createBookingsForEvents({
  event, userLdap, ...formValues
}: { event: {lenght: number, location?: string, neptunCode?: string}, userLdap: string } & z.infer<typeof bookingFormSchema>) {
  await validateSession("booking", ["make"]);

  const userRecord = await db.query.user.findFirst({
    where: eq(user.name, userLdap),
  });

  if (!userRecord) {
    throw new Error("User not found");
  }

  const bookingInserts = formValues.listOfEvents.map(date => ({
    userId: userRecord.id,
    startTime: new Date(date),
    endTime: new Date(new Date(date).getTime() + event.lenght * 60 * 60 * 1000),
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

export async function getMyBookings(userLdap: string) {
  return await db.query.bookings.findMany({
    where: eq(user.name, userLdap),
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
  data: Partial<typeof bookings.$inferInsert>
) {
  await validateSession("booking", ["make"]);

  await db.update(bookings).set(data).where(eq(bookings.id, id)).limit(1);
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
