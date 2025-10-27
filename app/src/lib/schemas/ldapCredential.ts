import * as z from "zod";

export const ldapCredentialsSchema = z.object({
  credential: z.string().min(1, {
    message: "LDAP azonosító megadása kötelező",
  }),
  password: z.string().min(1, {
    message: "Jelszó megadása kötelező",
  }),
});