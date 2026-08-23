import {
  classEntries,
  resolveLocation,
  timeSlots,
  timetableMeta,
} from "./timetable";
import type { ClassEntry, Weekday } from "./types";

const WEEKDAY_TO_JS: Record<Weekday, number> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const WEEKDAY_RRULE: Record<Weekday, string> = {
  monday: "MO",
  tuesday: "TU",
  wednesday: "WE",
  thursday: "TH",
  friday: "FR",
  saturday: "SA",
};

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Format as floating local datetime YYYYMMDDTHHMMSS */
function formatLocalDateTime(date: Date): string {
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
  );
}

function parseYmd(ymd: string): { y: number; m: number; d: number } {
  const [y, m, d] = ymd.split("-").map(Number);
  return { y, m, d };
}

function parseHm(hm: string): { h: number; min: number } {
  const [h, min] = hm.split(":").map(Number);
  return { h, min };
}

/** First occurrence of `weekday` on or after validFrom (local). */
function firstOccurrence(weekday: Weekday): Date {
  const { y, m, d } = parseYmd(timetableMeta.validFrom);
  const date = new Date(y, m - 1, d, 0, 0, 0, 0);
  const target = WEEKDAY_TO_JS[weekday];
  while (date.getDay() !== target) {
    date.setDate(date.getDate() + 1);
  }
  return date;
}

function slotBounds(entry: ClassEntry): { startHm: string; endHm: string } {
  const startSlot = timeSlots.find((s) => s.period === entry.startPeriod);
  const endSlot = timeSlots.find((s) => s.period === entry.endPeriod);
  if (!startSlot || !endSlot) {
    throw new Error(`Missing time slot for entry ${entry.id}`);
  }
  return { startHm: startSlot.start, endHm: endSlot.end };
}

function foldIcsLine(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let remaining = line;
  parts.push(remaining.slice(0, 75));
  remaining = remaining.slice(75);
  while (remaining.length > 0) {
    parts.push(` ${remaining.slice(0, 74)}`);
    remaining = remaining.slice(74);
  }
  return parts.join("\r\n");
}

function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function buildEvent(entry: ClassEntry): string {
  const first = firstOccurrence(entry.day);
  const { startHm, endHm } = slotBounds(entry);
  const startT = parseHm(startHm);
  const endT = parseHm(endHm);

  const dtStart = new Date(first);
  dtStart.setHours(startT.h, startT.min, 0, 0);
  const dtEnd = new Date(first);
  dtEnd.setHours(endT.h, endT.min, 0, 0);

  const { y, m, d } = parseYmd(timetableMeta.validTo);
  const until = new Date(y, m - 1, d, 23, 59, 59, 0);

  const location = resolveLocation(entry);
  const teachers = entry.teachers.join(" / ");
  const summary = `${entry.code} ${entry.name}`;
  const descriptionParts = [
    `Course: ${entry.code} — ${entry.name}`,
    `Teacher: ${teachers}`,
    `Location: ${location}`,
    entry.group ? `Group: ${entry.group}` : null,
    `Section: ${timetableMeta.section}`,
  ].filter(Boolean);

  const lines = [
    "BEGIN:VEVENT",
    `UID:${entry.id}@iilm-lms`,
    `DTSTAMP:${formatLocalDateTime(new Date())}`,
    `DTSTART:${formatLocalDateTime(dtStart)}`,
    `DTEND:${formatLocalDateTime(dtEnd)}`,
    `RRULE:FREQ=WEEKLY;BYDAY=${WEEKDAY_RRULE[entry.day]};UNTIL=${formatLocalDateTime(until)}`,
    `SUMMARY:${escapeText(summary)}`,
    `LOCATION:${escapeText(location)}`,
    `DESCRIPTION:${escapeText(descriptionParts.join("\n"))}`,
    "END:VEVENT",
  ];

  return lines.map(foldIcsLine).join("\r\n");
}

export function generateTimetableIcs(): string {
  const header = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//IILM LMS//Timetable//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:IILM ${timetableMeta.section} Timetable`,
    `X-WR-CALDESC:${timetableMeta.university} · ${timetableMeta.school} · Section ${timetableMeta.section}`,
  ];

  const events = classEntries.map(buildEvent);
  const body = [...header, ...events, "END:VCALENDAR"].join("\r\n");
  return `${body}\r\n`;
}

export function getIcsFilename(): string {
  return `iilm-${timetableMeta.section.toLowerCase()}-timetable.ics`;
}
