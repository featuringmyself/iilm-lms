const MAX_PROMPT_LENGTH = 1900;
/** Only truncate the student question when it alone exceeds this. */
const MAX_QUESTION_CHARS = 800;

const SHORTENED_NOTE =
  "(Question was shortened to fit the chat handoff limit.)";

const URLS_OMITTED_NOTE =
  "(URLs omitted for length — open the course library URL above for every file.)";

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

const KIND_SECTION_ORDER: AskAiFileKind[] = ["material", "note", "pyq"];

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

function courseHeader(
  courseName: string,
  semesterName: string,
  courseUrl: string
): string {
  return `You are a careful tutor for an IILM undergraduate student.

Course: ${courseName} (${semesterName})
Course library URL: ${courseUrl}`;
}

function fileHeader(
  courseName: string,
  semesterName: string,
  fileName: string,
  fileUrl: string,
  courseUrl: string
): string {
  return `You are a careful tutor for an IILM undergraduate student.

Course: ${courseName} (${semesterName})
Primary file: "${fileName}"
File URL: ${fileUrl}
Course library URL: ${courseUrl}`;
}

function howToAnswerCourse(
  tier: InstructionTier,
  urlsComplete: boolean
): string {
  if (tier === "none") return "";

  const prefer = urlsComplete
    ? "Prefer the linked materials above; ground answers in them when you can open them."
    : "Prefer the listed files; open them via the course library URL.";

  if (tier === "minimal") {
    return `How to answer: ${prefer} Say when something is not in those sources. Teach in short steps; hint first on graded work.`;
  }

  const fallback = urlsComplete
    ? "- If that is not enough, use the course library URL (materials, notes, PYQ under pyq/).\n"
    : "";

  return `How to answer
- ${prefer}
${fallback}- Do not invent lecture content, quotes, page numbers, or citations.
- Teach in short steps; hint first on graded work. End with 1–3 follow-ups.`;
}

function howToAnswerFile(tier: InstructionTier): string {
  if (tier === "none") return "";

  if (tier === "minimal") {
    return `How to answer: Prefer the primary file, then the course library URL. Say when something is not in those sources. Teach in short steps; hint first on graded work.`;
  }

  return `How to answer
- Prefer the primary file; ground answers in it when you can open it.
- Else use the course library URL (materials, notes, PYQ under pyq/).
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
  if (withUrl) {
    return `- "${file.name}" — ${file.url}`;
  }
  return `- "${file.name}"`;
}

/**
 * When only some URLs fit, spread them across materials, notes, and PYQ
 * instead of filling materials first and dropping PYQ.
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

  const nextIndex: Record<AskAiFileKind, number> = {
    material: 0,
    note: 0,
    pyq: 0,
  };

  while (withUrls.size < urlCount) {
    let added = false;
    for (const kind of KIND_SECTION_ORDER) {
      if (withUrls.size >= urlCount) break;
      const list = byKind[kind];
      const index = nextIndex[kind];
      if (index < list.length) {
        withUrls.add(list[index]);
        nextIndex[kind] = index + 1;
        added = true;
      }
    }
    if (!added) break;
  }

  return withUrls;
}

/**
 * Lists every file name (grouped by kind). Up to `filesWithUrlCount` files
 * also get absolute URLs, spread across kinds so PYQ is not dropped first.
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
 * Pack priority (never gut the question; always keep file names):
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
