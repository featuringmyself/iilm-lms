import { notFound, redirect } from "next/navigation";

import { DocumentViewer } from "@/components/document-viewer/document-viewer";
import { ViewerToolbar } from "@/components/document-viewer/viewer-toolbar";
import {
  getAllDocuments,
  getCourse,
  getDocument,
  getSemester,
} from "@/lib/content";

export async function generateStaticParams() {
  const docs = await getAllDocuments();
  return docs.map(({ semester, course, document }) => ({
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

  const semester = await getSemester(semesterSlug);
  const course = await getCourse(semesterSlug, courseSlug);
  const document = await getDocument(semesterSlug, courseSlug, docSlug);

  if (!semester || !course || !document) notFound();

  // PDFs: send to static file so the browser native viewer opens full quality
  if (document.extension === "pdf") {
    redirect(document.publicPath);
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
