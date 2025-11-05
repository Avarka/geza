"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ldapCredentialsSchema } from "@/lib/schemas/ldapCredential";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export function LoginForm() {
  const form = useForm<z.infer<typeof ldapCredentialsSchema>>({
    resolver: zodResolver(ldapCredentialsSchema),
    defaultValues: {
      credential: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ldapCredentialsSchema>) => {
    const { data, error } = await authClient.signIn.ldap(values);

    if (error) {
      form.setError(
        "credential",
        {
          type: "validate",
        },
        { shouldFocus: true }
      );

      form.setError("password", {
        type: "validate",
        message: "Hibás LDAP azonosító vagy jelszó.",
      });

      return;
    }

    if (data) {
      toast.success("Sikeres bejelentkezés!");
      redirect("/dashboard/schedule");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Bejelentkezés</CardTitle>
          <CardDescription>
            Használd az LDAP azonosítódat a belépéshez.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="credential"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="ldap">LDAP azonosító</FieldLabel>
                    <Input
                      {...field}
                      id="ldap"
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
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Jelszó</FieldLabel>
                    </div>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      required
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Field>
                <Button type="submit" disabled={form.formState.isSubmitting} >Bejelentkezés</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
