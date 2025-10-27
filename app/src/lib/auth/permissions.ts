import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";
import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  ...defaultStatements,
  semester: ["read", "create", "update", "delete"],
  examRequest: ["make", "decide", "view"],
  schedule: ["viewSubject"],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  semester: ["read", "create", "update", "delete"],
  examRequest: ["make", "decide", "view"],
  schedule: ["viewSubject"],
  ...adminAc.statements,
});

export const operator = ac.newRole({
  semester: ["read", "create", "update", "delete"],
  examRequest: ["make", "decide", "view"],
  user: ["ban", "get", "impersonate", "list"],
  session: ["delete", "list", "revoke"],
});

export const teacher = ac.newRole({
  semester: ["read"],
  examRequest: ["make", "view"],
})

export const headTeacher = ac.newRole({
  ...teacher.statements,
  schedule: ["viewSubject"],
})
