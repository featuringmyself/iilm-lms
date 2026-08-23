const ALLOWED_EXTENSIONS = new Set(["pdf", "pptx", "docx"]);

function basename(filename: string): string {
  return filename.replace(/^.*[/\\]/, "");
}

function extname(filename: string): string {
  const base = basename(filename);
  const dot = base.lastIndexOf(".");
  if (dot <= 0) return "";
  return base.slice(dot);
}

/** Returns a safe filename, or null if unsupported / empty after sanitizing. */
export function sanitizeFilename(filename: string): string | null {
  const base = basename(filename);
  if (!base || base === "." || base === "..") return null;

  const sanitized = base
    .replace(/[\x00-\x1f\x7f]/g, "")
    .replace(/[<>:"|?*\\/]/g, "")
    .replace(/^\.+/, "")
    .trim();

  if (!sanitized) return null;

  const ext = extname(sanitized).slice(1).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) return null;

  return sanitized;
}

export function splitFilename(filename: string): {
  stem: string;
  extension: string;
} {
  const base = basename(filename);
  const ext = extname(base);
  if (!ext) return { stem: base, extension: "" };
  return { stem: base.slice(0, -ext.length), extension: ext };
}
