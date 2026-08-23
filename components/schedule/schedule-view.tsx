"use client";

import {
  Bell,
  BookOpenCheck,
  CalendarDays,
  Check,
  ClipboardList,
} from "lucide-react";

import { useCompletedHomework } from "@/components/schedule/use-completed-homework";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimetableGrid } from "@/components/schedule/timetable-grid";
import type { ScheduleTask } from "@/lib/schedule";
import {
  formatTaskDueDate,
  getNextClass,
  getTaskUrgency,
} from "@/lib/schedule";
import { cn } from "@/lib/utils";


interface ScheduleViewProps {
  homework: ScheduleTask[];
  reminders: ScheduleTask[];
}

function TabCount({ count }: { count: number }) {
  return (
    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded bg-background px-1.5 font-mono text-[10px] font-medium tabular-nums text-muted-foreground dark:bg-background/40">
      {count}
    </span>
  );
}

function urgencyLabel(urgency: ReturnType<typeof getTaskUrgency>): string {
  switch (urgency) {
    case "overdue":
      return "Overdue";
    case "today":
      return "Today";
    case "upcoming":
      return "Upcoming";
  }
}

function EmptyState({
  icon: Icon,
  message,
}: {
  icon: typeof ClipboardList;
  message: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center">
      <Icon
        className="mx-auto mb-2 size-5 text-muted-foreground"
        strokeWidth={1.75}
      />
      <p className="text-[13px] text-muted-foreground">{message}</p>
    </div>
  );
}

function TaskMeta({ task }: { task: ScheduleTask }) {
  const course =
    task.courseName ??
    (task.courseCode ? task.courseCode : null);

  return (
    <p className="truncate text-[11px] text-muted-foreground">
      {course ? (
        <>
          {course}
          {task.courseCode && task.courseName ? (
            <>
              <span className="mx-1.5 text-border">·</span>
              <span className="font-mono tabular-nums">{task.courseCode}</span>
            </>
          ) : null}
          <span className="mx-1.5 text-border">·</span>
        </>
      ) : null}
      <span className="font-mono tabular-nums">
        {formatTaskDueDate(task.dueAt)}
      </span>
    </p>
  );
}

function HomeworkList({ items }: { items: ScheduleTask[] }) {
  const { isCompleted, toggle } = useCompletedHomework();

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        message="No homework assigned right now."
      />
    );
  }

  const open = items.filter((t) => !isCompleted(t.id));
  const done = items.filter((t) => isCompleted(t.id));
  const ordered = [...open, ...done];

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
      {ordered.map((task) => {
        const doneState = isCompleted(task.id);
        const urgency = getTaskUrgency(task);

        return (
          <li
            key={task.id}
            className={cn(
              "flex items-start gap-3 px-3 py-3 sm:px-4",
              doneState && "bg-muted/30 opacity-60"
            )}
          >
            <button
              type="button"
              onClick={() => toggle(task.id)}
              aria-pressed={doneState}
              aria-label={
                doneState
                  ? `Mark “${task.title}” as not done`
                  : `Mark “${task.title}” as done`
              }
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                doneState
                  ? "border-foreground/40 bg-foreground text-background"
                  : "border-border bg-background hover:border-foreground/40"
              )}
            >
              {doneState ? (
                <Check className="size-3" strokeWidth={2.5} />
              ) : null}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={cn(
                    "text-[13px] font-medium text-foreground",
                    doneState && "line-through"
                  )}
                >
                  {task.title}
                </p>
                {!doneState ? (
                  <span
                    className={cn(
                      "inline-flex h-5 items-center rounded px-1.5 text-[10px] font-medium tracking-wide uppercase",
                      urgency === "overdue" &&
                        "bg-destructive/10 text-destructive",
                      urgency === "today" &&
                        "bg-foreground/10 text-foreground",
                      urgency === "upcoming" &&
                        "bg-muted text-muted-foreground"
                    )}
                  >
                    {urgencyLabel(urgency)}
                  </span>
                ) : (
                  <span className="inline-flex h-5 items-center rounded bg-muted px-1.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                    Done
                  </span>
                )}
              </div>
              <TaskMeta task={task} />
              {task.description ? (
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                  {task.description}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function ReminderList({ items }: { items: ScheduleTask[] }) {
  const upcoming = items.filter((t) => getTaskUrgency(t) !== "overdue");
  const past = items.filter((t) => getTaskUrgency(t) === "overdue");

  if (items.length === 0) {
    return (
      <EmptyState icon={Bell} message="No reminders for this semester yet." />
    );
  }

  if (upcoming.length === 0 && past.length > 0) {
    return (
      <EmptyState
        icon={Bell}
        message="No upcoming reminders. Past ones are cleared from this list."
      />
    );
  }

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
      {upcoming.map((task) => {
        const urgency = getTaskUrgency(task);
        return (
          <li key={task.id} className="flex items-start gap-3 px-3 py-3 sm:px-4">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background">
              <Bell
                className="size-3.5 text-foreground/65"
                strokeWidth={1.75}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[13px] font-medium text-foreground">
                  {task.title}
                </p>
                <span
                  className={cn(
                    "inline-flex h-5 items-center rounded px-1.5 text-[10px] font-medium tracking-wide uppercase",
                    urgency === "today"
                      ? "bg-foreground/10 text-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {urgencyLabel(urgency)}
                </span>
              </div>
              <TaskMeta task={task} />
              {task.description ? (
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                  {task.description}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function ScheduleView({ homework, reminders }: ScheduleViewProps) {
  const { completed } = useCompletedHomework();
  const openHomeworkCount = homework.filter((t) => !completed.has(t.id)).length;
  const upcomingReminderCount = reminders.filter(
    (t) => getTaskUrgency(t) !== "overdue"
  ).length;
  const next = getNextClass();
  const highlightNote =
    next.status === "in_progress"
      ? "Now highlighted on the grid"
      : next.classItem
        ? next.status === "later"
          ? `${next.whenLabel} highlighted on the grid`
          : "Next class highlighted on the grid"
        : null;

  return (
    <Tabs defaultValue="timetable" className="gap-4 sm:gap-5">
      <TabsList className="h-10 w-full p-1 sm:h-9 sm:w-auto">
        <TabsTrigger
          value="timetable"
          className="h-full flex-1 gap-1.5 px-3 text-[13px] sm:flex-none"
        >
          <CalendarDays className="size-3.5" strokeWidth={1.75} />
          Timetable
        </TabsTrigger>
        <TabsTrigger
          value="homework"
          className="h-full flex-1 gap-1.5 px-3 text-[13px] sm:flex-none"
        >
          <BookOpenCheck className="size-3.5" strokeWidth={1.75} />
          Homework
          <TabCount count={openHomeworkCount} />
        </TabsTrigger>
        <TabsTrigger
          value="reminders"
          className="h-full flex-1 gap-1.5 px-3 text-[13px] sm:flex-none"
        >
          <Bell className="size-3.5" strokeWidth={1.75} />
          Reminders
          <TabCount count={upcomingReminderCount} />
        </TabsTrigger>
      </TabsList>

      <TabsContent value="timetable" className="mt-0 outline-none">
        {highlightNote ? (
          <p className="mb-3 text-[12px] text-muted-foreground sm:text-[13px]">
            <span className="font-mono tabular-nums text-foreground">
              {next.nowHm}
            </span>
            <span className="mx-1.5 text-border">·</span>
            {highlightNote}
          </p>
        ) : null}
        <TimetableGrid />
      </TabsContent>

      <TabsContent value="homework" className="mt-0 outline-none">
        <div className="mb-3">
          <h2 className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Homework
          </h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Mark items done to grey them out — saved on this device only.
          </p>
        </div>
        <HomeworkList items={homework} />
      </TabsContent>

      <TabsContent value="reminders" className="mt-0 outline-none">
        <div className="mb-3">
          <h2 className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Reminders
          </h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Upcoming notes for labs, quizzes, and deadlines.
          </p>
        </div>
        <ReminderList items={reminders} />
      </TabsContent>
    </Tabs>
  );
}
