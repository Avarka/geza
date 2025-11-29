// This component is used to create arbitrary bookings! Intented for operator and admin use only!
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
import {
  createBookingFormSchema,
} from "@/lib/schemas/bookingForm";
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
import { Rule, rules } from "@/lib/db/schema";
import { Spinner } from "@/components/ui/spinner";
import {
  createBooking,
  getSetOfRooms as getSetOfRoomsFromBookings,
} from "@/lib/actions/bookings";
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
import day from "@/lib/dayjs-ext";
import { useEffect, useState, useTransition } from "react";
import { getSetOfRooms as getSetOfRoomsFromBir } from "@/lib/actions/bir";
import { CustomCombobox } from "@/components/custom-combobox";

export default function CreateBookingDialog({
  userId,
  rules,
  ...props
}: { userId: string; rules: Rule[] } & DialogProps) {
  const form = useForm<z.infer<typeof createBookingFormSchema>>({
    resolver: zodResolver(createBookingFormSchema),
    defaultValues: {
      rule: "",
      customRequest: null,
      startTime: day().toISOString(),
      endTime: day().toISOString(),
      location: "",
      neptunCode: "",
    },
  });

  const [fetchingRooms, startFetchingRooms] = useTransition();
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);

  useEffect(() => {
    startFetchingRooms(async () => {
      const roomsFromBir = await getSetOfRoomsFromBir();
      const roomsFromBookings = await getSetOfRoomsFromBookings();

      const combinedRooms = Array.from(
        new Set([...roomsFromBir, ...roomsFromBookings])
      ).sort();
      setAvailableRooms(combinedRooms);
    });
  }, []);

  const onSubmit = async (values: z.infer<typeof createBookingFormSchema>) => {
    try {
      await createBooking({
        userId,
        startTime: new Date(values.startTime),
        endTime: new Date(values.endTime),
        ruleId: values.rule === "other" ? null : parseInt(values.rule, 10),
        customRequest: values.rule === "other" ? values.customRequest : null,
        classroom: values.location,
        course: values.neptunCode,
      });
      props.onOpenChange?.(false);
      toast.success("Foglalás sikeresen létrehozva");
      form.reset();
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Hiba történt a foglalás során");
    }
  };

  if (fetchingRooms) {
    return (
      <Dialog {...props}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Új foglalás létrehozása</DialogTitle>
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
          <DialogTitle>Új foglalás létrehozása</DialogTitle>
          <DialogDescription>ZH mód foglalása</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[450px]">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mb-4 pl-2 pr-4"
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
                        type="datetime-local"
                        id="startTime"
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
                        type="datetime-local"
                        id="endTime"
                        value={field.value || ""}
                      />
                    </Field>
                  )}
                />
              </div>

              <Controller
                control={form.control}
                name="location"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="classroom">Terem</FieldLabel>
                    <CustomCombobox 
                      {...field}
                      options={availableRooms.map((room) => {
                        return { label: room, value: room };
                      })}
                      placeholder="Válasszon termet vagy írjon be egy újat"
                      selected={field.value}
                      onChange={field.onChange}
                      onCreate={(value) => {
                        field.onChange(value);
                        setAvailableRooms((prev) => [...prev, value]);
                      }}

                    />
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="neptunCode"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="neptunCode">Neptun kód</FieldLabel>
                    <Input
                      {...field}
                      type="text"
                      id="neptunCode"
                      value={field.value || ""}
                    />
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
