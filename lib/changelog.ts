export type ChangelogKind = "added" | "changed" | "fixed";

export interface ChangelogItem {
  kind: ChangelogKind;
  text: string;
}

export interface ChangelogEntry {
  /** Stable id for keys / deep links */
  id: string;
  /** Display date (ISO yyyy-mm-dd) */
  date: string;
  title: string;
  summary: string;
  items: ChangelogItem[];
}

/**
 * User-facing changelog. Group related commits into one entry when they
 * ship as a single feature or release theme. Newest first.
 *
 * Update this file whenever you merge a user-visible change — see README
 * Contributing.
 */
export const changelog: ChangelogEntry[] = [
  {
    id: "2026-08-30-ask-ai",
    date: "2026-08-30",
    title: "Ask AI on course files",
    summary:
      "Ask a question about a whole course or any single material, note, or PYQ — opens ChatGPT with a prompt grounded in those files and the course library.",
    items: [
      {
        kind: "added",
        text: "Ask AI (wand) on course file rows opens a question dialog, then ChatGPT with links to the file and course page.",
      },
      {
        kind: "added",
        text: "Course-level Ask AI in the tabs toolbar next to Upload — “AI” on mobile, “Ask AI” on desktop; lists every course file with your question to ChatGPT.",
      },
      {
        kind: "fixed",
        text: "Course Ask AI keeps direct links to notes and PYQ in the ChatGPT prompt first (those tabs are not in the default course-page HTML); material URLs drop first when space is tight.",
      },
    ],
  },
  {
    id: "2026-08-29-drag-drop-upload",
    date: "2026-08-29",
    title: "Drag and drop upload",
    summary:
      "Drop files onto a course Materials, Notes, or PYQ list to upload into that folder — same rename step as the Upload button.",
    items: [
      {
        kind: "added",
        text: "Drag and drop files onto the active course tab to upload into that directory.",
      },
    ],
  },
  {
    id: "2026-08-29-pyq-section",
    date: "2026-08-29",
    title: "PYQ section",
    summary:
      "Previous year questions live in their own course folder and tab, alongside Materials and Notes.",
    items: [
      {
        kind: "added",
        text: "PYQ tab on course pages for previous year questions and midterms.",
      },
      {
        kind: "changed",
        text: "Store PYQ files under each course's pyq/ directory, separate from materials and notes.",
      },
    ],
  },
  {
    id: "2026-08-29-image-uploads",
    date: "2026-08-29",
    title: "Image uploads",
    summary:
      "Course materials and notes can include PNG, JPEG, GIF, WebP, and AVIF images, with in-browser preview.",
    items: [
      {
        kind: "added",
        text: "Upload PNG, JPEG, GIF, WebP, and AVIF images as materials or notes.",
      },
      {
        kind: "added",
        text: "In-browser image preview with the same toolbar as other documents.",
      },
    ],
  },
  {
    id: "2026-08-25-installable-pwa",
    date: "2026-08-25",
    title: "Install to home screen",
    summary:
      "IILM LMS can be installed as an app from Chrome and other browsers, with a standalone window and an offline fallback page.",
    items: [
      {
        kind: "added",
        text: "Web app manifest, icons, and service worker so browsers can offer Install / Add to Home Screen.",
      },
      {
        kind: "added",
        text: "Offline fallback at /~offline when a navigation fails without a network.",
      },
    ],
  },
  {
    id: "2026-08-25-changelog-page",
    date: "2026-08-25",
    title: "Changelog page",
    summary:
      "Public changelog of major product changes, linked from the sidebar. Contributors update `lib/changelog.ts` with user-visible work.",
    items: [
      {
        kind: "added",
        text: "/changelog with curated release themes (not every commit).",
      },
      {
        kind: "changed",
        text: "README Contributing section requires changelog updates for user-visible PRs.",
      },
    ],
  },
  {
    id: "2026-08-25-materials-schedule-data",
    date: "2026-08-25",
    title: "Materials counts & schedule data refresh",
    summary:
      "Course cards and quick links show note counts; timetable and homework stay in sync with current course codes and assignments.",
    items: [
      {
        kind: "changed",
        text: "Sidebar, course cards, and quick links show material and note counts together.",
      },
      {
        kind: "changed",
        text: "Homework list and timetable updated for Physics, Programming in C, Computational Design Thinking, and Applied Calculus.",
      },
      {
        kind: "fixed",
        text: "Upcoming class status label simplified to “Up next”.",
      },
    ],
  },
  {
    id: "2026-08-25-blob-sync",
    date: "2026-08-25",
    title: "Blob → public content sync",
    summary:
      "Routine sync pulls Vercel Blob uploads into `public/content/` so the repo stays the source of truth and Blob storage can be reclaimed.",
    items: [
      {
        kind: "added",
        text: "`bun run sync:blob` with dry-run and keep-blob options.",
      },
      {
        kind: "changed",
        text: "README documents content layout, merge strategy, and sync workflow.",
      },
    ],
  },
  {
    id: "2026-08-24-alerts",
    date: "2026-08-24",
    title: "Dashboard alerts",
    summary:
      "Inline alerts surface important updates and reminders on the dashboard.",
    items: [
      {
        kind: "added",
        text: "Alert system for timely notifications on the home view.",
      },
    ],
  },
  {
    id: "2026-08-23-product-explainer",
    date: "2026-08-23",
    title: "Product explainer",
    summary:
      "Dashboard includes a short video tour of how the student-led LMS works.",
    items: [
      {
        kind: "added",
        text: "Embedded YouTube explainer with a link to watch on YouTube.",
      },
    ],
  },
  {
    id: "2026-08-23-posthog",
    date: "2026-08-23",
    title: "PostHog analytics",
    summary:
      "Production-only analytics via PostHog, with ingest proxied through the app.",
    items: [
      {
        kind: "added",
        text: "Client and server PostHog integration; skipped in local development.",
      },
      {
        kind: "changed",
        text: "Next.js rewrites proxy browser traffic through `/ingest`.",
      },
    ],
  },
  {
    id: "2026-08-23-schedule",
    date: "2026-08-23",
    title: "Class schedule & next class",
    summary:
      "Sidebar schedule, weekly timetable, homework/reminders, and live next-class highlighting on the dashboard.",
    items: [
      {
        kind: "added",
        text: "Schedule page with timetable grid, due tasks, and add-to-calendar (ICS).",
      },
      {
        kind: "added",
        text: "Next-class card and highlighting for the current / upcoming period.",
      },
      {
        kind: "added",
        text: "Sidebar link to Schedule.",
      },
    ],
  },
  {
    id: "2026-08-23-documents",
    date: "2026-08-23",
    title: "In-browser document viewing",
    summary:
      "Open course materials and notes without leaving the app — PDFs in the browser, PPTX and DOCX in dedicated viewers.",
    items: [
      {
        kind: "added",
        text: "Document viewer routes for PPTX and DOCX; PDFs open via the native browser viewer.",
      },
      {
        kind: "changed",
        text: "Sidebar and document tables link materials and notes, including share and download actions.",
      },
    ],
  },
  {
    id: "2026-08-23-shell",
    date: "2026-08-23",
    title: "App shell & course library",
    summary:
      "Student LMS scaffold: sidebar by semester/course, dashboard, contribute uploads, and content from Blob + `public/content/`.",
    items: [
      {
        kind: "added",
        text: "Next.js App Router shell with sidebar, header, and theme support.",
      },
      {
        kind: "added",
        text: "Semester → course browsing, contribute uploads, and Vercel Blob staging.",
      },
    ],
  },
];

export function formatChangelogDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-IN", {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
