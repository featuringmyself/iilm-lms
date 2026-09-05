"use client";

import { useCallback, useId, useMemo, useState } from "react";
import { ExternalLink, Wand2 } from "lucide-react";
import posthog from "posthog-js";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  buildCourseAskAiPrompt,
  type AskAiCourseFile,
  type AskAiFileKind,
} from "@/lib/ask-ai-prompt";
import type { Document } from "@/lib/content";
import { cn } from "@/lib/utils";

function toAbsoluteUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const path = url.startsWith("/") ? url : `/${url}`;
  return `${window.location.origin}${path}`;
}

const KIND_LABEL: Record<AskAiFileKind, string> = {
  material: "Material",
  note: "Note",
  lab: "Lab",
  pyq: "PYQ",
};

const KIND_ORDER: AskAiFileKind[] = ["material", "note", "lab", "pyq"];

interface CourseAskAiButtonProps {
  courseName: string;
  semesterName: string;
  semesterSlug: string;
  courseSlug: string;
  materials: Document[];
  notes: Document[];
  labs: Document[];
  pyq: Document[];
  className?: string;
}

interface ListedFile {
  key: string;
  name: string;
  kind: AskAiFileKind;
  publicPath: string;
}

function toListedFiles(
  materials: Document[],
  notes: Document[],
  labs: Document[],
  pyq: Document[]
): ListedFile[] {
  const mapDoc = (doc: Document, kind: AskAiFileKind): ListedFile => ({
    key: `${kind}-${doc.slug}`,
    name: doc.name,
    kind,
    publicPath: doc.publicPath,
  });

  return [
    ...materials.map((doc) => mapDoc(doc, "material")),
    ...notes.map((doc) => mapDoc(doc, "note")),
    ...labs.map((doc) => mapDoc(doc, "lab")),
    ...pyq.map((doc) => mapDoc(doc, "pyq")),
  ];
}

export function CourseAskAiButton({
  courseName,
  semesterName,
  semesterSlug,
  courseSlug,
  materials,
  notes,
  labs,
  pyq,
  className,
}: CourseAskAiButtonProps) {
  const questionId = useId();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");

  const listedFiles = useMemo(
    () => toListedFiles(materials, notes, labs, pyq),
    [materials, notes, labs, pyq]
  );

  const filesByKind = useMemo(() => {
    return KIND_ORDER.map((kind) => ({
      kind,
      label: KIND_LABEL[kind],
      items: listedFiles.filter((file) => file.kind === kind),
    })).filter((group) => group.items.length > 0);
  }, [listedFiles]);

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) {
      setQuestion("");
    }
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = question.trim();
    if (!trimmed) return;

    const files: AskAiCourseFile[] = listedFiles.map((file) => ({
      name: file.name,
      url: toAbsoluteUrl(file.publicPath),
      kind: file.kind,
    }));

    const prompt = buildCourseAskAiPrompt({
      courseName,
      semesterName,
      courseUrl: toAbsoluteUrl(`/${semesterSlug}/${courseSlug}`),
      files,
      question: trimmed,
    });

    posthog.capture("course_ask_ai", {
      course_name: courseName,
    });

    window.open(
      `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
      "_blank",
      "noopener,noreferrer"
    );

    handleOpenChange(false);
  }, [
    question,
    courseName,
    semesterName,
    semesterSlug,
    courseSlug,
    listedFiles,
    handleOpenChange,
  ]);

  const canSubmit = question.trim().length > 0;
  const fileCount = listedFiles.length;

  if (fileCount === 0) return null;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn(
          "h-9 shrink-0 gap-1.5 px-2.5 text-muted-foreground hover:text-foreground sm:h-8",
          className
        )}
        onClick={() => setOpen(true)}
        aria-label={`Ask AI about ${courseName}`}
      >
        <Wand2 className="size-3.5" strokeWidth={1.75} />
        <span className="text-[13px] font-medium sm:hidden">AI</span>
        <span className="hidden text-[13px] font-medium sm:inline">Ask AI</span>
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="gap-5 sm:max-w-md">
          <form
            className="contents"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            <DialogHeader className="gap-1.5 pr-6">
              <DialogTitle className="text-base tracking-tight">
                Ask AI
              </DialogTitle>
              <DialogDescription className="text-[13px] leading-relaxed">
                Opens ChatGPT with your question and links to every file in
                this course.
              </DialogDescription>
            </DialogHeader>

            <div className="min-w-0 space-y-1.5">
              <p className="text-[13px] font-medium text-foreground">Course</p>
              <div className="min-w-0 space-y-0.5">
                <p
                  className="wrap-anywhere text-[13px] leading-snug tracking-tight text-foreground"
                  title={courseName}
                >
                  {courseName}
                </p>
                <p className="text-[12px] leading-relaxed text-muted-foreground">
                  {semesterName}
                  <span className="text-muted-foreground/50"> · </span>
                  {fileCount} file{fileCount === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <div className="min-w-0 space-y-1.5">
              <p className="text-[13px] font-medium text-foreground">
                Files included
              </p>
              {fileCount === 0 ? (
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  No files in this course yet — ChatGPT will still get the
                  course page link.
                </p>
              ) : (
                <div className="max-h-40 overflow-y-auto rounded-md border border-border bg-muted/30 px-2.5 py-2">
                  <ul className="space-y-2.5">
                    {filesByKind.map((group) => (
                      <li key={group.kind} className="min-w-0 space-y-1">
                        <p className="font-mono text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                          {group.label}
                          <span className="text-muted-foreground/50"> · </span>
                          {group.items.length}
                        </p>
                        <ul className="space-y-1">
                          {group.items.map((file) => (
                            <li
                              key={file.key}
                              className="wrap-anywhere text-[12px] leading-snug text-foreground"
                              title={file.name}
                            >
                              {file.name}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor={questionId}
                className="text-[13px] font-medium text-foreground"
              >
                Question
              </label>
              <textarea
                id={questionId}
                value={question}
                autoFocus
                autoComplete="off"
                rows={4}
                enterKeyHint="go"
                placeholder="What should ChatGPT explain across this course?"
                className={cn(
                  "min-h-26 w-full min-w-0 resize-y rounded-md border border-input bg-transparent px-2.5 py-2 text-base leading-relaxed shadow-xs transition-[color,box-shadow] outline-none",
                  "placeholder:text-muted-foreground",
                  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                  "md:text-sm dark:bg-input/30"
                )}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSubmit();
                  }
                }}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 sm:h-9"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 sm:h-9"
                disabled={!canSubmit}
              >
                Open in ChatGPT
                <ExternalLink className="size-3.5" strokeWidth={1.75} />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
