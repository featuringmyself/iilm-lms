import { cache } from "react";

import { scanContentTree } from "./scanner";
import type { ContentTree, Course, Semester } from "./types";

/** Dedupes content scans within a single request. */
export const getContentTree = cache(async (): Promise<ContentTree> => {
  return scanContentTree();
});

export async function getSemester(
  slug: string
): Promise<Semester | undefined> {
  const tree = await getContentTree();
  return tree.semesters.find((s) => s.slug === slug);
}

export async function getCourse(
  semesterSlug: string,
  courseSlug: string
): Promise<Course | undefined> {
  const semester = await getSemester(semesterSlug);
  return semester?.courses.find((c) => c.slug === courseSlug);
}
