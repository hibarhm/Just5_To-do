"use client"

import { Calendar } from "@/components/ui/calendar"

interface Calendar13Props {
  onDateSelect: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
  onDone: () => void;
}

export function Calendar13({ onDateSelect, selectedDate, onDone }: Calendar13Props) {
  return (
    <div className="flex flex-col gap-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        className="rounded-md border shadow-sm"
        captionLayout="dropdown"
      />
      <div className="flex justify-end">
        <button
          onClick={onDone}
          className="bg-[#a47376] text-white px-4 py-2 rounded-md hover:bg-[#8b5b5e] transition text-sm"
        >
          Done
        </button>
      </div>
    </div>
  )
}