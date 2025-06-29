// @ts-nocheck

import * as React from "react"
import { addDays, startOfMonth, endOfMonth } from "date-fns";
//import { hu } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

//const userLocale = navigator.languages[0]
const userLocale = "hu-HU"

const today = new Date();

type DateRange = {
  from: Date
  to?: Date
}

type Props = {
  value: DateRange
  onChange: (range: { from: Date; to: Date }) => void
}

//const [tempRange, setTempRange] = React.useState<DateRange | undefined>(value)

const predefinedRanges = [
  {
    label: "Yesterday",
    range: () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      return { from: yesterday, to: yesterday }
    },
  },
  {
    label: "Today",
    range: () => {
      return { from: today, to: today }
    },
  },
  {
    label: "Last 7 Days",
    range: () => {
      return { from: addDays(today, -6), to: today }
    },
  },
  {
    label: "Last 30 Days",
    range: () => {
      return { from: addDays(today, -29), to: today }
    },
  },
  {
    label: "This Month",
    range: () => {
      return { from: startOfMonth(today), to: endOfMonth(today) }
    },
  },
]

export function DateRangePicker({ value, onChange }: Props) {
  const [open, setOpen] = React.useState(false)
  const popoverRef = React.useRef<HTMLDivElement>(null)
  const [tempRange, setTempRange] = React.useState<DateRange>(value)

  const formatRange = () => {
    if (value.from && value.to) {
      return `${value.from.toLocaleDateString(userLocale)} - ${value.to.toLocaleDateString(userLocale)}`
    } else if (value.from) {
      return value.from.toLocaleDateString(userLocale)
    }
    return "Select date range"
  }

  const applySelection = () => {
    if (tempRange.from && tempRange.to) {
      onChange({ from: tempRange.from, to: tempRange.to })
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={() => setOpen((prev) => !prev)}
          variant="outline"
          className={cn(
            "w-[260px] justify-start text-left font-normal",
            !value.from && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatRange()}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        ref={popoverRef}
        className="w-auto p-0"
        align="start"
        onInteractOutside={(e) => {
            if (popoverRef.current?.contains(e.target as Node)) {
              e.preventDefault()
            }
          }}
        >
        <div className="m-0">
          <Calendar
            mode="range"
            selected={tempRange?.from ? tempRange : undefined}
            onSelect={(range) => setTempRange(range ?? {})}
            captionLayout="dropdown"
            numberOfMonths={2}
            defaultMonth={tempRange.from}
            weekStartsOn={1}
            startMonth={new Date(2021, 0)}
            
          />
        </div>
        <div className="flex ml-2">
            <div className="flex ">
            {predefinedRanges.map((preset) => (
                <Button
                key={preset.label}
                variant="ghost"
                className="m-1 px-2 py-0 text-xs"
                onClick={() => {
                    const r = preset.range()
                    setTempRange(r)
                    onChange(r)
                    setOpen(false)
                }}
                >
                {preset.label}
                </Button>
            ))}
            </div>
            <div className="m-2 flex justify-end gap-2">
            <Button variant="default" size="sm" onClick={applySelection} 
                disabled={!tempRange.from || !tempRange.to}>
                Apply
            </Button>
            </div>
        </div>

      </PopoverContent>
    </Popover>
  )
}
