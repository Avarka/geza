import { CalendarEvent } from "@ilamy/calendar";
import { MapPin } from "lucide-react";

export default function CustomEvent({event}: {event: CalendarEvent}) {
  return (
    <div className="px-2 py-1 rounded h-full border bg-blue-300 border-blue-700 dark:bg-blue-800 dark:border-blue-300 whitespace-normal">
      <div className="text-sm font-bold mb-1">{event.title}</div>
      <div className="text-xs">{event.description}</div>
      <div className="text-xs mt-3">
        <MapPin size={16} className="inline" /> {event.location}
      </div>
    </div>
  );
}
