import { notFound } from "next/navigation";
import Link from "next/link";
import { Layers } from "lucide-react";

import { CourseContentTabs } from "@/components/course-content-tabs";
import { PageHeader } from "@/components/page-header";
import { getContentTree, getCourse, getSemester } from "@/lib/content";
import { getReadyFlashcardDecks } from "@/lib/flashcards";

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

  const readyDecks = getReadyFlashcardDecks().filter(
    (deck) => deck.courseSlug === course.slug
  );

  return (
    <>
      <PageHeader
        title={course.name}
        description={descriptionParts.join(" · ")}
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
      {readyDecks.length > 0 ? (
        <div className="mt-10 space-y-2 border-t border-border pt-6">
          {readyDecks.map((deck) => (
            <Link
              key={`${deck.courseSlug}-${deck.unitSlug}`}
              href={`/flashcards/${deck.courseSlug}/${deck.unitSlug}`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 transition-colors hover:border-foreground/20 hover:bg-muted/40"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <Layers
                  className="size-4 shrink-0 text-muted-foreground"
                  strokeWidth={1.75}
                />
                <span className="min-w-0">
                  <span className="block text-[14px] font-medium text-foreground">
                    Flashcards
                  </span>
                  <span className="block truncate text-[12px] text-muted-foreground">
                    {deck.unitLabel} · {deck.cards.length} cards
                  </span>
                </span>
              </span>
              <span className="shrink-0 text-[12px] font-semibold text-muted-foreground">
                Study →
              </span>
            </Link>
          ))}
        </div>
      ) : null}
    </>
  );
}
