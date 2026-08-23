import fs from "fs";
import path from "path";

import { CONTENT_DIR } from "./constants";
import { getCourse, getSemester } from "./lookup";

export { CONTENT_DIR, SUPPORTED_EXTENSIONS } from "./constants";
export { sanitizeFilename } from "./sanitize-filename";

export function getCourseDiskPath(
  semesterSlug: string,
  courseSlug: string
): string | null {
  const semester = getSemester(semesterSlug);
  const course = getCourse(semesterSlug, courseSlug);
  if (!semester || !course) return null;

  const coursePath = path.join(CONTENT_DIR, semester.name, course.name);
  if (!isPathWithinContentDir(coursePath)) return null;

  if (!fs.existsSync(coursePath)) return null;

  return coursePath;
}

export function isPathWithinContentDir(targetPath: string): boolean {
  const resolved = path.resolve(targetPath);
  const contentResolved = path.resolve(CONTENT_DIR);
  return resolved === contentResolved || resolved.startsWith(`${contentResolved}${path.sep}`);
}
