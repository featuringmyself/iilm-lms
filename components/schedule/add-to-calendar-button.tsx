"use client";

import { CalendarPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { generateTimetableIcs, getIcsFilename } from "@/lib/schedule";

export function AddToCalendarButton() {
  function handleDownload() {
    const ics = generateTimetableIcs();
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = getIcsFilename();
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <Button
      type="button"
      size="sm"
      className="h-10 w-full justify-center sm:h-8 sm:w-auto"
      onClick={handleDownload}
    >
      <CalendarPlus data-icon="inline-start" strokeWidth={1.75} />
      Add to calendar
    </Button>
  );
}
