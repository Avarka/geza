"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogProps } from "@radix-ui/react-dialog";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { editBookingFormSchema } from "@/lib/schemas/bookingForm";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Booking } from "@/lib/db/schema";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { updateBooking } from "@/lib/actions/bookings";
import { useEffect, useState, useTransition } from "react";
import { GezaTeacherCourse } from "@/lib/db/schema-bir";
import { getCourseByNeptun } from "@/lib/actions/bir";
import {
  getEndDate,
  getStartDate,
} from "@/lib/helpers/classToEventTransformer";

export default function BookingEditDialog({
  booking,
  ...props
}: { booking: Booking } & DialogProps) {
  const form = useForm<z.infer<typeof editBookingFormSchema>>({
    resolver: zodResolver(editBookingFormSchema),
    defaultValues: {
      startTime: booking.startTime.toTimeString().split(" ")[0],
      endTime: booking.endTime.toTimeString().split(" ")[0],
    },
  });

  const [course, setCourse] = useState<GezaTeacherCourse | null>(null);
  const [fetchingCourse, startTransition] = useTransition();

  useEffect(() => {
    if (!props.open) {
      return;
    }
    startTransition(async () => {
      const course = await getCourseByNeptun(booking.course);
      if (course.length > 0) {
        setCourse(course[0]);
      }
    });
  }, [booking.course, props.open]);

  const onSubmit = async (values: z.infer<typeof editBookingFormSchema>) => {
    try {
      await updateBooking(booking.id, values.startTime, values.endTime);
      props.onOpenChange?.(false);
      toast.success("Foglalás frissítve!");
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Hiba történt a foglalás során");
    }
  };

  if (fetchingCourse) {
    return (
      <Dialog {...props}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{booking.course}</DialogTitle>
            <DialogDescription>ZH mód foglalás szerkeszése</DialogDescription>
          </DialogHeader>
          <Spinner className="mx-auto my-8 size-10" />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {course?.courseFullName} ({booking.course})
          </DialogTitle>
          <DialogDescription>ZH mód foglalás szerkeszése</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-4">
          <FieldGroup>
            <div className="flex gap-4 md:flex-row flex-col">
              <Controller
                control={form.control}
                name="startTime"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="startTime">Kezdő időpont</FieldLabel>
                    <Input
                      {...field}
                      type="time"
                      id="startTime"
                      step="60"
                      min={
                        course
                          ? getStartDate(course)
                              .subtract(10, "minutes")
                              .format("HH:mm")
                          : undefined
                      }
                      max={
                        course ? getEndDate(course).format("HH:mm") : undefined
                      }
                      value={field.value || ""}
                    />
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="endTime"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="endTime">Vég időpont</FieldLabel>
                    <Input
                      {...field}
                      type="time"
                      id="endTime"
                      step="60"
                      min={
                        course
                          ? getStartDate(course).format("HH:mm")
                          : undefined
                      }
                      max={
                        course
                          ? getEndDate(course)
                              .add(10, "minutes")
                              .format("HH:mm")
                          : undefined
                      }
                      value={field.value || ""}
                    />
                  </Field>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Mégse</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Spinner /> : null} Frissítés
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
