export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export interface TimeSlot {
  period: number;
  start: string;
  end: string;
  label: string;
  isLunch?: boolean;
}

export interface SubjectTheme {
  /** Flat solid fill for the cell body */
  bg: string;
  /** Flat solid fill for the teacher strip */
  strip: string;
  text: string;
  stripText: string;
}

export interface ClassEntry {
  id: string;
  day: Weekday;
  /** 1-indexed period number (inclusive) */
  startPeriod: number;
  /** 1-indexed period number (inclusive); equal to startPeriod for single slots */
  endPeriod: number;
  code: string;
  name: string;
  teachers: string[];
  /** Defaults to timetable.defaultRoom when omitted */
  location?: string;
  group?: string;
  /** Extra location label (e.g. Physics Lab I) */
  venueNote?: string;
  colorKey: string;
}

export interface TimetableMeta {
  university: string;
  school: string;
  section: string;
  defaultRoom: string;
  validFrom: string;
  validTo: string;
  validFromLabel: string;
  validToLabel: string;
}
