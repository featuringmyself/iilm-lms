"use client";

import { useEffect, useRef, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";

interface PptxViewerProps {
  publicPath: string;
}

const MIN_WIDTH = 320;
/** Ignore height-only layout shifts; only reflow when width moves meaningfully. */
const RESIZE_THRESHOLD_PX = 40;
const RESIZE_DEBOUNCE_MS = 500;

function measureWrapperWidth(el: HTMLElement | null): number {
  if (!el) return MIN_WIDTH;
  return Math.max(el.clientWidth, MIN_WIDTH);
}

export function PptxViewer({ publicPath }: PptxViewerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bufferRef = useRef<ArrayBuffer | null>(null);
  const renderedWidthRef = useRef<number | null>(null);
  const renderingRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    bufferRef.current = null;
    renderedWidthRef.current = null;
    setReady(false);
    setError(null);

    async function waitForLayoutFrame() {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    }

    async function renderIntoContainer(
      arrayBuffer: ArrayBuffer,
      width: number,
    ) {
      const container = containerRef.current;
      if (!container || cancelled) return;

      renderingRef.current = true;
      try {
        container.innerHTML = "";
        const { init } = await import("pptx-preview");
        if (cancelled || !containerRef.current) return;

        const previewer = init(containerRef.current, { width });
        await previewer.preview(arrayBuffer);
        if (!cancelled) {
          renderedWidthRef.current = width;
        }
      } finally {
        renderingRef.current = false;
      }
    }

    async function load() {
      try {
        const response = await fetch(publicPath);
        if (!response.ok) throw new Error("Failed to load presentation");

        const arrayBuffer = await response.arrayBuffer();
        if (cancelled) return;

        bufferRef.current = arrayBuffer;

        // One layout frame so wrapper width is real before first init.
        await waitForLayoutFrame();
        if (cancelled) return;

        const width = measureWrapperWidth(wrapperRef.current);
        await renderIntoContainer(arrayBuffer, width);
        if (cancelled) return;

        setReady(true);
        setError(null);
      } catch {
        if (!cancelled) {
          setError("Unable to preview this presentation.");
          setReady(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [publicPath]);

  // Width-only reflow: never re-init for height changes from slide paint / scroll.
  useEffect(() => {
    if (!ready) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let resizeTimer: ReturnType<typeof setTimeout>;

    const observer = new ResizeObserver(() => {
      if (!bufferRef.current || renderingRef.current) return;
      if (renderedWidthRef.current == null) return;

      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!bufferRef.current || renderingRef.current) return;
        if (renderedWidthRef.current == null) return;

        const nextWidth = measureWrapperWidth(wrapperRef.current);
        if (Math.abs(nextWidth - renderedWidthRef.current) < RESIZE_THRESHOLD_PX) {
          return;
        }

        const buffer = bufferRef.current;
        const container = containerRef.current;
        if (!buffer || !container) return;

        renderingRef.current = true;
        void (async () => {
          try {
            container.innerHTML = "";
            const { init } = await import("pptx-preview");
            if (!containerRef.current || !bufferRef.current) return;
            const previewer = init(containerRef.current, { width: nextWidth });
            await previewer.preview(bufferRef.current);
            renderedWidthRef.current = nextWidth;
          } finally {
            renderingRef.current = false;
          }
        })();
      }, RESIZE_DEBOUNCE_MS);
    });

    observer.observe(wrapper);
    return () => {
      clearTimeout(resizeTimer);
      observer.disconnect();
    };
  }, [ready]);

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
    <div
      ref={wrapperRef}
      className="relative w-full min-h-[min(70vh,720px)] p-3 sm:p-6"
    >
      {/*
        Skeleton stays in-flow until the first successful preview, then unmounts once.
        Container stays mounted (covered while loading) so pptx-preview can paint into a real box.
      */}
      {!ready ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center gap-4 bg-muted p-8">
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="h-4 w-48" />
        </div>
      ) : null}

      <div ref={containerRef} className="w-full" aria-busy={!ready} />
    </div>
  );
}
