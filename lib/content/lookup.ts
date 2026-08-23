import { scanContentTree } from "./scanner";
import type { ContentTree, Course, Semester } from "./types";

export function getContentTree(): ContentTree {
  return scanContentTree();
}

export function getSemester(slug: string): Semester | undefined {
  return getContentTree().semesters.find((s) => s.slug === slug);
}

export function getCourse(semesterSlug: string, courseSlug: string): Course | undefined {
  return getSemester(semesterSlug)?.courses.find((c) => c.slug === courseSlug);
}
