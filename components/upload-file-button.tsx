"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

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
import {
  sanitizeFilename,
  splitFilename,
} from "@/lib/content/sanitize-filename";
import posthog from "posthog-js";

import { cn } from "@/lib/utils";

export type UploadKind = "materials" | "notes";

const NAME_COLLISION_ERROR =
  "A file with this name already exists. Choose a different name.";

/** Ignore dismiss events briefly after the native file picker closes. */
const FILE_PICKER_DISMISS_GUARD_MS = 600;

interface UploadFileButtonProps {
  semesterSlug: string;
  courseSlug: string;
  /** Where the file is stored: course root (materials) or notes/ subfolder. */
  kind?: UploadKind;
  /** Filenames already present in the target folder (materials or notes). */
  existingFileNames?: string[];
  className?: string;
}

const ACCEPT = ".pdf,.pptx,.docx";

export function UploadFileButton({
  semesterSlug,
  courseSlug,
  kind = "materials",
  existingFileNames = [],
  className,
}: UploadFileButtonProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const filenameInputRef = useRef<HTMLInputElement>(null);
  const ignoreCloseUntilRef = useRef(0);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [stem, setStem] = useState("");
  const [extension, setExtension] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetPending() {
    setPendingFile(null);
    setStem("");
    setExtension("");
    setError(null);
  }

  function showNameError(message: string) {
    setError(message);
    requestAnimationFrame(() => filenameInputRef.current?.focus());
  }

  function isNameTaken(name: string): boolean {
    return existingFileNames.includes(name);
  }

  function openRenameDialog() {
    ignoreCloseUntilRef.current = Date.now() + FILE_PICKER_DISMISS_GUARD_MS;
    // Defer until after the native file picker finishes and its dismiss events settle.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setDialogOpen(true);
      });
    });
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const parts = splitFilename(file.name);
    setPendingFile(file);
    setStem(parts.stem);
    setExtension(parts.extension.toLowerCase());
    setError(null);
    openRenameDialog();
  }

  function handleDialogOpenChange(open: boolean) {
    if (uploading) return;
    if (!open && Date.now() < ignoreCloseUntilRef.current) return;
    setDialogOpen(open);
    if (!open) resetPending();
  }

  async function handleConfirmUpload() {
    if (!pendingFile) return;

    const proposedName = `${stem.trim()}${extension}`;
    const safeName = sanitizeFilename(proposedName);

    if (!safeName) {
      showNameError("Invalid filename. Allowed types: .pdf, .pptx, .docx");
      return;
    }

    if (isNameTaken(safeName)) {
      showNameError(NAME_COLLISION_ERROR);
      return;
    }

    setUploading(true);
    setError(null);

    const renamedFile = new File([pendingFile], safeName, {
      type: pendingFile.type,
      lastModified: pendingFile.lastModified,
    });

    const formData = new FormData();
    formData.append("file", renamedFile);
    formData.append("fileName", safeName);
    formData.append("semesterSlug", semesterSlug);
    formData.append("courseSlug", courseSlug);
    formData.append("kind", kind);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { error?: string; success?: boolean };

      if (!response.ok) {
        posthog.capture("file_upload_failed", {
          file_extension: extension,
          file_kind: kind,
          semester_slug: semesterSlug,
          course_slug: courseSlug,
          status_code: response.status,
        });
        if (response.status === 409) {
          showNameError(data.error ?? NAME_COLLISION_ERROR);
        } else {
          showNameError(data.error ?? "Upload failed. Please try again.");
        }
        return;
      }

      posthog.capture("file_uploaded", {
        file_extension: extension,
        file_kind: kind,
        semester_slug: semesterSlug,
        course_slug: courseSlug,
      });
      setDialogOpen(false);
      resetPending();
      router.refresh();
    } catch {
      posthog.capture("file_upload_failed", {
        file_extension: extension,
        file_kind: kind,
        semester_slug: semesterSlug,
        course_slug: courseSlug,
        status_code: 0,
      });
      showNameError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  const label = kind === "notes" ? "Upload note" : "Upload file";
  const previewName = `${stem.trim() || "untitled"}${extension}`;
  const destination =
    kind === "notes" ? "this course's notes" : "this course's materials";

  return (
    <div className={cn("flex flex-col items-stretch gap-1.5 sm:items-end", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        disabled={uploading}
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-10 w-full justify-center sm:h-8 sm:w-auto"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Upload className="size-4" strokeWidth={1.75} />
        )}
        {uploading ? "Uploading…" : label}
      </Button>

      <Dialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        disablePointerDismissal
      >
        <DialogContent
          className="gap-5 sm:max-w-md"
          showCloseButton={!uploading}
        >
          <DialogHeader className="gap-1.5 pr-6">
            <DialogTitle className="text-base tracking-tight">
              Rename before upload
            </DialogTitle>
            <DialogDescription className="text-[13px] leading-relaxed">
              Choose the filename saved to {destination}. The extension cannot
              be changed.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="upload-filename"
              className="text-[13px] font-medium text-foreground"
            >
              File name
            </label>
            <div className="flex min-w-0 items-stretch">
              <Input
                ref={filenameInputRef}
                id="upload-filename"
                value={stem}
                disabled={uploading}
                autoFocus
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="done"
                aria-invalid={error ? true : undefined}
                aria-describedby={
                  error ? "upload-filename-error upload-filename-preview" : "upload-filename-preview"
                }
                className="h-11 rounded-r-none border-r-0 text-base sm:h-9 sm:text-sm"
                onChange={(event) => {
                  setStem(event.target.value);
                  setError(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void handleConfirmUpload();
                  }
                }}
              />
              <span
                className="inline-flex shrink-0 items-center rounded-r-md border border-input bg-muted px-3 font-mono text-[13px] text-muted-foreground sm:text-sm"
                aria-hidden
              >
                {extension || "—"}
              </span>
            </div>
            <p
              id="upload-filename-preview"
              className="truncate font-mono text-[11px] text-muted-foreground"
            >
              Saves as{" "}
              <span className="text-foreground">{previewName}</span>
            </p>
            {error ? (
              <p
                id="upload-filename-error"
                className="text-[12px] text-destructive"
                role="alert"
              >
                {error}
              </p>
            ) : null}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 sm:h-9"
              disabled={uploading}
              onClick={() => handleDialogOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="h-10 sm:h-9"
              disabled={uploading || !stem.trim()}
              onClick={() => void handleConfirmUpload()}
            >
              {uploading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
