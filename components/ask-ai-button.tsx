"use client";

import { useCallback, useId, useState } from "react";
import { ExternalLink, FileText, Wand2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { buildAskAiPrompt } from "@/lib/ask-ai-prompt";
import { cn } from "@/lib/utils";

function toAbsoluteUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const path = url.startsWith("/") ? url : `/${url}`;
  return `${window.location.origin}${path}`;
}

interface AskAiButtonProps {
  documentName: string;
  fileUrl: string;
  courseName: string;
  semesterName: string;
  semesterSlug: string;
  courseSlug: string;
  className?: string;
}

export function AskAiButton({
  documentName,
  fileUrl,
  courseName,
  semesterName,
  semesterSlug,
  courseSlug,
  className,
}: AskAiButtonProps) {
  const questionId = useId();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) {
      setQuestion("");
    }
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = question.trim();
    if (!trimmed) return;

    const prompt = buildAskAiPrompt({
      fileName: documentName,
      fileUrl: toAbsoluteUrl(fileUrl),
      courseName,
      semesterName,
      courseUrl: toAbsoluteUrl(`/${semesterSlug}/${courseSlug}`),
      question: trimmed,
    });

    posthog.capture("document_ask_ai", {
      document_title: documentName,
    });

    window.open(
      `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
      "_blank",
      "noopener,noreferrer"
    );

    handleOpenChange(false);
  }, [
    question,
    documentName,
    fileUrl,
    courseName,
    semesterName,
    semesterSlug,
    courseSlug,
    handleOpenChange,
  ]);

  const canSubmit = question.trim().length > 0;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="xs"
        className={cn(
          "ml-1 h-8 gap-1.5 px-2.5 text-muted-foreground hover:text-foreground sm:h-6 sm:px-2",
          className
        )}
        onClick={() => setOpen(true)}
        aria-label={`Ask AI about ${documentName}`}
      >
        <Wand2 className="size-3.5 sm:size-3" strokeWidth={1.75} />
        Ask AI
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="gap-5 sm:max-w-md">
          <DialogHeader className="gap-1.5 pr-6">
            <DialogTitle className="text-base tracking-tight">
              Ask AI
            </DialogTitle>
            <DialogDescription className="text-[13px] leading-relaxed">
              Type a question about this material. We open ChatGPT in a new tab
              with the file and course library linked so answers stay grounded.
            </DialogDescription>
          </DialogHeader>

          <div
            className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/40 px-3 py-2.5"
            aria-label="File context"
          >
            <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-background">
              <FileText
                className="size-3.5 text-muted-foreground"
                strokeWidth={1.75}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="truncate text-[13px] font-medium tracking-tight text-foreground"
                title={documentName}
              >
                {documentName}
              </p>
              <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                {courseName}
                <span className="text-muted-foreground/60"> · </span>
                {semesterName}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor={questionId}
              className="text-[13px] font-medium text-foreground"
            >
              Your question
            </label>
            <Input
              id={questionId}
              value={question}
              autoFocus
              autoComplete="off"
              enterKeyHint="go"
              placeholder="e.g. Explain the main idea in simple terms"
              className="h-11 text-base sm:h-9 sm:text-sm"
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Tip: ask for a summary, definitions, or a step-by-step walkthrough.
            </p>
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
              type="button"
              className="h-10 sm:h-9"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              Open in ChatGPT
              <ExternalLink className="size-3.5" strokeWidth={1.75} />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
