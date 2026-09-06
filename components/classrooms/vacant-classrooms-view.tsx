"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Building2,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  DoorOpen,
  FlaskConical,
  GraduationCap,
  Hourglass,
  Layers,
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

type ModeTab = "now" | "plan";
type FloorFilter = "all" | 1 | 2 | 3 | 4 | "special";

const FLOOR_OPTIONS: { id: FloorFilter; label: string }[] = [
  { id: "all", label: "All floors" },
  { id: 1, label: "Floor 1" },
  { id: 2, label: "Floor 2" },
  { id: 3, label: "Floor 3" },
  { id: 4, label: "Floor 4" },
  { id: "special", label: "Labs" },
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
  periodNumber: number;
  periodEnd?: string;
  onOpenSchedule: (room: VacantRoom) => void;
}

function RoomCard({
  room,
  periodNumber: _periodNumber,
  periodEnd,
  onOpenSchedule,
}: RoomCardProps) {
  void _periodNumber;
  const [copied, setCopied] = useState(false);
  const consecutive = room.consecutivePeriods ?? 1;
  const isLongSession = consecutive >= 2;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(room.name);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

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
        "group relative flex flex-col justify-between rounded-xl border bg-card p-4 text-left transition-all duration-150 cursor-pointer select-none",
        isLongSession
          ? "border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-sm"
          : "border-border hover:border-foreground/25 hover:shadow-xs",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      <div>
        {/* Top Header: Room code + Copy action */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-mono text-base font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
              {room.shortCode}
            </h3>
            <p className="truncate text-xs font-medium text-muted-foreground mt-0.5">
              {room.buildingLabel}
              {room.floorLabel ? ` · ${room.floorLabel}` : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-md border border-transparent transition-colors",
              "text-muted-foreground opacity-50 group-hover:opacity-100 hover:border-border hover:bg-muted hover:text-foreground",
              copied && "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 opacity-100 dark:text-emerald-400"
            )}
            title={copied ? "Copied to clipboard" : `Copy ${room.name}`}
            aria-label={`Copy ${room.name}`}
          >
            {copied ? (
              <Check className="size-3.5" strokeWidth={2.5} />
            ) : (
              <Copy className="size-3.5" strokeWidth={1.75} />
            )}
          </button>
        </div>

        {/* Room Type Subtitle */}
        <p className="mt-2 text-[11px] text-muted-foreground/80 line-clamp-1">
          {room.roomType}
        </p>
      </div>

      {/* Availability Status Tag (The Hero Decision Indicator) */}
      <div className="mt-4 pt-2.5 border-t border-border/50 flex items-center justify-between text-xs">
        {isLongSession ? (
          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-300">
            <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Free till {room.freeUntilTime}</span>
            <span className="text-[10px] font-mono opacity-80 font-normal">
              ({consecutive} periods)
            </span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 font-mono text-muted-foreground text-[11px]">
            <Clock className="size-3 text-muted-foreground/70 shrink-0" />
            <span>Free this period</span>
            {periodEnd && <span className="opacity-75">· till {periodEnd}</span>}
          </span>
        )}

        <span className="text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 font-medium">
          View schedule →
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

  // Primary mode: "now" (instant answer) vs "plan" (schedule matrix)
  const [activeTab, setActiveTab] = useState<ModeTab>(() =>
    currentCampus.isLiveNow ? "now" : "plan"
  );

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
  const [searchQuery, setSearchQuery] = useState("");

  // Room Inspector Modal
  const [inspectedRoom, setInspectedRoom] = useState<VacantRoom | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSelectSlot = useCallback(
    (day: Weekday, period: number) => {
      setSelectedDay(day);
      setSelectedPeriod(period);
      setResult(getVacantRooms(day, period));
    },
    []
  );

  // When switching to "now", immediately sync with live campus slot
  const handleSwitchToNow = () => {
    setActiveTab("now");
    const campus = getCurrentCampusPeriod();
    handleSelectSlot(campus.day, campus.period);
  };

  const handleSwitchToPlan = () => {
    setActiveTab("plan");
  };

  // Keyboard navigation: / to search, Arrow keys to step periods in plan mode
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

      if (activeTab === "plan") {
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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, selectedDay, selectedPeriod, handleSelectSlot]);

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
    setSearchQuery("");
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

    if (longSessionOnly) {
      list = list.filter((r) => (r.consecutivePeriods ?? 1) >= 2);
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
  }, [result?.rooms, selectedBuilding, selectedFloor, longSessionOnly, searchQuery]);

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
    searchQuery.trim() !== "" ||
    selectedBuilding !== "all" ||
    selectedFloor !== "all" ||
    longSessionOnly;

  // Stats for the current period
  const totalFreeNow = result?.total ?? 0;
  const longSessionCount = useMemo(() => {
    return result?.rooms.filter((r) => (r.consecutivePeriods ?? 1) >= 2).length ?? 0;
  }, [result?.rooms]);

  // Detailed day schedule for inspected room modal
  const roomScheduleTimeline = useMemo(() => {
    if (!inspectedRoom) return [];
    return getAllRoomSchedule(inspectedRoom.name, selectedDay);
  }, [inspectedRoom, selectedDay]);

  return (
    <div className="space-y-6">
      {/* 1. Context Hero: Addresses the Student's Immediate Goal */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <DoorOpen className="size-3.5 text-primary" strokeWidth={1.75} />
                Campus Room Vacancy
              </span>

              {currentCampus.isLiveNow && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live campus time {currentCampus.nowHm} IST
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {activeTab === "now" && currentCampus.isLiveNow ? (
                <span>{totalFreeNow} rooms vacant right now</span>
              ) : activeTab === "now" && !currentCampus.isLiveNow ? (
                <span>
                  {currentCampus.isWeekend
                    ? "Campus weekend study hours"
                    : currentCampus.isBeforeClasses
                    ? "Morning schedule · Classes start at 09:00"
                    : "Classes concluded for today"}
                </span>
              ) : (
                <span>
                  Period {selectedPeriod} ({activePeriodSlot?.start}–{activePeriodSlot?.end}) ·{" "}
                  {weekdays.find((d) => d.id === selectedDay)?.label}
                </span>
              )}
            </h2>

            <p className="text-xs text-muted-foreground sm:text-[13px]">
              {activeTab === "now" && currentCampus.isLiveNow ? (
                <span>
                  Showing active Period {currentCampus.period} ({currentCampus.slotLabel})
                  {currentCampus.minutesLeft ? ` · ${currentCampus.minutesLeft}m remaining` : ""}
                  {longSessionCount > 0
                    ? ` · ${longSessionCount} spots free for 2+ consecutive periods`
                    : ""}
                </span>
              ) : activeTab === "now" && !currentCampus.isLiveNow ? (
                <span>
                  Browse upcoming classroom vacancies or switch to Plan Ahead to inspect any time slot.
                </span>
              ) : (
                <span>
                  Showing all vacant classrooms for {weekdays.find((d) => d.id === selectedDay)?.label},{" "}
                  Period {selectedPeriod}. Click any slot below to change time.
                </span>
              )}
            </p>
          </div>

          {/* Mode Switcher: 2 Clear Journeys (Right Now vs Plan Ahead) */}
          <div className="flex shrink-0 items-center rounded-lg border border-border bg-muted/40 p-1 self-start sm:self-center">
            <button
              type="button"
              onClick={handleSwitchToNow}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer",
                activeTab === "now"
                  ? "bg-card text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Sparkles className="size-3.5 text-primary" />
              <span>Right Now</span>
            </button>

            <button
              type="button"
              onClick={handleSwitchToPlan}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer",
                activeTab === "plan"
                  ? "bg-card text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Calendar className="size-3.5 text-muted-foreground" />
              <span>Plan Ahead</span>
            </button>
          </div>
        </div>

        {/* Plan Ahead Controls: Progressive Disclosure (Only shown when user wants to plan ahead) */}
        {activeTab === "plan" && (
          <div className="mt-5 pt-4 border-t border-border/60 space-y-3.5">
            {/* Day Selector */}
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Select Day
              </span>

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
                        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer shrink-0",
                        isSelected
                          ? "bg-foreground text-background font-semibold"
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
            </div>

            {/* Period Selector Grid with Times */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Campus Periods
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon-xs"
                    onClick={() => handleStepPeriod(-1)}
                    disabled={selectedPeriod <= 1}
                    className="size-6"
                    aria-label="Previous period"
                  >
                    <ChevronLeft className="size-3" />
                  </Button>
                  <span className="font-mono text-xs tabular-nums text-muted-foreground px-1">
                    P{selectedPeriod} of 9
                  </span>
                  <Button
                    variant="outline"
                    size="icon-xs"
                    onClick={() => handleStepPeriod(1)}
                    disabled={selectedPeriod >= 9}
                    className="size-6"
                    aria-label="Next period"
                  >
                    <ChevronRight className="size-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-9">
                {timeSlots.map((slot) => {
                  const isSelected = selectedPeriod === slot.period;
                  const count = result?.periodCounts?.[slot.period] ?? 0;
                  const isLiveSlot =
                    currentCampus.isLiveNow &&
                    currentCampus.day === selectedDay &&
                    currentCampus.period === slot.period;

                  return (
                    <button
                      key={slot.period}
                      type="button"
                      onClick={() => handleSelectSlot(selectedDay, slot.period)}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-lg border p-2 text-center transition-all cursor-pointer",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "border-border bg-background hover:bg-muted text-foreground",
                        isLiveSlot && !isSelected && "border-emerald-500/60 ring-1 ring-emerald-500/30"
                      )}
                    >
                      <span className="font-mono text-xs font-semibold">
                        P{slot.period}
                      </span>
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
                            : "text-muted-foreground"
                        )}
                      >
                        {count} free
                      </span>

                      {slot.isLunch && (
                        <span
                          className={cn(
                            "mt-0.5 inline-flex items-center gap-0.5 text-[8px] uppercase tracking-wider font-medium",
                            isSelected ? "text-primary-foreground/80" : "text-amber-600 dark:text-amber-400"
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
        )}
      </div>

      {/* 2. Campus Building Tabs: Geography-Based (Where am I right now?) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {BUILDING_OPTIONS.map((opt) => {
          const isSelected = selectedBuilding === opt.id;
          const count = result?.buildingCounts?.[opt.id] ?? 0;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedBuilding(opt.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition-all cursor-pointer shrink-0 shadow-2xs select-none",
                isSelected
                  ? "border-foreground bg-foreground text-background font-semibold"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              )}
            >
              {opt.id !== "all" && (
                <BuildingIcon
                  id={opt.id}
                  className={cn("size-3.5", isSelected ? "text-background" : "text-muted-foreground")}
                />
              )}
              <span>{opt.shortLabel}</span>
              <span
                className={cn(
                  "font-mono text-[10px] tabular-nums px-1.5 py-0.5 rounded-full font-semibold",
                  isSelected
                    ? "bg-background/20 text-background"
                    : "bg-muted text-foreground"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Refinement Toolbar: Search, Long Session Toggle & Floor Filter */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
          />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search room code (e.g. EB 204, 302, Lab)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8.5 pr-8 h-9 text-xs"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Clear search"
            >
              <X className="size-3" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 h-4.5 select-none items-center rounded border border-border bg-muted px-1.5 font-mono text-[9px] font-medium text-muted-foreground">
              /
            </kbd>
          )}
        </div>

        {/* Refinements: Long Study Session Toggle + Floor Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Long Study Session Toggle (The student's #1 reassurance against being kicked out) */}
          <button
            type="button"
            onClick={() => setLongSessionOnly((prev) => !prev)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer select-none",
              longSessionOnly
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold shadow-2xs"
                : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
            title="Filter rooms with at least 2 consecutive vacant periods"
          >
            <Hourglass className="size-3" />
            <span>Long study (≥2 periods free)</span>
            {longSessionCount > 0 && (
              <span className="font-mono text-[10px] tabular-nums font-semibold opacity-80">
                ({longSessionCount})
              </span>
            )}
          </button>

          {/* Floor Chips */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {FLOOR_OPTIONS.map((fl) => {
              const isSelected = selectedFloor === fl.id;
              return (
                <button
                  key={String(fl.id)}
                  type="button"
                  onClick={() => setSelectedFloor(fl.id)}
                  className={cn(
                    "rounded-md border px-2 py-1 font-mono text-[10px] transition-colors cursor-pointer select-none",
                    isSelected
                      ? "border-foreground bg-foreground text-background font-medium"
                      : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground"
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
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Filter Results Summary & Quick Guidance */}
      <div className="flex items-center justify-between border-b border-border/60 pb-2 text-xs text-muted-foreground">
        <p>
          Showing <strong className="font-mono text-foreground font-semibold">{filteredRooms.length}</strong>{" "}
          vacant room{filteredRooms.length === 1 ? "" : "s"}
          {selectedBuilding !== "all" ? ` in ${BUILDING_OPTIONS.find((b) => b.id === selectedBuilding)?.shortLabel}` : ""}
          {hasActiveFilters ? ` (filtered from ${result?.total ?? 0})` : ""}
        </p>

        <span className="text-[11px] text-muted-foreground hidden sm:inline">
          Tap any room to view full day schedule
        </span>
      </div>

      {/* 5. Main Room List: Grouped by Building Blocks for spatial clarity */}
      {filteredRooms.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-14 px-4 text-center bg-card/40">
          <DoorOpen
            className="mx-auto mb-3 size-8 text-muted-foreground/50"
            strokeWidth={1.5}
          />
          <h3 className="text-sm font-semibold text-foreground">
            {hasActiveFilters
              ? "No rooms match your filters"
              : `All rooms occupied during Period ${selectedPeriod}`}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
            {hasActiveFilters
              ? "Try resetting the floor filter, duration filter, or search keywords."
              : "Classes are currently scheduled across all campus blocks for this time slot."}
          </p>

          <div className="mt-4 flex items-center justify-center gap-2">
            {hasActiveFilters ? (
              <Button
                variant="outline"
                size="sm"
                onClick={resetAllFilters}
                className="h-8 text-xs"
              >
                Reset all filters
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
      ) : (
        <div className="space-y-8">
          {groupedRooms.map((group) => (
            <section key={group.id} className="space-y-3">
              {/* Section Header: Icon + Building Title + Count */}
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-md border border-border/60 bg-muted/50 text-foreground">
                    <BuildingIcon id={group.id} className="size-3.5" />
                  </div>
                  <h3 className="text-[13px] font-semibold text-foreground tracking-tight">
                    {group.title}
                  </h3>
                </div>

                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {group.rooms.length} available
                </span>
              </div>

              {/* Responsive Room Grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {group.rooms.map((room) => (
                  <RoomCard
                    key={room.name}
                    room={room}
                    periodNumber={selectedPeriod}
                    periodEnd={activePeriodSlot?.end}
                    onOpenSchedule={setInspectedRoom}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* 6. Interactive Room Full Day Schedule Inspector Modal */}
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
                <DialogDescription className="text-xs text-muted-foreground">
                  Full day availability schedule on{" "}
                  <strong className="text-foreground capitalize">{selectedDay}</strong> across all 9 campus periods.
                </DialogDescription>
              </DialogHeader>

              {/* Day Visual Bar Overview */}
              <div className="mt-1 mb-2">
                <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Day timeline</span>
                  <span className="font-mono text-foreground font-medium">
                    {roomScheduleTimeline.filter((s) => s.isFree).length} of 9 periods vacant
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

              {/* Period by Period List */}
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
