import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getCourseTheme } from "@/lib/course-themes";
import type { Course } from "@/lib/content";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  semesterSlug: string;
  className?: string;
}

export function CourseCard({ course, semesterSlug, className }: CourseCardProps) {
  const theme = getCourseTheme(course.slug);
  const Icon = theme.icon;

  const noteCount = course.notes.length;
  const pyqCount = course.pyq.length;
  const fileCount =
    course.documents.length + course.notes.length + course.pyq.length;

  return (
    <Link
      href={`/${semesterSlug}/${course.slug}`}
      className={cn(
        "group flex h-full flex-col rounded-lg border border-border bg-card p-4 transition-all duration-150",
        "hover:border-foreground/20 hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/50",
            theme.iconBg
          )}
        >
          <Icon className={cn("size-5", theme.iconColor)} strokeWidth={1.75} />
        </div>
        <ArrowUpRight
          className="size-3.5 text-muted-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          strokeWidth={1.75}
        />
      </div>

      <h3 className="line-clamp-2 text-[13px] font-medium leading-snug tracking-tight text-foreground">
        {course.name}
      </h3>

      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <p className="font-mono text-[11px] tabular-nums text-muted-foreground lg:block hidden">
          {course.documents.length} material
          {course.documents.length === 1 ? "" : "s"}
          {noteCount > 0 ? (
            <>
              <span className="mx-1.5 text-border">·</span>
              {noteCount} note{noteCount === 1 ? "" : "s"}
            </>
          ) : null}
          {pyqCount > 0 ? (
            <>
              <span className="mx-1.5 text-border">·</span>
              {pyqCount} PYQ
            </>
          ) : null}
        </p>
        {fileCount > 0 ? (
          <span className="inline-flex h-5 items-center rounded bg-muted px-1.5 font-mono text-[10px] font-medium tabular-nums text-muted-foreground">
            {fileCount} file{fileCount === 1 ? "" : "s"}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
