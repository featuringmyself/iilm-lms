"use client";

import { Loader2, Upload } from "lucide-react";

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
import { ACCEPT_FILE_TYPES } from "@/lib/content/supported-extensions";
import { cn } from "@/lib/utils";
import {
  useCourseFileUpload,
  type UploadKind,
} from "@/hooks/use-course-file-upload";

export type { UploadKind };
export type CourseFileUpload = ReturnType<typeof useCourseFileUpload>;

interface UploadFileButtonProps {
  upload: CourseFileUpload;
  className?: string;
}

export function UploadFileButton({ upload, className }: UploadFileButtonProps) {
  const {
    inputRef,
    filenameInputRef,
    stem,
    setStem,
    extension,
    dialogOpen,
    uploading,
    error,
    setError,
    previewName,
    destination,
    label,
    openPicker,
    handleFileChange,
    handleDialogOpenChange,
    handleConfirmUpload,
  } = upload;

  return (
    <div className={cn("flex flex-col items-stretch gap-1.5 sm:items-end", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_FILE_TYPES}
        className="sr-only"
        disabled={uploading}
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="size-9 shrink-0 justify-center px-0 sm:h-8 sm:w-auto sm:gap-1.5 sm:px-2.5"
        disabled={uploading}
        onClick={openPicker}
        aria-label={uploading ? "Uploading…" : label}
      >
        {uploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Upload className="size-4" strokeWidth={1.75} />
        )}
        <span className="hidden sm:inline">
          {uploading ? "Uploading…" : label}
        </span>
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
                  error
                    ? "upload-filename-error upload-filename-preview"
                    : "upload-filename-preview"
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
