import type {
  ClassEntry,
  SubjectTheme,
  TimeSlot,
  TimetableMeta,
  Weekday,
} from "./types";

export const timetableMeta: TimetableMeta = {
  university: "IILM University",
  school: "School of Computer Science and Engineering",
  section: "1CSE3",
  defaultRoom: "Foundation Block 105",
  campus: "Plot No. 16-18, Knowledge Park II, Greater Noida, Uttar Pradesh",
  validFrom: "2026-08-17",
  validTo: "2027-01-31",
  validFromLabel: "17/08/2026",
  validToLabel: "31/01/2027",
};

export const timeSlots: TimeSlot[] = [
  { period: 1, start: "09:00", end: "09:55", label: "9:00-9:55" },
  { period: 2, start: "09:55", end: "10:50", label: "9:55-10:50" },
  { period: 3, start: "10:50", end: "11:45", label: "10:50-11:45" },
  { period: 4, start: "11:45", end: "12:40", label: "11:45-12:40" },
  {
    period: 5,
    start: "12:40",
    end: "13:35",
    label: "12:40-13:35",
    isLunch: true,
  },
  { period: 6, start: "13:35", end: "14:30", label: "13:35-14:30" },
  { period: 7, start: "14:30", end: "15:25", label: "14:30-15:25" },
  { period: 8, start: "15:25", end: "16:20", label: "15:25-16:20" },
  { period: 9, start: "16:20", end: "17:15", label: "16:20-17:15" },
];

export const weekdays: { id: Weekday; label: string }[] = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
];

/** Flat solid subject colors — no gradients */
export const subjectThemes: Record<string, SubjectTheme> = {
  sqsp101: {
    bg: "#bfdbfe",
    strip: "#db2777",
    text: "#0f172a",
    stripText: "#ffffff",
  },
  sqst101: {
    bg: "#fef08a",
    strip: "#2563eb",
    text: "#422006",
    stripText: "#ffffff",
  },
  ccss105: {
    bg: "#bef264",
    strip: "#0891b2",
    text: "#14532d",
    stripText: "#ffffff",
  },
  csec104: {
    bg: "#e9d5ff",
    strip: "#65a30d",
    text: "#3b0764",
    stripText: "#ffffff",
  },
  csec107: {
    bg: "#d4d4d8",
    strip: "#16a34a",
    text: "#18181b",
    stripText: "#ffffff",
  },
  sqsc103: {
    bg: "#fda4af",
    strip: "#e11d48",
    text: "#4c0519",
    stripText: "#ffffff",
  },
  csec108: {
    bg: "#e7e5e4",
    strip: "#0284c7",
    text: "#1c1917",
    stripText: "#ffffff",
  },
  sqsp103: {
    bg: "#f9a8d4",
    strip: "#ca8a04",
    text: "#500724",
    stripText: "#ffffff",
  },
  csep111: {
    bg: "#67e8f9",
    strip: "#ea580c",
    text: "#083344",
    stripText: "#ffffff",
  },
  csep108: {
    bg: "#a5b4fc",
    strip: "#0891b2",
    text: "#1e1b4b",
    stripText: "#ffffff",
  },
};

export const classEntries: ClassEntry[] = [
  // Monday
  {
    id: "mon-3-4-sqsp101",
    day: "monday",
    startPeriod: 3,
    endPeriod: 4,
    code: "26SQSP101",
    name: "Semiconductor and Quantum Physics Lab",
    teachers: ["Dr. Pawan Soni", "Dr. Chhavi Pahwa"],
    location: "Physics Lab I",
    venueNote: "Physics Lab I",
    group: "G1/G2",
    colorKey: "sqsp101",
  },
  {
    id: "mon-6-sqst101",
    day: "monday",
    startPeriod: 6,
    endPeriod: 6,
    code: "26SQST101",
    name: "Semiconductor and Quantum Physics",
    teachers: ["Dr. Chhavi Pahwa"],
    colorKey: "sqst101",
  },
  {
    id: "mon-7-ccss105",
    day: "monday",
    startPeriod: 7,
    endPeriod: 7,
    code: "26CCSS105",
    name: "Professional Communication for Engineers",
    teachers: ["Ms. Rashmi Sharma"],
    colorKey: "ccss105",
  },
  {
    id: "mon-8-csec104",
    day: "monday",
    startPeriod: 8,
    endPeriod: 8,
    code: "26CSEC104",
    name: "Computational Design Thinking",
    teachers: ["MS Upasna Malhotra"],
    colorKey: "csec104",
  },
  {
    id: "mon-9-csec107",
    day: "monday",
    startPeriod: 9,
    endPeriod: 9,
    code: "26CSEC107",
    name: "Foundation of AI and Automation",
    teachers: ["Mr. Gagan Gupta"],
    colorKey: "csec107",
  },
  // Tuesday
  {
    id: "tue-6-csec104",
    day: "tuesday",
    startPeriod: 6,
    endPeriod: 6,
    code: "26CSEC104",
    name: "Computational Design Thinking",
    teachers: ["MS Upasna Malhotra"],
    colorKey: "csec104",
  },
  {
    id: "tue-7-sqst101",
    day: "tuesday",
    startPeriod: 7,
    endPeriod: 7,
    code: "26SQST101",
    name: "Semiconductor and Quantum Physics",
    teachers: ["Dr. Chhavi Pahwa"],
    colorKey: "sqst101",
  },
  {
    id: "tue-8-sqsc103",
    day: "tuesday",
    startPeriod: 8,
    endPeriod: 8,
    code: "26SQSC103",
    name: "Applied Calculus",
    teachers: ["Dr. Sunil Bhardwaj"],
    colorKey: "sqsc103",
  },
  {
    id: "tue-9-csec108",
    day: "tuesday",
    startPeriod: 9,
    endPeriod: 9,
    code: "26CSEC108",
    name: "Programming in C",
    teachers: ["Mr. Shiv Babu Dubey"],
    colorKey: "csec108",
  },
  // Wednesday
  {
    id: "wed-6-csec107",
    day: "wednesday",
    startPeriod: 6,
    endPeriod: 6,
    code: "26CSEC107",
    name: "Foundation of AI and Automation",
    teachers: ["Mr. Gagan Gupta"],
    colorKey: "csec107",
  },
  {
    id: "wed-7-sqsc103",
    day: "wednesday",
    startPeriod: 7,
    endPeriod: 7,
    code: "26SQSC103",
    name: "Applied Calculus",
    teachers: ["Dr. Sunil Bhardwaj"],
    colorKey: "sqsc103",
  },
  {
    id: "wed-8-sqst101",
    day: "wednesday",
    startPeriod: 8,
    endPeriod: 8,
    code: "26SQST101",
    name: "Semiconductor and Quantum Physics",
    teachers: ["Dr. Chhavi Pahwa"],
    colorKey: "sqst101",
  },
  {
    id: "wed-9-csec108",
    day: "wednesday",
    startPeriod: 9,
    endPeriod: 9,
    code: "26CSEC108",
    name: "Programming in C",
    teachers: ["Mr. Shiv Babu Dubey"],
    colorKey: "csec108",
  },
  // Thursday
  {
    id: "thu-6-sqsc103",
    day: "thursday",
    startPeriod: 6,
    endPeriod: 6,
    code: "26SQSC103",
    name: "Applied Calculus",
    teachers: ["Dr. Sunil Bhardwaj"],
    colorKey: "sqsc103",
  },
  {
    id: "thu-7-sqsp103",
    day: "thursday",
    startPeriod: 7,
    endPeriod: 7,
    code: "26SQSP103",
    name: "Applied Calculus Lab",
    teachers: ["Dr. Shivani Saini", "Dr. Sunil Bhardwaj"],
    colorKey: "sqsp103",
  },
  {
    id: "thu-8-9-csep111",
    day: "thursday",
    startPeriod: 8,
    endPeriod: 9,
    code: "26CSEP111",
    name: "Linux Administration Lab",
    teachers: ["Mr. Manoj Kumar Dixit", "Ms. Rakhi Nautiyal"],
    group: "G1/G2",
    colorKey: "csep111",
  },
  // Friday
  {
    id: "fri-6-7-csep108",
    day: "friday",
    startPeriod: 6,
    endPeriod: 7,
    code: "26CSEP108",
    name: "Programming in C Lab",
    teachers: ["Mr. Shiv Babu Dubey", "Ms. Madhu Lata Nirmal"],
    group: "G1/G2",
    colorKey: "csep108",
  },
  {
    id: "fri-8-csec108",
    day: "friday",
    startPeriod: 8,
    endPeriod: 8,
    code: "26CSEC108",
    name: "Programming in C",
    teachers: ["Mr. Shiv Babu Dubey"],
    colorKey: "csec108",
  },
  {
    id: "fri-9-ccss105",
    day: "friday",
    startPeriod: 9,
    endPeriod: 9,
    code: "26CCSS105",
    name: "Professional Communication for Engineers",
    teachers: ["Ms. Rashmi Sharma"],
    colorKey: "ccss105",
  },
];

export function getEntriesForDay(day: Weekday): ClassEntry[] {
  return classEntries.filter((entry) => entry.day === day);
}

export function getEntryAtPeriod(
  day: Weekday,
  period: number
): ClassEntry | undefined {
  return classEntries.find(
    (entry) =>
      entry.day === day &&
      period >= entry.startPeriod &&
      period <= entry.endPeriod
  );
}

export function resolveLocation(entry: ClassEntry): string {
  return entry.location ?? timetableMeta.defaultRoom;
}

export function getSubjectTheme(colorKey: string): SubjectTheme {
  return (
    subjectThemes[colorKey] ?? {
      bg: "#e2e8f0",
      strip: "#475569",
      text: "#0f172a",
      stripText: "#ffffff",
    }
  );
}
