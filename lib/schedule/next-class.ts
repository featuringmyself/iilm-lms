import {
  classEntries,
  getEntriesForDay,
  resolveLocation,
  timeSlots,
} from "./timetable";
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
  | "done"
  | "weekend"
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
  /** Local calendar weekday id, or null on Sunday */
  weekday: Weekday | null;
  weekdayLabel: string;
  /** HH:mm in campus timezone */
  nowHm: string;
  classItem: ResolvedClassTiming | null;
  /** Remaining classes after the highlighted one (same day) */
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
 * Picks the class a student cares about right now:
 * - currently in progress, else
 * - next not-yet-started today, else
 * - done / weekend / empty day
 */
export function getNextClass(date = new Date()): NextClassResult {
  const { weekday, weekdayLabel, hours, minutes, nowHm } = getCampusNow(date);
  const nowMinutes = hours * 60 + minutes;

  if (!weekday) {
    return {
      status: "weekend",
      weekday: null,
      weekdayLabel,
      nowHm,
      classItem: null,
      remainingToday: [],
    };
  }

  const today = getTodayClasses(weekday, date);

  if (today.length === 0) {
    // Saturday (or any weekday with no entries)
    const hasAnyForWeekday = classEntries.some((e) => e.day === weekday);
    return {
      status: hasAnyForWeekday ? "done" : weekday === "saturday" ? "weekend" : "no_classes",
      weekday,
      weekdayLabel,
      nowHm,
      classItem: null,
      remainingToday: [],
    };
  }

  const inProgress = today.find(
    (c) =>
      nowMinutes >= hmToMinutes(c.start) && nowMinutes < hmToMinutes(c.end)
  );
  if (inProgress) {
    const idx = today.indexOf(inProgress);
    return {
      status: "in_progress",
      weekday,
      weekdayLabel,
      nowHm,
      classItem: inProgress,
      remainingToday: today.slice(idx + 1),
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
      classItem: upcoming,
      remainingToday: today.slice(idx + 1),
    };
  }

  return {
    status: "done",
    weekday,
    weekdayLabel,
    nowHm,
    classItem: null,
    remainingToday: [],
  };
}
