"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ControllerRenderProps } from "react-hook-form"
import { hu } from "react-day-picker/locale";

function getJanuaryLastXYear(offset: number = 1) {
  const now = new Date()
  return new Date(now.getFullYear() - offset, 0, 31)
}

function getDecemberNextXYear(offset: number = 5) {
  const now = new Date()
  return new Date(now.getFullYear() + offset, 11, 31)
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

export function DateInput({
  label,
  ...props
}: {
  label: string
} & ControllerRenderProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(
    new Date()
  )
  const [month, setMonth] = React.useState<Date | undefined>(date)

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        {label}
      </Label>
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={formatDate(props.value)}
          placeholder="ÉÉÉÉ. HH. NN."
          className="bg-background pr-10"
          onChange={(e) => {
            const date = new Date(e.target.value)
            if (isValidDate(date)) {
              props.onChange(date)
              setDate(date)
              setMonth(date)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Válassz dátumot</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={props.value}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              weekStartsOn={1}
              locale={hu}
              startMonth={getJanuaryLastXYear(2)}
              endMonth={getDecemberNextXYear()}
              onSelect={(date) => {
                setDate(date)
                setOpen(false)
                props.onChange(date)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
