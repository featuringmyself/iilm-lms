import { notFound } from "next/navigation";

import { CourseContentTabs } from "@/components/course-content-tabs";
import { PageHeader } from "@/components/page-header";
import { getContentTree, getCourse, getSemester } from "@/lib/content";

export function generateStaticParams() {
  const params: Array<{ semester: string; course: string }> = [];

  for (const semester of getContentTree().semesters) {
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
  const semester = getSemester(semesterSlug);
  const course = getCourse(semesterSlug, courseSlug);

  if (!semester || !course) notFound();

  const materialCount = course.documents.length;
  const noteCount = course.notes.length;
  const materialLabel = `${materialCount} material${materialCount === 1 ? "" : "s"}`;
  const noteLabel = `${noteCount} note${noteCount === 1 ? "" : "s"}`;

  return (
    <>
      <PageHeader
        title={course.name}
        description={`${semester.displayName} · ${materialLabel} · ${noteLabel}`}
      />
      <CourseContentTabs
        semesterSlug={semester.slug}
        courseSlug={course.slug}
        materials={course.documents}
        notes={course.notes}
      />
    </>
  );
}
