import { CalendarEvent } from "@ilamy/calendar";
import { gezaTeacherCourses } from "../db/schema";

type ClassData = typeof gezaTeacherCourses.$inferSelect;

export function classToEventTransformer(
  classData: ClassData[]
): CalendarEvent[] {
  return classData.map(classItem => ({
    id: `${classItem.courseNeptunId}-${classItem.weekId}-${classItem.courseStarttimeDayId}`,
    title: `${classItem.courseFullName} (${classItem.courseType})`,
    start: getStartDate(classItem),
    end: getEndDate(classItem),
    allDay: false,
    description: `${classItem.courseNeptunId} - ${classItem.courseFullName}`,
    location: classItem.classroomFullName,
    data: {
      neptunCode: classItem.courseNeptunId,
    }
  }));
}

export function getStartDate(classItem: ClassData): Date {
  const startDate = new Date(classItem.weekDate!);
  const dayOffeset = classItem.courseStarttimeDayId! + 1; // assuming dayId 0 = Monday
  startDate.setDate(startDate.getDate() + dayOffeset);
  startDate.setHours(classItem.courseStarttimeStarthour!);
  return startDate;
}

export function getEndDate(classItem: ClassData): Date {
  const startDate = getStartDate(classItem);
  return new Date(
    startDate.setHours(startDate.getHours() + classItem.courseHour)
  );
}
