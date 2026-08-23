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
    <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:px-6">
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
