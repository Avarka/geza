"use server";

import { rules } from "@/lib/db/schema";
import { db } from "@/lib/db/instances";
import { eq } from "drizzle-orm";
import { validateSession } from "../helpers/permissionValidation";

export async function createRule(data: typeof rules.$inferInsert) {
  await validateSession("rules", ["create"]);

  await db.insert(rules).values(data);
}

export async function deleteRule(name: string) {
  await validateSession("rules", ["delete"]);

  await db.delete(rules).where(eq(rules.name, name)).limit(1);
}

export async function getRules() {
  console.log("Fetching rules...");
  await validateSession("rules", ["read"]);
  console.log("Session validated.");

  return await db.query.rules.findMany({
    orderBy: (rules, { desc }) => [desc(rules.name)],
  });
}

export async function updateRule(
  name: string,
  data: Partial<typeof rules.$inferInsert>
) {
  await validateSession("rules", ["update"]);

  await db.update(rules).set(data).where(eq(rules.name, name)).limit(1);
}
