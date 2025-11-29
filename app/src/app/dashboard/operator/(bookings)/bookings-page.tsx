"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { Booking, Rule } from "@/lib/db/schema";
import { getAllBookings } from "@/lib/actions/bookings";
import CreateBookingDialog from "@/components/bookings/booking-create";
import { BookingFilter } from "@/components/bookings/booking-filter";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { BookingItem } from "@/components/bookings/booking-item";
import { BookingsPageProps } from "@/app/dashboard/(user)/bookings/bookings-page";

export function BookingsPageOperator({
  userId,
  rules,
}: BookingsPageProps & { rules: Rule[] }) {
  const [isLoading, startTransition] = useTransition();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [nameFilter, setNameFilter] = useState("");
  const [stateFilter, setStateFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<Date>(new Date());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const refreshBookings = useCallback(() => {
    startTransition(async () => {
      setBookings([]);
      const myBookings = await getAllBookings();
      setBookings(myBookings);
      setFilteredBookings(myBookings);
    });
  }, []);

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

  const handleDialogChange = (open: boolean) => {
    setIsCreateDialogOpen(open);
    if (!open) {
      refreshBookings();
    }
  };

  return (
    <>
      <CreateBookingDialog
        userId={userId}
        rules={rules}
        open={isCreateDialogOpen}
        onOpenChange={handleDialogChange}
      />
      <BookingFilter
        nameFilter={nameFilter}
        onNameFilterChange={setNameFilter}
        stateFilter={stateFilter}
        onStateFilterChange={setStateFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
      />
      <div className="flex items-center justify-between px-20">
        <Separator className="flex-1 mr-2" />
        <Button
          variant="ghost"
          size="icon-lg"
          className="rounded-full"
          aria-label="Új foglalás létrehozása"
          onClick={() => handleDialogChange(true)}
        >
          <PlusCircleIcon />
        </Button>
        <Separator className="flex-1 ml-2" />
      </div>
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
            isOperatorView
            onRefresh={refreshBookings}
          />
        ))}
    </>
  );
}
