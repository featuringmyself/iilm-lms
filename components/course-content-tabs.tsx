"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import posthog from "posthog-js";

import { CourseAskAiButton } from "@/components/course-ask-ai-button";
import { DocumentTable } from "@/components/document-table";
import { FileDropZone } from "@/components/file-drop-zone";
// import { UploadFileButton } from "@/components/upload-file-button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  pickSupportedUploadFile,
  useCourseFileUpload,
  type UploadKind,
} from "@/hooks/use-course-file-upload";
import type { Document } from "@/lib/content";
import { ALLOWED_TYPES_LABEL } from "@/lib/content/supported-extensions";

interface CourseContentTabsProps {
  semesterSlug: string;
  courseSlug: string;
  courseName: string;
  semesterName: string;
  materials: Document[];
  notes: Document[];
  pyq: Document[];
}

const TAB_DROP_LABEL: Record<UploadKind, string> = {
  materials: "materials",
  notes: "notes",
  pyq: "PYQ",
};

function TabCount({ count }: { count: number }) {
  return (
    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded bg-background px-1.5 font-mono text-[10px] font-medium tabular-nums text-muted-foreground dark:bg-background/40">
      {count}
    </span>
  );
}

function isUploadKind(value: string): value is UploadKind {
  return value === "materials" || value === "notes" || value === "pyq";
}

function matchesQuery(doc: Document, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    doc.name.toLowerCase().includes(q) ||
    doc.fileName.toLowerCase().includes(q) ||
    doc.extension.toLowerCase().includes(q)
  );
}

export function CourseContentTabs({
  semesterSlug,
  courseSlug,
  courseName,
  semesterName,
  materials,
  notes,
  pyq,
}: CourseContentTabsProps) {
  const [tab, setTab] = useState<UploadKind>("materials");
  const [dropError, setDropError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const showNotes = notes.length > 0;
  const showPyq = pyq.length > 0;
  const hasCourseFiles =
    materials.length + notes.length + pyq.length > 0;

  const filesByKind: Record<UploadKind, Document[]> = {
    materials,
    notes,
    pyq,
  };

  const existingFileNames = filesByKind[tab].map((doc) => doc.fileName);
  const activeDocs = filesByKind[tab];
  const filteredDocs = activeDocs.filter((doc) => matchesQuery(doc, query));
  const hasFiles = activeDocs.length > 0;
  const hasQuery = query.trim().length > 0;

  const upload = useCourseFileUpload({
    semesterSlug,
    courseSlug,
    kind: tab,
    existingFileNames,
    existingFileNamesByKind: {
      materials: materials.map((doc) => doc.fileName),
      notes: notes.map((doc) => doc.fileName),
      pyq: pyq.map((doc) => doc.fileName),
    },
  });

  function handleDropFiles(files: FileList) {
    const file = pickSupportedUploadFile(files);
    if (!file) {
      setDropError(`Unsupported file type. Allowed: ${ALLOWED_TYPES_LABEL}`);
      return;
    }
    setDropError(null);
    upload.offerFile(file);
  }

  const askAiProps = {
    courseName,
    semesterName,
    semesterSlug,
    courseSlug,
    materials,
    notes,
    pyq,
  } as const;

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <Tabs
        value={tab}
        onValueChange={(value) => {
          if (isUploadKind(value)) {
            posthog.capture("course_tab_switched", {
              tab: value,
              semester_slug: semesterSlug,
              course_slug: courseSlug,
            });
            setDropError(null);
            setQuery("");
            setTab(value);
          }
        }}
        className="gap-4 sm:gap-5"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <TabsList className="h-10 w-full p-1 sm:h-9 sm:w-auto">
            <TabsTrigger
              value="materials"
              className="h-full flex-1 gap-1.5 px-3 text-[13px] sm:flex-none"
            >
              Materials
              <TabCount count={materials.length} />
            </TabsTrigger>
            {showNotes ? (
              <TabsTrigger
                value="notes"
                className="h-full flex-1 gap-1.5 px-3 text-[13px] sm:flex-none"
              >
                Notes
                <TabCount count={notes.length} />
              </TabsTrigger>
            ) : null}
            {showPyq ? (
              <TabsTrigger
                value="pyq"
                className="h-full flex-1 gap-1.5 px-3 text-[13px] sm:flex-none"
              >
                PYQ
                <TabCount count={pyq.length} />
              </TabsTrigger>
            ) : null}
          </TabsList>

          <div className="flex w-full items-center justify-end gap-1.5 sm:w-auto sm:gap-2">
            {hasFiles ? (
              <div className="relative min-w-0 flex-1 sm:w-52 sm:flex-none">
                <Search
                  className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
                  strokeWidth={1.75}
                />
                <Input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search files…"
                  aria-label="Search files"
                  className="h-9 pl-8 pr-8 text-[13px]"
                />
                {hasQuery ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute top-1/2 right-2 flex size-5 -translate-y-1/2 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="size-3.5" strokeWidth={1.75} />
                  </button>
                ) : null}
              </div>
            ) : null}
            {hasCourseFiles ? (
              <CourseAskAiButton {...askAiProps} className="shrink-0" />
            ) : null}
            {/* <UploadFileButton
              upload={upload}
              className="shrink-0"
            /> */}
          </div>
        </div>

        {dropError ? (
          <p className="text-[12px] text-destructive" role="alert">
            {dropError}
          </p>
        ) : null}

        <FileDropZone
          label={TAB_DROP_LABEL[tab]}
          disabled={upload.uploading || upload.dialogOpen}
          onDropFiles={handleDropFiles}
        >
          <TabsContent value="materials" className="mt-0 outline-none">
            <DocumentTable
              documents={tab === "materials" ? filteredDocs : materials}
              semesterSlug={semesterSlug}
              courseSlug={courseSlug}
              courseName={courseName}
              semesterName={semesterName}
              emptyTitle="No materials yet"
              emptyDescription="Drop a file here or use Upload — PDFs, presentations, documents, or images for lectures, readings, and assignments."
              emptyHint="Supported · PDF · PPTX · DOCX · Images"
              filterQuery={tab === "materials" ? query : undefined}
            />
          </TabsContent>

          {showNotes ? (
            <TabsContent value="notes" className="mt-0 outline-none">
              <DocumentTable
                documents={tab === "notes" ? filteredDocs : notes}
                semesterSlug={semesterSlug}
                courseSlug={courseSlug}
                courseName={courseName}
                semesterName={semesterName}
                emptyTitle="No notes yet"
                emptyDescription="Drop a file here or use Upload — keep personal or class notes separate from course materials."
                emptyHint="Supported · PDF · PPTX · DOCX · Images"
                filterQuery={tab === "notes" ? query : undefined}
              />
            </TabsContent>
          ) : null}

          {showPyq ? (
            <TabsContent value="pyq" className="mt-0 outline-none">
              <DocumentTable
                documents={tab === "pyq" ? filteredDocs : pyq}
                semesterSlug={semesterSlug}
                courseSlug={courseSlug}
                courseName={courseName}
                semesterName={semesterName}
                emptyTitle="No PYQ yet"
                emptyDescription="Drop a file here or use Upload — previous year questions and midterms stay separate from materials and notes."
                emptyHint="Supported · PDF · PPTX · DOCX · Images"
                filterQuery={tab === "pyq" ? query : undefined}
              />
            </TabsContent>
          ) : null}
        </FileDropZone>
      </Tabs>
    </div>
  );
}
