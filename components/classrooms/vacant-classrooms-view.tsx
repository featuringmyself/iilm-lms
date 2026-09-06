"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  DoorOpen,
  FlaskConical,
  GraduationCap,
  Hourglass,
  Info,
  Layers,
  LayoutGrid,
  ListFilter,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BUILDING_OPTIONS,
  type BuildingId,
  type VacantRoom,
  type VacantRoomsResult,
  getAllRoomSchedule,
  getCurrentCampusPeriod,
  getVacantRooms,
} from "@/lib/classrooms";
import { timeSlots, weekdays, type Weekday } from "@/lib/schedule";
import { cn } from "@/lib/utils";

interface VacantClassroomsViewProps {
  initialResult?: VacantRoomsResult | null;
  initialDay?: Weekday;
  initialPeriod?: number;
}

type ViewMode = "grouped" | "grid";
type FloorFilter = "all" | 1 | 2 | 3 | 4 | "special";

const FLOOR_OPTIONS: { id: FloorFilter; label: string }[] = [
  { id: "all", label: "All Floors" },
  { id: 1, label: "Floor 1" },
  { id: 2, label: "Floor 2" },
  { id: 3, label: "Floor 3" },
  { id: 4, label: "Floor 4" },
  { id: "special", label: "Labs & Special" },
];

function getBuildingTheme(building: Exclude<BuildingId, "all">) {
  switch (building) {
    case "foundation":
      return {
        badge:
          "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300",
        borderAccent: "hover:border-blue-500/40 focus-visible:ring-blue-500/30",
        dot: "bg-blue-500",
        ring: "ring-blue-500/20",
      };
    case "eb":
      return {
        badge:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        borderAccent: "hover:border-emerald-500/40 focus-visible:ring-emerald-500/30",
        dot: "bg-emerald-500",
        ring: "ring-emerald-500/20",
      };
    case "svh":
      return {
        badge:
          "border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-300",
        borderAccent: "hover:border-purple-500/40 focus-visible:ring-purple-500/30",
        dot: "bg-purple-500",
        ring: "ring-purple-500/20",
      };
    case "law":
      return {
        badge:
          "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        borderAccent: "hover:border-amber-500/40 focus-visible:ring-amber-500/30",
        dot: "bg-amber-500",
        ring: "ring-amber-500/20",
      };
    case "labs":
      return {
        badge:
          "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300",
        borderAccent: "hover:border-rose-500/40 focus-visible:ring-rose-500/30",
        dot: "bg-rose-500",
        ring: "ring-rose-500/20",
      };
  }
}

const BUILDING_ICONS: Record<Exclude<BuildingId, "all">, typeof Building2> = {
  foundation: Building2,
  eb: Layers,
  svh: GraduationCap,
  law: Building2,
  labs: FlaskConical,
};

function BuildingBlockIcon({
  id,
  className,
}: {
  id: Exclude<BuildingId, "all">;
  className?: string;
}) {
  const Icon = BUILDING_ICONS[id] ?? Building2;
  return <Icon className={className} strokeWidth={1.75} />;
}

function RoomIcon({
  building,
  isLab,
  className,
}: {
  building: Exclude<BuildingId, "all">;
  isLab: boolean;
  className?: string;
}) {
  if (isLab) {
    return <FlaskConical className={className} strokeWidth={1.75} />;
  }
  const Icon = BUILDING_ICONS[building] ?? Building2;
  return <Icon className={className} strokeWidth={1.75} />;
}

interface RoomCardProps {
  room: VacantRoom;
  periodNumber: number;
  onOpenSchedule: (room: VacantRoom) => void;
}

function RoomCard({ room, periodNumber, onOpenSchedule }: RoomCardProps) {
  const [copied, setCopied] = useState(false);
  const theme = getBuildingTheme(room.building);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(room.name);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const consecutive = room.consecutivePeriods ?? 1;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenSchedule(room)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenSchedule(room);
        }
      }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-3.5 shadow-2xs transition-all duration-150 text-left cursor-pointer select-none",
        "hover:shadow-xs hover:-translate-y-0.5 focus-visible:outline-hidden focus-visible:ring-2",
        theme.borderAccent
      )}
    >
      <div>
        {/* Top Header: Building Badge, Floor, and Copy Button */}
        <div className="mb-2 flex items-center justify-between gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium leading-none",
              theme.badge
            )}
          >
            <RoomIcon
              building={room.building}
              isLab={room.isLab}
              className="size-2.5 shrink-0"
            />
            <span className="truncate">{room.buildingLabel}</span>
          </span>

          <div className="flex items-center gap-1 shrink-0">
            {room.floorLabel ? (
              <span className="font-mono text-[10px] text-muted-foreground">
                {room.floorLabel}
              </span>
            ) : null}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      onClick={handleCopy}
                      className={cn(
                        "flex size-6 items-center justify-center rounded-md border border-transparent transition-colors",
                        "text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground",
                        copied && "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      )}
                      aria-label={copied ? "Room copied to clipboard" : `Copy ${room.name}`}
                    />
                  }
                >
                  {copied ? (
                    <Check className="size-3" strokeWidth={2.5} />
                  ) : (
                    <Copy className="size-3" strokeWidth={1.75} />
                  )}
                </TooltipTrigger>
                <TooltipContent side="top">
                  {copied ? "Copied!" : "Copy room name"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Room Title */}
        <div className="mt-1">
          <h3 className="font-mono text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {room.shortCode}
          </h3>
          <p className="line-clamp-1 text-[11px] text-muted-foreground">
            {room.name}
          </p>
        </div>

        {/* Consecutive Availability pill */}
        {consecutive > 1 && (
          <div className="mt-2.5 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              <Hourglass className="size-2.5 shrink-0" />
              <span>Free for {consecutive} periods</span>
              {room.freeUntilTime && (
                <span className="font-mono text-[9px] opacity-80">(till {room.freeUntilTime})</span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Footer Info: Room Type & Period indicator */}
      <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2 text-[11px] text-muted-foreground">
        <span className="truncate font-medium text-[10px] text-muted-foreground">
          {room.roomType}
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-[10px] tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          P{periodNumber} Free
        </span>
      </div>
    </div>
  );
}

export function VacantClassroomsView({
  initialResult,
  initialDay,
  initialPeriod,
}: VacantClassroomsViewProps) {
  const currentCampus = useMemo(() => getCurrentCampusPeriod(), []);

  const [selectedDay, setSelectedDay] = useState<Weekday>(
    initialDay ?? initialResult?.day ?? currentCampus.day
  );
  const [selectedPeriod, setSelectedPeriod] = useState<number>(
    initialPeriod ?? initialResult?.period ?? currentCampus.period
  );

  const [result, setResult] = useState<VacantRoomsResult>(() =>
    initialResult ?? getVacantRooms(selectedDay, selectedPeriod)
  );

  // Client-side quick filter & search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingId>("all");
  const [selectedFloor, setSelectedFloor] = useState<FloorFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grouped");

  // Room Schedule Inspector Modal state
  const [inspectedRoom, setInspectedRoom] = useState<VacantRoom | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const isCurrentSlot =
    currentCampus.isLiveNow &&
    selectedDay === currentCampus.day &&
    selectedPeriod === currentCampus.period;

  const handleSelectSlot = useCallback(
    (day: Weekday, period: number) => {
      setSelectedDay(day);
      setSelectedPeriod(period);
      setResult(getVacantRooms(day, period));
    },
    []
  );

  // Keyboard navigation: Left/Right arrow for periods, '/' for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea") {
        if (e.key === "Escape") {
          setSearchQuery("");
          (document.activeElement as HTMLElement)?.blur();
        }
        return;
      }

      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      if (e.key === "ArrowLeft") {
        if (selectedPeriod > 1) {
          handleSelectSlot(selectedDay, selectedPeriod - 1);
        }
      } else if (e.key === "ArrowRight") {
        if (selectedPeriod < 9) {
          handleSelectSlot(selectedDay, selectedPeriod + 1);
        }
      } else if (/^[1-9]$/.test(e.key)) {
        const p = parseInt(e.key, 10);
        handleSelectSlot(selectedDay, p);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedDay, selectedPeriod, handleSelectSlot]);

  const handleJumpToNow = () => {
    const campus = getCurrentCampusPeriod();
    handleSelectSlot(campus.day, campus.period);
  };

  const handleRefresh = () => {
    handleSelectSlot(selectedDay, selectedPeriod);
  };

  const handleStepPeriod = (direction: -1 | 1) => {
    const nextP = selectedPeriod + direction;
    if (nextP >= 1 && nextP <= 9) {
      handleSelectSlot(selectedDay, nextP);
    }
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedBuilding("all");
    setSelectedFloor("all");
  };

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    if (!result?.rooms) return [];

    let list = result.rooms;

    if (selectedBuilding !== "all") {
      if (selectedBuilding === "labs") {
        list = list.filter((r) => r.building === "labs" || r.isLab);
      } else {
        list = list.filter((r) => r.building === selectedBuilding);
      }
    }

    if (selectedFloor !== "all") {
      if (selectedFloor === "special") {
        list = list.filter((r) => r.isLab || r.floor === undefined);
      } else {
        list = list.filter((r) => r.floor === selectedFloor);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.shortCode.toLowerCase().includes(q) ||
          r.buildingLabel.toLowerCase().includes(q) ||
          r.roomType.toLowerCase().includes(q) ||
          (r.floorLabel && r.floorLabel.toLowerCase().includes(q))
      );
    }

    return list;
  }, [result?.rooms, selectedBuilding, selectedFloor, searchQuery]);

  // Grouped rooms by building
  const groupedRooms = useMemo(() => {
    const groups: {
      id: Exclude<BuildingId, "all">;
      title: string;
      rooms: VacantRoom[];
    }[] = [
      {
        id: "foundation",
        title: "Foundation Block",
        rooms: [],
      },
      {
        id: "eb",
        title: "Engineering Block (EB)",
        rooms: [],
      },
      {
        id: "svh",
        title: "SVH Block",
        rooms: [],
      },
      {
        id: "law",
        title: "Law Block",
        rooms: [],
      },
      {
        id: "labs",
        title: "Labs & Specialized Halls",
        rooms: [],
      },
    ];

    for (const room of filteredRooms) {
      const g = groups.find((grp) => grp.id === room.building);
      if (g) {
        g.rooms.push(room);
      } else {
        groups[groups.length - 1].rooms.push(room);
      }
    }

    return groups.filter((g) => g.rooms.length > 0);
  }, [filteredRooms]);

  // Derived stats
  const topBuilding = useMemo(() => {
    if (!result?.buildingCounts) return null;
    const candidates: { id: BuildingId; count: number; label: string }[] = [
      { id: "foundation", count: result.buildingCounts.foundation, label: "Foundation Block" },
      { id: "eb", count: result.buildingCounts.eb, label: "Engineering Block" },
      { id: "svh", count: result.buildingCounts.svh, label: "SVH Block" },
      { id: "law", count: result.buildingCounts.law, label: "Law Block" },
    ];
    candidates.sort((a, b) => b.count - a.count);
    return candidates[0] && candidates[0].count > 0 ? candidates[0] : null;
  }, [result]);

  const activePeriodSlot = timeSlots.find((s) => s.period === selectedPeriod);
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedBuilding !== "all" ||
    selectedFloor !== "all";

  // Detailed day schedule for inspected room modal
  const roomScheduleTimeline = useMemo(() => {
    if (!inspectedRoom) return [];
    return getAllRoomSchedule(inspectedRoom.name, selectedDay);
  }, [inspectedRoom, selectedDay]);

  return (
    <div className="space-y-6">
      {/* Live Campus Pulse Banner */}
      <div
        className={cn(
          "flex flex-col gap-3 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between transition-colors",
          isCurrentSlot
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100"
            : currentCampus.isLiveNow
            ? "border-primary/20 bg-primary/5 text-foreground"
            : "border-border bg-card text-muted-foreground"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg border",
              isCurrentSlot
                ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-600 dark:text-emerald-300"
                : "border-border bg-background text-foreground/70"
            )}
          >
            {isCurrentSlot ? (
              <Sparkles className="size-4 animate-pulse text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Clock className="size-4" strokeWidth={1.75} />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-[13px] text-foreground">
                {currentCampus.isLiveNow
                  ? `Campus Live Slot: Period ${currentCampus.period} (${currentCampus.slotLabel})`
                  : currentCampus.isBeforeClasses
                  ? "Before Classes (09:00 Start)"
                  : currentCampus.isAfterClasses
                  ? "Classes Concluded (After 17:15)"
                  : "Weekend · Self Study Mode"}
              </span>

              {isCurrentSlot && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wider">
                  <span className="size-1.5 rounded-full bg-white animate-ping" />
                  Live Now
                </span>
              )}
            </div>

            <p className="text-[12px] text-muted-foreground">
              {currentCampus.isLiveNow ? (
                <>
                  Campus time:{" "}
                  <span className="font-mono tabular-nums font-medium text-foreground">
                    {currentCampus.nowHm} IST
                  </span>
                  {currentCampus.minutesLeft ? (
                    <>
                      <span className="mx-1.5 text-border">·</span>
                      <span>{currentCampus.minutesLeft} min remaining in current period</span>
                    </>
                  ) : null}
                </>
              ) : (
                "Select any weekday and period to check room vacancy across campus blocks."
              )}
            </p>
          </div>
        </div>

        {currentCampus.isLiveNow && !isCurrentSlot && (
          <Button
            size="sm"
            onClick={handleJumpToNow}
            className="h-8 gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Clock className="size-3.5" />
            <span>Jump to right now (P{currentCampus.period})</span>
          </Button>
        )}
      </div>

      {/* Control Panel: Day & Period Selector */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-xs sm:p-5">
        <div className="space-y-4">
          {/* Day selection row */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                <CalendarDays className="size-3.5" strokeWidth={1.75} />
                Day of week
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                {weekdays.find((d) => d.id === selectedDay)?.label}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
              {weekdays.map((day) => {
                const isSelected = selectedDay === day.id;
                const isToday = currentCampus.day === day.id;

                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => handleSelectSlot(day.id, selectedPeriod)}
                    className={cn(
                      "group relative flex flex-col items-center justify-center rounded-lg border py-2 px-1 text-center transition-all",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground shadow-xs font-semibold"
                        : "border-border bg-background hover:bg-muted text-foreground font-medium",
                      isToday && !isSelected && "ring-1 ring-primary/40"
                    )}
                  >
                    <span className="text-xs sm:text-[13px]">{day.label}</span>
                    {isToday && (
                      <span
                        className={cn(
                          "mt-0.5 text-[9px] uppercase tracking-wider font-semibold",
                          isSelected
                            ? "text-primary-foreground/90 font-normal"
                            : "text-primary"
                        )}
                      >
                        Today
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Period selector with stepping chevrons */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                  <Clock className="size-3.5" strokeWidth={1.75} />
                  Period
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  (P{selectedPeriod} · {activePeriodSlot?.start} – {activePeriodSlot?.end})
                </span>
              </div>

              {/* Prev / Next Steppers */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-xs"
                  onClick={() => handleStepPeriod(-1)}
                  disabled={selectedPeriod <= 1}
                  aria-label="Previous period"
                  className="size-7"
                >
                  <ChevronLeft className="size-3.5" />
                </Button>
                <span className="font-mono text-xs text-muted-foreground px-1 tabular-nums">
                  {selectedPeriod} / 9
                </span>
                <Button
                  variant="outline"
                  size="icon-xs"
                  onClick={() => handleStepPeriod(1)}
                  disabled={selectedPeriod >= 9}
                  aria-label="Next period"
                  className="size-7"
                >
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>

            {/* Period buttons grid */}
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-9">
              {timeSlots.map((slot) => {
                const isSelected = selectedPeriod === slot.period;
                const isSlotNow =
                  currentCampus.isLiveNow &&
                  selectedDay === currentCampus.day &&
                  currentCampus.period === slot.period;
                const slotVacancies = result?.periodCounts?.[slot.period] ?? 0;

                return (
                  <button
                    key={slot.period}
                    type="button"
                    onClick={() => handleSelectSlot(selectedDay, slot.period)}
                    className={cn(
                      "group relative flex flex-col items-center justify-center rounded-lg border py-2 px-1 text-center transition-all",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground shadow-xs font-semibold"
                        : "border-border bg-background hover:bg-muted text-foreground font-medium",
                      isSlotNow && !isSelected && "ring-1 ring-emerald-500/60"
                    )}
                  >
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs sm:text-[13px]">
                        P{slot.period}
                      </span>
                      {isSlotNow && (
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            isSelected ? "bg-emerald-300" : "bg-emerald-500 animate-pulse"
                          )}
                          title="Currently active period"
                        />
                      )}
                    </div>

                    <span
                      className={cn(
                        "font-mono text-[9px] tabular-nums sm:text-[10px]",
                        isSelected
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground"
                      )}
                    >
                      {slot.start}
                    </span>

                    {/* Room count badge */}
                    <span
                      className={cn(
                        "mt-1 rounded-sm px-1 font-mono text-[8.5px] tabular-nums font-semibold",
                        isSelected
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      {slotVacancies} free
                    </span>

                    {slot.isLunch && (
                      <span
                        className={cn(
                          "mt-0.5 inline-flex items-center gap-0.5 text-[8px] font-semibold uppercase tracking-wider",
                          isSelected
                            ? "text-primary-foreground/90 font-normal"
                            : "text-amber-600 dark:text-amber-400"
                        )}
                      >
                        <Utensils className="size-2" />
                        Lunch
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Secondary Filter Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          {/* Search box with hotkey hint */}
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.75}
            />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search room, building, floor (e.g. 302, EB, Apple)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8.5 pr-14 h-9 text-sm"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Right actions: View mode switch & Refresh */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grouped")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  viewMode === "grouped"
                    ? "bg-card text-foreground shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Group rooms by building block"
              >
                <Building2 className="size-3.5" />
                <span className="hidden sm:inline">By Block</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  viewMode === "grid"
                    ? "bg-card text-foreground shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="View all rooms in a grid"
              >
                <LayoutGrid className="size-3.5" />
                <span className="hidden sm:inline">All Rooms</span>
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <RefreshCw
                className="size-3.5"
                strokeWidth={1.75}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Building Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[11px] font-medium text-muted-foreground shrink-0 flex items-center gap-1 mr-1">
            <ListFilter className="size-3" />
            Block:
          </span>
          {BUILDING_OPTIONS.map((opt) => {
            const isSelected = selectedBuilding === opt.id;
            const count = result?.buildingCounts?.[opt.id] ?? 0;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedBuilding(opt.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs whitespace-nowrap transition-colors",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground font-semibold shadow-2xs"
                    : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground font-normal"
                )}
              >
                <span>{opt.shortLabel}</span>
                {result && (
                  <span
                    className={cn(
                      "font-mono text-[10px] tabular-nums px-1.5 py-px rounded-full",
                      isSelected
                        ? "bg-primary-foreground/20 text-primary-foreground font-medium"
                        : "bg-muted text-foreground font-medium"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Floor Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[11px] font-medium text-muted-foreground shrink-0 flex items-center gap-1 mr-1">
            <MapPin className="size-3" />
            Floor:
          </span>
          {FLOOR_OPTIONS.map((fl) => {
            const isSelected = selectedFloor === fl.id;
            return (
              <button
                key={String(fl.id)}
                type="button"
                onClick={() => setSelectedFloor(fl.id)}
                className={cn(
                  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] whitespace-nowrap transition-colors",
                  isSelected
                    ? "border-foreground bg-foreground text-background font-medium"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                )}
              >
                {fl.label}
              </button>
            );
          })}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="ml-auto inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium shrink-0"
            >
              <X className="size-3" />
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Slim Summary / Metrics Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-y border-border py-2 text-[12px] text-muted-foreground">
        <div className="flex flex-wrap items-center gap-3">
          <span>
            <strong className="font-mono text-sm font-semibold tabular-nums text-foreground">
              {filteredRooms.length}
            </strong>{" "}
            {filteredRooms.length === 1 ? "room" : "rooms"} available
            {hasActiveFilters && result ? (
              <span className="text-muted-foreground"> (filtered from {result.total})</span>
            ) : null}
          </span>

          {topBuilding && (
            <>
              <span className="text-border">·</span>
              <span>
                Most vacancies in{" "}
                <strong className="text-foreground">{topBuilding.label}</strong> (
                {topBuilding.count})
              </span>
            </>
          )}

          <span className="text-border">·</span>
          <span className="flex items-center gap-1 text-[11px]">
            <Info className="size-3" />
            Click any room to view full day schedule
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span>
            {weekdays.find((d) => d.id === selectedDay)?.label} · Period {selectedPeriod}
          </span>
          <span className="text-border">·</span>
          <span>{activePeriodSlot?.start}–{activePeriodSlot?.end}</span>
        </div>
      </div>

      {/* Content Area */}
      {filteredRooms.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-14 px-4 text-center">
          <DoorOpen
            className="mx-auto mb-2 size-8 text-muted-foreground/50"
            strokeWidth={1.5}
          />
          <p className="text-sm font-medium text-foreground">
            {hasActiveFilters
              ? "No rooms match your search or filter criteria"
              : `All classrooms occupied during Period ${selectedPeriod}`}
          </p>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
            {hasActiveFilters
              ? "Try adjusting your search terms or clearing floor and block filters."
              : "Classes are scheduled across all registered rooms for this time slot."}
          </p>

          <div className="mt-4 flex items-center justify-center gap-2">
            {hasActiveFilters ? (
              <Button
                variant="outline"
                size="sm"
                onClick={resetAllFilters}
                className="h-8 text-xs"
              >
                Clear all filters
              </Button>
            ) : selectedPeriod < 9 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStepPeriod(1)}
                className="h-8 text-xs gap-1.5"
              >
                <span>Check Period {selectedPeriod + 1}</span>
                <ChevronRight className="size-3" />
              </Button>
            ) : null}
          </div>
        </div>
      ) : viewMode === "grouped" ? (
        /* Grouped by Building Block View */
        <div className="space-y-7">
          {groupedRooms.map((group) => {
            return (
              <section key={group.id} className="space-y-3">
                <div className="flex items-center justify-between border-b border-border/70 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded-md border border-border/60 bg-muted/60">
                      <BuildingBlockIcon id={group.id} className="size-3.5 text-foreground/80" />
                    </div>
                    <h2 className="text-[13px] font-semibold text-foreground tracking-tight">
                      {group.title}
                    </h2>
                  </div>

                  <span className="font-mono text-xs tabular-nums text-muted-foreground">
                    {group.rooms.length} {group.rooms.length === 1 ? "room" : "rooms"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {group.rooms.map((room) => (
                    <RoomCard
                      key={room.name}
                      room={room}
                      periodNumber={selectedPeriod}
                      onOpenSchedule={setInspectedRoom}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        /* Flat Grid View */
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.name}
              room={room}
              periodNumber={selectedPeriod}
              onOpenSchedule={setInspectedRoom}
            />
          ))}
        </div>
      )}

      {/* Room Full Day Timeline Inspector Dialog */}
      <Dialog open={Boolean(inspectedRoom)} onOpenChange={(open) => !open && setInspectedRoom(null)}>
        <DialogContent className="sm:max-w-md">
          {inspectedRoom && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
                      getBuildingTheme(inspectedRoom.building).badge
                    )}
                  >
                    <RoomIcon
                      building={inspectedRoom.building}
                      isLab={inspectedRoom.isLab}
                      className="size-3 shrink-0"
                    />
                    <span>{inspectedRoom.buildingLabel}</span>
                  </span>
                  {inspectedRoom.floorLabel && (
                    <span className="text-xs text-muted-foreground font-mono">
                      · {inspectedRoom.floorLabel}
                    </span>
                  )}
                </div>
                <DialogTitle className="font-mono text-xl font-bold tracking-tight text-foreground mt-1">
                  {inspectedRoom.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Availability schedule for{" "}
                  <strong className="text-foreground capitalize">{selectedDay}</strong> across all 9 campus periods.
                </DialogDescription>
              </DialogHeader>

              {/* Day Timeline Grid */}
              <div className="space-y-2 py-2">
                <div className="grid grid-cols-1 gap-1.5 max-h-72 overflow-y-auto pr-1">
                  {roomScheduleTimeline.map((slot) => {
                    const isSelectedP = slot.period === selectedPeriod;
                    return (
                      <div
                        key={slot.period}
                        className={cn(
                          "flex items-center justify-between rounded-lg border px-3 py-2 text-xs transition-colors",
                          isSelectedP && "ring-2 ring-primary/60 border-primary/40",
                          slot.isFree
                            ? "bg-emerald-500/5 border-emerald-500/20 text-foreground"
                            : "bg-muted/40 border-border/50 text-muted-foreground opacity-60"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={cn(
                              "font-mono text-xs font-semibold px-1.5 py-0.5 rounded",
                              isSelectedP ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                            )}
                          >
                            P{slot.period}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {slot.slotLabel}
                          </span>
                          {slot.isLunch && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] text-amber-600 dark:text-amber-400 font-medium uppercase">
                              <Utensils className="size-2.5" />
                              Lunch
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {slot.isFree ? (
                            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                              <span className="size-1.5 rounded-full bg-emerald-500" />
                              Vacant
                            </span>
                          ) : (
                            <span className="font-mono text-[11px] text-muted-foreground">
                              Occupied
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions Footer */}
              <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                <span className="font-mono text-muted-foreground text-[11px]">
                  {roomScheduleTimeline.filter((s) => s.isFree).length} of 9 periods free
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(inspectedRoom.name);
                    setInspectedRoom(null);
                  }}
                  className="h-8 gap-1.5 text-xs"
                >
                  <Copy className="size-3.5" />
                  Copy Name
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
