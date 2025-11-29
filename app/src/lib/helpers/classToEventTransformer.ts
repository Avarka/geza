import { CalendarEvent } from "@ilamy/calendar";
import { Dayjs } from "dayjs";
import day from "@/lib/dayjs-ext";
import { GezaTeacherCourse as ClassData } from "@/lib/db/schema-bir";

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
    },
  }));
}

export function getStartDate(classItem: ClassData): Dayjs {
  const startDate = new Date(classItem.weekDate!);
  const dayOffeset = classItem.courseStarttimeDayId! + 1; // assuming dayId 0 = Monday
  startDate.setDate(startDate.getDate() + dayOffeset);
  startDate.setHours(classItem.courseStarttimeStarthour!);
  return day(startDate);
}

export function getEndDate(classItem: ClassData): Dayjs {
  const startDate = getStartDate(classItem);
  return startDate.add(classItem.courseHour, 'hours');
}
