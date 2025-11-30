import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, Menu } from "lucide-react";
import React, { useState } from "react";
import { ViewControls } from "./view-controls";
import { useIlamyCalendarContext, UseIlamyCalendarContextReturn, useIlamyResourceCalendarContext, UseIlamyResourceCalendarContextReturn } from "@ilamy/calendar";

export function ScheduleCalendarHeader() {
  return <CalendarHearedGeneric {...useIlamyCalendarContext()} />
}

export function ResouceCalendarHeader() {
  return <CalendarHearedGeneric {...useIlamyResourceCalendarContext()} />
}

function CalendarHearedGeneric({
  view, setView, today, nextPeriod, prevPeriod, currentDate
}: UseIlamyCalendarContextReturn | UseIlamyResourceCalendarContextReturn) {
  const [mobilePopoverOpen, setMobilePopoverOpen] = useState(false);

  return (
    <>
      {/* Calendar Header with grid layout */}
      <div className="@container/base-header w-full">
        <div className="flex justify-center @2xl/base-header:justify-between flex-wrap items-center gap-2 border-b py-2 px-8">
          {/* Title area - Left section */}
          <div className="flex flex-wrap items-center justify-center gap-1 @2xl/base-header:justify-start">
            <CalendarIcon className="h-5 w-5 mr-4" />
            <h2 className="text-lg font-semibold">
              {currentDate.format("YYYY MMMM")}
            </h2>
          </div>

          <div className="flex flex-wrap justify-start @xl/base-header:justify-center gap-1 @4xl/base-header:justify-end overflow-x-auto">
            <div className="hidden @md/base-header:flex items-center justify-start gap-1">
              <ViewControls
                currentView={view}
                onChange={setView}
                onToday={today}
                onNext={nextPeriod}
                onPrevious={prevPeriod}
                variant="default"
                className="justify-end"
              />
            </div>

            {/* Mobile navigation menu button - Right aligned */}
            <div className="flex items-center justify-end gap-1 @md/base-header:hidden">
              <Popover
                open={mobilePopoverOpen}
                onOpenChange={setMobilePopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Menu className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[240px] p-2">
                  <div className="space-y-2">
                    <h3 className="mb-1 text-sm font-medium">
                      View & Navigation
                    </h3>
                    <ViewControls
                      currentView={view}
                      onChange={setView}
                      onToday={today}
                      onNext={nextPeriod}
                      onPrevious={prevPeriod}
                      variant="grid"
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
