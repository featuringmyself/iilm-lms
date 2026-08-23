import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  className?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  className,
  iconContainerClassName,
  iconClassName,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-border bg-card p-4 transition-colors duration-150",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
          <p className="font-mono text-2xl font-semibold tracking-tight tabular-nums text-foreground">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background",
            iconContainerClassName
          )}
        >
          <Icon
            className={cn("size-5 text-foreground/65", iconClassName)}
            strokeWidth={1.75}
          />
        </div>
      </div>
    </div>
  );
}
