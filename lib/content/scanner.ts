import fs from "fs";
import path from "path";

import { CONTENT_DIR, SUPPORTED_EXTENSIONS } from "./constants";
import type { ContentTree, Course, Document, FileExtension, Semester } from "./types";
import {
  displayNameFromFile,
  formatFileSize,
  formatSemesterName,
  getExtension,
  slugify,
} from "./slug";

function toFileExtension(ext: string): FileExtension {
  if (ext === "pdf" || ext === "pptx" || ext === "docx") return ext;
  return "other";
}

function uniqueSlug(base: string, existing: Set<string>): string {
  let slug = slugify(base);
  if (!slug) slug = "document";

  if (!existing.has(slug)) {
    existing.add(slug);
    return slug;
  }

  let counter = 2;
  while (existing.has(`${slug}-${counter}`)) {
    counter++;
  }
  const unique = `${slug}-${counter}`;
  existing.add(unique);
  return unique;
}

function scanDocuments(courseDir: string): Document[] {
  const entries = fs.readdirSync(courseDir, { withFileTypes: true });
  const slugSet = new Set<string>();
  const documents: Document[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || entry.name.startsWith(".")) continue;

    const ext = getExtension(entry.name);
    if (!SUPPORTED_EXTENSIONS.has(ext)) continue;

    const filePath = path.join(courseDir, entry.name);
    const stat = fs.statSync(filePath);
    const publicPath = `/content/${path
      .relative(CONTENT_DIR, filePath)
      .split(path.sep)
      .map(encodeURIComponent)
      .join("/")}`;

    documents.push({
      slug: uniqueSlug(displayNameFromFile(entry.name), slugSet),
      name: displayNameFromFile(entry.name),
      fileName: entry.name,
      publicPath,
      extension: toFileExtension(ext),
      size: formatFileSize(stat.size),
      sizeBytes: stat.size,
    });
  }

  documents.sort((a, b) => a.name.localeCompare(b.name));
  return documents;
}

function scanCourses(semesterDir: string): Course[] {
  const entries = fs.readdirSync(semesterDir, { withFileTypes: true });
  const courses: Course[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;

    const courseDir = path.join(semesterDir, entry.name);
    const documents = scanDocuments(courseDir);
    if (documents.length === 0) continue;

    courses.push({
      slug: slugify(entry.name),
      name: entry.name,
      documents,
    });
  }

  courses.sort((a, b) => a.name.localeCompare(b.name));
  return courses;
}

function scanSemesters(): Semester[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const entries = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });
  const semesters: Semester[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;

    const semesterDir = path.join(CONTENT_DIR, entry.name);
    const courses = scanCourses(semesterDir);
    if (courses.length === 0) continue;

    semesters.push({
      slug: slugify(entry.name),
      name: entry.name,
      displayName: formatSemesterName(entry.name),
      courses,
    });
  }

  semesters.sort((a, b) => a.name.localeCompare(b.name));
  return semesters;
}

export function scanContentTree(): ContentTree {
  const semesters = scanSemesters();
  const totalCourses = semesters.reduce((sum, s) => sum + s.courses.length, 0);
  const totalDocuments = semesters.reduce(
    (sum, s) => sum + s.courses.reduce((cSum, c) => cSum + c.documents.length, 0),
    0
  );

  return { semesters, totalCourses, totalDocuments };
}
