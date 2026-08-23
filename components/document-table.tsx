import Link from "next/link";
import { Download, Eye, FileText, Presentation } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Course, Document } from "@/lib/content";
import { getFileTypeBadge } from "@/lib/course-themes";
import { cn } from "@/lib/utils";

interface DocumentTableProps {
  course: Course;
  semesterSlug: string;
}

function FileIcon({ extension }: { extension: Document["extension"] }) {
  if (extension === "pptx") {
    return <Presentation className="size-3.5 text-amber-700 dark:text-neutral-400" strokeWidth={1.75} />;
  }
  if (extension === "docx") {
    return <FileText className="size-3.5 text-blue-700 dark:text-neutral-400" strokeWidth={1.75} />;
  }
  return <FileText className="size-3.5 text-rose-700 dark:text-neutral-400" strokeWidth={1.75} />;
}

export function DocumentTable({ course, semesterSlug }: DocumentTableProps) {
  if (course.documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center">
        <div className="mb-3 flex size-10 items-center justify-center rounded-md border border-border bg-muted">
          <FileText className="size-4 text-muted-foreground" strokeWidth={1.75} />
        </div>
        <p className="text-[13px] font-medium tracking-tight">No materials yet</p>
        <p className="mt-1 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
          Documents will appear here when added to this course folder.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-9 w-10 bg-muted/50 px-3 text-[11px] font-medium tracking-wide text-muted-foreground uppercase" />
            <TableHead className="h-9 bg-muted/50 px-3 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              Name
            </TableHead>
            <TableHead className="hidden h-9 bg-muted/50 px-3 text-[11px] font-medium tracking-wide text-muted-foreground uppercase sm:table-cell">
              Type
            </TableHead>
            <TableHead className="hidden h-9 bg-muted/50 px-3 text-[11px] font-medium tracking-wide text-muted-foreground uppercase md:table-cell">
              Size
            </TableHead>
            <TableHead className="h-9 bg-muted/50 px-3 text-right text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {course.documents.map((doc) => {
            const badge = getFileTypeBadge(doc.extension);
            const isPdf = doc.extension === "pdf";
            // PDFs open via static publicPath so the browser native viewer
            // handles them; DOCX/PPTX stay on the in-app viewer route.
            const viewHref = isPdf
              ? doc.publicPath
              : `/${semesterSlug}/${course.slug}/${doc.slug}`;

            return (
              <TableRow
                key={doc.slug}
                className="transition-colors duration-150 hover:bg-muted/40"
              >
                <TableCell className="px-3 py-2.5">
                  <div className="flex size-7 items-center justify-center rounded-md border border-border bg-muted/60">
                    <FileIcon extension={doc.extension} />
                  </div>
                </TableCell>
                <TableCell className="max-w-[240px] px-3 py-2.5 sm:max-w-md">
                  {isPdf ? (
                    <a
                      href={viewHref}
                      className="line-clamp-2 text-[13px] font-medium tracking-tight text-foreground transition-colors duration-150 hover:text-primary sm:line-clamp-1"
                      title={doc.name}
                    >
                      {doc.name}
                    </a>
                  ) : (
                    <Link
                      href={viewHref}
                      className="line-clamp-2 text-[13px] font-medium tracking-tight text-foreground transition-colors duration-150 hover:text-primary sm:line-clamp-1"
                      title={doc.name}
                    >
                      {doc.name}
                    </Link>
                  )}
                </TableCell>
                <TableCell className="hidden px-3 py-2.5 sm:table-cell">
                  <span
                    className={cn(
                      "inline-flex h-5 items-center rounded px-1.5 font-mono text-[10px] font-medium",
                      badge.className
                    )}
                  >
                    {badge.label}
                  </span>
                </TableCell>
                <TableCell className="hidden px-3 py-2.5 font-mono text-[12px] tabular-nums text-muted-foreground md:table-cell">
                  {doc.size}
                </TableCell>
                <TableCell className="px-3 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="size-7 text-muted-foreground hover:text-foreground"
                      nativeButton={false}
                      render={
                        isPdf ? (
                          <a href={viewHref} />
                        ) : (
                          <Link href={viewHref} />
                        )
                      }
                    >
                      <Eye className="size-3.5" />
                      <span className="sr-only">View</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="size-7 text-muted-foreground hover:text-foreground"
                      nativeButton={false}
                      render={<a href={doc.publicPath} download={doc.fileName} />}
                    >
                      <Download className="size-3.5" />
                      <span className="sr-only">Download</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="xs"
                      className="ml-1 hidden sm:inline-flex"
                      nativeButton={false}
                      render={
                        isPdf ? (
                          <a href={viewHref} />
                        ) : (
                          <Link href={viewHref} />
                        )
                      }
                    >
                      Open
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
