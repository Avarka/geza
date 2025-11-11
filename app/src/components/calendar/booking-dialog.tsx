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
import { CalendarEvent } from "@ilamy/calendar";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { newBookingFormSchema } from "@/lib/schemas/bookingForm";
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
import { rules } from "@/lib/db/schema";
import { useEffect, useState, useTransition } from "react";
import { getUserScheduleForCourse } from "@/lib/actions/schedule";
import { getStartDate } from "@/lib/helpers/classToEventTransformer";
import { Spinner } from "@/components/ui/spinner";
import { createBookingsForEvents } from "@/lib/actions/bookings";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { Input } from "../ui/input";

type Rule = typeof rules.$inferSelect;

export default function BookingDialog({
  event,
  userLdap,
  rules,
  ...props
}: { event: CalendarEvent; userLdap: string; rules: Rule[] } & DialogProps) {
  const form = useForm<z.infer<typeof newBookingFormSchema>>({
    resolver: zodResolver(newBookingFormSchema),
    defaultValues: {
      listOfEvents: [event.start.toISOString()],
      listOfRules: [],
      note: "",
      startTime: new Date(event.start).toTimeString().split(" ")[0],
      endTime: new Date(event.end).toTimeString().split(" ")[0],
    },
  });

  const [gettingEvents, startTransition] = useTransition();
  const [dates, setDates] = useState<Date[]>([]);

  useEffect(() => {
    if (!event.data) {
      return;
    }
    startTransition(async () => {
      const events = await getUserScheduleForCourse(
        userLdap,
        event.data!.neptunCode
      );
      const dates = events.map(e => getStartDate(e));
      setDates(dates);
    });
  }, [event.data, userLdap]);

  const onSubmit = async (values: z.infer<typeof newBookingFormSchema>) => {
    try {
      await createBookingsForEvents({
        event: {
          lenght: Math.abs(
            new Date(event.start).getHours() - new Date(event.end).getHours()
          ),
          location: event.location,
          neptunCode: event.data?.neptunCode,
        },
        userLdap,
        ...values,
      });
      props.onOpenChange?.(false);
      toast.success("Foglalás sikeres, operátori jóváhagyásra vár");
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Hiba történt a foglalás során");
    }
  };

  if (gettingEvents) {
    return (
      <Dialog {...props}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{event.title}</DialogTitle>
            <DialogDescription>ZH mód foglalása</DialogDescription>
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
          <DialogTitle>{event.title}</DialogTitle>
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
                    <Input
                      {...field}
                      type="time"
                      id="startTime"
                      step="60"
                      min={new Date(event.start).toTimeString().split(" ")[0]}
                      max={new Date(event.end).toTimeString().split(" ")[0]}
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
                      min={new Date(event.start).toTimeString().split(" ")[0]}
                      max={new Date(event.end).toTimeString().split(" ")[0]}
                      value={field.value || ""}
                    />
                  </Field>
                )}
              />
            </div>

            <Controller
              control={form.control}
              name="listOfEvents"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="events">Alkalmak</FieldLabel>
                  <MultiSelect
                    {...field}
                    onValuesChange={field.onChange}
                    values={field.value}
                  >
                    <MultiSelectTrigger
                      className="w-full max-w-[400px]"
                      id="events"
                    >
                      <MultiSelectValue placeholder="Válasszon alkalmakat..." />
                    </MultiSelectTrigger>
                    <MultiSelectContent>
                      <MultiSelectGroup>
                        {dates.length > 0 ? (
                          dates.map((date, i) => (
                            <MultiSelectItem
                              key={date.toISOString()}
                              value={date.toISOString()}
                            >
                              {(i + 1).toString().padStart(2, "0")}. alkalom (
                              {(date.getMonth() + 1)
                                .toString()
                                .padStart(2, "0")}
                              /{date.getDate().toString().padStart(2, "0")})
                            </MultiSelectItem>
                          ))
                        ) : (
                          <MultiSelectItem value="">
                            Nincsenek elérhető időpontok a foglaláshoz.
                          </MultiSelectItem>
                        )}
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
              name="listOfRules"
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
                        {rules.length > 0 ? (
                          rules.map(rule => (
                            <MultiSelectItem
                              key={rule.id.toString()}
                              value={rule.id.toString()}
                            >
                              {rule.name}
                            </MultiSelectItem>
                          ))
                        ) : (
                          <MultiSelectItem value="">
                            Nincsenek elérhető szabályok.
                          </MultiSelectItem>
                        )}
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
                {form.formState.isSubmitting ? <Spinner /> : null} Foglalás
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
