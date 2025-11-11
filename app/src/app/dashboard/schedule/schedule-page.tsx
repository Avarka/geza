"use client";

import BookingDialog from "@/components/calendar/booking-dialog";
import { TeacherCalendarHeader } from "@/components/calendar/calendar-header";
import CustomEvent from "@/components/calendar/event";
import { rules } from "@/lib/db/schema";
import { CalendarEvent, IlamyCalendar } from "@ilamy/calendar";
import { useState } from "react";

type Rule = typeof rules.$inferSelect;

export function SchedulePage({
  events,
  rules,
  userLdap,
}: {
  events: CalendarEvent[];
  rules: Rule[];
  userLdap: string;
}) {
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [bookingEvent, setBookingEvent] = useState<CalendarEvent | undefined>(undefined);

  return (
    <div>
      {isBookingDialogOpen && bookingEvent !== undefined && (
        <BookingDialog
          event={bookingEvent}
          open={isBookingDialogOpen}
          onOpenChange={setIsBookingDialogOpen}
          rules={rules}
          userLdap={userLdap}
        />
      )}

      <IlamyCalendar
        initialView="week"
        firstDayOfWeek="monday"
        disableCellClick={true}
        disableDragAndDrop={true}
        headerComponent={<TeacherCalendarHeader />}
        timezone="Europe/Budapest"
        locale="hu"
        events={events}
        viewHeaderClassName="bg-accent pointer-events-none"
        renderEvent={event => <CustomEvent event={event} />}
        onEventClick={async event => {
          setBookingEvent(event);
          setIsBookingDialogOpen(true);
        }}
      />
    </div>
  );
}
