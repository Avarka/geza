"use server";

import { db } from "@/lib/db/instance";

export async function getUserSchedule(userLdapId: string) {
  const result = await db.query.gezaTeacherCourses.findMany({
    where: (courses, { eq }) => eq(courses.userEmail, userLdapId),
  });

  return result;
}

export async function getUserScheduleForCourse(userLdapId: string, courseNeptunId: string) {
  const result = await db.query.gezaTeacherCourses.findMany({
    where: (courses, { and, eq }) => and(
      eq(courses.userEmail, userLdapId),
      eq(courses.courseNeptunId, courseNeptunId),
    ),
  });

  return result;
}