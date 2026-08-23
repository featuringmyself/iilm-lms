import { notFound } from "next/navigation";

import { CourseCard } from "@/components/course-card";
import { PageHeader } from "@/components/page-header";
import { getContentTree, getSemester } from "@/lib/content";

export async function generateStaticParams() {
  const tree = await getContentTree();
  return tree.semesters.map((semester) => ({
    semester: semester.slug,
  }));
}

export default async function SemesterPage({
  params,
}: PageProps<"/[semester]">) {
  const { semester: semesterSlug } = await params;
  const semester = await getSemester(semesterSlug);

  if (!semester) notFound();

  return (
    <>
      <PageHeader
        title={semester.displayName}
        description={`${semester.courses.length} course${semester.courses.length === 1 ? "" : "s"} available`}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {semester.courses.map((course) => (
          <CourseCard
            key={course.slug}
            course={course}
            semesterSlug={semester.slug}
          />
        ))}
      </div>
    </>
  );
}
