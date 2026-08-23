import { ContentBreadcrumb } from "@/components/content-breadcrumb";
import { DownloadButton } from "@/components/document-viewer/download-button";
import type { Document } from "@/lib/content";

interface ViewerToolbarProps {
  document: Document;
  semesterSlug: string;
  semesterName: string;
  courseSlug: string;
  courseName: string;
}

export function ViewerToolbar({
  document: doc,
  semesterSlug,
  semesterName,
  courseSlug,
  courseName,
}: ViewerToolbarProps) {
  return (
    <header className="sticky top-0 z-30 flex min-h-14 shrink-0 flex-wrap items-center justify-between gap-2 border-b bg-background/95 px-3 py-2 backdrop-blur-sm sm:h-12 sm:min-h-0 sm:flex-nowrap sm:gap-4 sm:px-6 sm:py-0">
      <div className="min-w-0 flex-1 overflow-hidden">
        <ContentBreadcrumb
          segments={[
            { label: "Dashboard", href: "/" },
            { label: semesterName, href: `/${semesterSlug}` },
            { label: courseName, href: `/${semesterSlug}/${courseSlug}` },
            { label: doc.name },
          ]}
        />
      </div>
      <DownloadButton publicPath={doc.publicPath} fileName={doc.fileName} />
    </header>
  );
}
