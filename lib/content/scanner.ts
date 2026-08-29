import fs from "fs";
import path from "path";
import type { ListBlobResultBlob } from "@vercel/blob";

import { isBlobConfigured, listContentBlobs } from "./blob";
import { CONTENT_DIR, SUPPORTED_EXTENSIONS } from "./constants";
import type { ContentTree, Course, Document, FileExtension, Semester } from "./types";
import {
  displayNameFromFile,
  formatFileSize,
  formatSemesterName,
  getExtension,
  slugify,
} from "./slug";

const NOTES_DIR_NAME = "notes";
const PYQ_DIR_NAME = "pyq";
const BLOB_CONTENT_PREFIX = "content/";

function toFileExtension(ext: string): FileExtension {
  if (SUPPORTED_EXTENSIONS.has(ext)) return ext as FileExtension;
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

function nameFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildTreeTotals(semesters: Semester[]): ContentTree {
  const totalCourses = semesters.reduce((sum, s) => sum + s.courses.length, 0);
  const totalMaterials = semesters.reduce(
    (sum, s) =>
      sum + s.courses.reduce((cSum, c) => cSum + c.documents.length, 0),
    0
  );
  const totalNotes = semesters.reduce(
    (sum, s) => sum + s.courses.reduce((cSum, c) => cSum + c.notes.length, 0),
    0
  );
  const totalPyq = semesters.reduce(
    (sum, s) => sum + s.courses.reduce((cSum, c) => cSum + c.pyq.length, 0),
    0
  );

  return { semesters, totalCourses, totalMaterials, totalNotes, totalPyq };
}

function scanDocumentsInDir(dir: string, slugSet: Set<string>): Document[] {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const documents: Document[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || entry.name.startsWith(".")) continue;

    const ext = getExtension(entry.name);
    if (!SUPPORTED_EXTENSIONS.has(ext)) continue;

    const filePath = path.join(dir, entry.name);
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
    const slugSet = new Set<string>();
    // Materials: files in course root only (notes/ and pyq/ skipped via isFile()).
    const documents = scanDocumentsInDir(courseDir, slugSet);
    const notes = scanDocumentsInDir(
      path.join(courseDir, NOTES_DIR_NAME),
      slugSet
    );
    const pyq = scanDocumentsInDir(
      path.join(courseDir, PYQ_DIR_NAME),
      slugSet
    );

    if (documents.length === 0 && notes.length === 0 && pyq.length === 0) {
      continue;
    }

    courses.push({
      slug: slugify(entry.name),
      name: entry.name,
      documents,
      notes,
      pyq,
    });
  }

  courses.sort((a, b) => a.name.localeCompare(b.name));
  return courses;
}

/** Filesystem scan of public/content (local/dev fallback). */
export function scanLocalContentTree(): ContentTree {
  if (!fs.existsSync(CONTENT_DIR)) return buildTreeTotals([]);

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
  return buildTreeTotals(semesters);
}

type CourseBucket = {
  name: string;
  materials: ListBlobResultBlob[];
  notes: ListBlobResultBlob[];
  pyq: ListBlobResultBlob[];
};

function documentsFromBlobs(
  blobs: ListBlobResultBlob[],
  slugSet: Set<string>
): Document[] {
  const documents: Document[] = [];

  for (const blob of blobs) {
    const fileName = blob.pathname.split("/").pop() ?? "";
    if (!fileName || fileName.startsWith(".")) continue;

    const ext = getExtension(fileName);
    if (!SUPPORTED_EXTENSIONS.has(ext)) continue;

    documents.push({
      slug: uniqueSlug(displayNameFromFile(fileName), slugSet),
      name: displayNameFromFile(fileName),
      fileName,
      publicPath: blob.url,
      extension: toFileExtension(ext),
      size: formatFileSize(blob.size),
      sizeBytes: blob.size,
    });
  }

  documents.sort((a, b) => a.name.localeCompare(b.name));
  return documents;
}

/** Discover course materials/notes/pyq from Vercel Blob under content/. */
export async function scanBlobContentTree(): Promise<ContentTree> {
  const blobs = await listContentBlobs();
  const semesterMap = new Map<
    string,
    { name: string; courses: Map<string, CourseBucket> }
  >();

  for (const blob of blobs) {
    if (!blob.pathname.startsWith(BLOB_CONTENT_PREFIX)) continue;

    const relative = blob.pathname.slice(BLOB_CONTENT_PREFIX.length);
    const parts = relative.split("/").filter(Boolean);
    if (parts.length < 3) continue;

    const [semesterSlug, courseSlug, ...rest] = parts;
    if (!semesterSlug || !courseSlug || rest.length === 0) continue;

    let section: "materials" | "notes" | "pyq" = "materials";
    let fileName: string;

    if (rest[0] === NOTES_DIR_NAME) {
      if (rest.length !== 2) continue;
      section = "notes";
      fileName = rest[1]!;
    } else if (rest[0] === PYQ_DIR_NAME) {
      if (rest.length !== 2) continue;
      section = "pyq";
      fileName = rest[1]!;
    } else if (rest.length === 1) {
      fileName = rest[0]!;
    } else {
      // Nested paths outside notes/ and pyq/ are ignored.
      continue;
    }

    if (!fileName || fileName.startsWith(".")) continue;
    const ext = getExtension(fileName);
    if (!SUPPORTED_EXTENSIONS.has(ext)) continue;

    let semester = semesterMap.get(semesterSlug);
    if (!semester) {
      semester = {
        name: semesterSlug,
        courses: new Map(),
      };
      semesterMap.set(semesterSlug, semester);
    }

    let course = semester.courses.get(courseSlug);
    if (!course) {
      course = {
        name: nameFromSlug(courseSlug) || courseSlug,
        materials: [],
        notes: [],
        pyq: [],
      };
      semester.courses.set(courseSlug, course);
    }

    if (section === "notes") course.notes.push(blob);
    else if (section === "pyq") course.pyq.push(blob);
    else course.materials.push(blob);
  }

  const semesters: Semester[] = [];

  for (const [semesterSlug, semester] of semesterMap) {
    const courses: Course[] = [];

    for (const [courseSlug, course] of semester.courses) {
      const slugSet = new Set<string>();
      const documents = documentsFromBlobs(course.materials, slugSet);
      const notes = documentsFromBlobs(course.notes, slugSet);
      const pyq = documentsFromBlobs(course.pyq, slugSet);
      if (documents.length === 0 && notes.length === 0 && pyq.length === 0) {
        continue;
      }

      courses.push({
        slug: courseSlug,
        name: course.name,
        documents,
        notes,
        pyq,
      });
    }

    if (courses.length === 0) continue;
    courses.sort((a, b) => a.name.localeCompare(b.name));

    semesters.push({
      slug: semesterSlug,
      name: semester.name,
      displayName: formatSemesterName(semester.name),
      courses,
    });
  }

  semesters.sort((a, b) => a.name.localeCompare(b.name));
  return buildTreeTotals(semesters);
}

function mergeDocuments(
  preferred: Document[],
  fallback: Document[],
  slugSet: Set<string>
): Document[] {
  const byFileName = new Map<string, Document>();

  for (const doc of preferred) {
    byFileName.set(doc.fileName, doc);
    slugSet.add(doc.slug);
  }

  for (const doc of fallback) {
    if (byFileName.has(doc.fileName)) continue;
    // Re-unique slug against the combined set.
    const slug = uniqueSlug(displayNameFromFile(doc.fileName), slugSet);
    byFileName.set(doc.fileName, { ...doc, slug });
  }

  return Array.from(byFileName.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

/**
 * Merge Blob + local trees by semester/course slug.
 * Local documents win on the same fileName (synced public/content is canonical).
 * Blob-only files still appear so fresh uploads are visible before sync.
 */
export function mergeContentTrees(
  blobTree: ContentTree,
  localTree: ContentTree
): ContentTree {
  const semesterMap = new Map<string, Semester>();

  for (const localSemester of localTree.semesters) {
    semesterMap.set(localSemester.slug, {
      ...localSemester,
      courses: localSemester.courses.map((course) => ({
        ...course,
        documents: [...course.documents],
        notes: [...course.notes],
        pyq: [...course.pyq],
      })),
    });
  }

  for (const blobSemester of blobTree.semesters) {
    const existing = semesterMap.get(blobSemester.slug);
    if (!existing) {
      semesterMap.set(blobSemester.slug, {
        ...blobSemester,
        courses: blobSemester.courses.map((course) => ({
          ...course,
          documents: [...course.documents],
          notes: [...course.notes],
          pyq: [...course.pyq],
        })),
      });
      continue;
    }

    const courseMap = new Map(
      existing.courses.map((course) => [course.slug, course])
    );

    for (const blobCourse of blobSemester.courses) {
      const localCourse = courseMap.get(blobCourse.slug);
      if (!localCourse) {
        courseMap.set(blobCourse.slug, {
          ...blobCourse,
          documents: [...blobCourse.documents],
          notes: [...blobCourse.notes],
          pyq: [...blobCourse.pyq],
        });
        continue;
      }

      const slugSet = new Set<string>();
      localCourse.documents = mergeDocuments(
        localCourse.documents,
        blobCourse.documents,
        slugSet
      );
      localCourse.notes = mergeDocuments(
        localCourse.notes,
        blobCourse.notes,
        slugSet
      );
      localCourse.pyq = mergeDocuments(
        localCourse.pyq,
        blobCourse.pyq,
        slugSet
      );
    }

    existing.courses = Array.from(courseMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  const semesters = Array.from(semesterMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  return buildTreeTotals(semesters);
}

/**
 * Prefer local public/content when present; merge Blob so unsynced uploads
 * still appear. Falls back to a local-only scan when the token is missing.
 */
export async function scanContentTree(): Promise<ContentTree> {
  if (!isBlobConfigured()) {
    return scanLocalContentTree();
  }

  const blobTree = await scanBlobContentTree();
  const localTree = scanLocalContentTree();
  if (localTree.semesters.length === 0) return blobTree;
  if (blobTree.semesters.length === 0) return localTree;
  return mergeContentTrees(blobTree, localTree);
}
