import path from "path";

export { SUPPORTED_EXTENSIONS } from "./supported-extensions";

export const CONTENT_DIR = path.join(process.cwd(), "public/content");

/** Canonical on-disk lab folder. Scanning also accepts `lab/` (case-insensitive). */
export const LAB_DIR_NAME = "Lab";
