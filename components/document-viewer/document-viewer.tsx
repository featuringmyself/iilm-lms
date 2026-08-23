import type { Document } from "@/lib/content";

import { DocxViewer } from "./docx-viewer";
import { PptxViewer } from "./pptx-viewer";

interface DocumentViewerProps {
  document: Document;
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  switch (document.extension) {
    case "docx":
      return <DocxViewer publicPath={document.publicPath} />;
    case "pptx":
      return <PptxViewer publicPath={document.publicPath} />;
    default:
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="font-medium">Preview not supported for this file type.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Use the download button to open the file locally.
          </p>
        </div>
      );
  }
}
