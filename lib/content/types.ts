export type FileExtension = "pdf" | "pptx" | "docx" | "other";

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
  /** Materials in the course folder root (pdf/pptx/docx). */
  documents: Document[];
  /** Notes stored under `{course}/notes/`. */
  notes: Document[];
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
  /** Files in course folder roots (excludes notes/). */
  totalMaterials: number;
  /** Files in course notes/ subfolders. */
  totalNotes: number;
}

export interface ContentStats {
  semesters: number;
  courses: number;
  materials: number;
  notes: number;
}
