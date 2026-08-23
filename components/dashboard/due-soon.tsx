"use client";

import Link from "next/link";
import { ArrowRight, Bell, ClipboardList } from "lucide-react";

import { useCompletedHomework } from "@/components/schedule/use-completed-homework";
import type { ScheduleTask } from "@/lib/schedule";
import { formatDueRelative, getDueSoon, getTaskUrgency } from "@/lib/schedule";
import { cn } from "@/lib/utils";

const PREVIEW_LIMIT = 2;

export function DueSoon() {
  const { completed } = useCompletedHomework();
  const items = getDueSoon(PREVIEW_LIMIT, { excludeIds: completed });

  if (items.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          Due soon
        </h2>
        <Link
          href="/schedule"
          className="inline-flex items-center gap-1 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Schedule
          <ArrowRight className="size-3" strokeWidth={1.75} />
        </Link>
      </div>

      <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
        {items.map((task) => (
          <DueSoonRow key={task.id} task={task} />
        ))}
      </ul>
    </section>
  );
}

function DueSoonRow({ task }: { task: ScheduleTask }) {
  const urgency = getTaskUrgency(task);
  const Icon = task.type === "homework" ? ClipboardList : Bell;

  return (
    <li>
      <Link
        href="/schedule"
        className={cn(
          "group flex items-center gap-3 px-3 py-2.5 sm:px-4",
          "transition-colors duration-150 hover:bg-muted/40",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        )}
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background">
          <Icon
            className="size-3.5 text-foreground/65"
            strokeWidth={1.75}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-foreground">
            {task.title}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {task.courseName ?? task.courseCode ?? "General"}
            <span className="mx-1.5 text-border">·</span>
            <span
              className={cn(
                urgency === "overdue" && "text-destructive",
                urgency === "today" && "text-foreground"
              )}
            >
              {formatDueRelative(task)}
            </span>
          </p>
        </div>
        <ArrowRight
          className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
          strokeWidth={1.75}
        />
      </Link>
    </li>
  );
}
