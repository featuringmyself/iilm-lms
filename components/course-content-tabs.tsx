"use client";

import { useState } from "react";

import { DocumentTable } from "@/components/document-table";
import { UploadFileButton, type UploadKind } from "@/components/upload-file-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Document } from "@/lib/content";

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

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => {
        if (value === "materials" || value === "notes") setTab(value);
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

        <UploadFileButton
          semesterSlug={semesterSlug}
          courseSlug={courseSlug}
          kind={tab}
          existingFileNames={
            tab === "materials"
              ? materials.map((doc) => doc.fileName)
              : notes.map((doc) => doc.fileName)
          }
          className="w-full sm:w-auto"
        />
      </div>

      <TabsContent value="materials" className="mt-0 outline-none">
        <DocumentTable
          documents={materials}
          semesterSlug={semesterSlug}
          courseSlug={courseSlug}
          emptyTitle="No materials yet"
          emptyDescription="Upload PDFs, PPTX, or DOCX files for lectures, readings, and assignments."
          emptyHint="Supported · PDF · PPTX · DOCX"
        />
      </TabsContent>

      <TabsContent value="notes" className="mt-0 outline-none">
        <DocumentTable
          documents={notes}
          semesterSlug={semesterSlug}
          courseSlug={courseSlug}
          emptyTitle="No notes yet"
          emptyDescription="Keep personal or class notes here, separate from course materials."
          emptyHint="Supported · PDF · PPTX · DOCX"
        />
      </TabsContent>
    </Tabs>
  );
}
