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
  nowHm: string;
  weekdayLabel: string;
  slotLabel: string;
  minutesLeft?: number;
  isLunch?: boolean;
  isBeforeClasses?: boolean;
  isAfterClasses?: boolean;
  isWeekend?: boolean;
}

export function getCurrentCampusPeriod(date = new Date()): CampusPeriodStatus {
  const { weekday, hours, minutes, nowHm, weekdayLabel } = getCampusNow(date);
  const nowMinutes = hours * 60 + minutes;
  const activeDay: Weekday = weekday ?? "monday";

  for (const slot of timeSlots) {
    const [startH, startM] = slot.start.split(":").map(Number);
    const [endH, endM] = slot.end.split(":").map(Number);
    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;

    if (nowMinutes >= startTotal && nowMinutes < endTotal) {
      const minutesLeft = endTotal - nowMinutes;
      return {
        day: activeDay,
        period: slot.period,
        isLiveNow: Boolean(weekday),
        nowHm,
        weekdayLabel,
        slotLabel: `${slot.start} – ${slot.end}`,
        minutesLeft,
        isLunch: Boolean(slot.isLunch),
      };
    }
  }

  const isBeforeClasses = Boolean(weekday) && nowMinutes < 9 * 60;
  const isAfterClasses = Boolean(weekday) && nowMinutes >= 17 * 60 + 15;

  return {
    day: activeDay,
    period: 1,
    isLiveNow: false,
    nowHm,
    weekdayLabel,
    slotLabel: `${timeSlots[0].start} – ${timeSlots[0].end}`,
    isBeforeClasses,
    isAfterClasses,
    isWeekend: !weekday,
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

  const rooms: VacantRoom[] = rawRoomNames.map(categorizeRoom);

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

  return {
    day: normalizedDay,
    period,
    periodLabel,
    total: rooms.length,
    rooms,
    buildingCounts,
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

export function getAllWeekdays() {
  return weekdays;
}

export function getAllPeriods() {
  return timeSlots;
}
