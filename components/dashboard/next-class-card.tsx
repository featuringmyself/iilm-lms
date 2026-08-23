import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { MatchedCourse } from "@/lib/content";
import type { NextClassResult, ResolvedClassTiming } from "@/lib/schedule";
import { cn } from "@/lib/utils";

interface NextClassCardProps {
  next: NextClassResult;
  matched: MatchedCourse | null;
}

function statusLabel(next: NextClassResult): string {
  switch (next.status) {
    case "in_progress":
      return "In progress";
    case "upcoming":
      return "Next up";
    case "later":
      return next.whenLabel ?? "Up next";
    case "no_classes":
      return "No classes";
  }
}

function ClassMeta({ item }: { item: ResolvedClassTiming }) {
  return (
    <dl className="grid gap-2 text-[13px] text-muted-foreground sm:grid-cols-3">
      <div className="flex items-start gap-2">
        <Clock
          className="mt-0.5 size-3.5 shrink-0 text-foreground/60"
          strokeWidth={1.75}
        />
        <div>
          <dt className="sr-only">Time</dt>
          <dd className="font-mono tabular-nums text-foreground">
            {item.label}
          </dd>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <MapPin
          className="mt-0.5 size-3.5 shrink-0 text-foreground/60"
          strokeWidth={1.75}
        />
        <div>
          <dt className="sr-only">Room</dt>
          <dd className="text-foreground">{item.location}</dd>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <UserRound
          className="mt-0.5 size-3.5 shrink-0 text-foreground/60"
          strokeWidth={1.75}
        />
        <div>
          <dt className="sr-only">Teacher</dt>
          <dd className="text-foreground">{item.entry.teachers.join(", ")}</dd>
        </div>
      </div>
    </dl>
  );
}

export function NextClassCard({ next, matched }: NextClassCardProps) {
  const href = matched?.href ?? "/schedule";
  const linkLabel = matched ? "Open course" : "View schedule";
  const dayHint =
    next.status === "later" && next.whenLabel
      ? next.whenLabel
      : next.weekdayLabel;

  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-card p-4 sm:p-5",
        "transition-colors duration-150"
      )}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            {statusLabel(next)}
          </span>
          <span className="text-border">·</span>
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {dayHint}
            <span className="mx-1.5 text-border">·</span>
            {next.nowHm}
          </span>
        </div>
        <Link
          href="/schedule"
          className="inline-flex items-center gap-1 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Full timetable
          <ArrowRight className="size-3" strokeWidth={1.75} />
        </Link>
      </div>

      {next.classItem ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 space-y-3">
            <div>
              <p className="font-mono text-[11px] tabular-nums text-muted-foreground">
                {next.classItem.entry.code}
                {next.classItem.entry.group ? (
                  <>
                    <span className="mx-1.5 text-border">·</span>
                    {next.classItem.entry.group}
                  </>
                ) : null}
              </p>
              <h2 className="mt-0.5 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                {next.classItem.entry.name}
              </h2>
            </div>

            <ClassMeta item={next.classItem} />

            {next.status === "in_progress" && next.upNext ? (
              <div className="border-t border-border pt-3">
                <p className="mb-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  Up next
                </p>
                <p className="text-[13px] text-foreground">
                  <span className="font-medium">{next.upNext.entry.name}</span>
                  <span className="mx-1.5 text-border">·</span>
                  <span className="font-mono tabular-nums text-muted-foreground">
                    {next.upNext.label}
                  </span>
                </p>
              </div>
            ) : null}

            {next.status !== "in_progress" && next.remainingToday.length > 0 ? (
              <p className="text-[12px] text-muted-foreground">
                {next.remainingToday.length} more class
                {next.remainingToday.length === 1 ? "" : "es"} after this
                {next.status === "later" ? ` on ${next.weekdayLabel}` : ""}
              </p>
            ) : null}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-9 w-full shrink-0 sm:h-8 sm:w-auto"
            nativeButton={false}
            render={<Link href={href} />}
          >
            {linkLabel}
            <ArrowRight data-icon="inline-end" strokeWidth={1.75} />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background">
              <Calendar
                className="size-5 text-foreground/65"
                strokeWidth={1.75}
              />
            </div>
            <p className="max-w-xl text-[13px] leading-relaxed text-muted-foreground">
              Nothing on the timetable for this week.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-full shrink-0 sm:h-8 sm:w-auto"
            nativeButton={false}
            render={<Link href="/schedule" />}
          >
            View schedule
            <ArrowRight data-icon="inline-end" strokeWidth={1.75} />
          </Button>
        </div>
      )}
    </section>
  );
}
