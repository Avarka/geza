import day from "@/lib/dayjs-ext";
import { CalendarEvent } from "@ilamy/calendar";
import clsx from "clsx";
import { MapPin } from "lucide-react";

export const isUnbookable = (event: CalendarEvent) => {
  return false;

  const now = day();
  let cutoffTime = day(event.start);

  while (
    cutoffTime.day() === 0 ||
    cutoffTime.day() === 6 ||
    Math.abs(cutoffTime.diff(event.start, "day")) === 0
  ) {
    cutoffTime = cutoffTime.subtract(1, "day");
  }

  cutoffTime = cutoffTime.set("hour", 12);
  
  return now.isAfter(cutoffTime);
};

export default function CustomEvent({ event }: { event: CalendarEvent }) {
  return (
    <div
      className={clsx(
        "px-2 py-1 rounded h-full border bg-blue-300 border-blue-700 dark:bg-blue-800 dark:border-blue-300 whitespace-normal",
        isUnbookable(event) && "opacity-50 pointer-events-none cursor-default"
      )}
    >
      <div className="text-sm font-bold mb-1">{event.title}</div>
      <div className="text-xs">{event.description}</div>
      <div className="text-xs mt-3">
        <MapPin size={16} className="inline" /> {event.location}
      </div>
    </div>
  );
}
