import { existsSync, readdirSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import {
  buildContentBlobPathname,
  contentBlobExists,
  isBlobConfigured,
  isSafeContentSlug,
  putContentBlob,
} from "@/lib/content/blob";
import { LAB_DIR_NAME } from "@/lib/content/constants";
import { getCourse } from "@/lib/content/lookup";
import {
  getCourseDiskPath,
  isPathWithinContentDir,
  sanitizeFilename,
} from "@/lib/content/paths";
import { getExtension } from "@/lib/content/slug";
import {
  ALLOWED_TYPES_LABEL,
  contentTypeForExtension,
} from "@/lib/content/supported-extensions";

export type UploadKind = "materials" | "notes" | "pyq" | "lab";

function parseUploadKind(value: FormDataEntryValue | null): UploadKind | null {
  if (
    value === "materials" ||
    value === "notes" ||
    value === "pyq" ||
    value === "lab"
  )
    return value;
  // Back-compat: older clients without kind upload to materials.
  if (value === null || value === "") return "materials";
  return null;
}

function resolveLabTargetDir(courseDir: string): string {
  const fallback = path.join(courseDir, LAB_DIR_NAME);
  if (!existsSync(courseDir)) return fallback;

  for (const entry of readdirSync(courseDir, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name.toLowerCase() === "lab") {
      return path.join(courseDir, entry.name);
    }
  }

  return fallback;
}

/**
 * Uploads course materials/notes/pyq/lab.
 * - When `BLOB_READ_WRITE_TOKEN` is set: stores in Vercel Blob (persists on Vercel).
 * - Otherwise: writes to public/content/ (local/dev only; does not persist on serverless).
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const semesterSlug = formData.get("semesterSlug");
    const courseSlug = formData.get("courseSlug");
    const kind =
      parseUploadKind(formData.get("kind")) ??
      parseUploadKind(formData.get("target"));

    const fileName = formData.get("fileName");

    if (
      !(file instanceof File) ||
      typeof semesterSlug !== "string" ||
      typeof courseSlug !== "string" ||
      !semesterSlug.trim() ||
      !courseSlug.trim() ||
      !kind
    ) {
      return NextResponse.json({ error: "Invalid upload request." }, { status: 400 });
    }

    if (!isSafeContentSlug(semesterSlug) || !isSafeContentSlug(courseSlug)) {
      return NextResponse.json({ error: "Invalid course path." }, { status: 400 });
    }

    const requestedName =
      typeof fileName === "string" && fileName.trim() ? fileName.trim() : file.name;
    const safeName = sanitizeFilename(requestedName);
    if (!safeName) {
      return NextResponse.json(
        { error: `Unsupported file type. Allowed: ${ALLOWED_TYPES_LABEL}` },
        { status: 400 }
      );
    }

    const course = await getCourse(semesterSlug, courseSlug);
    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    if (isBlobConfigured()) {
      const pathname = buildContentBlobPathname(
        semesterSlug,
        courseSlug,
        safeName,
        kind
      );

      if (await contentBlobExists(pathname)) {
        return NextResponse.json(
          { error: "A file with this name already exists." },
          { status: 409 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const contentType =
        file.type || contentTypeForExtension(getExtension(safeName));
      await putContentBlob(pathname, buffer, contentType);

      revalidatePath(`/${semesterSlug}/${courseSlug}`);
      revalidatePath(`/${semesterSlug}`);
      revalidatePath("/");

      return NextResponse.json({
        success: true,
        fileName: safeName,
        kind,
        pathname,
      });
    }

    const courseDir = await getCourseDiskPath(semesterSlug, courseSlug);
    if (!courseDir) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    const targetDir =
      kind === "notes"
        ? path.join(courseDir, "notes")
        : kind === "pyq"
          ? path.join(courseDir, "pyq")
          : kind === "lab"
            ? resolveLabTargetDir(courseDir)
            : courseDir;

    if (
      (kind === "notes" || kind === "pyq" || kind === "lab") &&
      !existsSync(targetDir)
    ) {
      await mkdir(targetDir, { recursive: true });
    }

    const targetPath = path.join(targetDir, safeName);
    if (!isPathWithinContentDir(targetPath)) {
      return NextResponse.json({ error: "Invalid file path." }, { status: 400 });
    }

    if (existsSync(targetPath)) {
      return NextResponse.json(
        { error: "A file with this name already exists." },
        { status: 409 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(targetPath, buffer);

    revalidatePath(`/${semesterSlug}/${courseSlug}`);
    revalidatePath(`/${semesterSlug}`);
    revalidatePath("/");

    return NextResponse.json({ success: true, fileName: safeName, kind });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/already exists|cannot be overwritten/i.test(message)) {
      return NextResponse.json(
        { error: "A file with this name already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
