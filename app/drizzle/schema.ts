import { mysqlTable, mysqlSchema, AnyMySqlColumn, int, varchar, date, tinyint } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const gezaTeacherCourses = mysqlTable("GEZA_teacher_courses", {
	id: int().autoincrement().notNull(),
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
	courseType: int("course_type"),
	courseScool: int("course_scool"),
	courseHour: int("course_hour").notNull(),
	coursePrefill: int("course_prefill"),
	courseDepartmentUniqueId: int("course_department_unique_id"),
	courseDivisionDephelper: int("course_division_dephelper"),
	weekId: int("week_id"),
	weekWeek: int("week_week"),
	weekActive: int("week_active"),
	weekDate: int("week_date"),
	courseStarttimeStarthour: int("course_starttime_starthour").notNull(),
	courseStarttimeDayId: int("course_starttime_day_id").notNull(),
	classroonNeptunId: varchar("classroon_neptun_id", { length: 255 }),
	classroomUniqueName: varchar("classroom_unique_name", { length: 255 }).default('\'IR-217\'').notNull(),
	classroomFullName: varchar("classroom_full_name", { length: 255 }).default('\'IR-217 PC terem\'').notNull(),
});

export const semesterEntity = mysqlTable("semester_entity", {
	id: varchar({ length: 10 }).notNull(),
	startDate: date("start_date", { mode: 'date' }).notNull(),
	length: tinyint().default(14).notNull(),
});
