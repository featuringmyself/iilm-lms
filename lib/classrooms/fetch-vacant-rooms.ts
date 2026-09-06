import { timeSlots, weekdays, type Weekday } from "@/lib/schedule";
import { getCampusNow } from "@/lib/schedule/next-class";
import type {
  BuildingId,
  VacantRoom,
  VacantRoomsResult,
} from "./types";
import { VACANT_CLASSROOMS_DATA } from "./vacant-rooms-data";

export interface CampusPeriodStatus {
  day: Weekday;
  period: number;
  isLiveNow: boolean;
  livePeriod?: number;
  liveDay?: Weekday;
  todayWeekday: Weekday | null;
  nowHm: string;
  weekdayLabel: string;
  slotLabel: string;
  minutesLeft?: number;
  isLunch?: boolean;
  isBeforeClasses?: boolean;
  isAfterClasses?: boolean;
  isWeekend?: boolean;
}

export function getNextCampusDay(currentWeekday: Weekday | null): Weekday {
  switch (currentWeekday) {
    case "monday":
      return "tuesday";
    case "tuesday":
      return "wednesday";
    case "wednesday":
      return "thursday";
    case "thursday":
      return "friday";
    case "friday":
      return "saturday";
    case "saturday":
    default:
      // Saturday rolls over past Sunday to Monday.
      // Sunday (null) rolls over to Monday.
      return "monday";
  }
}

export function getCurrentCampusPeriod(date = new Date()): CampusPeriodStatus {
  const { weekday, hours, minutes, nowHm, weekdayLabel } = getCampusNow(date);
  const nowMinutes = hours * 60 + minutes;

  // Campus daily timetable parameters:
  // Period 1 starts at 09:00 (540m), Period 9 ends at 17:15 (1035m).
  const firstSlotStart = 9 * 60; // 09:00

  // 1. Sunday: Campus is closed. Next best available slot is Monday Period 1 (09:00).
  if (!weekday) {
    const mondaySlot = timeSlots[0];
    return {
      day: "monday",
      period: 1,
      isLiveNow: false,
      todayWeekday: null,
      nowHm,
      weekdayLabel: "Sunday",
      slotLabel: `${mondaySlot.start} – ${mondaySlot.end}`,
      isBeforeClasses: false,
      isAfterClasses: false,
      isWeekend: true,
    };
  }

  // 2. Weekday before classes (before 09:00, e.g. 08:00 AM):
  // Classes start today at 09:00. Preselect today's Period 1.
  if (nowMinutes < firstSlotStart) {
    const firstSlot = timeSlots[0];
    return {
      day: weekday,
      period: 1,
      isLiveNow: false,
      todayWeekday: weekday,
      nowHm,
      weekdayLabel,
      slotLabel: `${firstSlot.start} – ${firstSlot.end}`,
      isBeforeClasses: true,
      isAfterClasses: false,
      isWeekend: false,
    };
  }

  // 3. Weekday during active campus hours (09:00 to 17:15):
  // Match the exact current live slot.
  for (const slot of timeSlots) {
    const [startH, startM] = slot.start.split(":").map(Number);
    const [endH, endM] = slot.end.split(":").map(Number);
    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;

    if (nowMinutes >= startTotal && nowMinutes < endTotal) {
      const minutesLeft = endTotal - nowMinutes;
      return {
        day: weekday,
        period: slot.period,
        isLiveNow: true,
        livePeriod: slot.period,
        liveDay: weekday,
        todayWeekday: weekday,
        nowHm,
        weekdayLabel,
        slotLabel: `${slot.start} – ${slot.end}`,
        minutesLeft,
        isLunch: Boolean(slot.isLunch),
        isBeforeClasses: false,
        isAfterClasses: false,
        isWeekend: false,
      };
    }
  }

  // 4. Weekday after classes have ended for the day (at or after 17:15, e.g. 19:00 / 7:00 PM):
  // Today's classes are over. Preselect the NEXT campus day's Period 1 (09:00 AM).
  const nextDay = getNextCampusDay(weekday);
  const nextSlot = timeSlots[0];

  return {
    day: nextDay,
    period: 1,
    isLiveNow: false,
    todayWeekday: weekday,
    nowHm,
    weekdayLabel,
    slotLabel: `${nextSlot.start} – ${nextSlot.end}`,
    isBeforeClasses: false,
    isAfterClasses: true,
    isWeekend: false,
  };
}

export function categorizeRoom(rawName: string): VacantRoom {
  const name = rawName.trim();
  const lower = name.toLowerCase();

  const isLab =
    lower.includes("lab") ||
    lower.includes("seminar") ||
    lower.includes("hall") ||
    lower.includes("workshop");

  let building: Exclude<BuildingId, "all"> = "labs";
  let buildingLabel = "Labs & Special Halls";

  if (lower.includes("foundation")) {
    building = "foundation";
    buildingLabel = "Foundation Block";
  } else if (lower.startsWith("eb") || lower.includes(" eb ")) {
    building = "eb";
    buildingLabel = "Engineering Block";
  } else if (lower.includes("svh")) {
    building = "svh";
    buildingLabel = "SVH Block";
  } else if (lower.includes("law")) {
    building = "law";
    buildingLabel = "Law Block";
  } else if (lower.includes("lab eb")) {
    building = "eb";
    buildingLabel = "Engineering Block";
  } else if (isLab) {
    building = "labs";
    buildingLabel = "Labs & Special Halls";
  }

  // Extract floor if a 3-digit room number exists (e.g. 102 -> 1, 205 -> 2, 306 -> 3, 401 -> 4)
  const floorMatch = name.match(/\b([1-9])\d{2}\b/);
  const floor = floorMatch ? parseInt(floorMatch[1], 10) : undefined;
  const floorLabels: Record<number, string> = {
    1: "1st Floor",
    2: "2nd Floor",
    3: "3rd Floor",
    4: "4th Floor",
  };
  const floorLabel = floor ? floorLabels[floor] : undefined;

  let roomType = "Lecture Room";
  if (lower.includes("seminar")) {
    roomType = "Seminar Hall";
  } else if (lower.includes("apple") || lower.includes("dell")) {
    roomType = "Computer Lab";
  } else if (lower.includes("physics")) {
    roomType = "Science Lab";
  } else if (lower.includes("lab")) {
    roomType = "Laboratory";
  }

  // Clean short display code
  let shortCode = name;
  if (name.startsWith("Foundation Block ")) {
    shortCode = name.replace("Foundation Block ", "FB ");
  } else if (name.startsWith("Law Block ")) {
    shortCode = name.replace("Law Block ", "LB ");
  } else if (name.startsWith("LAB Law Block ")) {
    shortCode = name.replace("LAB Law Block ", "LAB LB ");
  }

  return {
    name,
    shortCode,
    building,
    buildingLabel,
    floor,
    floorLabel,
    roomType,
    isLab,
  };
}

const VALID_WEEKDAYS = new Set<Weekday>([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
]);

export function isValidWeekday(day: string): day is Weekday {
  return VALID_WEEKDAYS.has(day.toLowerCase() as Weekday);
}

export function isValidPeriod(period: number): boolean {
  return Number.isInteger(period) && period >= 1 && period <= 9;
}

export function getVacantRooms(
  day: Weekday,
  period: number
): VacantRoomsResult {
  const normalizedDay = day.toLowerCase() as Weekday;
  const slot = timeSlots.find((s) => s.period === period);
  const periodLabel = slot ? `${slot.start} - ${slot.end}` : `Period ${period}`;

  const dayData = VACANT_CLASSROOMS_DATA[normalizedDay];
  const rawRoomNames: string[] = dayData?.[period] ?? [];

  const rooms: VacantRoom[] = rawRoomNames.map((raw) => {
    const base = categorizeRoom(raw);

    // Calculate how many consecutive periods this room stays free starting from current period
    let consecutivePeriods = 1;
    let freeUntilPeriod = period;

    for (let p = period + 1; p <= 9; p++) {
      const nextList = dayData?.[p] ?? [];
      if (nextList.includes(base.name)) {
        consecutivePeriods++;
        freeUntilPeriod = p;
      } else {
        break;
      }
    }

    const untilSlot = timeSlots.find((s) => s.period === freeUntilPeriod);
    const freeUntilTime = untilSlot ? untilSlot.end : undefined;

    // Calculate schedule overview across all 9 periods for this room on this day
    const scheduleOverview: boolean[] = [];
    let totalFreePeriods = 0;
    for (let p = 1; p <= 9; p++) {
      const pList = dayData?.[p] ?? [];
      const free = pList.includes(base.name);
      scheduleOverview.push(free);
      if (free) totalFreePeriods++;
    }

    return {
      ...base,
      consecutivePeriods,
      freeUntilPeriod,
      freeUntilTime,
      scheduleOverview,
      totalFreePeriods,
    };
  });

  // Compute building counts
  const buildingCounts: Record<BuildingId, number> = {
    all: rooms.length,
    foundation: 0,
    eb: 0,
    svh: 0,
    law: 0,
    labs: 0,
  };

  for (const room of rooms) {
    buildingCounts[room.building] = (buildingCounts[room.building] ?? 0) + 1;
    if (room.isLab && room.building !== "labs") {
      buildingCounts.labs += 1;
    }
  }

  // Precompute room count for each period on this day
  const periodCounts: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  };
  for (let p = 1; p <= 9; p++) {
    periodCounts[p] = (dayData?.[p] ?? []).length;
  }

  return {
    day: normalizedDay,
    period,
    periodLabel,
    total: rooms.length,
    rooms,
    buildingCounts,
    periodCounts,
    fetchedAt: new Date().toISOString(),
  };
}

export async function fetchVacantRooms(
  day: Weekday,
  period: number,
  _options: { forceFresh?: boolean } = {}
): Promise<VacantRoomsResult> {
  void _options;
  return getVacantRooms(day, period);
}

export function getAllRoomSchedule(roomName: string, day: Weekday) {
  const normalizedDay = day.toLowerCase() as Weekday;
  const dayData = VACANT_CLASSROOMS_DATA[normalizedDay];

  return timeSlots.map((slot) => {
    const list = dayData?.[slot.period] ?? [];
    const isFree = list.includes(roomName);
    return {
      period: slot.period,
      slotLabel: `${slot.start} – ${slot.end}`,
      start: slot.start,
      end: slot.end,
      isLunch: Boolean(slot.isLunch),
      isFree,
    };
  });
}

export function getFullRoomWeekSchedule(roomName: string) {
  const schedule: Record<Weekday, { period: number; isFree: boolean; isLunch: boolean }[]> = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
  };

  for (const day of weekdays) {
    const dayData = VACANT_CLASSROOMS_DATA[day.id];
    schedule[day.id] = timeSlots.map((slot) => ({
      period: slot.period,
      isFree: (dayData?.[slot.period] ?? []).includes(roomName),
      isLunch: Boolean(slot.isLunch),
    }));
  }

  return schedule;
}

export function getAllWeekdays() {
  return weekdays;
}

export function getAllPeriods() {
  return timeSlots;
}
