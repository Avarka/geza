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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import { bookings, rules } from "@/lib/db/schema";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { updateBooking } from "@/lib/actions/bookings";

type Rule = typeof rules.$inferSelect;

export default function BookingEditDialog({
  booking,
  ...props
}: { booking: typeof bookings.$inferSelect } & DialogProps) {
  const form = useForm<z.infer<typeof editBookingFormSchema>>({
    resolver: zodResolver(editBookingFormSchema),
    defaultValues: {
      listOfRules: [],
      note: booking.note || "",
      startTime: booking.startTime.toTimeString().split(" ")[0],
      endTime: booking.endTime.toTimeString().split(" ")[0],
    },
  });

  const onSubmit = async (values: z.infer<typeof editBookingFormSchema>) => {
    try {
      await updateBooking(booking.id, values.startTime, values.endTime, values.note);
      props.onOpenChange?.(false);
      {/* TODO: Auto refresh */}
      toast.success("Foglalás frissítve, frissítse az oldalt");
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Hiba történt a foglalás során");
    }
  };

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{booking.course}</DialogTitle>
          <DialogDescription>ZH mód foglalása</DialogDescription>
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
                    {/* TODO: Implement min max according to course limits */}
                    <Input
                      {...field}
                      type="time"
                      id="startTime"
                      step="60"
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
                    {/* TODO: Implement min max according to course limits */}
                    <Input
                      {...field}
                      type="time"
                      id="endTime"
                      step="60"
                      value={field.value || ""}
                    />
                  </Field>
                )}
              />
            </div>

            {/* TODO: Implement rule editing */}
            <Controller
              control={form.control}
              name="listOfRules"
              disabled
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="rules">Szabályok</FieldLabel>
                  <MultiSelect
                    {...field}
                    onValuesChange={field.onChange}
                    values={field.value.map(String)}
                  >
                    <MultiSelectTrigger
                      className="w-full max-w-[400px]"
                      id="rules"
                    >
                      <MultiSelectValue placeholder="Válasszon szabályokat..." />
                    </MultiSelectTrigger>
                    <MultiSelectContent>
                      <MultiSelectGroup>
                        <MultiSelectItem value="">
                          Nincsenek elérhető szabályok.
                        </MultiSelectItem>
                      </MultiSelectGroup>
                    </MultiSelectContent>
                  </MultiSelect>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="note"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="note">Megjegyzés</FieldLabel>
                  <Textarea
                    {...field}
                    id="note"
                    placeholder="Szabadszavas megjegyzés, amennyiben szükséges"
                    rows={4}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

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
