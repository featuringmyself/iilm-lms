"use client";

import { useState } from "react";
import posthog from "posthog-js";

import { DocumentTable } from "@/components/document-table";
import { FileDropZone } from "@/components/file-drop-zone";
import { UploadFileButton } from "@/components/upload-file-button";
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
  materials: Document[];
  notes: Document[];
}

function TabCount({ count }: { count: number }) {
  return (
    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded bg-background px-1.5 font-mono text-[10px] font-medium tabular-nums text-muted-foreground dark:bg-background/40">
      {count}
    </span>
  );
}

export function CourseContentTabs({
  semesterSlug,
  courseSlug,
  materials,
  notes,
}: CourseContentTabsProps) {
  const [tab, setTab] = useState<UploadKind>("materials");
  const [dropError, setDropError] = useState<string | null>(null);

  const existingFileNames =
    tab === "materials"
      ? materials.map((doc) => doc.fileName)
      : notes.map((doc) => doc.fileName);

  const upload = useCourseFileUpload({
    semesterSlug,
    courseSlug,
    kind: tab,
    existingFileNames,
    existingFileNamesByKind: {
      materials: materials.map((doc) => doc.fileName),
      notes: notes.map((doc) => doc.fileName),
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

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => {
        if (value === "materials" || value === "notes") {
          posthog.capture("course_tab_switched", {
            tab: value,
            semester_slug: semesterSlug,
            course_slug: courseSlug,
          });
          setDropError(null);
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
          <TabsTrigger
            value="notes"
            className="h-full flex-1 gap-1.5 px-3 text-[13px] sm:flex-none"
          >
            Notes
            <TabCount count={notes.length} />
          </TabsTrigger>
        </TabsList>

        <UploadFileButton upload={upload} className="w-full sm:w-auto" />
      </div>

      {dropError ? (
        <p className="text-[12px] text-destructive" role="alert">
          {dropError}
        </p>
      ) : null}

      <FileDropZone
        label={tab === "notes" ? "notes" : "materials"}
        disabled={upload.uploading || upload.dialogOpen}
        onDropFiles={handleDropFiles}
      >
        <TabsContent value="materials" className="mt-0 outline-none">
          <DocumentTable
            documents={materials}
            semesterSlug={semesterSlug}
            courseSlug={courseSlug}
            emptyTitle="No materials yet"
            emptyDescription="Drop a file here or use Upload — PDFs, presentations, documents, or images for lectures, readings, and assignments."
            emptyHint="Supported · PDF · PPTX · DOCX · Images"
          />
        </TabsContent>

        <TabsContent value="notes" className="mt-0 outline-none">
          <DocumentTable
            documents={notes}
            semesterSlug={semesterSlug}
            courseSlug={courseSlug}
            emptyTitle="No notes yet"
            emptyDescription="Drop a file here or use Upload — keep personal or class notes separate from course materials."
            emptyHint="Supported · PDF · PPTX · DOCX · Images"
          />
        </TabsContent>
      </FileDropZone>
    </Tabs>
  );
}
