"use client";

import BookingDialog from "@/components/calendar/booking-dialog";
import { TeacherCalendarHeader } from "@/components/calendar/calendar-header";
import CustomEvent from "@/components/calendar/event";
import { getUserScheduleForCourse } from "@/lib/actions/schedule";
import { authClient } from "@/lib/auth-client";
import { getStartDate } from "@/lib/helpers/classToEventTransformer";
import { CalendarEvent, IlamyCalendar } from "@ilamy/calendar";
import { redirect } from "next/navigation";
import { useState } from "react";

export function SchedulePage({ events }: { events: CalendarEvent[] }) {
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [bookingEvent, setBookingEvent] = useState<CalendarEvent>({} as CalendarEvent)
  const [bookingEventDates, setBookingEventDates] = useState<Date[]>([])

  return (
    <div>
      <BookingDialog event={bookingEvent} dates={bookingEventDates} open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen} />
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
          console.log("Event clicked:", event);
          const user = (await authClient.getSession()).data?.user.name || redirect("/login");
          
          setBookingEvent(event);
          const events = await getUserScheduleForCourse(user, event.data!.neptunCode);
          const dates = events.map(e => getStartDate(e));
          setBookingEventDates(dates);

          setIsBookingDialogOpen(true);
        }}
      />
    </div>
  );
}
