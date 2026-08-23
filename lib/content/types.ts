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
  documents: Document[];
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
  totalDocuments: number;
}

export interface ContentStats {
  semesters: number;
  courses: number;
  documents: number;
}
