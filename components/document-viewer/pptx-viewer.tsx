"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface PptxViewerProps {
  publicPath: string;
}

export function PptxViewer({ publicPath }: PptxViewerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bufferRef = useRef<ArrayBuffer | null>(null);
  const readyRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getWidth = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return 320;
    return Math.max(el.clientWidth, 320);
  }, []);

  const renderPreview = useCallback(async (arrayBuffer: ArrayBuffer, width: number) => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";
    const { init } = await import("pptx-preview");
    const previewer = init(containerRef.current, { width });
    await previewer.preview(arrayBuffer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    bufferRef.current = null;
    readyRef.current = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(publicPath);
        if (!response.ok) throw new Error("Failed to load presentation");
        const arrayBuffer = await response.arrayBuffer();
        if (cancelled || !containerRef.current) return;

        bufferRef.current = arrayBuffer;
        await renderPreview(arrayBuffer, getWidth());
        if (!cancelled) {
          readyRef.current = true;
          setError(null);
        }
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
      readyRef.current = false;
    };
  }, [publicPath, getWidth, renderPreview]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let resizeTimer: ReturnType<typeof setTimeout>;
    const observer = new ResizeObserver(() => {
      if (!readyRef.current || !bufferRef.current) return;

      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (readyRef.current && bufferRef.current) {
          void renderPreview(bufferRef.current, getWidth());
        }
      }, 150);
    });

    observer.observe(wrapper);
    return () => {
      clearTimeout(resizeTimer);
      observer.disconnect();
    };
  }, [getWidth, renderPreview]);

  return (
    <div ref={wrapperRef} className="relative w-full p-6">
      {loading ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center gap-4 bg-muted p-8">
          <Skeleton className="aspect-video w-full" />
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
        className={cn("w-full", (loading || error) && "invisible absolute")}
      />
    </div>
  );
}
