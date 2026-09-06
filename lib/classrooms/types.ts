import type { Weekday } from "@/lib/schedule";

export type BuildingId =
  | "all"
  | "foundation"
  | "eb"
  | "svh"
  | "law"
  | "labs";

export interface VacantRoom {
  name: string;
  shortCode: string;
  building: Exclude<BuildingId, "all">;
  buildingLabel: string;
  floor?: number;
  floorLabel?: string;
  roomType: string;
  isLab: boolean;
}

export interface BuildingFilterOption {
  id: BuildingId;
  label: string;
  shortLabel: string;
}

export const BUILDING_OPTIONS: BuildingFilterOption[] = [
  { id: "all", label: "All Buildings", shortLabel: "All" },
  { id: "foundation", label: "Foundation Block", shortLabel: "Foundation" },
  { id: "eb", label: "Engineering Block (EB)", shortLabel: "EB" },
  { id: "svh", label: "SVH Block", shortLabel: "SVH" },
  { id: "law", label: "Law Block", shortLabel: "Law" },
  { id: "labs", label: "Labs & Special Halls", shortLabel: "Labs & Halls" },
];

export interface VacantRoomsResult {
  day: Weekday;
  period: number;
  periodLabel: string;
  total: number;
  rooms: VacantRoom[];
  buildingCounts: Record<BuildingId, number>;
  fetchedAt: string;
}

export interface VacantRoomsErrorResponse {
  error: string;
  day?: string;
  period?: number;
}
