import { BookOpen, FileStack, StickyNote } from "lucide-react";

import type { ContentStats } from "@/lib/content";
import { cn } from "@/lib/utils";

interface SlimStatsProps {
  stats: Pick<ContentStats, "courses" | "materials" | "notes">;
}

const items = [
  {
    key: "materials" as const,
    label: "Materials",
    icon: FileStack,
  },
  {
    key: "notes" as const,
    label: "Notes",
    icon: StickyNote,
  },
  {
    key: "courses" as const,
    label: "Courses",
    icon: BookOpen,
  },
];

export function SlimStats({ stats }: SlimStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {items.map(({ key, label, icon: Icon }) => (
        <div
          key={key}
          className={cn(
            "flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5",
            "sm:gap-3 sm:px-4"
          )}
        >
          <Icon
            className="size-3.5 shrink-0 text-muted-foreground"
            strokeWidth={1.75}
          />
          <div className="min-w-0">
            <p className="font-mono text-base font-semibold tabular-nums tracking-tight text-foreground sm:text-lg">
              {stats[key]}
            </p>
            <p className="truncate text-[10px] font-medium tracking-wide text-muted-foreground uppercase sm:text-[11px]">
              {label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
