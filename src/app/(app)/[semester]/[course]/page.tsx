import { notFound } from "next/navigation";
import Link from "next/link";
import { Layers } from "lucide-react";

import { CourseContentTabs } from "@/components/course-content-tabs";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { getContentTree, getCourse, getSemester } from "@/lib/content";
import { getFlashcardSubject } from "@/lib/flashcards";

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
  const labCount = course.labs.length;
  const pyqCount = course.pyq.length;
  const descriptionParts = [
    semester.displayName,
    `${materialCount} material${materialCount === 1 ? "" : "s"}`,
    noteCount > 0
      ? `${noteCount} note${noteCount === 1 ? "" : "s"}`
      : null,
    labCount > 0 ? `${labCount} lab${labCount === 1 ? "" : "s"}` : null,
    pyqCount > 0 ? `${pyqCount} PYQ` : null,
  ].filter(Boolean);

  const flashSubject = getFlashcardSubject(course.slug);
  const readyDeck = flashSubject?.units.find(
    (unit) => unit.ready && unit.cards.length > 0
  );

  return (
    <>
      <PageHeader
        title={course.name}
        description={descriptionParts.join(" · ")}
        action={
          readyDeck ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              render={
                <Link
                  href={`/flashcards/${readyDeck.courseSlug}/${readyDeck.unitSlug}`}
                />
              }
            >
              <Layers className="size-3.5" strokeWidth={1.75} />
              Study flashcards
            </Button>
          ) : flashSubject ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              render={<Link href={`/flashcards?course=${course.slug}`} />}
            >
              <Layers className="size-3.5" strokeWidth={1.75} />
              Flashcards
            </Button>
          ) : null
        }
      />
      <CourseContentTabs
        semesterSlug={semester.slug}
        courseSlug={course.slug}
        courseName={course.name}
        semesterName={semester.displayName}
        materials={course.documents}
        notes={course.notes}
        labs={course.labs}
        pyq={course.pyq}
      />
    </>
  );
}
