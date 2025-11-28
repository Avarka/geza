"use server";

import { birDb as db } from "@/lib/db/instances";
import { gezaTeacherCourses } from "@/lib/db/schema-bir";
import { and, eq } from "drizzle-orm";

export async function getUserSchedule(userLdapId: string) {
  const result = await db
    .select()
    .from(gezaTeacherCourses)
    .where(eq(gezaTeacherCourses.userEmail, userLdapId));

  return result;
}

export async function getUserScheduleForCourse(
  userLdapId: string,
  courseNeptunId: string
) {
  const result = await db
    .select()
    .from(gezaTeacherCourses)
    .where(
      and(
        eq(gezaTeacherCourses.userEmail, userLdapId),
        eq(gezaTeacherCourses.courseNeptunId, courseNeptunId)
      )
    );

  return result;
}

export async function getCourseByNeptun(courseNeptunId: string) {
  const result = await db
    .select()
    .from(gezaTeacherCourses)
    .where(eq(gezaTeacherCourses.courseNeptunId, courseNeptunId));
  return result;
}
