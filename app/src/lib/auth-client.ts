import { User } from "better-auth";
import { credentialsClient } from "better-auth-credentials-plugin";
import { createAuthClient } from "better-auth/react";
import { ldapCredentialsSchema } from "@/lib/schemas/ldapCredential";
import { adminClient } from "better-auth/client/plugins"
import { ac, admin, headTeacher, operator, teacher } from "@/lib/auth/permissions";

type MyUser = User & {
  gidNumber: number;
  fullname: string;
  dispalyName?: string;
};

export const authClient = createAuthClient({
  plugins: [
    credentialsClient<MyUser, "/sign-in/ldap", typeof ldapCredentialsSchema>(),
    adminClient({
      ac,
      roles: {
        admin,
        operator,
        teacher,
        headTeacher
      },
    })
  ],
});
