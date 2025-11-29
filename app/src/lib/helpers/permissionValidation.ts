import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ac } from "@/lib/auth/permissions";

export async function validateSession<S extends keyof typeof ac.statements>(
  statement: S,
  perms: string[]
): Promise<boolean> {
  let session = undefined;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } finally {
    if (!session) {
      return false;
    }
  }

  const has = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permission: { [statement]: perms } as Record<string, unknown>,
    },
  });

  return Boolean(has);
}
