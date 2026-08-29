"use client";

import { useCallback, useId, useState } from "react";
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
                Opens ChatGPT with your question and links to this material.
              </DialogDescription>
            </DialogHeader>

            <div className="min-w-0 space-y-1.5">
              <p className="text-[13px] font-medium text-foreground">File</p>
              <div className="min-w-0 space-y-0.5">
                <p
                  className="wrap-anywhere text-[13px] leading-snug tracking-tight text-foreground"
                  title={documentName}
                >
                  {documentName}
                </p>
                <p className="text-[12px] leading-relaxed text-muted-foreground">
                  {courseName}
                  <span className="text-muted-foreground/50"> · </span>
                  {semesterName}
                </p>
              </div>
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
                placeholder="What should ChatGPT explain or summarize?"
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
