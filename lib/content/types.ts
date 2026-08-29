import type { SupportedExtension } from "./supported-extensions";

export type FileExtension = SupportedExtension | "other";

export interface Document {
  slug: string;
  name: string;
  fileName: string;
  publicPath: string;
  extension: FileExtension;
  size: string;
  sizeBytes: number;
}

export interface Course {
  slug: string;
  name: string;
  /** Materials in the course folder root (documents and images). */
  documents: Document[];
  /** Notes stored under `{course}/notes/`. */
  notes: Document[];
  /** Previous year questions under `{course}/pyq/`. */
  pyq: Document[];
}

export interface Semester {
  slug: string;
  name: string;
  displayName: string;
  courses: Course[];
}

export interface ContentTree {
  semesters: Semester[];
  totalCourses: number;
  /** Files in course folder roots (excludes notes/ and pyq/). */
  totalMaterials: number;
  /** Files in course notes/ subfolders. */
  totalNotes: number;
  /** Files in course pyq/ subfolders. */
  totalPyq: number;
}

export interface ContentStats {
  semesters: number;
  courses: number;
  materials: number;
  notes: number;
  pyq: number;
}
