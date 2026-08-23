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
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted">
          <Icon className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}
