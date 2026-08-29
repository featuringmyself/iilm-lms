import { notFound } from "next/navigation";

import { CourseContentTabs } from "@/components/course-content-tabs";
import { PageHeader } from "@/components/page-header";
import {
  getContentTree,
  getCourse,
  getSemester,
  type Document,
} from "@/lib/content";

function CourseFileIndex({
  materials,
  notes,
  pyq,
}: {
  materials: Document[];
  notes: Document[];
  pyq: Document[];
}) {
  const sections = [
    { label: "Materials", docs: materials },
    { label: "Notes", docs: notes },
    { label: "Previous-year questions (PYQ)", docs: pyq },
  ].filter((section) => section.docs.length > 0);

  if (sections.length === 0) return null;

  return (
    <nav aria-label="All course files" className="sr-only">
      {sections.map((section) => (
        <section key={section.label}>
          <h2>{section.label}</h2>
          <ul>
            {section.docs.map((doc) => (
              <li key={doc.publicPath}>
                <a href={doc.publicPath}>{doc.name}</a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}

export async function generateStaticParams() {
  const params: Array<{ semester: string; course: string }> = [];
  const tree = await getContentTree();

  for (const semester of tree.semesters) {
    for (const course of semester.courses) {
      params.push({ semester: semester.slug, course: course.slug });
    }
  }

  return params;
}

export default async function CoursePage({
  params,
}: PageProps<"/[semester]/[course]">) {
  const { semester: semesterSlug, course: courseSlug } = await params;
  const semester = await getSemester(semesterSlug);
  const course = await getCourse(semesterSlug, courseSlug);

  if (!semester || !course) notFound();

  const materialCount = course.documents.length;
  const noteCount = course.notes.length;
  const pyqCount = course.pyq.length;
  const descriptionParts = [
    semester.displayName,
    `${materialCount} material${materialCount === 1 ? "" : "s"}`,
    noteCount > 0
      ? `${noteCount} note${noteCount === 1 ? "" : "s"}`
      : null,
    pyqCount > 0 ? `${pyqCount} PYQ` : null,
  ].filter(Boolean);

  return (
    <>
      <PageHeader
        title={course.name}
        description={descriptionParts.join(" · ")}
      />
      <CourseFileIndex
        materials={course.documents}
        notes={course.notes}
        pyq={course.pyq}
      />
      <CourseContentTabs
        semesterSlug={semester.slug}
        courseSlug={course.slug}
        courseName={course.name}
        semesterName={semester.displayName}
        materials={course.documents}
        notes={course.notes}
        pyq={course.pyq}
      />
    </>
  );
}
