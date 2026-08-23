import type { ReactNode } from "react";

import {
  getEntryAtPeriod,
  getNextClass,
  getSubjectTheme,
  resolveLocation,
  timeSlots,
  weekdays,
} from "@/lib/schedule";
import type { ClassEntry, NextClassResult, Weekday } from "@/lib/schedule";
import { cn } from "@/lib/utils";

type HighlightKind = "now" | "next" | null;

function highlightFor(
  entry: ClassEntry,
  next: NextClassResult
): HighlightKind {
  if (!next.classItem) return null;
  if (entry.id === next.classItem.entry.id) {
    return next.status === "in_progress" ? "now" : "next";
  }
  if (next.upNext && entry.id === next.upNext.entry.id) {
    return "next";
  }
  return null;
}

function ClassCell({
  entry,
  colSpan,
  highlight,
}: {
  entry: ClassEntry;
  colSpan: number;
  highlight: HighlightKind;
}) {
  const theme = getSubjectTheme(entry.colorKey);
  const location = resolveLocation(entry);
  const teachers = entry.teachers.join(" / ");

  return (
    <td
      colSpan={colSpan}
      className={cn(
        "border border-border p-0 align-stretch",
        highlight === "now" && "ring-2 ring-inset ring-foreground",
        highlight === "next" && "ring-2 ring-inset ring-foreground/40"
      )}
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      <div className="flex h-full min-h-[76px] flex-col sm:min-h-[88px]">
        <div className="flex items-start justify-between gap-1 px-1.5 pt-1.5 text-[9px] leading-tight font-medium opacity-80 sm:text-[10px]">
          <span className="min-w-0 truncate">{location}</span>
          <span className="flex shrink-0 items-center gap-1">
            {entry.group && !highlight ? (
              <span className="font-semibold">{entry.group}</span>
            ) : null}
            {highlight ? (
              <span className="rounded-sm bg-foreground px-1 py-px text-[8px] font-semibold tracking-wide text-background uppercase">
                {highlight === "now" ? "Now" : "Next"}
              </span>
            ) : null}
          </span>
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
      <div className="min-h-[76px] sm:min-h-[88px]" />
    </td>
  );
}

function DayRow({
  day,
  label,
  shortLabel,
  next,
  isActiveDay,
}: {
  day: Weekday;
  label: string;
  shortLabel: string;
  next: NextClassResult;
  isActiveDay: boolean;
}) {
  const cells: ReactNode[] = [];
  let period = 1;

  while (period <= timeSlots.length) {
    const slot = timeSlots[period - 1];
    const entry = getEntryAtPeriod(day, period);

    if (entry && entry.startPeriod === period) {
      const colSpan = entry.endPeriod - entry.startPeriod + 1;
      cells.push(
        <ClassCell
          key={entry.id}
          entry={entry}
          colSpan={colSpan}
          highlight={highlightFor(entry, next)}
        />
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
    <tr className={cn(isActiveDay && "bg-muted/20")}>
      <th
        scope="row"
        className={cn(
          "sticky left-0 z-10 border border-border bg-primary px-1.5 py-2 text-left text-[10px] font-semibold tracking-wide whitespace-nowrap text-primary-foreground shadow-[2px_0_0_0_var(--border)] sm:px-3 sm:text-xs",
          isActiveDay && "underline decoration-primary-foreground/70 underline-offset-2"
        )}
      >
        <span className="sm:hidden">{shortLabel}</span>
        <span className="hidden sm:inline">{label}</span>
      </th>
      {cells}
    </tr>
  );
}

export function TimetableGrid() {
  const next = getNextClass();
  const activeDay = next.classItem?.entry.day ?? null;

  return (
    <div className="-mx-3 overflow-x-auto overscroll-x-contain border-y border-border bg-card sm:mx-0 sm:rounded-lg sm:border">
      <table className="w-full min-w-[860px] border-collapse text-left sm:min-w-[920px]">
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-20 border border-border bg-primary px-1.5 py-2 text-[10px] font-semibold text-primary-foreground shadow-[2px_0_0_0_var(--border)] sm:px-3 sm:py-2.5 sm:text-xs"
            >
              Day
            </th>
            {timeSlots.map((slot) => (
              <th
                key={slot.period}
                scope="col"
                className={cn(
                  "border border-border bg-primary px-1 py-2 text-center text-[9px] font-semibold whitespace-nowrap text-primary-foreground sm:px-1.5 sm:py-2.5 sm:text-[11px]",
                  slot.isLunch && "bg-primary/90"
                )}
              >
                <span className="block font-mono tabular-nums">{slot.label}</span>
                {slot.isLunch ? (
                  <span className="mt-0.5 block text-[8px] font-medium tracking-wide uppercase opacity-80 sm:text-[9px]">
                    Lunch
                  </span>
                ) : (
                  <span className="mt-0.5 block font-mono text-[8px] font-normal opacity-70 sm:text-[9px]">
                    P{slot.period}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weekdays.map((day) => (
            <DayRow
              key={day.id}
              day={day.id}
              label={day.label}
              shortLabel={day.label.slice(0, 3)}
              next={next}
              isActiveDay={activeDay === day.id}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
