import fs from "fs";
import path from "path";

import { CONTENT_DIR } from "./constants";
import { getCourse, getSemester } from "./lookup";

export { CONTENT_DIR, SUPPORTED_EXTENSIONS } from "./constants";

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

export function sanitizeFilename(filename: string): string | null {
  const base = path.basename(filename);
  if (!base || base === "." || base === "..") return null;

  const sanitized = base
    .replace(/[\x00-\x1f\x7f]/g, "")
    .replace(/[<>:"|?*\\]/g, "")
    .replace(/^\.+/, "")
    .trim();

  if (!sanitized) return null;

  const ext = path.extname(sanitized).slice(1).toLowerCase();
  if (!["pdf", "pptx", "docx"].includes(ext)) return null;

  return sanitized;
}
