// This component is used to create arbitrary bookings! Intented for operator and admin use only!
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogProps } from "@radix-ui/react-dialog";
import { Spinner } from "@/components/ui/spinner";
import { getBookingWithRuleAndUser } from "@/lib/actions/bookings";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState, useTransition } from "react";
import { Booking, Rule, User } from "@/lib/db/schema";

export default function BookingDetailsDialog({
  bookingId,
  ...props
}: { bookingId: string } & DialogProps) {
  const [fetchingBooking, startFetchingBooking] = useTransition();
  const [booking, setBooking] = useState<{
    booking: Booking | null;
    rule: Rule | null;
    user: User | null;
  }>();

  useEffect(() => {
    startFetchingBooking(async () => {
      if (!bookingId) {
        return;
      }
      const booking = await getBookingWithRuleAndUser(Number(bookingId));
      setBooking(booking);
    });
  }, [bookingId]);

  if (fetchingBooking) {
    return (
      <Dialog {...props}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Foglalás</DialogTitle>
            <DialogDescription>A foglalás adatai</DialogDescription>
          </DialogHeader>
          <Spinner className="mx-auto my-8 size-10" />
        </DialogContent>
      </Dialog>
    );
  }

  if (!booking || booking.booking === null) {
    return (
      <Dialog {...props}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Foglalás</DialogTitle>
            <DialogDescription>A foglalás adatai</DialogDescription>
          </DialogHeader>
          Nem található foglalás (hogyan jött ez össze?).
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Foglalás ({booking.booking.course})</DialogTitle>
          <DialogDescription>A foglalás adatai</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[450px]">
          <div className="space-y-4 py-4">
            <div>
              <strong>Felhasználó LDAP:</strong> {booking.user?.name}
            </div>
            <div>
              <strong>Terem:</strong> {booking.booking.classroom}
            </div>
            <div>
              <strong>Keletkezés ideje:</strong>{" "}
              {new Date(booking.booking.createdAt).toLocaleString("hu-HU")}
            </div>
            <div>
              <strong>Foglalás kezdete:</strong>{" "}
              {new Date(booking.booking.startTime).toLocaleString("hu-HU")}
            </div>
            <div>
              <strong>Foglalás vége:</strong>{" "}
              {new Date(booking.booking.endTime).toLocaleString("hu-HU")}
            </div>
            {booking.rule && (
              <div>
                <strong>Szabály:</strong> {booking.rule.name}
              </div>
            )}
            {!booking.rule && booking.booking.customRequest && (
              <>
                <div>
                  <strong>Egyedi kérés:</strong>{" "}
                </div>
                <pre>{JSON.stringify(booking.booking.customRequest, null, 2)}</pre>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
