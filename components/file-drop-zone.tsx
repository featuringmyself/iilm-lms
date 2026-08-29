"use client";

import { useRef, useState, type DragEvent, type ReactNode } from "react";
import { Upload } from "lucide-react";

import { cn } from "@/lib/utils";

function isFileDrag(event: DragEvent): boolean {
  return Array.from(event.dataTransfer.types).includes("Files");
}

interface FileDropZoneProps {
  children: ReactNode;
  disabled?: boolean;
  /** Shown in the overlay, e.g. "materials" or "notes". */
  label: string;
  onDropFiles: (files: FileList) => void;
  className?: string;
}

/**
 * Drop target for file uploads. Uses an enter/leave depth counter so nested
 * children don't flicker the active state.
 */
export function FileDropZone({
  children,
  disabled = false,
  label,
  onDropFiles,
  className,
}: FileDropZoneProps) {
  const depthRef = useRef(0);
  const [active, setActive] = useState(false);

  function clear() {
    depthRef.current = 0;
    setActive(false);
  }

  function handleDragEnter(event: DragEvent<HTMLDivElement>) {
    if (disabled || !isFileDrag(event)) return;
    event.preventDefault();
    event.stopPropagation();
    depthRef.current += 1;
    if (depthRef.current === 1) setActive(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    if (disabled || !isFileDrag(event)) return;
    event.preventDefault();
    event.stopPropagation();
    depthRef.current = Math.max(0, depthRef.current - 1);
    if (depthRef.current === 0) setActive(false);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    if (disabled || !isFileDrag(event)) return;
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    if (disabled || !isFileDrag(event)) return;
    event.preventDefault();
    event.stopPropagation();
    clear();
    if (event.dataTransfer.files.length > 0) {
      onDropFiles(event.dataTransfer.files);
    }
  }

  return (
    <div
      className={cn("relative", className)}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-drop-active={active ? "true" : undefined}
    >
      {children}
      {active ? (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-lg border-2 border-dashed border-primary bg-background/85 backdrop-blur-[2px]"
          aria-hidden
        >
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <div className="flex size-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
              <Upload className="size-4 text-primary" strokeWidth={1.75} />
            </div>
            <p className="text-[14px] font-medium tracking-tight text-foreground">
              Drop to upload to {label}
            </p>
            <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
              PDF · PPTX · DOCX · Images
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
