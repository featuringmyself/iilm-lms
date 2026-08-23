import path from "path";

export const CONTENT_DIR = path.join(process.cwd(), "public/content");

export const SUPPORTED_EXTENSIONS = new Set(["pdf", "pptx", "docx"]);
