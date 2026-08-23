import type { ReactNode } from "react";

import {
  getEntryAtPeriod,
  getSubjectTheme,
  resolveLocation,
  timeSlots,
  weekdays,
} from "@/lib/schedule";
import type { ClassEntry, Weekday } from "@/lib/schedule";
import { cn } from "@/lib/utils";

function ClassCell({ entry, colSpan }: { entry: ClassEntry; colSpan: number }) {
  const theme = getSubjectTheme(entry.colorKey);
  const location = resolveLocation(entry);
  const teachers = entry.teachers.join(" / ");

  return (
    <td
      colSpan={colSpan}
      className="border border-border p-0 align-stretch"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      <div className="flex h-full min-h-[88px] flex-col">
        <div className="flex items-start justify-between gap-1 px-1.5 pt-1.5 text-[9px] leading-tight font-medium opacity-80 sm:text-[10px]">
          <span className="min-w-0 truncate">{location}</span>
          {entry.group ? (
            <span className="shrink-0 font-semibold">{entry.group}</span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col justify-center px-1.5 py-1 text-center">
          <p className="font-mono text-[9px] font-semibold tracking-tight sm:text-[10px]">
            {entry.code}
          </p>
          <p className="text-[10px] leading-snug font-medium sm:text-[11px]">
            {entry.name}
          </p>
        </div>
        <div
          className="px-1.5 py-1 text-center text-[9px] leading-tight font-medium sm:text-[10px]"
          style={{ backgroundColor: theme.strip, color: theme.stripText }}
        >
          {teachers}
        </div>
      </div>
    </td>
  );
}

function EmptyCell({ isLunch }: { isLunch?: boolean }) {
  return (
    <td
      className={cn(
        "border border-border p-0",
        isLunch ? "bg-muted/40" : "bg-card"
      )}
    >
      <div className="min-h-[88px]" />
    </td>
  );
}

function DayRow({ day, label }: { day: Weekday; label: string }) {
  const cells: ReactNode[] = [];
  let period = 1;

  while (period <= timeSlots.length) {
    const slot = timeSlots[period - 1];
    const entry = getEntryAtPeriod(day, period);

    if (entry && entry.startPeriod === period) {
      const colSpan = entry.endPeriod - entry.startPeriod + 1;
      cells.push(
        <ClassCell key={entry.id} entry={entry} colSpan={colSpan} />
      );
      period = entry.endPeriod + 1;
      continue;
    }

    if (entry && entry.startPeriod < period) {
      // Covered by a previous merged cell
      period += 1;
      continue;
    }

    cells.push(
      <EmptyCell key={`${day}-${period}`} isLunch={slot?.isLunch} />
    );
    period += 1;
  }

  return (
    <tr>
      <th
        scope="row"
        className="sticky left-0 z-10 border border-border bg-primary px-2 py-2 text-left text-[11px] font-semibold tracking-wide whitespace-nowrap text-primary-foreground sm:px-3 sm:text-xs"
      >
        {label}
      </th>
      {cells}
    </tr>
  );
}

export function TimetableGrid() {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full min-w-[920px] border-collapse text-left">
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-20 border border-border bg-primary px-2 py-2.5 text-[11px] font-semibold text-primary-foreground sm:px-3 sm:text-xs"
            >
              Day
            </th>
            {timeSlots.map((slot) => (
              <th
                key={slot.period}
                scope="col"
                className={cn(
                  "border border-border bg-primary px-1 py-2.5 text-center text-[10px] font-semibold whitespace-nowrap text-primary-foreground sm:px-1.5 sm:text-[11px]",
                  slot.isLunch && "bg-primary/90"
                )}
              >
                <span className="block font-mono tabular-nums">{slot.label}</span>
                {slot.isLunch ? (
                  <span className="mt-0.5 block text-[9px] font-medium tracking-wide uppercase opacity-80">
                    Lunch
                  </span>
                ) : (
                  <span className="mt-0.5 block font-mono text-[9px] font-normal opacity-70">
                    P{slot.period}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weekdays.map((day) => (
            <DayRow key={day.id} day={day.id} label={day.label} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
