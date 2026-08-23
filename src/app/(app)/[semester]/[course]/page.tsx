import { notFound } from "next/navigation";

import { DocumentTable } from "@/components/document-table";
import { PageHeader } from "@/components/page-header";
import { UploadFileButton } from "@/components/upload-file-button";
import { Badge } from "@/components/ui/badge";
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

  return (
    <>
      <PageHeader
        title={course.name}
        description={`${course.documents.length} material${course.documents.length === 1 ? "" : "s"} in this course`}
        action={
          <div className="flex items-center gap-2">
            <UploadFileButton
              semesterSlug={semester.slug}
              courseSlug={course.slug}
            />
            <Badge
              variant="secondary"
              className="rounded-md px-2 font-mono text-[10px] tracking-wide uppercase"
            >
              {semester.displayName}
            </Badge>
          </div>
        }
      />
      <DocumentTable course={course} semesterSlug={semester.slug} />
    </>
  );
}
