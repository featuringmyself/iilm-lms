"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";

import {
  sanitizeFilename,
  splitFilename,
} from "@/lib/content/sanitize-filename";
import {
  ALLOWED_TYPES_LABEL,
  SUPPORTED_EXTENSIONS,
} from "@/lib/content/supported-extensions";

export type UploadKind = "materials" | "notes";

export const NAME_COLLISION_ERROR =
  "A file with this name already exists. Choose a different name.";

/** Ignore dismiss events briefly after the native file picker closes. */
const FILE_PICKER_DISMISS_GUARD_MS = 600;

function extensionOf(filename: string): string {
  const base = filename.replace(/^.*[/\\]/, "");
  const dot = base.lastIndexOf(".");
  if (dot <= 0) return "";
  return base.slice(dot + 1).toLowerCase();
}

export function isSupportedUploadFile(file: File): boolean {
  return SUPPORTED_EXTENSIONS.has(extensionOf(file.name));
}

/** First supported file from a FileList / File array, or null. */
export function pickSupportedUploadFile(
  files: FileList | File[] | null | undefined
): File | null {
  if (!files || files.length === 0) return null;
  for (const file of Array.from(files)) {
    if (isSupportedUploadFile(file)) return file;
  }
  return null;
}

interface UseCourseFileUploadOptions {
  semesterSlug: string;
  courseSlug: string;
  kind?: UploadKind;
  /** Filenames already present in the active folder (materials or notes). */
  existingFileNames?: string[];
  /** Optional map used when destination is frozen after offer. */
  existingFileNamesByKind?: Record<UploadKind, string[]>;
}

export function useCourseFileUpload({
  semesterSlug,
  courseSlug,
  kind = "materials",
  existingFileNames = [],
  existingFileNamesByKind,
}: UseCourseFileUploadOptions) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const filenameInputRef = useRef<HTMLInputElement>(null);
  const ignoreCloseUntilRef = useRef(0);

  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingKind, setPendingKind] = useState<UploadKind>(kind);
  const [stem, setStem] = useState("");
  const [extension, setExtension] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPending = useCallback(() => {
    setPendingFile(null);
    setPendingKind(kind);
    setStem("");
    setExtension("");
    setError(null);
  }, [kind]);

  const showNameError = useCallback((message: string) => {
    setError(message);
    requestAnimationFrame(() => filenameInputRef.current?.focus());
  }, []);

  const offerFile = useCallback(
    (file: File, options?: { fromPicker?: boolean }) => {
      if (uploading) return;

      const parts = splitFilename(file.name);
      setPendingFile(file);
      setPendingKind(kind);
      setStem(parts.stem);
      setExtension(parts.extension.toLowerCase());
      setError(null);

      if (options?.fromPicker) {
        ignoreCloseUntilRef.current = Date.now() + FILE_PICKER_DISMISS_GUARD_MS;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setDialogOpen(true));
        });
      } else {
        setDialogOpen(true);
      }
    },
    [kind, uploading]
  );

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    offerFile(file, { fromPicker: true });
  }

  function handleDialogOpenChange(open: boolean) {
    if (uploading) return;
    if (!open && Date.now() < ignoreCloseUntilRef.current) return;
    setDialogOpen(open);
    if (!open) resetPending();
  }

  async function handleConfirmUpload() {
    if (!pendingFile) return;

    const uploadKind = pendingKind;
    const proposedName = `${stem.trim()}${extension}`;
    const safeName = sanitizeFilename(proposedName);

    if (!safeName) {
      showNameError(`Invalid filename. Allowed types: ${ALLOWED_TYPES_LABEL}`);
      return;
    }

    const namesForKind =
      existingFileNamesByKind?.[uploadKind] ?? existingFileNames;
    if (namesForKind.includes(safeName)) {
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
    formData.append("kind", uploadKind);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as {
        error?: string;
        success?: boolean;
      };

      if (!response.ok) {
        posthog.capture("file_upload_failed", {
          file_extension: extension,
          file_kind: uploadKind,
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
        file_kind: uploadKind,
        semester_slug: semesterSlug,
        course_slug: courseSlug,
      });
      setDialogOpen(false);
      resetPending();
      router.refresh();
    } catch {
      posthog.capture("file_upload_failed", {
        file_extension: extension,
        file_kind: uploadKind,
        semester_slug: semesterSlug,
        course_slug: courseSlug,
        status_code: 0,
      });
      showNameError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  const previewName = `${stem.trim() || "untitled"}${extension}`;
  const activeKind = dialogOpen ? pendingKind : kind;
  const destination =
    activeKind === "notes" ? "this course's notes" : "this course's materials";
  const label = kind === "notes" ? "Upload note" : "Upload file";

  return {
    inputRef,
    filenameInputRef,
    pendingFile,
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
    offerFile,
    openPicker: () => inputRef.current?.click(),
    handleFileChange,
    handleDialogOpenChange,
    handleConfirmUpload,
  };
}
