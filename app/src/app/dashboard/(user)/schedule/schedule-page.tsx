"use client";

import BookingDialog from "@/components/calendar/booking-dialog";
import { TeacherCalendarHeader } from "@/components/calendar/calendar-header";
import CustomEvent from "@/components/calendar/event";
import { Rule } from "@/lib/db/schema";
import { GezaTeacherCourse as ClassData } from "@/lib/db/schema-bir";
import { classToEventTransformer } from "@/lib/helpers/classToEventTransformer";
import { CalendarEvent, IlamyCalendar } from "@ilamy/calendar";
import { useEffect, useState } from "react";

export function SchedulePage({
  classes,
  rules,
  userLdap,
}: {
  classes: ClassData[];
  rules: Rule[];
  userLdap: string;
}) {
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [bookingEvent, setBookingEvent] = useState<CalendarEvent | undefined>(undefined);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    setEvents(classToEventTransformer(classes))
  }, [classes])

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
        businessHours={{
          daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          startTime: 8,
          endTime: 22
        }}
        timeFormat="24-hour"
      />
    </div>
  );
}
