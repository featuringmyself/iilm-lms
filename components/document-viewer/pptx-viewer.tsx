"use client";

import { useEffect, useRef, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface PptxViewerProps {
  publicPath: string;
}

export function PptxViewer({ publicPath }: PptxViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(publicPath);
        if (!response.ok) throw new Error("Failed to load presentation");
        const arrayBuffer = await response.arrayBuffer();

        const { init } = await import("pptx-preview");
        if (cancelled || !containerRef.current) return;

        containerRef.current.innerHTML = "";
        const width = Math.min(
          Math.max(containerRef.current.clientWidth - 32, 320),
          960
        );
        const previewer = init(containerRef.current, { width });
        await previewer.preview(arrayBuffer);
        if (!cancelled) setError(null);
      } catch {
        if (!cancelled) {
          setError("Unable to preview this presentation.");
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

  return (
    <div className="relative flex min-h-[50vh] justify-center p-6">
      {loading ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center gap-4 bg-muted p-8">
          <Skeleton className="aspect-video w-full max-w-4xl" />
          <Skeleton className="h-4 w-48" />
        </div>
      ) : null}

      {error && !loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="font-medium">{error}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Use the download button to open the file locally.
          </p>
        </div>
      ) : null}

      <div
        ref={containerRef}
        className={cn(
          "w-full max-w-5xl",
          (loading || error) && "invisible absolute"
        )}
      />
    </div>
  );
}
