"use client";

import { BookingFilter } from "@/components/bookings/booking-filter";
import { BookingItem } from "@/components/bookings/booking-item";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { getMyBookings } from "@/lib/actions/bookings";
import { Booking, bookings as bookingsSchema } from "@/lib/db/schema";
import { useCallback, useEffect, useState, useTransition } from "react";

export type BookingsPageProps = {
  userId: string;
};

export function BookingsPage({ userId: userId }: BookingsPageProps) {
  const [isLoading, startTransition] = useTransition();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [nameFilter, setNameFilter] = useState("");
  const [stateFilter, setStateFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<Date>(new Date());

  const refreshBookings = useCallback(() => {
    startTransition(async () => {
      const myBookings = await getMyBookings(userId);
      setBookings(myBookings);
      setFilteredBookings(myBookings);
    });
  }, [userId]);

  useEffect(() => {
    refreshBookings();
  }, [refreshBookings, userId]);

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
      {isLoading && (
        <div className="flex flex-col items-center gap-2">
          <Spinner className="size-10" /> Betöltés...
        </div>
      )}
      {!isLoading && filteredBookings.length === 0 && (
        <div className="text-center text-muted-foreground">
          Nincsenek megjeleníthető foglalások.
        </div>
      )}
      {!isLoading &&
        filteredBookings.map(booking => (
          <BookingItem
            key={booking.id}
            booking={booking}
            onRefresh={refreshBookings}
          />
        ))}
    </>
  );
}
