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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { ruleCreate } from "@/lib/schemas/ruleCreate";
import { createRule, updateRule } from "@/lib/actions/rules";
import { Textarea } from "@/components/ui/textarea";

export default function RuleCreateEditDialog({
  rule,
  ...props
}: {
  rule?: z.infer<typeof ruleCreate>;
} & DialogProps) {
  const form = useForm<z.infer<typeof ruleCreate>>({
    resolver: zodResolver(ruleCreate),
    defaultValues: {
      name: rule?.name || "",
      description: rule?.description || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ruleCreate>) => {
    try {
      if (rule) {
        await updateRule(rule.name, values);
      } else {
        const newRule = {
          ...values,
          action: { type: ("script" as const), scriptName: values.scriptName },
        };
        await createRule(newRule);
      }
      props.onOpenChange?.(false);
      toast.success(`Szabály sikeresen ${rule ? "frissítve" : "létrehozva"}`);
      form.reset();
    } catch (error) {
      console.error("Error creating rule:", error);
      toast.error(
        `Hiba történt a szabály ${rule ? "frissítése" : "létrehozása"} során`
      );
    }
  };

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Szabály {rule ? "szerkeszése" : "létrehozása"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-4">
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="ruleName">
                    Szabály megnevezése
                  </FieldLabel>
                  <Input
                    {...field}
                    id="ruleName"
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
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="ruleDescription">
                    Szabály leírása
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="ruleDescription"
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
              name="scriptName"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="scriptName">Script neve</FieldLabel>
                  <Input
                    {...field}
                    value={field.value}
                    id="scriptName"
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
                {rule ? "Frissítés" : "Hozzáadás"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
