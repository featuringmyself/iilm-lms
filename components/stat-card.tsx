import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-border bg-card p-3 transition-colors duration-150 sm:p-4",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0 space-y-1.5 sm:space-y-2">
          <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase sm:text-[11px]">
            {label}
          </p>
          <p className="font-mono text-xl font-semibold tracking-tight tabular-nums text-foreground sm:text-2xl">
            {value}
          </p>
        </div>
        <div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted sm:size-8">
          <Icon className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}
