"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogProps } from "@radix-ui/react-dialog";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { semesterCreate } from "@/lib/schemas/semesterCreate";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/date-input";
import { createSemester, updateSemester } from "@/lib/actions/semester";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function SemesterCreateEditDialog({
  semester,
  ...props
}: {
  semester?: z.infer<typeof semesterCreate>;
} & DialogProps) {
  const form = useForm<z.infer<typeof semesterCreate>>({
    resolver: zodResolver(semesterCreate),
    defaultValues: {
      name: semester?.name || "",
      startDate: semester?.startDate || new Date(),
      endDate: semester?.endDate || new Date(),
    },
  });

  const onSubmit = async (values: z.infer<typeof semesterCreate>) => {
    try {
      if (semester) {
        await updateSemester(semester.name, values);
      } else {
        await createSemester(values);
      }
      props.onOpenChange?.(false);
      toast.success(`Félév sikeresen ${semester ? "frissítve" : "létrehozva"}`);
    } catch (error) {
      console.error("Error creating semester:", error);
      toast.error(
        `Hiba történt a félév ${semester ? "frissítése" : "létrehozása"} során`
      );
    }
  };

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Új félév {semester ? "szerkeszése" : "létrehozása"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-4">
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="semesterName">
                    Félév megnevezése
                  </FieldLabel>
                  <FieldDescription>
                    {'Elvárt formátum: "ÉÉÉÉ/ÉÉ I" vagy "ÉÉÉÉ/ÉÉ II"'}
                  </FieldDescription>
                  <Input
                    {...field}
                    id="semesterName"
                    type="text"
                    required
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="startDate"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <DateInput {...field} label="Kezdő dátum" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="endDate"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <DateInput {...field} label="Vég dátum" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  disabled={form.formState.isSubmitting}
                >
                  Mégse
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Spinner /> : ""}
                {semester ? "Frissítés" : "Hozzáadás"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
