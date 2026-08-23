import { SCHEDULE_TIMEZONE } from "./next-class";

export type ScheduleTaskType = "reminder" | "homework";

export interface ScheduleTask {
  id: string;
  type: ScheduleTaskType;
  title: string;
  description?: string;
  /** ISO 8601 datetime (Asia/Kolkata wall time preferred) */
  dueAt: string;
  /** Course code, e.g. 26SQSC103 */
  courseCode?: string;
  /** Course display name */
  courseName?: string;
}

/** Sample homework & reminders for 1CSE3 · Odd semester 2026–27 */
export const scheduleTasks: ScheduleTask[] = [
  {
    id: "hw-calc-ps2",
    type: "homework",
    title: "Problem set 2 — derivatives",
    description: "Questions 1–12 from the Applied Calculus worksheet.",
    dueAt: "2026-08-20T23:59:00+05:30",
    courseCode: "26SQSC103",
    courseName: "Applied Calculus",
  },
  {
    id: "hw-c-arrays",
    type: "homework",
    title: "Lab report: arrays & pointers",
    description: "Submit the C lab write-up with sample outputs.",
    dueAt: "2026-08-25T23:59:00+05:30",
    courseCode: "26CSEC108",
    courseName: "Programming in C",
  },
  {
    id: "hw-quantum-ch3",
    type: "homework",
    title: "Chapter 3 practice questions",
    description: "Semiconductor & Quantum Physics — energy bands & photons.",
    dueAt: "2026-08-28T23:59:00+05:30",
    courseCode: "26SQST101",
    courseName: "Semiconductor and Quantum Physics",
  },
  {
    id: "hw-comm-outline",
    type: "homework",
    title: "Presentation outline",
    description: "One-page outline for the engineering communication talk.",
    dueAt: "2026-09-05T23:59:00+05:30",
    courseCode: "26CCSS105",
    courseName: "Professional Communication for Engineers",
  },
  {
    id: "hw-ai-reflection",
    type: "homework",
    title: "Reading reflection — automation",
    description: "Short write-up on the assigned AI & automation article.",
    dueAt: "2026-09-12T23:59:00+05:30",
    courseCode: "26CSEC107",
    courseName: "Foundation of AI and Automation",
  },
  {
    id: "rem-calc-quiz",
    type: "reminder",
    title: "Bring calculator for Calculus quiz",
    description: "Scientific calculator allowed; no phones.",
    dueAt: "2026-08-26T09:00:00+05:30",
    courseCode: "26SQSC103",
    courseName: "Applied Calculus",
  },
  {
    id: "rem-linux-usb",
    type: "reminder",
    title: "Bring USB drive for Linux lab",
    description: "Bootable media session in Linux Administration Lab.",
    dueAt: "2026-08-29T13:35:00+05:30",
    courseCode: "26CSEP111",
    courseName: "Linux Administration Lab",
  },
  {
    id: "rem-midsem-reg",
    type: "reminder",
    title: "Mid-sem registration opens",
    description: "Check EduPage for exam form window.",
    dueAt: "2026-09-01T10:00:00+05:30",
  },
  {
    id: "rem-c-peer",
    type: "reminder",
    title: "C Programming peer review session",
    description: "Bring a printed copy of your latest assignment.",
    dueAt: "2026-09-08T14:30:00+05:30",
    courseCode: "26CSEC108",
    courseName: "Programming in C",
  },
];

export function getHomework(): ScheduleTask[] {
  return scheduleTasks
    .filter((t) => t.type === "homework")
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
 * Next incomplete upcoming items (homework + reminders), overdue first,
 * then soonest due. Caller may filter completed homework via localStorage.
 */
export function getDueSoon(
  limit = 2,
  opts?: { excludeIds?: ReadonlySet<string>; now?: Date }
): ScheduleTask[] {
  const now = opts?.now ?? new Date();
  const exclude = opts?.excludeIds;

  const open = scheduleTasks.filter((t) => {
    if (exclude?.has(t.id)) return false;
    // Reminders past due drop off; overdue homework still surfaces
    if (t.type === "reminder" && isTaskOverdue(t, now)) return false;
    return true;
  });

  open.sort((a, b) => {
    const aOver = isTaskOverdue(a, now) ? 0 : 1;
    const bOver = isTaskOverdue(b, now) ? 0 : 1;
    if (aOver !== bOver) return aOver - bOver;
    return byDueAtAsc(a, b);
  });

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
