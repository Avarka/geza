import {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  int,
  varchar,
  date,
  tinyint,
  text,
  timestamp,
  boolean
} from "drizzle-orm/mysql-core";

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
  classroomUniqueName: varchar("classroom_unique_name", { length: 255 })
    .default("'IR-217'")
    .notNull(),
  classroomFullName: varchar("classroom_full_name", { length: 255 })
    .default("'IR-217 PC terem'")
    .notNull(),
});

export const semesterEntity = mysqlTable("semester_entity", {
  id: varchar({ length: 10 }).notNull(),
  startDate: date("start_date", { mode: "date" }).notNull(),
  length: tinyint().default(14).notNull(),
});

export const user = mysqlTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires", { fsp: 3 }),
  gidNumber: int("gid_number").notNull(),
  fullname: text("fullname"),
  displayName: text("display_name"),
});

export const session = mysqlTable("session", {
  id: varchar("id", { length: 36 }).primaryKey(),
  expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
});

export const account = mysqlTable("account", {
  id: varchar("id", { length: 36 }).primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { fsp: 3 }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { fsp: 3 }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 36 }).primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
