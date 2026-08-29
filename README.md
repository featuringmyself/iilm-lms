# IILM LMS

Unofficial, student-led learning management system for IILM courses: browse semester/course materials and notes, view PDF / PPTX / DOCX / images in-browser, check the class schedule, and contribute uploads.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + React 19
- TypeScript, Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com)
- [Bun](https://bun.sh) (`packageManager` in `package.json`)
- [Vercel Blob](https://vercel.com/docs/vercel-blob) for instant upload staging (synced into `public/content/`)
- [PostHog](https://posthog.com) analytics (production only)

## Getting started

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Script | Command | Notes |
| --- | --- | --- |
| `dev` | `bun dev` | Next.js dev server |
| `build` | `bun run build` | Production build |
| `start` | `bun start` | Serve the production build |
| `lint` | `bun run lint` | ESLint |
| `sync:blob` | `bun run sync:blob` | Pull Blob → `public/content/`, then delete from Blob |

## Environment

Copy values into `.env.local` as needed. All env files are gitignored.

| Variable | Required | Notes |
| --- | --- | --- |
| `BLOB_READ_WRITE_TOKEN` | For Blob uploads / listing | Created when you add a Blob store in the Vercel dashboard. Works on the Hobby free tier. |
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | No | PostHog project token. Client init runs in **production** only (`instrumentation-client.ts`); local `bun dev` skips PostHog. |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | Used by the server-side PostHog client (e.g. `https://us.i.posthog.com`). Browser traffic is proxied via `/ingest` (see `next.config.ts`). |

Without `BLOB_READ_WRITE_TOKEN`, uploads write to `public/content/` (fine for local dev).

Pull Vercel-linked env vars locally with:

```bash
vercel env pull
```

## Content storage

Course materials and notes are served from **`public/content/`** (committed and deployed). Uploads still go to **Vercel Blob** first so new files are visible immediately; periodically sync Blob down to `public/` and free Blob storage.

Layout:

```
public/content/{SemesterFolder}/{CourseFolder}/{filename}          # materials
public/content/{SemesterFolder}/{CourseFolder}/notes/{filename}    # notes
```

Blob pathnames use URL slugs (`content/{semesterSlug}/{courseSlug}/...`) and map back onto the display-name folders above.

### Vercel setup

1. In the project **Storage** tab, create a **Blob** store (public access).
2. Connect it to Production / Preview (and Development if you want Blob locally).
3. Vercel injects `BLOB_READ_WRITE_TOKEN`. Pull locally with `vercel env pull`.
4. Redeploy. New uploads go to Blob; the app merges Blob + local so unsynced uploads still appear until you run the sync.

### Sync Blob → public (routine)

Run locally when you want to reclaim Blob storage and make `public/content/` the source of truth:

```bash
bun run sync:blob -- --dry-run   # preview
bun run sync:blob                # download + delete from Blob
bun run sync:blob -- --keep-blob # download only, leave Blob copies
```

Then commit and deploy `public/content/` so production serves the local files. Upload via the UI is unchanged.

## Project structure

```
src/app/
  (app)/                 # Shell: sidebar + header
    page.tsx             # Dashboard
    schedule/            # Timetable, due-soon tasks, ICS
    changelog/           # User-facing changelog
    [semester]/...      # Semester → course pages
  [semester]/[course]/[doc]/  # Document viewer (outside shell)
  api/upload/            # Material / note uploads
components/              # UI, dashboard, schedule, document viewers
lib/
  content/               # Scan/list Blob + local content tree
  schedule/              # Timetable, next class, tasks, ICS
  changelog.ts           # Changelog entries for /changelog
public/content/          # Local/dev content tree (optional seed data)
```

## Contributing

PRs that change user-visible behavior should update the changelog.

1. Edit `lib/changelog.ts` — add a new entry at the **top** (newest first), or append items to an existing entry when the change belongs to the same release theme.
2. Prefer one entry per meaningful feature or fix theme; related commits can share an entry.
3. Use `added` / `changed` / `fixed` for item kinds, and write copy for students (what changed), not commit titles.
4. Keep the `/changelog` page accurate; do not dump every chore or refactor.

Content uploads (materials / notes via the UI or sync) do not need a changelog entry.

## Agent notes

This repo uses a Next.js version that may differ from older training data. See `AGENTS.md` / `CLAUDE.md` and the docs under `node_modules/next/dist/docs/` before changing Next APIs.

## Deploy

Deploy on [Vercel](https://vercel.com/new). Ensure Blob (and optionally PostHog) env vars are set for Production / Preview.
