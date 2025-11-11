import { headers } from "next/headers";
import { auth } from "../auth";
import { ac } from "../auth/permissions";

export async function validateSession<
  S extends keyof typeof ac.statements
>(statement: S, perms: string[]): Promise<boolean> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return false;
  }

  const has = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permission: { [statement]: perms } as Record<string, unknown>,
    },
  });

  return Boolean(has);
}
