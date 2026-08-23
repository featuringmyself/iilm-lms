"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadFileButtonProps {
  semesterSlug: string;
  courseSlug: string;
  className?: string;
}

const ACCEPT = ".pdf,.pptx,.docx";

export function UploadFileButton({
  semesterSlug,
  courseSlug,
  className,
}: UploadFileButtonProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("semesterSlug", semesterSlug);
    formData.append("courseSlug", courseSlug);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { error?: string; success?: boolean };

      if (!response.ok) {
        setError(data.error ?? "Upload failed. Please try again.");
        return;
      }

      router.refresh();
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={cn("flex flex-col items-end gap-1.5", className)}>
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
        className="h-8"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Upload className="size-4" />
        )}
        {uploading ? "Uploading…" : "Upload file"}
      </Button>
      {error ? (
        <p className="max-w-xs text-right text-[12px] text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
