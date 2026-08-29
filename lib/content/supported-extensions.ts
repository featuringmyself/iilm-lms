export const IMAGE_EXTENSIONS = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "avif",
] as const;

export const DOCUMENT_EXTENSIONS = ["pdf", "pptx", "docx"] as const;

export const SUPPORTED_EXTENSION_LIST = [
  ...DOCUMENT_EXTENSIONS,
  ...IMAGE_EXTENSIONS,
] as const;

export type ImageExtension = (typeof IMAGE_EXTENSIONS)[number];
export type SupportedExtension = (typeof SUPPORTED_EXTENSION_LIST)[number];

export const SUPPORTED_EXTENSIONS = new Set<string>(SUPPORTED_EXTENSION_LIST);

export const ACCEPT_FILE_TYPES = SUPPORTED_EXTENSION_LIST.map(
  (ext) => `.${ext}`
).join(",");

export const ALLOWED_TYPES_LABEL = SUPPORTED_EXTENSION_LIST.map(
  (ext) => `.${ext}`
).join(", ");

const IMAGE_EXTENSION_SET = new Set<string>(IMAGE_EXTENSIONS);

export function isImageExtension(ext: string): ext is ImageExtension {
  return IMAGE_EXTENSION_SET.has(ext);
}

const CONTENT_TYPE_BY_EXTENSION: Record<SupportedExtension, string> = {
  pdf: "application/pdf",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
};

export function contentTypeForExtension(ext: string): string | undefined {
  if (ext in CONTENT_TYPE_BY_EXTENSION) {
    return CONTENT_TYPE_BY_EXTENSION[ext as SupportedExtension];
  }
  return undefined;
}
