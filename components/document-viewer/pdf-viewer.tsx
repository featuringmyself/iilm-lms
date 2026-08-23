"use client";

import { useEffect, useState } from "react";

interface PdfViewerProps {
  publicPath: string;
}

/** Fit page width in Chrome/Safari built-in PDF viewers. */
function pdfSrc(publicPath: string): string {
  const hash = "view=FitH&zoom=page-width";
  const [base, existingHash] = publicPath.split("#");
  return existingHash ? `${base}#${existingHash}&${hash}` : `${base}#${hash}`;
}

export function PdfViewer({ publicPath }: PdfViewerProps) {
  const [viewport, setViewport] = useState<{ width: number; height: number }>();

  useEffect(() => {
    const syncViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    syncViewport();
    window.addEventListener("resize", syncViewport);

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("resize", syncViewport);
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  return (
    <iframe
      src={pdfSrc(publicPath)}
      title="PDF document"
      className="fixed left-0 top-0 border-0 bg-white"
      style={
        viewport
          ? { width: viewport.width, height: viewport.height }
          : undefined
      }
    />
  );
}
