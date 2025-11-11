"use server";

import { rules } from "@/lib/db/schema";
import { db } from "@/lib/db/instance";
import { eq } from "drizzle-orm";
import { auth } from "../auth";
import { headers } from "next/headers";

async function validateSession(
  perms: ("read" | "create" | "update" | "delete")[]
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("No session found");
  }

  if (
    !(await auth.api.userHasPermission({
      body: {
        userId: session.user.id,
        permission: {
          rules: perms,
        },
      },
    }))
  ) {
    throw new Error("Insufficient permissions");
  }
}

export async function createRule(data: typeof rules.$inferInsert) {
  await validateSession(["create"]);

  await db.insert(rules).values(data);
}

export async function deleteRule(name: string) {
  await validateSession(["delete"]);

  await db.delete(rules).where(eq(rules.name, name)).limit(1);
}

export async function getRules() {
  await validateSession(["read"]);

  return await db.query.rules.findMany({
    orderBy: (rules, { desc }) => [desc(rules.name)],
  });
}

export async function updateRule(
  name: string,
  data: Partial<typeof rules.$inferInsert>
) {
  await validateSession(["update"]);

  await db.update(rules).set(data).where(eq(rules.name, name)).limit(1);
}
