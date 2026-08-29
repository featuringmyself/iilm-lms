import type { ContentStats, Course, Document, Semester } from "./types";
import { getContentTree, getCourse } from "./lookup";

export type {
  ContentStats,
  ContentTree,
  Course,
  Document,
  FileExtension,
  Semester,
} from "./types";
export { formatSemesterName, slugify } from "./slug";
export { isImageExtension } from "./supported-extensions";
export {
  CONTENT_DIR,
  getCourseDiskPath,
  isPathWithinContentDir,
  sanitizeFilename,
  SUPPORTED_EXTENSIONS,
} from "./paths";
export {
  buildContentBlobPathname,
  isBlobConfigured,
  isSafeContentSlug,
} from "./blob";
export { getContentTree, getCourse, getSemester } from "./lookup";
export {
  matchScheduleSubjectToCourse,
  type MatchedCourse,
} from "./match-course";

export async function getContentStats(): Promise<ContentStats> {
  const tree = await getContentTree();
  return {
    semesters: tree.semesters.length,
    courses: tree.totalCourses,
    materials: tree.totalMaterials,
    notes: tree.totalNotes,
    pyq: tree.totalPyq,
  };
}

export async function getDocument(
  semesterSlug: string,
  courseSlug: string,
  docSlug: string
): Promise<Document | undefined> {
  const course = await getCourse(semesterSlug, courseSlug);
  if (!course) return undefined;
  return (
    course.documents.find((d) => d.slug === docSlug) ??
    course.notes.find((d) => d.slug === docSlug) ??
    course.pyq.find((d) => d.slug === docSlug)
  );
}

export async function getAllDocuments(): Promise<
  Array<{
    semester: Semester;
    course: Course;
    document: Document;
  }>
> {
  const tree = await getContentTree();
  const results: Array<{
    semester: Semester;
    course: Course;
    document: Document;
  }> = [];

  for (const semester of tree.semesters) {
    for (const course of semester.courses) {
      for (const document of course.documents) {
        results.push({ semester, course, document });
      }
      for (const document of course.notes) {
        results.push({ semester, course, document });
      }
      for (const document of course.pyq) {
        results.push({ semester, course, document });
      }
    }
  }

  return results;
}

export async function getStaticParams(): Promise<
  Array<{
    semester: string;
    course?: string;
    doc?: string;
  }>
> {
  const params: Array<{
    semester: string;
    course?: string;
    doc?: string;
  }> = [];

  for (const { semester, course, document } of await getAllDocuments()) {
    params.push({
      semester: semester.slug,
      course: course.slug,
      doc: document.slug,
    });
  }

  const tree = await getContentTree();
  for (const semester of tree.semesters) {
    if (!params.some((p) => p.semester === semester.slug && !p.course)) {
      params.push({ semester: semester.slug });
    }
    for (const course of semester.courses) {
      if (
        !params.some(
          (p) =>
            p.semester === semester.slug &&
            p.course === course.slug &&
            !p.doc
        )
      ) {
        params.push({ semester: semester.slug, course: course.slug });
      }
    }
  }

  return params;
}
