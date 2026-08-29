const MAX_PROMPT_LENGTH = 1900;
/** Only truncate the student question when it alone exceeds this. */
const MAX_QUESTION_CHARS = 800;
/**
 * Cap for file (and optionally course) names in the packed prompt.
 * Full names stay in the UI; only the ChatGPT `?q=` string shortens.
 */
const MAX_FILE_NAME_CHARS = 64;
/** Soft cap for course titles in the prompt header. */
const MAX_COURSE_NAME_CHARS = 72;

const SHORTENED_NOTE =
  "(Question was shortened to fit the chat handoff limit.)";

const URLS_OMITTED_NOTE =
  "(Some material URLs omitted for length — open those from the course library Materials tab. Notes/PYQ keep direct links above when present.)";

export type AskAiFileKind = "material" | "note" | "pyq";

export interface AskAiCourseFile {
  name: string;
  url: string;
  kind: AskAiFileKind;
}

export interface BuildAskAiPromptInput {
  fileName: string;
  fileUrl: string;
  courseName: string;
  semesterName: string;
  courseUrl: string;
  question: string;
}

export interface BuildCourseAskAiPromptInput {
  courseName: string;
  semesterName: string;
  courseUrl: string;
  files: AskAiCourseFile[];
  question: string;
}

/** Display order in the prompt. */
const KIND_SECTION_ORDER: AskAiFileKind[] = ["material", "note", "pyq"];

/**
 * URL budget order: notes/PYQ first — they are not in the default course-page
 * HTML (Materials tab only). Materials can still be opened from that page.
 */
const URL_PRIORITY_ORDER: AskAiFileKind[] = ["pyq", "note", "material"];

const KIND_SECTION_LABEL: Record<AskAiFileKind, string> = {
  material: "Materials",
  note: "Notes",
  pyq: "Previous-year questions (PYQ)",
};

type InstructionTier = "full" | "minimal" | "none";

/**
 * Keep the full trimmed question unless it alone exceeds MAX_QUESTION_CHARS.
 * Never return an empty / ellipsis-only question.
 */
function clampStudentQuestion(question: string): string {
  const trimmed = question.trim();
  if (trimmed.length === 0) return trimmed;
  if (trimmed.length <= MAX_QUESTION_CHARS) return trimmed;

  const head = trimmed.slice(0, MAX_QUESTION_CHARS).trimEnd();
  return `${head}\n…\n${SHORTENED_NOTE}`;
}

/**
 * Middle-ellipsis shorten for prompt packing. Leaves short names alone;
 * preserves a useful tail (extension / distinctive ending).
 */
export function shortenFileName(
  name: string,
  maxLen: number = MAX_FILE_NAME_CHARS
): string {
  if (name.length <= maxLen) return name;
  if (maxLen <= 1) return "…";
  if (maxLen <= 3) return `${name.slice(0, maxLen - 1)}…`;

  const ellipsis = "…";
  const budget = maxLen - ellipsis.length;
  // ~2/3 head + ~1/3 tail so extensions and endings stay readable.
  const keepEnd = Math.max(4, Math.floor(budget / 3));
  const keepStart = budget - keepEnd;

  return `${name.slice(0, keepStart)}${ellipsis}${name.slice(-keepEnd)}`;
}

function courseHeader(
  courseName: string,
  semesterName: string,
  courseUrl: string
): string {
  const displayCourse = shortenFileName(courseName, MAX_COURSE_NAME_CHARS);
  return `You are a careful tutor for an IILM undergraduate student.

Course: ${displayCourse} (${semesterName})
Course library URL: ${courseUrl}`;
}

function fileHeader(
  courseName: string,
  semesterName: string,
  fileName: string,
  fileUrl: string,
  courseUrl: string
): string {
  const displayCourse = shortenFileName(courseName, MAX_COURSE_NAME_CHARS);
  const displayFile = shortenFileName(fileName);
  return `You are a careful tutor for an IILM undergraduate student.

Course: ${displayCourse} (${semesterName})
Primary file: "${displayFile}"
File URL: ${fileUrl}
Course library URL: ${courseUrl}`;
}

function howToAnswerCourse(
  tier: InstructionTier,
  urlsComplete: boolean
): string {
  if (tier === "none") return "";

  const prefer = urlsComplete
    ? "Prefer the linked files above; ground answers in them when you can open them."
    : "Prefer files that have URLs above. Materials without a URL are on the course library Materials tab.";

  if (tier === "minimal") {
    return `How to answer: ${prefer} Say when something is not in those sources. Teach in short steps; hint first on graded work.`;
  }

  return `How to answer
- ${prefer}
- Do not invent lecture content, quotes, page numbers, or citations.
- Teach in short steps; hint first on graded work. End with 1–3 follow-ups.`;
}

function howToAnswerFile(tier: InstructionTier): string {
  if (tier === "none") return "";

  if (tier === "minimal") {
    return `How to answer: Prefer the primary file, then other links on the course library page. Say when something is not in those sources. Teach in short steps; hint first on graded work.`;
  }

  return `How to answer
- Prefer the primary file; ground answers in it when you can open it.
- Else use other file links on the course library page (Materials tab lists course materials).
- Do not invent lecture content, quotes, page numbers, or citations.
- Teach in short steps; hint first on graded work. End with 1–3 follow-ups.`;
}

function assembleParts(parts: string[]): string {
  return parts.filter((part) => part.length > 0).join("\n\n");
}

function orderedCourseFiles(files: AskAiCourseFile[]): AskAiCourseFile[] {
  return KIND_SECTION_ORDER.flatMap((kind) =>
    files.filter((file) => file.kind === kind)
  );
}

function formatFileLine(file: AskAiCourseFile, withUrl: boolean): string {
  const displayName = shortenFileName(file.name);
  if (withUrl) {
    return `- "${displayName}" — ${file.url}`;
  }
  return `- "${displayName}"`;
}

/**
 * Prefer notes/PYQ URLs when the budget is tight — those files are not linked
 * on the default course-page Materials tab; materials still are.
 */
function pickFilesWithUrls(
  orderedFiles: AskAiCourseFile[],
  urlCount: number
): Set<AskAiCourseFile> {
  const withUrls = new Set<AskAiCourseFile>();
  if (urlCount <= 0) return withUrls;

  const byKind: Record<AskAiFileKind, AskAiCourseFile[]> = {
    material: [],
    note: [],
    pyq: [],
  };
  for (const file of orderedFiles) {
    byKind[file.kind].push(file);
  }

  for (const kind of URL_PRIORITY_ORDER) {
    for (const file of byKind[kind]) {
      if (withUrls.size >= urlCount) return withUrls;
      withUrls.add(file);
    }
  }

  return withUrls;
}

/**
 * Lists every file name (grouped by kind). Up to `filesWithUrlCount` files
 * also get absolute URLs — notes/PYQ before materials when space is limited.
 */
function formatFilesSection(
  orderedFiles: AskAiCourseFile[],
  filesWithUrlCount: number,
  urlsOmitted: boolean
): string {
  if (orderedFiles.length === 0) {
    return "Files for this course:\n(No files listed — use the course library URL above.)";
  }

  const filesWithUrls = pickFilesWithUrls(orderedFiles, filesWithUrlCount);
  const groups: string[] = [];
  let index = 0;

  for (const kind of KIND_SECTION_ORDER) {
    const kindFiles: AskAiCourseFile[] = [];
    while (
      index < orderedFiles.length &&
      orderedFiles[index].kind === kind
    ) {
      kindFiles.push(orderedFiles[index]);
      index += 1;
    }
    if (kindFiles.length === 0) continue;

    const lines = kindFiles.map((file) =>
      formatFileLine(file, filesWithUrls.has(file))
    );

    groups.push(`${KIND_SECTION_LABEL[kind]}:\n${lines.join("\n")}`);
  }

  let section = `Files for this course:\n${groups.join("\n\n")}`;

  if (urlsOmitted) {
    section = `${section}\n${URLS_OMITTED_NOTE}`;
  }

  return section;
}

/**
 * Builds a curated ChatGPT `?q=` prompt for a course file.
 * Soft-caps by shrinking instructions first; only clamps the question at ~800 chars.
 */
export function buildAskAiPrompt({
  fileName,
  fileUrl,
  courseName,
  semesterName,
  courseUrl,
  question,
}: BuildAskAiPromptInput): string {
  const questionText = clampStudentQuestion(question);
  const header = fileHeader(
    courseName,
    semesterName,
    fileName,
    fileUrl,
    courseUrl
  );
  const questionBlock = `Student question:\n${questionText}`;

  const tiers: InstructionTier[] = ["full", "minimal", "none"];
  for (const tier of tiers) {
    const candidate = assembleParts([
      header,
      questionBlock,
      howToAnswerFile(tier),
    ]);
    if (candidate.length <= MAX_PROMPT_LENGTH) {
      return candidate;
    }
  }

  // Prefer keeping the question + URLs over the soft cap rather than gutting it.
  return assembleParts([header, questionBlock]);
}

/**
 * Builds a curated ChatGPT `?q=` prompt for a whole course (all files).
 *
 * Pack priority (never gut the question; always keep every file, names
 * middle-ellipsis shortened for budget):
 * a/b/c header + full question + all names, then d URLs, e omit-note, f how-to.
 * Over budget: drop URLs first, then shrink/drop how-to — never replace the
 * question with "…". Question alone is only clamped at ~800 chars.
 */
export function buildCourseAskAiPrompt({
  courseName,
  semesterName,
  courseUrl,
  files,
  question,
}: BuildCourseAskAiPromptInput): string {
  const questionText = clampStudentQuestion(question);
  const ordered = orderedCourseFiles(files);
  const totalFiles = ordered.length;
  const header = courseHeader(courseName, semesterName, courseUrl);
  const questionBlock = `Student question:\n${questionText}`;

  function build(urlCount: number, tier: InstructionTier): string {
    const urlsComplete = totalFiles === 0 || urlCount >= totalFiles;
    const urlsOmitted = totalFiles > 0 && urlCount < totalFiles;
    return assembleParts([
      header,
      questionBlock,
      formatFilesSection(ordered, urlCount, urlsOmitted),
      howToAnswerCourse(tier, urlsComplete),
    ]);
  }

  const tiers: InstructionTier[] = ["full", "minimal", "none"];

  // Drop URLs first while keeping the current how-to tier; only then shrink how-to.
  for (const tier of tiers) {
    for (let urlCount = totalFiles; urlCount >= 0; urlCount -= 1) {
      const candidate = build(urlCount, tier);
      if (candidate.length <= MAX_PROMPT_LENGTH) {
        return candidate;
      }
    }
  }

  // Soft-cap overflow from huge name lists: keep question + names, never "…".
  return build(0, "none");
}
