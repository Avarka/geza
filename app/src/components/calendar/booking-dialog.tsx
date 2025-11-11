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
import { bookingFormSchema } from "@/lib/schemas/bookingForm";
import { Field, FieldError, FieldGroup } from "../ui/field";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "../ui/multi-select";

const tempRules = [
  "Újraindítás kezdéskor",
  "Újraindítás a végén",
  "Progalapszabály",
  "Elérhető rendszer: CS",
  "Elérhető rendszer: Linux",
  "Elérhető rendszer: Windows"
]

export default function BookingDialog({
  event,
  dates,
  ...props
}: { event: CalendarEvent; dates: Date[] } & DialogProps) {
  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      listOfEvents: [],
      listOfRules: [],
    },
  });

  const onSubmit = (values: z.infer<typeof bookingFormSchema>) => {
    console.log("Form submitted with values:", values);
  };

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
          <DialogDescription>ZH mód foglalása</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-4">
          <FieldGroup>
            <Controller
              control={form.control}
              name="listOfEvents"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <MultiSelect
                    {...field}
                    onValuesChange={field.onChange}
                    values={field.value}
                  >
                    <MultiSelectTrigger className="w-full max-w-[400px]">
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
                          <MultiSelectItem value="">Nincsenek elérhető időpontok a foglaláshoz.</MultiSelectItem>
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
                  <MultiSelect
                    {...field}
                    onValuesChange={field.onChange}
                    values={field.value}
                  >
                    <MultiSelectTrigger className="w-full max-w-[400px]">
                      <MultiSelectValue placeholder="Válasszon szabályokat..." />
                    </MultiSelectTrigger>
                    <MultiSelectContent>
                      <MultiSelectGroup>
                        {tempRules.length > 0 ? (
                          tempRules.map((rule) => (
                            <MultiSelectItem
                              key={rule}
                              value={rule}
                            >
                              {rule}
                            </MultiSelectItem>
                          ))
                        ) : (
                          <MultiSelectItem value="">Nincsenek elérhető szabályok.</MultiSelectItem>
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

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Mégse</Button>
              </DialogClose>
              <Button type="submit">Foglalás</Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
