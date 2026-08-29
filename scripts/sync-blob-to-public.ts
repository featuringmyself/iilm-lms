/**
 * Pull course materials/notes/pyq from Vercel Blob into public/content/, then
 * delete them from Blob to free storage. Uploads keep writing to Blob for
 * instant availability; run this periodically and commit/deploy public/.
 *
 * Usage:
 *   bun run sync:blob              # download + delete from Blob
 *   bun run sync:blob -- --dry-run # preview only
 *   bun run sync:blob -- --keep-blob  # download, leave Blob intact
 */

import fs from "fs";
import path from "path";

import {
  deleteContentBlobs,
  isBlobConfigured,
  listContentBlobs,
} from "../lib/content/blob";
import { CONTENT_DIR, SUPPORTED_EXTENSIONS } from "../lib/content/constants";
import { getExtension, slugify } from "../lib/content/slug";

const BLOB_CONTENT_PREFIX = "content/";
const NOTES_DIR_NAME = "notes";
const PYQ_DIR_NAME = "pyq";
const DELETE_BATCH_SIZE = 50;

type CliOptions = {
  dryRun: boolean;
  keepBlob: boolean;
};

type SyncAction =
  | "download"
  | "skip-exists"
  | "skip-unsupported"
  | "skip-invalid-path";

type SyncPlanItem = {
  pathname: string;
  url: string;
  size: number;
  localPath: string;
  action: SyncAction;
};

function parseArgs(argv: string[]): CliOptions {
  return {
    dryRun: argv.includes("--dry-run"),
    keepBlob: argv.includes("--keep-blob"),
  };
}

function nameFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** Map `1stsem` → `1stSem` so new folders match the existing convention. */
function folderNameFromSemesterSlug(slug: string): string {
  const match = slug.match(/^(\d+)(st|nd|rd|th)sem$/i);
  if (match) {
    return `${match[1]}${match[2].toLowerCase()}Sem`;
  }
  return nameFromSlug(slug);
}

function buildSlugToDirMap(parentDir: string): Map<string, string> {
  const map = new Map<string, string>();
  if (!fs.existsSync(parentDir)) return map;

  for (const entry of fs.readdirSync(parentDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    map.set(slugify(entry.name), entry.name);
  }

  return map;
}

function resolveDirName(
  slug: string,
  existing: Map<string, string>,
  createName: (slug: string) => string
): string {
  return existing.get(slug) ?? createName(slug);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function resolveLocalPath(pathname: string): string | null {
  if (!pathname.startsWith(BLOB_CONTENT_PREFIX)) return null;

  const relative = pathname.slice(BLOB_CONTENT_PREFIX.length);
  const parts = relative.split("/").filter(Boolean);
  if (parts.length < 3) return null;

  const [semesterSlug, courseSlug, ...rest] = parts;
  if (!semesterSlug || !courseSlug || rest.length === 0) return null;

  let subdir: string | null = null;
  let fileName: string;

  if (rest[0] === NOTES_DIR_NAME) {
    if (rest.length !== 2) return null;
    subdir = NOTES_DIR_NAME;
    fileName = rest[1]!;
  } else if (rest[0] === PYQ_DIR_NAME) {
    if (rest.length !== 2) return null;
    subdir = PYQ_DIR_NAME;
    fileName = rest[1]!;
  } else if (rest.length === 1) {
    fileName = rest[0]!;
  } else {
    return null;
  }

  if (!fileName || fileName.startsWith(".")) return null;

  const semesterDirs = buildSlugToDirMap(CONTENT_DIR);
  const semesterName = resolveDirName(
    semesterSlug,
    semesterDirs,
    folderNameFromSemesterSlug
  );
  const semesterDir = path.join(CONTENT_DIR, semesterName);

  const courseDirs = buildSlugToDirMap(semesterDir);
  const courseName = resolveDirName(courseSlug, courseDirs, nameFromSlug);
  const courseDir = path.join(semesterDir, courseName);

  return subdir
    ? path.join(courseDir, subdir, fileName)
    : path.join(courseDir, fileName);
}

async function downloadToFile(url: string, dest: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} fetching ${url}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  await fs.promises.writeFile(dest, buffer);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (!isBlobConfigured()) {
    console.error(
      "BLOB_READ_WRITE_TOKEN is not set. Pull env with `vercel env pull` or set it in .env."
    );
    process.exit(1);
  }

  console.log(
    options.dryRun
      ? "Dry run — no downloads or deletes."
      : options.keepBlob
        ? "Downloading to public/content/ (keeping Blob copies)."
        : "Downloading to public/content/, then deleting from Blob."
  );

  const blobs = await listContentBlobs();
  console.log(`Found ${blobs.length} blob(s) under content/.`);

  const plan: SyncPlanItem[] = [];

  for (const blob of blobs) {
    const localPath = resolveLocalPath(blob.pathname);
    if (!localPath) {
      plan.push({
        pathname: blob.pathname,
        url: blob.url,
        size: blob.size,
        localPath: "",
        action: "skip-invalid-path",
      });
      continue;
    }

    const fileName = path.basename(localPath);
    const ext = getExtension(fileName);
    if (!SUPPORTED_EXTENSIONS.has(ext)) {
      plan.push({
        pathname: blob.pathname,
        url: blob.url,
        size: blob.size,
        localPath,
        action: "skip-unsupported",
      });
      continue;
    }

    if (fs.existsSync(localPath)) {
      const stat = fs.statSync(localPath);
      if (stat.size === blob.size) {
        plan.push({
          pathname: blob.pathname,
          url: blob.url,
          size: blob.size,
          localPath,
          action: "skip-exists",
        });
        continue;
      }
    }

    plan.push({
      pathname: blob.pathname,
      url: blob.url,
      size: blob.size,
      localPath,
      action: "download",
    });
  }

  const toDownload = plan.filter((item) => item.action === "download");
  const alreadyLocal = plan.filter((item) => item.action === "skip-exists");
  const skipped = plan.filter(
    (item) =>
      item.action === "skip-unsupported" || item.action === "skip-invalid-path"
  );

  for (const item of plan) {
    const rel = item.localPath
      ? path.relative(process.cwd(), item.localPath)
      : "(no local path)";
    const size = formatBytes(item.size);

    switch (item.action) {
      case "download":
        console.log(`  ↓ ${item.pathname} → ${rel} (${size})`);
        break;
      case "skip-exists":
        console.log(`  = ${item.pathname} already at ${rel} (${size})`);
        break;
      case "skip-unsupported":
        console.log(`  · skip unsupported ${item.pathname}`);
        break;
      case "skip-invalid-path":
        console.log(`  · skip invalid path ${item.pathname}`);
        break;
    }
  }

  if (options.dryRun) {
    console.log(
      `\nSummary (dry-run): ${toDownload.length} to download, ${alreadyLocal.length} already local, ${skipped.length} skipped.`
    );
    if (!options.keepBlob) {
      const wouldDelete = toDownload.length + alreadyLocal.length;
      console.log(
        `Would delete ${wouldDelete} blob(s) after confirming local copies.`
      );
    }
    return;
  }

  let downloaded = 0;
  const readyToDelete: string[] = [];

  for (const item of toDownload) {
    process.stdout.write(`Downloading ${item.pathname}... `);
    try {
      await downloadToFile(item.url, item.localPath);
      const stat = fs.statSync(item.localPath);
      if (stat.size !== item.size) {
        fs.unlinkSync(item.localPath);
        console.log(`failed (size mismatch: got ${stat.size}, expected ${item.size})`);
        continue;
      }
      console.log("ok");
      downloaded++;
      readyToDelete.push(item.url);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`failed (${message})`);
    }
  }

  // Already mirrored locally — safe to free Blob storage.
  for (const item of alreadyLocal) {
    readyToDelete.push(item.url);
  }

  if (options.keepBlob) {
    console.log(
      `\nDone: downloaded ${downloaded}, left ${readyToDelete.length} on Blob (--keep-blob).`
    );
    return;
  }

  let deleted = 0;
  for (let i = 0; i < readyToDelete.length; i += DELETE_BATCH_SIZE) {
    const batch = readyToDelete.slice(i, i + DELETE_BATCH_SIZE);
    await deleteContentBlobs(batch);
    deleted += batch.length;
    console.log(`Deleted ${deleted}/${readyToDelete.length} from Blob...`);
  }

  console.log(
    `\nDone: downloaded ${downloaded}, deleted ${deleted} from Blob, ${skipped.length} skipped.`
  );
  console.log(
    "Commit and deploy public/content/ so production serves the local copies."
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
