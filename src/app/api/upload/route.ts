import { existsSync } from "fs";
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
import { getCourse } from "@/lib/content/lookup";
import {
  getCourseDiskPath,
  isPathWithinContentDir,
  sanitizeFilename,
} from "@/lib/content/paths";

export type UploadKind = "materials" | "notes";

function parseUploadKind(value: FormDataEntryValue | null): UploadKind | null {
  if (value === "materials" || value === "notes") return value;
  // Back-compat: older clients without kind upload to materials.
  if (value === null || value === "") return "materials";
  return null;
}

/**
 * Uploads course materials/notes.
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
        { error: "Unsupported file type. Allowed: .pdf, .pptx, .docx" },
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
      await putContentBlob(pathname, buffer, file.type || undefined);

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
      kind === "notes" ? path.join(courseDir, "notes") : courseDir;

    if (kind === "notes" && !existsSync(targetDir)) {
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
