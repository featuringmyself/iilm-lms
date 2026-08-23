This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Content storage (Vercel Blob)

Course materials and notes are stored either in **Vercel Blob** (production) or under `public/content/` (local fallback).

### Environment

| Variable | Required | Notes |
| --- | --- | --- |
| `BLOB_READ_WRITE_TOKEN` | For Blob uploads / listing | Created when you add a Blob store in the Vercel dashboard. Works on the Hobby free tier. |

Without this token, uploads write to `public/content/` (fine for `bun run dev`, but **not durable** on Vercel serverless).

### Vercel setup

1. In the project **Storage** tab, create a **Blob** store (public access).
2. Connect it to Production / Preview (and Development if you want Blob locally).
3. Vercel injects `BLOB_READ_WRITE_TOKEN`. Pull locally with:

```bash
vercel env pull
```

4. Redeploy. New uploads go to Blob at:

- `content/{semesterSlug}/{courseSlug}/{filename}` (materials)
- `content/{semesterSlug}/{courseSlug}/notes/{filename}` (notes)

`publicPath` for Blob files is the public Blob URL, so PDF / PPTX / DOCX viewers keep working.

When the token is set, the app lists Blob under `content/` and still merges any remaining local `public/content` files so git-seeded materials stay visible until you migrate them into Blob.

### Migrate existing files

Upload files via the UI, or use the [Vercel Blob CLI / SDK](https://vercel.com/docs/vercel-blob) to `put` existing `public/content/**` files using the slug-based pathname convention above.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Blob](https://vercel.com/docs/vercel-blob)

## Deploy on Vercel

The easiest way to deploy is the [Vercel Platform](https://vercel.com/new).
