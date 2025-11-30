import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";
import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  ...defaultStatements,
  booking: ["make", "decide", "view"],
  schedule: ["viewSubject"],
  rules: ["read", "create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  booking: ["make", "decide", "view"],
  schedule: ["viewSubject"],
  rules: ["read", "create", "update", "delete"],
  ...adminAc.statements,
});

export const operator = ac.newRole({
  booking: ["make", "decide", "view"],
  user: ["ban", "get", "impersonate", "list"],
  session: ["delete", "list", "revoke"],
  rules: ["read", "create", "update", "delete"],
});

export const teacher = ac.newRole({
  booking: ["make", "view"],
  rules: ["read"],
});

export const headTeacher = ac.newRole({
  ...teacher.statements,
  schedule: ["viewSubject"],
});
