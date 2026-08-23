import { CourseCard } from "@/components/course-card";
import { NextClassCard } from "@/components/dashboard/next-class-card";
import { QuickLinks } from "@/components/dashboard/quick-links";
import {
  RecentMaterials,
  type MaterialItem,
} from "@/components/dashboard/recent-materials";
import { SlimStats } from "@/components/dashboard/slim-stats";
import { PageHeader } from "@/components/page-header";
import {
  getContentStats,
  getContentTree,
  matchScheduleSubjectToCourse,
} from "@/lib/content";
import { getNextClass, timetableMeta } from "@/lib/schedule";

/** Recompute next-class from Asia/Kolkata wall clock on each request. */
export const dynamic = "force-dynamic";

const MATERIAL_PREVIEW_LIMIT = 8;
const QUICK_LINK_COURSE_LIMIT = 5;

export default async function DashboardPage() {
  const tree = await getContentTree();
  const stats = await getContentStats();
  const next = getNextClass();
  const matched = next.classItem
    ? matchScheduleSubjectToCourse(next.classItem.entry.name, tree)
    : null;

  const coursesWithMaterials = tree.semesters
    .flatMap((semester) =>
      semester.courses.map((course) => ({ semester, course }))
    )
    .sort(
      (a, b) =>
        b.course.documents.length +
        b.course.notes.length -
        (a.course.documents.length + a.course.notes.length)
    );

  const quickLinkCourses = coursesWithMaterials
    .filter(
      ({ course }) => course.documents.length > 0 || course.notes.length > 0
    )
    .slice(0, QUICK_LINK_COURSE_LIMIT);

  // Prefer courses that have materials; if none, show primary semester courses
  const links =
    quickLinkCourses.length > 0
      ? quickLinkCourses
      : coursesWithMaterials.slice(0, QUICK_LINK_COURSE_LIMIT);

  const materials: MaterialItem[] = [];
  for (const { semester, course } of coursesWithMaterials) {
    for (const document of course.documents) {
      materials.push({ semester, course, document });
      if (materials.length >= MATERIAL_PREVIEW_LIMIT) break;
    }
    if (materials.length >= MATERIAL_PREVIEW_LIMIT) break;
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`${timetableMeta.section} · Today's classes, materials, and courses.`}
      />

      <div className="mb-6 space-y-6 sm:mb-8 sm:space-y-8">
        <NextClassCard next={next} matched={matched} />

        <SlimStats
          stats={{
            materials: stats.materials,
            notes: stats.notes,
            courses: stats.courses,
          }}
        />

        <QuickLinks courses={links} />

        <RecentMaterials
          materials={materials}
          notesCount={stats.notes}
        />
      </div>

      <section>
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            All courses
          </h2>
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {stats.courses} total
          </span>
        </div>

        {tree.semesters.map((semester) => (
          <div key={semester.slug} className="mb-7 last:mb-0">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h3 className="text-[12px] font-medium text-muted-foreground">
                {semester.displayName}
              </h3>
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                {semester.courses.length} course
                {semester.courses.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
              {semester.courses.map((course) => (
                <CourseCard
                  key={course.slug}
                  course={course}
                  semesterSlug={semester.slug}
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
