"use client";

import { BookingItem } from "@/components/bookings/booking-item";
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

  useEffect(() => {
    startTransition(async () => {
      const myBookings = await getMyBookings(userId);
      setBookings(myBookings);
    });
  }, [userId]);

  if (isLoading) {
    return <div>Betöltés...</div>;
  }

  return (
    <>
      {bookings.map(booking => (
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

  useEffect(() => {
    startTransition(async () => {
      const allBookings = await getAllBookings();
      setBookings(allBookings);
    });
  }, [userId]);

  if (isLoading) {
    return <div>Betöltés...</div>;
  }

  return (
    <>
      {bookings.map(booking => (
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
