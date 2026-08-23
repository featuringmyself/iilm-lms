import type { ContentStats, ContentTree, Course, Document, Semester } from "./types";
import { getContentTree, getCourse } from "./lookup";

export type { ContentStats, ContentTree, Course, Document, FileExtension, Semester } from "./types";
export { formatSemesterName, slugify } from "./slug";
export {
  CONTENT_DIR,
  getCourseDiskPath,
  isPathWithinContentDir,
  sanitizeFilename,
  SUPPORTED_EXTENSIONS,
} from "./paths";
export { getContentTree, getCourse, getSemester } from "./lookup";

export function getContentStats(): ContentStats {
  const tree = getContentTree();
  return {
    semesters: tree.semesters.length,
    courses: tree.totalCourses,
    materials: tree.totalMaterials,
    notes: tree.totalNotes,
  };
}

export function getDocument(
  semesterSlug: string,
  courseSlug: string,
  docSlug: string
): Document | undefined {
  const course = getCourse(semesterSlug, courseSlug);
  if (!course) return undefined;
  return (
    course.documents.find((d) => d.slug === docSlug) ??
    course.notes.find((d) => d.slug === docSlug)
  );
}

export function getAllDocuments(): Array<{
  semester: Semester;
  course: Course;
  document: Document;
}> {
  const tree = getContentTree();
  const results: Array<{ semester: Semester; course: Course; document: Document }> = [];

  for (const semester of tree.semesters) {
    for (const course of semester.courses) {
      for (const document of course.documents) {
        results.push({ semester, course, document });
      }
      for (const document of course.notes) {
        results.push({ semester, course, document });
      }
    }
  }

  return results;
}

export function getStaticParams(): Array<{
  semester: string;
  course?: string;
  doc?: string;
}> {
  const params: Array<{ semester: string; course?: string; doc?: string }> = [];

  for (const { semester, course, document } of getAllDocuments()) {
    params.push({ semester: semester.slug, course: course.slug, doc: document.slug });
  }

  for (const semester of getContentTree().semesters) {
    if (!params.some((p) => p.semester === semester.slug && !p.course)) {
      params.push({ semester: semester.slug });
    }
    for (const course of semester.courses) {
      if (
        !params.some(
          (p) => p.semester === semester.slug && p.course === course.slug && !p.doc
        )
      ) {
        params.push({ semester: semester.slug, course: course.slug });
      }
    }
  }

  return params;
}
