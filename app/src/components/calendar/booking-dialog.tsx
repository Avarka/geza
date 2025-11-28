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
  FieldContent,
  FieldDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      rule: "",
      customRequest: {
        note: "",
        internetAccess: true,
        operatingSystems: [],
      },
      startTime: event.start.format("HH:mm"),
      endTime: event.end.format("HH:mm"),
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
      const dates = events.map(e => getStartDate(e).toDate());
      setDates(dates);
    });
  }, [event.data, userLdap]);

  const onSubmit = async (values: z.infer<typeof newBookingFormSchema>) => {
    try {
      if (!event.location || !event.data?.neptunCode) {
        throw new Error("Malformed event! Probably internal error.");
      }

      await createBookingsForEvents({
        event: {
          lenght: Math.abs(event.start.hour() - event.end.hour()),
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
        <ScrollArea className="max-h-[450px]">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mb-4 pr-4"
          >
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
                        min={event.start
                          .subtract(10, "minutes")
                          .format("HH:mm")}
                        max={event.end.format("HH:mm")}
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
                        min={event.start.format("HH:mm")}
                        max={event.end.add(10, "minutes").format("HH:mm")}
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
                      <MultiSelectTrigger className="w-full" id="events">
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
                name="rule"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="rules">Szabály</FieldLabel>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Válasszon szabályt" />
                      </SelectTrigger>
                      <SelectContent>
                        {rules.length > 0 ? (
                          rules.map(rule => (
                            <SelectItem
                              key={rule.id.toString()}
                              value={rule.id.toString()}
                            >
                              {rule.name}
                            </SelectItem>
                          ))
                        ) : (
                          <></>
                        )}
                        <SelectItem value="other">Egyéni</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {form.watch("rule") === "other" && (
                <>
                  <Controller
                    control={form.control}
                    name="customRequest.operatingSystems"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="events">Menü opciók</FieldLabel>
                        <MultiSelect
                          {...field}
                          onValuesChange={field.onChange}
                          values={field.value}
                        >
                          <MultiSelectTrigger className="w-full" id="events">
                            <MultiSelectValue placeholder="Válasszon lehetőségeket..." />
                          </MultiSelectTrigger>
                          <MultiSelectContent>
                            <MultiSelectGroup>
                              <MultiSelectItem value="linux">
                                Linux
                              </MultiSelectItem>
                              <MultiSelectItem value="windows">
                                Windows
                              </MultiSelectItem>
                              <MultiSelectItem value="cs">
                                CooSpace
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
                    name="customRequest.internetAccess"
                    render={({ field, fieldState }) => (
                      <Field
                        {...field}
                        orientation="horizontal"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldContent>
                          <FieldLabel htmlFor="internetAccess">
                            Internet hozzáférés
                          </FieldLabel>
                          <FieldDescription>
                            Az általános internethozzáférés ezzel tiltható.
                            Amennyiben szükség van bizonyos oldalakra, vagy
                            szoftverekre, azt a lenti megjegyzés mezőben
                            jelezze.
                          </FieldDescription>
                        </FieldContent>
                        <Switch id="internetAccess" />
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="customRequest.forcedReset.beginning"
                    render={({ field, fieldState }) => (
                      <Field
                        {...field}
                        orientation="horizontal"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldContent>
                          <FieldLabel htmlFor="forcedResetBegin">
                            Újraindítás az elején
                          </FieldLabel>
                          <FieldDescription>
                            A virtuális operációs rendszer újbóli kiválasztása
                            szükséges a kezdéskor. Ezzel eltűntetve az
                            esetlegesen megnyitott alkalmazásokat, weboldalakat.
                          </FieldDescription>
                        </FieldContent>
                        <Switch id="forcedResetBegin" />
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="customRequest.forcedReset.end"
                    render={({ field, fieldState }) => (
                      <Field
                        {...field}
                        orientation="horizontal"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldContent>
                          <FieldLabel htmlFor="forcedResetEnd">
                            Újraindítás a végén
                          </FieldLabel>
                          <FieldDescription>
                            A vizsga végén a virtuális operációs rendszer leáll.
                          </FieldDescription>
                        </FieldContent>
                        <Switch id="forcedResetEnd" />
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="customRequest.note"
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
                </>
              )}

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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
