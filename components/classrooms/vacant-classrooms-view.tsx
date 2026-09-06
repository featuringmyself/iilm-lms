"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock,
  DoorOpen,
  FlaskConical,
  GraduationCap,
  Hourglass,
  Layers,
  LayoutGrid,
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

type FloorFilter = "all" | 1 | 2 | 3 | 4 | "special";
type ViewMode = "grouped" | "grid";

const FLOOR_OPTIONS: { id: FloorFilter; label: string }[] = [
  { id: "all", label: "All floors" },
  { id: 1, label: "Floor 1" },
  { id: 2, label: "Floor 2" },
  { id: 3, label: "Floor 3" },
  { id: 4, label: "Floor 4" },
  { id: "special", label: "Labs & Halls" },
];

const BUILDING_ICONS: Record<Exclude<BuildingId, "all">, typeof Building2> = {
  eb: Layers,
  foundation: Building2,
  svh: GraduationCap,
  law: Building2,
  labs: FlaskConical,
};

function BuildingIcon({
  id,
  className,
}: {
  id: Exclude<BuildingId, "all">;
  className?: string;
}) {
  const Icon = BUILDING_ICONS[id] ?? Building2;
  return <Icon className={className} strokeWidth={1.75} />;
}

interface RoomCardProps {
  room: VacantRoom;
  selectedPeriod: number;
  periodEnd?: string;
  onOpenSchedule: (room: VacantRoom) => void;
}

function RoomCard({
  room,
  selectedPeriod,
  periodEnd,
  onOpenSchedule,
}: RoomCardProps) {
  const consecutive = room.consecutivePeriods ?? 1;
  const isLongSession = consecutive >= 2;
  const scheduleOverview = room.scheduleOverview ?? [];
  const freeCount = room.totalFreePeriods ?? scheduleOverview.filter(Boolean).length;

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
        "group relative flex flex-col justify-between rounded-xl border bg-card p-3.5 text-left transition-all duration-150 cursor-pointer select-none",
        isLongSession
          ? "border-emerald-500/25 hover:border-emerald-500/50 hover:shadow-xs"
          : "border-border hover:border-foreground/25 hover:shadow-2xs",
        "hover:-translate-y-0.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      <div>
        {/* Top Line: Room Code + Building Icon */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-mono text-[15px] font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
              {room.shortCode}
            </h3>
            <p className="line-clamp-1 text-xs text-muted-foreground mt-0.5">
              {room.buildingLabel}
              {room.floorLabel ? ` · ${room.floorLabel}` : ""}
            </p>
          </div>

          <div className="flex size-6 items-center justify-center rounded-md border border-border/50 bg-muted/40 text-muted-foreground shrink-0">
            <BuildingIcon id={room.building} className="size-3" />
          </div>
        </div>

        {/* Room Type Tag */}
        <p className="mt-1.5 text-[11px] text-muted-foreground/80 line-clamp-1">
          {room.roomType}
        </p>

        {/* Hero Peace-of-Mind Status Pill */}
        <div className="mt-3">
          {isLongSession ? (
            <div className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-800 dark:text-emerald-200">
              <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>Free for {consecutive} periods</span>
              {room.freeUntilTime && (
                <span className="font-mono text-[10px] opacity-80">(till {room.freeUntilTime})</span>
              )}
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1 text-[11px] font-medium text-muted-foreground">
              <Clock className="size-3 shrink-0" />
              <span>Free this period</span>
              {periodEnd && <span className="font-mono text-[10px] opacity-80">(till {periodEnd})</span>}
            </div>
          )}
        </div>
      </div>

      {/* 9-Period Micro Day Timeline Strip */}
      <div className="mt-3.5 pt-2.5 border-t border-border/50">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1 font-mono">
          <span>Day schedule</span>
          <span className="tabular-nums">{freeCount}/9 periods free</span>
        </div>

        <div className="grid grid-cols-9 gap-0.5 h-1.5 rounded-xs overflow-hidden bg-muted/50 p-px">
          {scheduleOverview.map((isFree, idx) => {
            const periodNum = idx + 1;
            const isViewingPeriod = periodNum === selectedPeriod;

            return (
              <div
                key={periodNum}
                title={`Period ${periodNum}: ${isFree ? "Free" : "Occupied"}`}
                className={cn(
                  "h-full rounded-xs transition-colors",
                  isFree
                    ? isViewingPeriod
                      ? "bg-emerald-500 ring-1 ring-emerald-600 dark:ring-emerald-400"
                      : "bg-emerald-500/60 dark:bg-emerald-500/70"
                    : isViewingPeriod
                    ? "bg-foreground/40 ring-1 ring-foreground/60"
                    : "bg-muted-foreground/20"
                )}
              />
            );
          })}
        </div>
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

  // Filters
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingId>("all");
  const [selectedFloor, setSelectedFloor] = useState<FloorFilter>("all");
  const [longSessionOnly, setLongSessionOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grouped");

  // Room Inspector Modal
  const [inspectedRoom, setInspectedRoom] = useState<VacantRoom | null>(null);

  const isCurrentLiveSlot =
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

  const handleJumpToNow = () => {
    const campus = getCurrentCampusPeriod();
    handleSelectSlot(campus.day, campus.period);
  };

  const handleStepPeriod = (direction: -1 | 1) => {
    const nextP = selectedPeriod + direction;
    if (nextP >= 1 && nextP <= 9) {
      handleSelectSlot(selectedDay, nextP);
    }
  };

  const resetAllFilters = () => {
    setSelectedBuilding("all");
    setSelectedFloor("all");
    setLongSessionOnly(false);
  };

  // Keyboard navigation: Arrow keys to step periods, 1-9 to select period
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea") {
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

    if (longSessionOnly) {
      list = list.filter((r) => (r.consecutivePeriods ?? 1) >= 2);
    }

    return list;
  }, [result?.rooms, selectedBuilding, selectedFloor, longSessionOnly]);

  // Grouped rooms by building
  const groupedRooms = useMemo(() => {
    const groups: {
      id: Exclude<BuildingId, "all">;
      title: string;
      rooms: VacantRoom[];
    }[] = [
      {
        id: "eb",
        title: "Engineering Block (EB)",
        rooms: [],
      },
      {
        id: "foundation",
        title: "Foundation Block",
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

  const activePeriodSlot = timeSlots.find((s) => s.period === selectedPeriod);
  const hasActiveFilters =
    selectedBuilding !== "all" ||
    selectedFloor !== "all" ||
    longSessionOnly;

  const longSessionCount = useMemo(() => {
    return result?.rooms.filter((r) => (r.consecutivePeriods ?? 1) >= 2).length ?? 0;
  }, [result?.rooms]);

  // Detailed day schedule for inspected room modal
  const roomScheduleTimeline = useMemo(() => {
    if (!inspectedRoom) return [];
    return getAllRoomSchedule(inspectedRoom.name, selectedDay);
  }, [inspectedRoom, selectedDay]);

  return (
    <div className="space-y-5">
      {/* Schedule Scrubber: Day Tabs + Period Navigator */}
      <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-xs space-y-3">
        {/* Row A: Day Selector Bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none">
            {weekdays.map((day) => {
              const isSelected = selectedDay === day.id;
              const isToday = currentCampus.day === day.id;

              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => handleSelectSlot(day.id, selectedPeriod)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer select-none shrink-0",
                    isSelected
                      ? "bg-foreground text-background font-semibold shadow-2xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    isToday && !isSelected && "text-foreground font-semibold"
                  )}
                >
                  <span>{day.label}</span>
                  {isToday && (
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        isSelected ? "bg-background" : "bg-primary"
                      )}
                      title="Today"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <span className="hidden sm:inline">P{selectedPeriod} · {activePeriodSlot?.start}–{activePeriodSlot?.end}</span>
            {currentCampus.isLiveNow && !isCurrentLiveSlot && (
              <button
                type="button"
                onClick={handleJumpToNow}
                className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
              >
                Jump to P{currentCampus.period}
              </button>
            )}
            <div className="flex items-center gap-0.5">
              <Button
                variant="outline"
                size="icon-xs"
                onClick={() => handleStepPeriod(-1)}
                disabled={selectedPeriod <= 1}
                className="size-6 text-muted-foreground hover:text-foreground"
                aria-label="Previous period"
              >
                <ChevronLeft className="size-3" />
              </Button>
              <Button
                variant="outline"
                size="icon-xs"
                onClick={() => handleStepPeriod(1)}
                disabled={selectedPeriod >= 9}
                className="size-6 text-muted-foreground hover:text-foreground"
                aria-label="Next period"
              >
                <ChevronRight className="size-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Row B: 9 Period Slots Grid */}
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
                  "group relative flex flex-col items-center justify-center rounded-lg border p-2 text-center transition-all cursor-pointer select-none",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "border-border bg-background hover:bg-muted/70 text-foreground",
                  isSlotNow && !isSelected && "border-emerald-500/60 ring-1 ring-emerald-500/30"
                )}
              >
                <div className="flex items-center gap-1 font-mono text-xs">
                  <span>P{slot.period}</span>
                  {isSlotNow && (
                    <span
                      className={cn(
                        "size-1.5 rounded-full shrink-0",
                        isSelected ? "bg-primary-foreground" : "bg-emerald-500"
                      )}
                      title="Current active period"
                    />
                  )}
                </div>

                <span
                  className={cn(
                    "font-mono text-[10px] tabular-nums mt-0.5",
                    isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}
                >
                  {slot.start}
                </span>

                <span
                  className={cn(
                    "mt-1 font-mono text-[9px] tabular-nums font-medium",
                    isSelected
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {slotVacancies} free
                </span>

                {slot.isLunch && (
                  <span
                    className={cn(
                      "mt-0.5 inline-flex items-center gap-0.5 text-[8px] uppercase tracking-wider font-semibold",
                      isSelected ? "text-primary-foreground/90" : "text-amber-600 dark:text-amber-400"
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

      {/* 3. Filter & Discovery Toolbar */}
      <div className="space-y-2.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Building block tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none">
            {BUILDING_OPTIONS.map((opt) => {
              const isSelected = selectedBuilding === opt.id;
              const count = result?.buildingCounts?.[opt.id] ?? 0;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedBuilding(opt.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors cursor-pointer shrink-0 select-none",
                    isSelected
                      ? "bg-muted text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  {opt.id !== "all" && (
                    <BuildingIcon id={opt.id} className="size-3 text-muted-foreground" />
                  )}
                  <span>{opt.shortLabel}</span>
                  <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {/* Long Study Session Toggle */}
            <Button
              variant={longSessionOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setLongSessionOnly((prev) => !prev)}
              className="h-8 text-xs gap-1.5 px-2.5"
            >
              <Hourglass className="size-3" />
              <span>≥2 periods free</span>
              {longSessionCount > 0 && (
                <span className="font-mono text-[10px] tabular-nums opacity-80 font-normal">
                  ({longSessionCount})
                </span>
              )}
            </Button>

            {/* View Mode Toggle: Grouped by block vs Flat grid */}
            <div className="inline-flex rounded-lg border border-border bg-muted/30 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grouped")}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors cursor-pointer",
                  viewMode === "grouped"
                    ? "bg-card text-foreground shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Group by campus block"
              >
                <Building2 className="size-3.5" />
                <span className="hidden sm:inline">Blocks</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors cursor-pointer",
                  viewMode === "grid"
                    ? "bg-card text-foreground shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Flat grid of all rooms"
              >
                <LayoutGrid className="size-3.5" />
                <span className="hidden sm:inline">All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row B: Floor filter & Reset */}
        <div className="flex items-center justify-between gap-2 border-t border-border/50 pt-2">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-medium text-muted-foreground mr-1 shrink-0">
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
                    "rounded px-1.5 py-0.5 font-mono text-[10px] transition-colors cursor-pointer select-none",
                    isSelected
                      ? "bg-foreground text-background font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {fl.label}
                </button>
              );
            })}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium shrink-0 cursor-pointer ml-1"
            >
              <X className="size-3" />
              <span>Reset filters</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Section Summary */}
      <div className="flex items-center justify-between border-b border-border/60 pb-2 text-xs text-muted-foreground font-mono">
        <span>
          <strong className="text-foreground font-semibold">{filteredRooms.length}</strong> vacant
        </span>
      </div>

      {/* 5. Main Content: Grouped or Grid */}
      {filteredRooms.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 px-4 text-center">
          <DoorOpen
            className="mx-auto mb-2 size-6 text-muted-foreground/50"
            strokeWidth={1.5}
          />
          <p className="text-sm font-medium text-foreground">
            No vacant classrooms found
          </p>

          <div className="mt-3 flex items-center justify-center gap-2">
            {hasActiveFilters ? (
              <Button
                variant="outline"
                size="sm"
                onClick={resetAllFilters}
                className="h-7 text-xs"
              >
                Reset filters
              </Button>
            ) : selectedPeriod < 9 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStepPeriod(1)}
                className="h-7 text-xs gap-1"
              >
                <span>Period {selectedPeriod + 1}</span>
                <ChevronRight className="size-3" />
              </Button>
            ) : null}
          </div>
        </div>
      ) : viewMode === "grouped" ? (
        /* Grouped by Campus Block */
        <div className="space-y-7">
          {groupedRooms.map((group) => (
            <section key={group.id} className="space-y-3">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-md border border-border/60 bg-muted/60 text-foreground">
                    <BuildingIcon id={group.id} className="size-3.5" />
                  </div>
                  <h3 className="text-[13px] font-semibold text-foreground tracking-tight">
                    {group.title}
                  </h3>
                </div>

                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {group.rooms.length} vacant
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {group.rooms.map((room) => (
                  <RoomCard
                    key={room.name}
                    room={room}
                    selectedPeriod={selectedPeriod}
                    periodEnd={activePeriodSlot?.end}
                    onOpenSchedule={setInspectedRoom}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        /* Flat Grid View */
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.name}
              room={room}
              selectedPeriod={selectedPeriod}
              periodEnd={activePeriodSlot?.end}
              onOpenSchedule={setInspectedRoom}
            />
          ))}
        </div>
      )}

      {/* 6. Room Full Day Schedule Inspector Modal */}
      <Dialog open={Boolean(inspectedRoom)} onOpenChange={(open) => !open && setInspectedRoom(null)}>
        <DialogContent className="sm:max-w-md">
          {inspectedRoom && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">
                    <BuildingIcon id={inspectedRoom.building} className="size-3" />
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
                <DialogDescription className="text-xs text-muted-foreground capitalize">
                  {selectedDay} schedule
                </DialogDescription>
              </DialogHeader>

              {/* Day Visual Bar Overview */}
              <div className="mt-1 mb-2">
                <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                  <span>Day timeline</span>
                  <span className="text-foreground font-medium">
                    {roomScheduleTimeline.filter((s) => s.isFree).length}/9 vacant
                  </span>
                </div>
                <div className="grid grid-cols-9 gap-1 h-2 rounded bg-muted p-0.5 border border-border/50">
                  {roomScheduleTimeline.map((slot) => {
                    const isSelectedP = slot.period === selectedPeriod;
                    return (
                      <div
                        key={slot.period}
                        title={`Period ${slot.period} (${slot.start}–${slot.end}): ${slot.isFree ? "Vacant" : "Occupied"}`}
                        className={cn(
                          "h-full rounded-xs transition-colors",
                          slot.isFree ? "bg-emerald-500" : "bg-muted-foreground/20",
                          isSelectedP && "ring-1 ring-foreground ring-offset-1 ring-offset-background"
                        )}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Period by Period Breakdown List */}
              <div className="divide-y divide-border/60 overflow-hidden rounded-lg border border-border bg-card max-h-72 overflow-y-auto">
                {roomScheduleTimeline.map((slot) => {
                  const isSelectedP = slot.period === selectedPeriod;
                  return (
                    <div
                      key={slot.period}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 text-xs transition-colors",
                        isSelectedP && "bg-muted/70 font-medium",
                        !slot.isFree && "opacity-50"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold tabular-nums text-foreground">
                          P{slot.period}
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {slot.slotLabel}
                        </span>
                        {slot.isLunch && (
                          <span className="text-[9px] uppercase font-mono text-amber-600 dark:text-amber-400">
                            Lunch
                          </span>
                        )}
                      </div>

                      <div>
                        {slot.isFree ? (
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
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

              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                <span className="text-muted-foreground text-[11px]">
                  Room type: <strong className="text-foreground">{inspectedRoom.roomType}</strong>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInspectedRoom(null)}
                  className="h-8 text-xs px-3"
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
