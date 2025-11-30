import { CalendarEvent } from "@ilamy/calendar";
import day from "@/lib/dayjs-ext";
import { Booking } from "@/lib/db/schema";

export function bookingToResourceEventTransformer(
  bookings: Booking[]
): CalendarEvent[] {
  return bookings.map(booking => ({
    id: booking.id,
    title: `${booking.course} (${booking.status === "pending" ? "Függőben" : booking.status === "permitted" ? "Engedélyezve" : "Elutasítva"})`,
    start: day(booking.startTime),
    end: day(booking.endTime),
    allDay: false,
    resourceId: booking.classroom.trim().replaceAll(" ", "_").toLowerCase(),
    color: booking.status === "pending" ? "#FFA500" : booking.status === "permitted" ? "#008000" : "#FF0000",
    backgroundColor: booking.status === "pending" ? "#FFF5E5" : booking.status === "permitted" ? "#E5FFE5" : "#FFE5E5",
  }));
}