import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getCourseTheme, getFileTypeBadge } from "@/lib/course-themes";
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

  const typeCounts = course.documents.reduce<Record<string, number>>((acc, doc) => {
    acc[doc.extension] = (acc[doc.extension] ?? 0) + 1;
    return acc;
  }, {});

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
            "flex size-9 shrink-0 items-center justify-center rounded-md border border-transparent",
            theme.iconBg
          )}
        >
          <Icon className={cn("size-4", theme.iconColor)} strokeWidth={1.75} />
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
        <p className="font-mono text-[11px] tabular-nums text-muted-foreground">
          {course.documents.length} material
          {course.documents.length === 1 ? "" : "s"}
        </p>
        {Object.keys(typeCounts).length > 0 ? (
          <div className="flex flex-wrap justify-end gap-1">
            {Object.entries(typeCounts).map(([ext, count]) => {
              const badge = getFileTypeBadge(ext);
              return (
                <span
                  key={ext}
                  className={cn(
                    "inline-flex h-5 items-center rounded px-1.5 font-mono text-[10px] font-medium tabular-nums",
                    badge.className
                  )}
                >
                  {count} {badge.label}
                </span>
              );
            })}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
