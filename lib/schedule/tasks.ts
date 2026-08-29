import { SCHEDULE_TIMEZONE } from "./next-class";

export type ScheduleTaskType = "reminder" | "homework";

export interface ScheduleTask {
  id: string;
  type: ScheduleTaskType;
  title: string;
  description?: string;
  /** ISO 8601 datetime (Asia/Kolkata wall time preferred) */
  dueAt: string;
  /** Course code, e.g. 26SOSC103 */
  courseCode?: string;
  /** Course display name */
  courseName?: string;
}

/** Homework & reminders for 1CSE3 · Odd semester 2026–27 */
export const scheduleTasks: ScheduleTask[] = [
  {
    id: "hw-physics-revise-practical-mon",
    type: "homework",
    title: "Revise for test + practical file",
    description:
      "Revise all topics covered for the test, and complete the practical file.",
    dueAt: "2026-08-31T13:35:00+05:30",
    courseCode: "26SOST101",
    courseName: "Semiconductor and Quantum Physics",
  },
  {
    id: "hw-pce-prepare-topics-mon",
    type: "homework",
    title: "Prepare four topics",
    description:
      "Prepare: Use of AI in Everyday Life, Sustainability, AI in Education, and Climate Change.",
    dueAt: "2026-08-31T14:30:00+05:30",
    courseCode: "26CCSS105",
    courseName: "Professional Communication for Engineers",
  },
  {
    id: "hw-cdt-complete-notes",
    type: "homework",
    title: "Complete all notes",
    description: "Finish the full set of notes for Computational Design Thinking.",
    dueAt: "2026-08-31T15:25:00+05:30",
    courseCode: "26CSEC104",
    courseName: "Computational Design Thinking",
  },
  {
    id: "hw-maths-qb-sept1",
    type: "homework",
    title: "Practice + Question Bank",
    description:
      "Solve questions from topics covered in class so far, and complete the Question Bank (PDF will be shared by the CR).",
    dueAt: "2026-09-01T15:25:00+05:30",
    courseCode: "26SOSC103",
    courseName: "Applied Calculus",
  },
];

export function getHomework(): ScheduleTask[] {
  const now = new Date();
  return scheduleTasks
    .filter((t) => t.type === "homework" && !isTaskOverdue(t, now))
    .sort(byDueAtAsc);
}

export function getReminders(): ScheduleTask[] {
  return scheduleTasks
    .filter((t) => t.type === "reminder")
    .sort(byDueAtAsc);
}

function byDueAtAsc(a: ScheduleTask, b: ScheduleTask): number {
  return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
}

/** Campus-local calendar day key YYYY-MM-DD for a Date. */
export function campusDateKey(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SCHEDULE_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const y = parts.find((p) => p.type === "year")?.value ?? "0000";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const d = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${y}-${m}-${d}`;
}

export function isTaskOverdue(task: ScheduleTask, now = new Date()): boolean {
  return new Date(task.dueAt).getTime() < now.getTime();
}

export function formatTaskDueDate(
  dueAt: string,
  opts?: { includeTime?: boolean }
): string {
  const date = new Date(dueAt);
  const includeTime = opts?.includeTime ?? taskLikelyHasTime(dueAt);

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: SCHEDULE_TIMEZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
    ...(includeTime
      ? { hour: "2-digit", minute: "2-digit", hourCycle: "h23" as const }
      : {}),
  }).format(date);
}

function taskLikelyHasTime(dueAt: string): boolean {
  // Homework often ends at 23:59 — show date only for end-of-day dues
  const date = new Date(dueAt);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: SCHEDULE_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const h = parts.find((p) => p.type === "hour")?.value ?? "00";
  const m = parts.find((p) => p.type === "minute")?.value ?? "00";
  return !(h === "23" && m === "59");
}

export type TaskUrgency = "overdue" | "today" | "upcoming";

export function getTaskUrgency(
  task: ScheduleTask,
  now = new Date()
): TaskUrgency {
  if (isTaskOverdue(task, now)) return "overdue";
  const dueKey = campusDateKey(new Date(task.dueAt));
  const todayKey = campusDateKey(now);
  if (dueKey === todayKey) return "today";
  return "upcoming";
}

/**
 * Next incomplete upcoming items (homework + reminders), soonest due first.
 * Past-due items drop off. Caller may filter completed homework via localStorage.
 */
export function getDueSoon(
  limit = 2,
  opts?: { excludeIds?: ReadonlySet<string>; now?: Date }
): ScheduleTask[] {
  const now = opts?.now ?? new Date();
  const exclude = opts?.excludeIds;

  const open = scheduleTasks.filter((t) => {
    if (exclude?.has(t.id)) return false;
    if (isTaskOverdue(t, now)) return false;
    return true;
  });

  open.sort(byDueAtAsc);

  return open.slice(0, limit);
}

/** Relative hint used in compact lists (e.g. dashboard). */
export function formatDueRelative(
  task: ScheduleTask,
  now = new Date()
): string {
  const urgency = getTaskUrgency(task, now);
  if (urgency === "overdue") return "Overdue";
  if (urgency === "today") return "Due today";

  const due = new Date(task.dueAt);
  const ms = due.getTime() - now.getTime();
  const days = Math.ceil(ms / (24 * 60 * 60 * 1000));
  if (days <= 1) return "Due tomorrow";
  if (days <= 7) return `In ${days} days`;
  return formatTaskDueDate(task.dueAt, { includeTime: false });
}
