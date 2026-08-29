"use client";

import { useState } from "react";

interface ImageViewerProps {
  publicPath: string;
  name: string;
}

export function ImageViewer({ publicPath, name }: ImageViewerProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-medium">Unable to preview this image.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Use the download button to open the file locally.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center p-4 sm:p-8">
      {/* Native img: files may be local `/content` paths or Vercel Blob URLs of unknown size. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={publicPath}
        alt={name}
        className="max-h-[calc(100svh-7rem)] max-w-full rounded-md object-contain shadow-xs ring-1 ring-foreground/10"
        onError={() => setError(true)}
      />
    </div>
  );
}
