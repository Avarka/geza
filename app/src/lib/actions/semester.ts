"use server";

import { semester } from "@/lib/db/schema";
import { db } from "@/lib/db/instance";
import { eq } from "drizzle-orm";
import { validateSession } from "../helpers/permissionValidation";

export async function createSemester(data: typeof semester.$inferInsert) {
  await validateSession("semester", ["create"]);

  await db.insert(semester).values(data);
}

export async function deleteSemester(name: string) {
  await validateSession("semester", ["delete"]);

  await db.delete(semester).where(eq(semester.name, name)).limit(1);
}

export async function getSemesters() {
  await validateSession("semester", ["read"]);

  return await db.query.semester.findMany({
    orderBy: (semester, { desc }) => [desc(semester.startDate)],
  });
}

export async function updateSemester(
  name: string,
  data: Partial<typeof semester.$inferInsert>
) {
  await validateSession("semester", ["update"]);

  await db.update(semester).set(data).where(eq(semester.name, name)).limit(1);
}
