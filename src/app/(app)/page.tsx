import { BookOpen, FileStack, GraduationCap, StickyNote } from "lucide-react";

import { CourseCard } from "@/components/course-card";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { getContentStats, getContentTree } from "@/lib/content";

export default async function DashboardPage() {
  const tree = await getContentTree();
  const stats = await getContentStats();

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Browse semesters, courses, and learning materials."
      />

      <div className="mb-8 grid gap-3 grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Courses"
          value={stats.courses}
          icon={BookOpen}
          iconContainerClassName="border-sky-200/70 bg-sky-50 dark:border-sky-900/50 dark:bg-sky-950/40"
          iconClassName="text-sky-600 dark:text-sky-400"
        />
        <StatCard
          label="Materials"
          value={stats.materials}
          icon={FileStack}
          iconContainerClassName="border-violet-200/70 bg-violet-50 dark:border-violet-900/50 dark:bg-violet-950/40"
          iconClassName="text-violet-600 dark:text-violet-400"
        />
        <StatCard
          label="Notes"
          value={stats.notes}
          icon={StickyNote}
          iconContainerClassName="border-amber-200/70 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/40"
          iconClassName="text-amber-600 dark:text-amber-400"
        />
        <StatCard
          label="Semesters"
          value={stats.semesters}
          icon={GraduationCap}
          iconContainerClassName="border-emerald-200/70 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/40"
          iconClassName="text-emerald-600 dark:text-emerald-400"
        />
      </div>

      {tree.semesters.map((semester) => (
        <section key={semester.slug} className="mb-9 last:mb-0">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              {semester.displayName}
            </h2>
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
        </section>
      ))}
    </>
  );
}
