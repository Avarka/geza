"use server";

import { semester } from "@/lib/db/schema";
import { db } from "@/lib/db/instance";
import { eq } from "drizzle-orm";

export async function createSemester(data: typeof semester.$inferInsert) {
  await db.insert(semester).values(data);
}

export async function deleteSemester(name: string) {
  await db.delete(semester).where(eq(semester.name, name)).limit(1);
}

export async function getSemesters() {
  return await db.query.semester.findMany({
    orderBy: (semester, { desc }) => [desc(semester.startDate)],
  });
}

export async function updateSemester(
  name: string,
  data: Partial<typeof semester.$inferInsert>
) {
  await db.update(semester).set(data).where(eq(semester.name, name)).limit(1);
}
