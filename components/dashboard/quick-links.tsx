import Link from "next/link";
import { ArrowUpRight, BookOpen, Calendar, FileStack } from "lucide-react";

import { getCourseTheme } from "@/lib/course-themes";
import type { Course, Semester } from "@/lib/content";
import { cn } from "@/lib/utils";

export interface QuickLinkCourse {
  semester: Semester;
  course: Course;
}

interface QuickLinksProps {
  courses: QuickLinkCourse[];
}

export function QuickLinks({ courses }: QuickLinksProps) {
  return (
    <section>
      <h2 className="mb-3 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        Quick links
      </h2>
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        <Link
          href="/schedule"
          className={cn(
            "group flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5",
            "transition-colors duration-150 hover:border-foreground/20 hover:bg-muted/40",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border/60 bg-background">
            <Calendar
              className="size-3.5 text-foreground/70"
              strokeWidth={1.75}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-foreground">
              Schedule
            </p>
            <p className="truncate font-mono text-[10px] text-muted-foreground">
              Timetable
            </p>
          </div>
          <ArrowUpRight
            className="size-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
            strokeWidth={1.75}
          />
        </Link>

        {courses.map(({ semester, course }) => {
          const theme = getCourseTheme(course.slug);
          const Icon = theme.icon;
          return (
            <Link
              key={`${semester.slug}/${course.slug}`}
              href={`/${semester.slug}/${course.slug}`}
              className={cn(
                "group flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5",
                "transition-colors duration-150 hover:border-foreground/20 hover:bg-muted/40",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
            >
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-md border border-border/50",
                  theme.iconBg
                )}
              >
                <Icon
                  className={cn("size-3.5", theme.iconColor)}
                  strokeWidth={1.75}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-foreground">
                  {course.name}
                </p>
                <p className="truncate font-mono text-[10px] tabular-nums text-muted-foreground">
                  {course.documents.length} material
                  {course.documents.length === 1 ? "" : "s"}
                  {course.notes.length > 0
                    ? ` · ${course.notes.length} note${
                        course.notes.length === 1 ? "" : "s"
                      }`
                    : ""}
                  {course.pyq.length > 0
                    ? ` · ${course.pyq.length} PYQ`
                    : ""}
                </p>
              </div>
              <ArrowUpRight
                className="size-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                strokeWidth={1.75}
              />
            </Link>
          );
        })}

        {courses.length === 0 ? (
          <div className="col-span-full flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2.5 text-[13px] text-muted-foreground">
            <BookOpen className="size-3.5 shrink-0" strokeWidth={1.75} />
            <FileStack className="size-3.5 shrink-0" strokeWidth={1.75} />
            <span>Courses appear here once materials are added.</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
