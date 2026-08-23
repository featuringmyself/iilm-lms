import Link from "next/link";
import { ArrowRight, FileText, StickyNote } from "lucide-react";

import { getFileTypeBadge } from "@/lib/course-themes";
import type { Course, Document, Semester } from "@/lib/content";
import { cn } from "@/lib/utils";

export interface MaterialItem {
  semester: Semester;
  course: Course;
  document: Document;
}

interface RecentMaterialsProps {
  materials: MaterialItem[];
  notesCount: number;
}

function materialHref(
  semesterSlug: string,
  courseSlug: string,
  doc: Document
): string {
  if (doc.extension === "pdf") return doc.publicPath;
  return `/${semesterSlug}/${courseSlug}/${doc.slug}`;
}

export function RecentMaterials({
  materials,
  notesCount,
}: RecentMaterialsProps) {
  return (
    <section>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          Available materials
        </h2>
        {notesCount > 0 ? (
          <p className="inline-flex items-center gap-1.5 font-mono text-[11px] tabular-nums text-muted-foreground">
            <StickyNote className="size-3" strokeWidth={1.75} />
            {notesCount} note{notesCount === 1 ? "" : "s"} in course folders
          </p>
        ) : null}
      </div>

      {materials.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center">
          <FileText
            className="mx-auto mb-2 size-5 text-muted-foreground"
            strokeWidth={1.75}
          />
          <p className="text-[13px] text-muted-foreground">
            No materials uploaded yet.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          {materials.map(({ semester, course, document }) => {
            const badge = getFileTypeBadge(document.extension);
            const href = materialHref(
              semester.slug,
              course.slug,
              document
            );

            return (
              <li key={`${semester.slug}/${course.slug}/${document.slug}`}>
                <Link
                  href={href}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 sm:px-4",
                    "transition-colors duration-150 hover:bg-muted/40",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-5 shrink-0 items-center rounded px-1.5 font-mono text-[10px] font-medium",
                      badge.className
                    )}
                  >
                    {badge.label}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-foreground">
                      {document.name}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {course.name}
                      <span className="mx-1.5 text-border">·</span>
                      <span className="font-mono tabular-nums">
                        {document.size}
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
          })}
        </ul>
      )}
    </section>
  );
}
