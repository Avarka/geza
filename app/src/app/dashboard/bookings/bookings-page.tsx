"use client";

import { BookingFilter } from "@/components/bookings/booking-filter";
import { BookingItem } from "@/components/bookings/booking-item";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllBookings, getMyBookings } from "@/lib/actions/bookings";
import { bookings as bookingsSchema } from "@/lib/db/schema";
import { useEffect, useState, useTransition } from "react";

type BookingsPageProps = {
  userId: string;
};

export function BookingsPage({ userId: userId }: BookingsPageProps) {
  const [isLoading, startTransition] = useTransition();
  const [bookings, setBookings] = useState<
    (typeof bookingsSchema.$inferSelect)[]
  >([]);
  const [filteredBookings, setFilteredBookings] = useState<
    (typeof bookingsSchema.$inferSelect)[]
  >([]);
  const [nameFilter, setNameFilter] = useState("");
  const [stateFilter, setStateFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<Date>(new Date());

  useEffect(() => {
    startTransition(async () => {
      const myBookings = await getMyBookings(userId);
      setBookings(myBookings);
      setFilteredBookings(myBookings);
    });
  }, [userId]);

  useEffect(() => {
    const handleFilterChange = () => {
      let filtered = bookings;
      if (stateFilter.length > 0) {
        filtered = filtered.filter(booking =>
          stateFilter.includes(booking.status)
        );
      }
      if (nameFilter) {
        filtered = filtered.filter(booking =>
          booking.course.toLowerCase().includes(nameFilter.toLowerCase())
        );
      }
      if (dateFilter) {
        filtered = filtered.filter(booking => {
          // Booking date is on the same day or is after the dateFilter
          const bookingDate = new Date(booking.startTime);
          return dateFilter.getTime() <= bookingDate.getTime();
        });
      }
      setFilteredBookings(filtered);
    };

    handleFilterChange();
  }, [bookings, nameFilter, stateFilter, dateFilter]);

  if (isLoading) {
    return (
      <>
        <BookingFilter
          nameFilter={nameFilter}
          onNameFilterChange={setNameFilter}
          stateFilter={stateFilter}
          onStateFilterChange={setStateFilter}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
        />
        <Separator className="my-4" />
        <div className="flex flex-col items-center gap-2">
          <Spinner className="size-10" /> Betöltés...
        </div>
      </>
    );
  }

  return (
    <>
      <BookingFilter
        nameFilter={nameFilter}
        onNameFilterChange={setNameFilter}
        stateFilter={stateFilter}
        onStateFilterChange={setStateFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
      />
      <Separator className="my-4" />
      {filteredBookings.map(booking => (
        <BookingItem key={booking.id} booking={booking} />
      ))}
    </>
  );
}

export function BookingsPageOperator({ userId }: BookingsPageProps) {
  const [isLoading, startTransition] = useTransition();
  const [bookings, setBookings] = useState<
    (typeof bookingsSchema.$inferSelect)[]
  >([]);
  const [filteredBookings, setFilteredBookings] = useState<
    (typeof bookingsSchema.$inferSelect)[]
  >([]);
  const [nameFilter, setNameFilter] = useState("");
  const [stateFilter, setStateFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<Date>(new Date());

  useEffect(() => {
    startTransition(async () => {
      const allBookings = await getAllBookings();
      setBookings(allBookings);
      setFilteredBookings(allBookings);
    });
  }, [userId]);

  useEffect(() => {
    const handleFilterChange = () => {
      let filtered = bookings;
      if (stateFilter.length > 0) {
        filtered = filtered.filter(booking =>
          stateFilter.includes(booking.status)
        );
      }
      if (nameFilter) {
        filtered = filtered.filter(booking =>
          booking.course.toLowerCase().includes(nameFilter.toLowerCase())
        );
      }
      if (dateFilter) {
        filtered = filtered.filter(booking => {
          // Booking date is on the same day or is after the dateFilter
          const bookingDate = new Date(booking.startTime);
          return dateFilter.getTime() <= bookingDate.getTime();
        });
      }
      setFilteredBookings(filtered);
    };

    handleFilterChange();
  }, [bookings, nameFilter, stateFilter, dateFilter]);

  if (isLoading) {
    return (
      <>
        <BookingFilter
          nameFilter={nameFilter}
          onNameFilterChange={setNameFilter}
          stateFilter={stateFilter}
          onStateFilterChange={setStateFilter}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
        />
        <Separator className="my-4" />
        <div className="flex flex-col items-center gap-2">
          <Spinner className="size-10" /> Betöltés...
        </div>
      </>
    );
  }

  return (
    <>
      <BookingFilter
        nameFilter={nameFilter}
        onNameFilterChange={setNameFilter}
        stateFilter={stateFilter}
        onStateFilterChange={setStateFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
      />
      <Separator className="my-4" />
      {filteredBookings.map(booking => (
        <BookingItem key={booking.id} booking={booking} isOperatorView />
      ))}
    </>
  );
}

export function AdminBookingsPage({ userId }: BookingsPageProps) {
  return (
    <>
      <Tabs defaultValue="user" className="m-4">
        <TabsList className="mx-auto">
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="operator">Operator</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <BookingsPage userId={userId} />
        </TabsContent>
        <TabsContent value="operator">
          <BookingsPageOperator userId={userId} />
        </TabsContent>
      </Tabs>
    </>
  );
}
