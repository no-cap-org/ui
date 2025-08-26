import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = {
  onDateSelect: (date: Date | undefined) => void
  value?: Date
}

export function DatePicker({ onDateSelect, value }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {value ? value.toLocaleDateString() : "Select date"}
            {/* <ChevronDownIcon /> */}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0 bg-white" align="start">
          <Calendar
            mode="single"
            selected={value}
            // captionLayout="dropdown"
            startMonth={new Date(1970, 0)}
            endMonth={new Date()}
            onSelect={(date) => {
              onDateSelect(date)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}