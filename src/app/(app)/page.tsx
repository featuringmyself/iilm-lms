import { BookOpen, FileStack, GraduationCap, StickyNote } from "lucide-react";

import { CourseCard } from "@/components/course-card";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { getContentStats, getContentTree } from "@/lib/content";

export default function DashboardPage() {
  const tree = getContentTree();
  const stats = getContentStats();

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Browse semesters, courses, and learning materials."
      />

      <div className="mb-6 grid grid-cols-2 gap-2.5 sm:mb-8 sm:gap-3 lg:grid-cols-4">
        <StatCard label="Courses" value={stats.courses} icon={BookOpen} />
        <StatCard label="Materials" value={stats.materials} icon={FileStack} />
        <StatCard label="Notes" value={stats.notes} icon={StickyNote} />
        <StatCard label="Semesters" value={stats.semesters} icon={GraduationCap} />
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
