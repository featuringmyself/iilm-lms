import { getEntriesForDay, resolveLocation, timeSlots } from "./timetable";
import type { ClassEntry, Weekday } from "./types";

const JS_DAY_TO_WEEKDAY: Record<number, Weekday | null> = {
  0: null, // Sunday
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

const WEEKDAY_LABEL: Record<Weekday, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
};

/** Campus timezone for Greater Noida. */
export const SCHEDULE_TIMEZONE = "Asia/Kolkata";

export type NextClassStatus =
  | "in_progress"
  | "upcoming"
  | "later"
  | "no_classes";

export interface ResolvedClassTiming {
  entry: ClassEntry;
  start: string;
  end: string;
  label: string;
  location: string;
}

export interface NextClassResult {
  status: NextClassStatus;
  /**
   * Weekday of the highlighted class (or today's weekday when nothing is found).
   * Null only on Sunday when the week has no classes at all.
   */
  weekday: Weekday | null;
  weekdayLabel: string;
  /** HH:mm in campus timezone */
  nowHm: string;
  /**
   * Relative day label for a future-day class: "Tomorrow" or e.g. "Monday".
   * Null when the class is today (in progress / upcoming).
   */
  whenLabel: string | null;
  classItem: ResolvedClassTiming | null;
  /** When in progress: the following class (same day, else next weekday). */
  upNext: ResolvedClassTiming | null;
  /** Remaining classes after the highlighted one on that class's day */
  remainingToday: ResolvedClassTiming[];
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Parts of "now" in the campus timezone. */
export function getCampusNow(date = new Date()): {
  weekday: Weekday | null;
  weekdayLabel: string;
  hours: number;
  minutes: number;
  nowHm: string;
  jsDay: number;
} {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: SCHEDULE_TIMEZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const weekdayShort = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hourStr = parts.find((p) => p.type === "hour")?.value ?? "0";
  const minuteStr = parts.find((p) => p.type === "minute")?.value ?? "0";

  const shortToJs: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const jsDay = shortToJs[weekdayShort] ?? date.getDay();
  const weekday = JS_DAY_TO_WEEKDAY[jsDay] ?? null;
  const hours = Number(hourStr);
  const minutes = Number(minuteStr);

  return {
    weekday,
    weekdayLabel: weekday ? WEEKDAY_LABEL[weekday] : "Sunday",
    hours,
    minutes,
    nowHm: `${pad(hours)}:${pad(minutes)}`,
    jsDay,
  };
}

function hmToMinutes(hm: string): number {
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
}

function resolveTiming(entry: ClassEntry): ResolvedClassTiming | null {
  const startSlot = timeSlots.find((s) => s.period === entry.startPeriod);
  const endSlot = timeSlots.find((s) => s.period === entry.endPeriod);
  if (!startSlot || !endSlot) return null;

  return {
    entry,
    start: startSlot.start,
    end: endSlot.end,
    label:
      entry.startPeriod === entry.endPeriod
        ? startSlot.label
        : `${startSlot.start}–${endSlot.end}`,
    location: resolveLocation(entry),
  };
}

function sortByStart(a: ResolvedClassTiming, b: ResolvedClassTiming): number {
  return hmToMinutes(a.start) - hmToMinutes(b.start);
}

export function getTodayClasses(
  weekday: Weekday | null,
  date = new Date()
): ResolvedClassTiming[] {
  void date;
  if (!weekday) return [];
  return getEntriesForDay(weekday)
    .map(resolveTiming)
    .filter((t): t is ResolvedClassTiming => t !== null)
    .sort(sortByStart);
}

/**
 * Walk forward from `fromJsDay` (exclusive) up to 7 days and return the first
 * weekday that has at least one class. Skips Sunday and empty days (e.g. Saturday).
 */
function findNextDayWithClasses(fromJsDay: number): {
  weekday: Weekday;
  daysAhead: number;
  classes: ResolvedClassTiming[];
} | null {
  for (let offset = 1; offset <= 7; offset++) {
    const jsDay = (fromJsDay + offset) % 7;
    const weekday = JS_DAY_TO_WEEKDAY[jsDay];
    if (!weekday) continue;
    const classes = getTodayClasses(weekday);
    if (classes.length > 0) {
      return { weekday, daysAhead: offset, classes };
    }
  }
  return null;
}

function whenLabelForOffset(daysAhead: number, weekday: Weekday): string {
  return daysAhead === 1 ? "Tomorrow" : WEEKDAY_LABEL[weekday];
}

function laterResult(
  nowHm: string,
  found: {
    weekday: Weekday;
    daysAhead: number;
    classes: ResolvedClassTiming[];
  }
): NextClassResult {
  const first = found.classes[0];
  return {
    status: "later",
    weekday: found.weekday,
    weekdayLabel: WEEKDAY_LABEL[found.weekday],
    nowHm,
    whenLabel: whenLabelForOffset(found.daysAhead, found.weekday),
    classItem: first,
    upNext: null,
    remainingToday: found.classes.slice(1),
  };
}

/**
 * Picks the class a student cares about right now (Asia/Kolkata):
 * 1. currently in progress → status in_progress (+ upNext if any)
 * 2. next not-yet-started today → status upcoming
 * 3. else first class on the next weekday that has classes
 *    (tomorrow, or e.g. Monday if Sat/Sun are empty)
 */
export function getNextClass(date = new Date()): NextClassResult {
  const { weekday, weekdayLabel, hours, minutes, nowHm, jsDay } =
    getCampusNow(date);
  const nowMinutes = hours * 60 + minutes;

  const today = getTodayClasses(weekday, date);

  if (today.length > 0) {
    const inProgress = today.find(
      (c) =>
        nowMinutes >= hmToMinutes(c.start) && nowMinutes < hmToMinutes(c.end)
    );
    if (inProgress) {
      const idx = today.indexOf(inProgress);
      const remaining = today.slice(idx + 1);
      let upNext: ResolvedClassTiming | null = remaining[0] ?? null;

      if (!upNext) {
        const nextDay = findNextDayWithClasses(jsDay);
        upNext = nextDay?.classes[0] ?? null;
      }

      return {
        status: "in_progress",
        weekday,
        weekdayLabel,
        nowHm,
        whenLabel: null,
        classItem: inProgress,
        upNext,
        remainingToday: remaining,
      };
    }

    const upcoming = today.find((c) => nowMinutes < hmToMinutes(c.start));
    if (upcoming) {
      const idx = today.indexOf(upcoming);
      return {
        status: "upcoming",
        weekday,
        weekdayLabel,
        nowHm,
        whenLabel: null,
        classItem: upcoming,
        upNext: null,
        remainingToday: today.slice(idx + 1),
      };
    }
  }

  // No more classes today (or Sunday / empty day) → look ahead
  const nextDay = findNextDayWithClasses(jsDay);
  if (nextDay) {
    return laterResult(nowHm, nextDay);
  }

  return {
    status: "no_classes",
    weekday,
    weekdayLabel,
    nowHm,
    whenLabel: null,
    classItem: null,
    upNext: null,
    remainingToday: [],
  };
}
