import {
  BlobNotFoundError,
  del,
  head,
  list,
  put,
  type ListBlobResultBlob,
  type PutBlobResult,
} from "@vercel/blob";

export type ContentUploadKind = "materials" | "notes" | "pyq" | "lab";

/** True when a Blob read/write token is configured (Hobby free tier OK). */
export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

/**
 * Safe slug segment for Blob pathnames: lowercase alphanumeric + hyphens only.
 * Rejects path traversal and empty values.
 */
export function isSafeContentSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Pathname convention mirroring public/content layout, using URL slugs:
 * - materials: content/{semesterSlug}/{courseSlug}/{filename}
 * - notes:     content/{semesterSlug}/{courseSlug}/notes/{filename}
 * - pyq:       content/{semesterSlug}/{courseSlug}/pyq/{filename}
 * - lab:       content/{semesterSlug}/{courseSlug}/lab/{filename}
 */
export function buildContentBlobPathname(
  semesterSlug: string,
  courseSlug: string,
  fileName: string,
  kind: ContentUploadKind
): string {
  const base = `content/${semesterSlug}/${courseSlug}`;
  if (kind === "notes") return `${base}/notes/${fileName}`;
  if (kind === "pyq") return `${base}/pyq/${fileName}`;
  if (kind === "lab") return `${base}/lab/${fileName}`;
  return `${base}/${fileName}`;
}

export async function listContentBlobs(): Promise<ListBlobResultBlob[]> {
  const blobs: ListBlobResultBlob[] = [];
  let cursor: string | undefined;

  do {
    const result = await list({
      prefix: "content/",
      cursor,
      limit: 1000,
    });
    blobs.push(...result.blobs);
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  return blobs;
}

/** Returns true if a blob already exists at pathname. */
export async function contentBlobExists(pathname: string): Promise<boolean> {
  try {
    await head(pathname);
    return true;
  } catch (error) {
    if (error instanceof BlobNotFoundError) return false;
    throw error;
  }
}

export async function putContentBlob(
  pathname: string,
  body: Buffer | Blob | File,
  contentType?: string
): Promise<PutBlobResult> {
  return put(pathname, body, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: false,
    ...(contentType ? { contentType } : {}),
  });
}

/** Delete one or more blobs by URL or pathname. */
export async function deleteContentBlobs(
  urlOrPathname: string | string[]
): Promise<void> {
  await del(urlOrPathname);
}
