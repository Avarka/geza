"use client";

import BookingDetailsDialog from "@/components/bookings/booking-details";
import { ResouceCalendarHeader } from "@/components/calendar/calendar-header";
import { Booking } from "@/lib/db/schema";
import { bookingToResourceEventTransformer } from "@/lib/helpers/bookingToEventTransformer";
import {
  CalendarEvent,
  IlamyResourceCalendar,
  Resource,
} from "@ilamy/calendar";
import { useState } from "react";

export function OverviewPage({
  rooms,
  bookings,
}: {
  rooms: string[];
  bookings: Booking[];
}) {
  const [isBookingDetailsDialogOpen, setIsBookingDetailsDialogOpen] =
    useState(false);
  const [bookingEvent, setBookingEvent] = useState<CalendarEvent | undefined>(
    undefined
  );

  const resources: Resource[] = rooms
    .map(room => ({
      id: room.trim().replaceAll(" ", "_").toLowerCase(),
      title: room,
    }))
    .sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }

      return 0;
    });

  const events = bookingToResourceEventTransformer(bookings);

  console.log(events);

  return (
    <div>
      {isBookingDetailsDialogOpen && bookingEvent !== undefined && (
        <BookingDetailsDialog
          bookingId={bookingEvent.id.toString()}
          open={isBookingDetailsDialogOpen}
          onOpenChange={setIsBookingDetailsDialogOpen}
        />
      )}
      <IlamyResourceCalendar
        disableCellClick={true}
        businessHours={{
          daysOfWeek: ["monday", "tuesday", "wednesday", "thursday", "friday"],
          startTime: 8,
          endTime: 22,
        }}
        disableDragAndDrop={true}
        onEventClick={event => {
          setBookingEvent(event);
          setIsBookingDetailsDialogOpen(true);
        }}
        firstDayOfWeek="monday"
        initialView="week"
        locale="hu"
        timeFormat="24-hour"
        timezone="Europe/Budapest"
        resources={resources}
        events={events}
        headerComponent={<ResouceCalendarHeader />}
        translations={
          {
            resources: "Termek",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any
        }
      />
    </div>
  );
}
