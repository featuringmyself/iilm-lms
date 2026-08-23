import { existsSync } from "fs";
import { writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import {
  getCourseDiskPath,
  isPathWithinContentDir,
  sanitizeFilename,
} from "@/lib/content/paths";
import { getCourse, getSemester } from "@/lib/content";

// Local/dev only: writes to public/content/ do not persist on Vercel serverless.
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const semesterSlug = formData.get("semesterSlug");
    const courseSlug = formData.get("courseSlug");

    if (
      !(file instanceof File) ||
      typeof semesterSlug !== "string" ||
      typeof courseSlug !== "string" ||
      !semesterSlug.trim() ||
      !courseSlug.trim()
    ) {
      return NextResponse.json({ error: "Invalid upload request." }, { status: 400 });
    }

    const safeName = sanitizeFilename(file.name);
    if (!safeName) {
      return NextResponse.json(
        { error: "Unsupported file type. Allowed: .pdf, .pptx, .docx" },
        { status: 400 }
      );
    }

    const courseDir = getCourseDiskPath(semesterSlug, courseSlug);
    if (!courseDir) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    const targetPath = path.join(courseDir, safeName);
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

    return NextResponse.json({ success: true, fileName: safeName });
  } catch {
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
