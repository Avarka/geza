"use server";

import { db } from "@/lib/db/instances";
import { validateSession } from "@/lib/helpers/permissionValidation";
import { newBookingFormSchema } from "@/lib/schemas/bookingForm";
import { bookings, rules, user } from "@/lib/db/schema";
import { and, eq, gt, or } from "drizzle-orm";
import * as z from "zod";
import transporter from "@/lib/mailer";
import { render } from "@react-email/components";
import NewBookingEmail from "@/emails/new-booking";
import TestEmail from "@/emails/test";

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
  event,
  userLdap,
  ...formValues
}: {
  event: { lenght: number; location: string; neptunCode: string };
  userLdap: string;
} & z.infer<typeof newBookingFormSchema>) {
  await validateSession("booking", ["make"]);

  const userRecord = await db.query.user.findFirst({
    where: eq(user.name, userLdap),
  });

  if (!userRecord) {
    throw new Error("User not found");
  }

  const bookingInserts = formValues.listOfEvents.map(date => ({
    userId: userRecord.id,
    startTime: parseTime(new Date(date), formValues.startTime),
    endTime: parseTime(
      new Date(new Date(date).getTime() + event.lenght * 60 * 60 * 1000),
      formValues.endTime
    ),
    ruleId: parseInt(formValues.rule, 10) || null,
    customRequest: formValues.customRequest,
    classroom: event.location,
    course: event.neptunCode,
  }));

  await db.transaction(async tx => {
    await tx.insert(bookings).values(bookingInserts);
  });

  let rule = undefined;

  if (formValues.rule !== "other") {
    rule = await db.query.rules.findFirst({
      where: eq(rules.id, parseInt(formValues.rule, 10)),
    });
  }

  const emailHtml = await render(
    NewBookingEmail({ bookings: bookingInserts, user: userRecord, rule: rule })
  );

  await transporter.sendMail(
    {
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM}>`,
      to: "vadavar7@gmail.com",
      subject: "Új foglalás",
      html: emailHtml,
    },
    (error, info) => {
      if (error) {
        console.error(error);
      }

      console.log("Email sent: " + info.response);
    }
  );
}

export async function deleteBooking(id: number) {
  await validateSession("booking", ["make"]);

  await db.delete(bookings).where(eq(bookings.id, id)).limit(1);
}

export async function getMyBookings(userId: string) {
  return await db.query.bookings.findMany({
    where: and(
      eq(bookings.userId, userId),
      or(
        eq(bookings.status, "pending"),
        gt(bookings.startTime, new Date())
      )
    ),
    orderBy: (bookings, { asc }) => [asc(bookings.startTime)],
  });
}

export async function getAllBookings() {
  await validateSession("booking", ["view"]);

  return await db.query.bookings.findMany({
    orderBy: (bookings, { asc }) => [asc(bookings.startTime)],
  });
}

export async function updateBooking(
  id: number,
  startTime: string | undefined,
  endTime: string | undefined
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

  await db
    .update(bookings)
    .set({ startTime: updatedStartTime, endTime: updatedEndTime })
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
