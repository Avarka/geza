import { betterAuth, User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db/instance";
import { credentials } from "better-auth-credentials-plugin";
import { authenticate } from "ldap-authentication";
import * as schema from "@/lib/db/schema";
import { ldapCredentialsSchema } from "@/lib/schemas/ldapCredential";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, admin, headTeacher, operator, teacher } from "@/lib/auth/permissions";

export interface LdapUser extends User {
  gidNumber: number;
  fullname: string;
  displayName?: string;
}

export interface FullUser extends LdapUser {
  role: string;
  banned: boolean;
  banReason: string | null;
  banExpires: Date | null;
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: schema,
  }),
  emailAndPassword: {
    enabled: false,
  },
  advanced: {
    cookiePrefix: "geza_auth",
  },
  user: {
    additionalFields: {
      gidNumber: {
        type: "number",
        returned: true,
        required: true,
      },
      cn: {
        type: "string",
        returned: true,
        required: false,
        fieldName: "fullname",
      },
      displayName: {
        type: "string",
        returned: true,
        required: false,
      },
    },
  },
  plugins: [
    credentials({
      UserType: {} as FullUser,
      autoSignUp: true,
      linkAccountIfExisting: true,
      providerId: "ldap",
      inputSchema: ldapCredentialsSchema,
      path: "/sign-in/ldap",
      async callback(ctx, parsed) {
        const secure = process.env.LDAP_URL!.startsWith("ldaps://");
        const ldapResult = await authenticate({
          ldapOpts: {
            url: process.env.LDAP_URL!,
            connectTimeout: 5000,
            strictDN: false,
            ...(secure ? { tlsOptions: { minVersion: "TLSv1.2" } } : {}),
          },
          userSearchBase: process.env.LDAP_BASE_DN,
          usernameAttribute: process.env.LDAP_SEARCH_ATTR,
          userDn: `${process.env.LDAP_SEARCH_ATTR}=${parsed.credential},${process.env.LDAP_USER_DN}`,
          username: parsed.credential,
          userPassword: parsed.password,
        });
        const uid = ldapResult[process.env.LDAP_SEARCH_ATTR!];

        return {
          email:
            (Array.isArray(ldapResult.mail)
              ? ldapResult.mail[0]
              : ldapResult.mail) || `${uid}@inf.u-szeged.hu`,
          fullname: ldapResult.cn,
          name: uid,
          dispalyName: ldapResult.displayName,
          gidNumber: parseInt(ldapResult.gidNumber) || -99,
          emailVerified: true,
          role: process.env.ADMIN_ACCESS_UIDS?.split(",").includes(uid) ? "admin" : process.env.OPERATOR_ACCESS_UIDS?.split(",").includes(uid) ? "operator" : "teacher",
        };
      },
    }),
    adminPlugin({
      ac,
      roles: {
        admin,
        operator,
        teacher,
        headTeacher,
      },
      defaultRole: "teacher",
      defaultBanExpiresIn: undefined,
      bannedUserMessage: "Fiók letiltva. Kérjük lépjen kapcsolatba a rendszergazdával.",
    }),
  ],
});
