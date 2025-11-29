import {
  char,
  date,
  int,
  mysqlView,
  varchar,
} from "drizzle-orm/mysql-core";

export const gezaTeacherCourses = mysqlView("GEZA_teacher_courses", {
  userId: int("user_id"),
  userEmail: varchar("user_email", { length: 100 }).notNull(),
  userName: varchar("user_name", { length: 100 }).notNull(),
  teacherId: int("teacher_id"),
  teacherDepartmentUniqueId: int("teacher_department_unique_id"),
  teacherActive: int("teacher_active"),
  courseId: int("course_id"),
  courseNeptunId: varchar("course_neptun_id", { length: 100 }).notNull(),
  courseUniqueName: varchar("course_unique_name", { length: 100 }).notNull(),
  courseFullName: varchar("course_full_name", { length: 100 }).notNull(),
  courseType: varchar("course_type", { length: 5 }).notNull(),
  courseScool: char("course_scool").notNull(),
  courseHour: int("course_hour").notNull(),
  coursePrefill: int("course_prefill"),
  courseDepartmentUniqueId: int("course_department_unique_id"),
  courseDivisionDephelper: int("course_division_dephelper"),
  weekId: int("week_id"),
  weekWeek: int("week_week"),
  weekActive: int("week_active"),
  weekDate: date("week_date", { mode: "date" }),
  courseStarttimeStarthour: int("course_starttime_starthour").notNull(),
  courseStarttimeDayId: int("course_starttime_day_id").notNull(),
  classroomNeptunId: varchar("classroom_neptun_id", { length: 255 }),
  classroomUniqueName: varchar("classroom_unique_name", {
    length: 255,
  }).notNull(),
  classroomFullName: varchar("classroom_full_name", { length: 255 }).notNull(),
}).existing();

export type GezaTeacherCourse = typeof gezaTeacherCourses.$inferSelect;
