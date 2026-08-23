import Link from "next/link";
import { Download, Eye, FileText, Presentation, Upload } from "lucide-react";

import { ShareButton } from "@/components/share-button";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Document } from "@/lib/content";
import { getFileTypeBadge } from "@/lib/course-themes";
import { cn } from "@/lib/utils";

interface DocumentTableProps {
  documents: Document[];
  semesterSlug: string;
  courseSlug: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyHint?: string;
}

function FileIcon({ extension }: { extension: Document["extension"] }) {
  if (extension === "pptx") {
    return (
      <Presentation
        className="size-3.5 text-amber-700 dark:text-neutral-400"
        strokeWidth={1.75}
      />
    );
  }
  if (extension === "docx") {
    return (
      <FileText
        className="size-3.5 text-blue-700 dark:text-neutral-400"
        strokeWidth={1.75}
      />
    );
  }
  return (
    <FileText
      className="size-3.5 text-rose-700 dark:text-neutral-400"
      strokeWidth={1.75}
    />
  );
}

function getMaterialShareUrl(
  doc: Document,
  semesterSlug: string,
  courseSlug: string
): string {
  if (doc.extension === "pdf") {
    return doc.publicPath;
  }

  return `/${semesterSlug}/${courseSlug}/${doc.slug}`;
}

function DocumentActions({
  doc,
  viewHref,
  isPdf,
  semesterSlug,
  courseSlug,
  compact,
}: {
  doc: Document;
  viewHref: string;
  isPdf: boolean;
  semesterSlug: string;
  courseSlug: string;
  compact?: boolean;
}) {
  const shareUrl = getMaterialShareUrl(doc, semesterSlug, courseSlug);

  return (
    <div className={cn("flex items-center gap-0.5", compact ? "justify-end" : "justify-end")}>
      <Button
        variant="ghost"
        size="icon-sm"
        className="size-9 text-muted-foreground hover:text-foreground sm:size-7"
        nativeButton={false}
        render={isPdf ? <a href={viewHref} /> : <Link href={viewHref} />}
      >
        <Eye className="size-3.5" strokeWidth={1.75} />
        <span className="sr-only">View</span>
      </Button>
      <ShareButton url={shareUrl} title={doc.name} />
      <Button
        variant="ghost"
        size="icon-sm"
        className="size-9 text-muted-foreground hover:text-foreground sm:size-7"
        nativeButton={false}
        render={<a href={doc.publicPath} download={doc.fileName} />}
      >
        <Download className="size-3.5" strokeWidth={1.75} />
        <span className="sr-only">Download</span>
      </Button>
      <Button
        variant="outline"
        size="xs"
        className="ml-1 hidden sm:inline-flex"
        nativeButton={false}
        render={isPdf ? <a href={viewHref} /> : <Link href={viewHref} />}
      >
        Open
      </Button>
    </div>
  );
}

export function DocumentTable({
  documents,
  semesterSlug,
  courseSlug,
  emptyTitle = "No materials yet",
  emptyDescription = "Documents will appear here when added to this course folder.",
  emptyHint,
}: DocumentTableProps) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-5 py-14 text-center sm:px-8 sm:py-16">
        <div className="mb-4 flex size-11 items-center justify-center rounded-lg border border-border bg-muted">
          <Upload className="size-4 text-muted-foreground" strokeWidth={1.75} />
        </div>
        <p className="text-[14px] font-medium tracking-tight text-foreground">
          {emptyTitle}
        </p>
        <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
          {emptyDescription}
        </p>
        {emptyHint ? (
          <p className="mt-4 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
            {emptyHint}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <>
      {/* Mobile: stacked cards */}
      <ul className="flex flex-col gap-2 sm:hidden">
        {documents.map((doc) => {
          const badge = getFileTypeBadge(doc.extension);
          const isPdf = doc.extension === "pdf";
          const viewHref = isPdf
            ? doc.publicPath
            : `/${semesterSlug}/${courseSlug}/${doc.slug}`;
          const nameClassName =
            "line-clamp-2 text-[13px] font-medium tracking-tight text-foreground";

          return (
            <li
              key={doc.slug}
              className="rounded-lg border border-border bg-card p-3 transition-colors duration-150 active:bg-muted/40"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted/60">
                  <FileIcon extension={doc.extension} />
                </div>
                <div className="min-w-0 flex-1">
                  {isPdf ? (
                    <a href={viewHref} className={nameClassName} title={doc.name}>
                      {doc.name}
                    </a>
                  ) : (
                    <Link href={viewHref} className={nameClassName} title={doc.name}>
                      {doc.name}
                    </Link>
                  )}
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex h-5 items-center rounded px-1.5 font-mono text-[10px] font-medium",
                        badge.className
                      )}
                    >
                      {badge.label}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                      {doc.size}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-end border-t border-border pt-2">
                <DocumentActions
                  doc={doc}
                  viewHref={viewHref}
                  isPdf={isPdf}
                  semesterSlug={semesterSlug}
                  courseSlug={courseSlug}
                />
              </div>
            </li>
          );
        })}
      </ul>

      {/* Tablet / desktop: table */}
      <div className="hidden overflow-hidden rounded-lg border border-border bg-card sm:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-9 w-10 bg-muted/50 px-3 text-[11px] font-medium tracking-wide text-muted-foreground uppercase" />
                <TableHead className="h-9 bg-muted/50 px-3 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  Name
                </TableHead>
                <TableHead className="hidden h-9 bg-muted/50 px-3 text-[11px] font-medium tracking-wide text-muted-foreground uppercase md:table-cell">
                  Type
                </TableHead>
                <TableHead className="hidden h-9 bg-muted/50 px-3 text-[11px] font-medium tracking-wide text-muted-foreground uppercase lg:table-cell">
                  Size
                </TableHead>
                <TableHead className="h-9 bg-muted/50 px-3 text-right text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => {
                const badge = getFileTypeBadge(doc.extension);
                const isPdf = doc.extension === "pdf";
                const viewHref = isPdf
                  ? doc.publicPath
                  : `/${semesterSlug}/${courseSlug}/${doc.slug}`;

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
                    <TableCell className="max-w-[200px] px-3 py-2.5 md:max-w-md">
                      {isPdf ? (
                        <a
                          href={viewHref}
                          className="line-clamp-2 text-[13px] font-medium tracking-tight text-foreground transition-colors duration-150 hover:text-primary md:line-clamp-1"
                          title={doc.name}
                        >
                          {doc.name}
                        </a>
                      ) : (
                        <Link
                          href={viewHref}
                          className="line-clamp-2 text-[13px] font-medium tracking-tight text-foreground transition-colors duration-150 hover:text-primary md:line-clamp-1"
                          title={doc.name}
                        >
                          {doc.name}
                        </Link>
                      )}
                    </TableCell>
                    <TableCell className="hidden px-3 py-2.5 md:table-cell">
                      <span
                        className={cn(
                          "inline-flex h-5 items-center rounded px-1.5 font-mono text-[10px] font-medium",
                          badge.className
                        )}
                      >
                        {badge.label}
                      </span>
                    </TableCell>
                    <TableCell className="hidden px-3 py-2.5 font-mono text-[12px] tabular-nums text-muted-foreground lg:table-cell">
                      {doc.size}
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-right">
                      <DocumentActions
                        doc={doc}
                        viewHref={viewHref}
                        isPdf={isPdf}
                        semesterSlug={semesterSlug}
                        courseSlug={courseSlug}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
