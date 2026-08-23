# IILM LMS

Unofficial, student-led learning management system for IILM courses: browse semester/course materials and notes, view PDF / PPTX / DOCX in-browser, check the class schedule, and contribute uploads.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + React 19
- TypeScript, Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com)
- [Bun](https://bun.sh) (`packageManager` in `package.json`)
- [Vercel Blob](https://vercel.com/docs/vercel-blob) for durable content storage
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

## Environment

Copy values into `.env.local` as needed. All env files are gitignored.

| Variable | Required | Notes |
| --- | --- | --- |
| `BLOB_READ_WRITE_TOKEN` | For Blob uploads / listing | Created when you add a Blob store in the Vercel dashboard. Works on the Hobby free tier. |
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | No | PostHog project token. Client init runs in **production** only (`instrumentation-client.ts`); local `bun dev` skips PostHog. |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | Used by the server-side PostHog client (e.g. `https://us.i.posthog.com`). Browser traffic is proxied via `/ingest` (see `next.config.ts`). |

Without `BLOB_READ_WRITE_TOKEN`, uploads write to `public/content/` (fine for local dev, but **not durable** on Vercel serverless).

Pull Vercel-linked env vars locally with:

```bash
vercel env pull
```

## Content storage (Vercel Blob)

Course materials and notes live in **Vercel Blob** (production) or under `public/content/` (local fallback). Layout:

```
content/{semesterSlug}/{courseSlug}/{filename}          # materials
content/{semesterSlug}/{courseSlug}/notes/{filename}    # notes
```

### Vercel setup

1. In the project **Storage** tab, create a **Blob** store (public access).
2. Connect it to Production / Preview (and Development if you want Blob locally).
3. Vercel injects `BLOB_READ_WRITE_TOKEN`. Pull locally with `vercel env pull`.
4. Redeploy. New uploads go to Blob; `publicPath` for Blob files is the public Blob URL, so PDF / PPTX / DOCX viewers keep working.

When the token is set, the app lists Blob under `content/` and still merges any remaining local `public/content` files so git-seeded materials stay visible until you migrate them into Blob.

### Migrate existing files

Upload via the UI, or use the [Vercel Blob CLI / SDK](https://vercel.com/docs/vercel-blob) to `put` existing `public/content/**` files using the slug-based pathname convention above.

## Project structure

```
src/app/
  (app)/                 # Shell: sidebar + header
    page.tsx             # Dashboard
    schedule/            # Timetable, due-soon tasks, ICS
    [semester]/...      # Semester → course pages
  [semester]/[course]/[doc]/  # Document viewer (outside shell)
  api/upload/            # Material / note uploads
components/              # UI, dashboard, schedule, document viewers
lib/
  content/               # Scan/list Blob + local content tree
  schedule/              # Timetable, next class, tasks, ICS
public/content/          # Local/dev content tree (optional seed data)
```

## Agent notes

This repo uses a Next.js version that may differ from older training data. See `AGENTS.md` / `CLAUDE.md` and the docs under `node_modules/next/dist/docs/` before changing Next APIs.

## Deploy

Deploy on [Vercel](https://vercel.com/new). Ensure Blob (and optionally PostHog) env vars are set for Production / Preview.
