import { notFound } from "next/navigation";

import { CourseContentTabs } from "@/components/course-content-tabs";
import { PageHeader } from "@/components/page-header";
import { getContentTree, getCourse, getSemester } from "@/lib/content";

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
      <CourseContentTabs
        semesterSlug={semester.slug}
        courseSlug={course.slug}
        materials={course.documents}
        notes={course.notes}
        pyq={course.pyq}
      />
    </>
  );
}
