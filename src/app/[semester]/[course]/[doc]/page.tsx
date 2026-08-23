import { notFound } from "next/navigation";

import { DocumentViewer } from "@/components/document-viewer/document-viewer";
import { ViewerToolbar } from "@/components/document-viewer/viewer-toolbar";
import {
  getAllDocuments,
  getCourse,
  getDocument,
  getSemester,
} from "@/lib/content";

export function generateStaticParams() {
  return getAllDocuments().map(({ semester, course, document }) => ({
    semester: semester.slug,
    course: course.slug,
    doc: document.slug,
  }));
}

export default async function DocumentPage({
  params,
}: PageProps<"/[semester]/[course]/[doc]">) {
  const { semester: semesterSlug, course: courseSlug, doc: docSlug } =
    await params;

  const semester = getSemester(semesterSlug);
  const course = getCourse(semesterSlug, courseSlug);
  const document = getDocument(semesterSlug, courseSlug, docSlug);

  if (!semester || !course || !document) notFound();

  // PDF: zero chrome — full viewport only (no sidebar/header/toolbar)
  if (document.extension === "pdf") {
    return <DocumentViewer document={document} />;
  }

  // DOCX / PPTX: toolbar with breadcrumb + download
  return (
    <div className="flex min-h-svh flex-col">
      <ViewerToolbar
        document={document}
        semesterSlug={semester.slug}
        semesterName={semester.displayName}
        courseSlug={course.slug}
        courseName={course.name}
      />
      <main className="flex-1 bg-muted">
        <DocumentViewer document={document} />
      </main>
    </div>
  );
}
