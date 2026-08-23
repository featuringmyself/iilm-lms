"use client";

import mammoth from "mammoth";
import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";

interface DocxViewerProps {
  publicPath: string;
}

export function DocxViewer({ publicPath }: DocxViewerProps) {
  const [html, setHtml] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(publicPath);
        if (!response.ok) throw new Error("Failed to load document");
        const arrayBuffer = await response.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        if (!cancelled) {
          setHtml(result.value);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to preview this document.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [publicPath]);

  if (loading) {
    return (
      <div className="w-full space-y-4 p-4 sm:p-8">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-medium">{error}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Use the download button to open the file locally.
        </p>
      </div>
    );
  }

  return (
    <article
      className="prose-content w-full max-w-none overflow-x-auto bg-card p-4 shadow-xs ring-1 ring-foreground/10 sm:p-8"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
