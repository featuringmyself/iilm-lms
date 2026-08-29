const MAX_PROMPT_LENGTH = 1700;

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

function buildPromptBody(params: {
  fileName: string;
  fileUrl: string;
  courseName: string;
  semesterName: string;
  courseUrl: string;
  question: string;
}): string {
  return `You are a careful tutor for an IILM undergraduate student.

Context
- Course: ${params.courseName} (${params.semesterName})
- Primary file: "${params.fileName}"
- File URL: ${params.fileUrl}
- Full course library (materials, notes, previous-year questions — open any of these if needed): ${params.courseUrl}

How to answer
1. Prefer the primary file. If you can open/fetch it, ground your answer in that material and say when you used it.
2. If the primary file is not enough or you cannot access it, open the course library URL and follow its file links (materials, notes, and PYQ under a pyq/ path — not the course folder root). Or tell the student which linked file to open next.
3. If you still cannot verify something from those sources, say so clearly (e.g. "Not in the linked materials") instead of inventing lecture content, quotes, page numbers, or fake citations.
4. Teach clearly: short sections, steps, and formulas when useful. For graded homework, give a hint or method first; provide a full worked solution only if they still need it.
5. End with 1–3 follow-up study questions the student can try, tied to this course when possible.

Student question:
${params.question}`;
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
    return "(No files listed — use the course library URL above.)";
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

  let section = groups.join("\n\n");

  if (urlsOmitted) {
    section = `${section}\n${URLS_OMITTED_NOTE}`;
  }

  return section;
}

function buildCoursePromptBody(params: {
  courseName: string;
  semesterName: string;
  courseUrl: string;
  filesSection: string;
  question: string;
}): string {
  return `You are a careful tutor for an IILM undergraduate student.

Context
- Course: ${params.courseName} (${params.semesterName})
- Course library URL: ${params.courseUrl}
- Files for this course:
${params.filesSection}

How to answer
1. Prefer the linked materials above. If you can open/fetch them, ground your answer in those files and say when you used them.
2. If the listed files are not enough or you cannot access them, open the course library URL and follow its file links (materials, notes, and PYQ under a pyq/ path — not the course folder root). Or tell the student which linked file to open next.
3. If you still cannot verify something from those sources, say so clearly (e.g. "Not in the linked materials") instead of inventing lecture content, quotes, page numbers, or fake citations.
4. Teach clearly: short sections, steps, and formulas when useful. For graded homework, give a hint or method first; provide a full worked solution only if they still need it.
5. End with 1–3 follow-up study questions the student can try, tied to this course when possible.

Student question:
${params.question}`;
}

/**
 * Builds a curated ChatGPT `?q=` prompt for a course file.
 * Soft-caps length by truncating only the student question when needed.
 */
export function buildAskAiPrompt({
  fileName,
  fileUrl,
  courseName,
  semesterName,
  courseUrl,
  question,
}: BuildAskAiPromptInput): string {
  const trimmedQuestion = question.trim();

  const full = buildPromptBody({
    fileName,
    fileUrl,
    courseName,
    semesterName,
    courseUrl,
    question: trimmedQuestion,
  });

  if (full.length <= MAX_PROMPT_LENGTH) {
    return full;
  }

  const withEmptyQuestion = buildPromptBody({
    fileName,
    fileUrl,
    courseName,
    semesterName,
    courseUrl,
    question: "",
  });

  // Reserve room for ellipsis + shortened note under the truncated question.
  const overhead = `\n…\n${SHORTENED_NOTE}`.length;
  const available = MAX_PROMPT_LENGTH - withEmptyQuestion.length - overhead;

  if (available <= 0) {
    // Extremely long URLs/names: keep instructions + URLs, drop the question body.
    return `${withEmptyQuestion.trimEnd()}\n…\n${SHORTENED_NOTE}`.slice(
      0,
      MAX_PROMPT_LENGTH
    );
  }

  const truncatedQuestion = trimmedQuestion.slice(0, available).trimEnd();

  return buildPromptBody({
    fileName,
    fileUrl,
    courseName,
    semesterName,
    courseUrl,
    question: `${truncatedQuestion}\n…\n${SHORTENED_NOTE}`,
  });
}

/**
 * Builds a curated ChatGPT `?q=` prompt for a whole course (all files).
 * Soft-caps length by omitting file URLs first, then truncating the question —
 * never by dropping file names.
 */
export function buildCourseAskAiPrompt({
  courseName,
  semesterName,
  courseUrl,
  files,
  question,
}: BuildCourseAskAiPromptInput): string {
  const trimmedQuestion = question.trim();
  const ordered = orderedCourseFiles(files);
  const totalFiles = ordered.length;
  const questionOverhead = `\n…\n${SHORTENED_NOTE}`.length;

  function promptWith(urlCount: number, questionText: string): string {
    const urlsOmitted = totalFiles > 0 && urlCount < totalFiles;
    return buildCoursePromptBody({
      courseName,
      semesterName,
      courseUrl,
      filesSection: formatFilesSection(ordered, urlCount, urlsOmitted),
      question: questionText,
    });
  }

  // Prefer the full question; drop URLs until it fits (all names always stay).
  for (let urlCount = totalFiles; urlCount >= 0; urlCount -= 1) {
    const candidate = promptWith(urlCount, trimmedQuestion);
    if (candidate.length <= MAX_PROMPT_LENGTH) {
      return candidate;
    }
  }

  // Question still overflows — keep as many URLs as fit with a truncated question.
  for (let urlCount = totalFiles; urlCount >= 0; urlCount -= 1) {
    const withEmptyQuestion = promptWith(urlCount, "");
    const available =
      MAX_PROMPT_LENGTH - withEmptyQuestion.length - questionOverhead;

    if (available <= 0) continue;

    const truncatedQuestion = trimmedQuestion.slice(0, available).trimEnd();
    const candidate = promptWith(
      urlCount,
      `${truncatedQuestion}\n…\n${SHORTENED_NOTE}`
    );

    if (candidate.length <= MAX_PROMPT_LENGTH) {
      return candidate;
    }
  }

  // Names secured; drop the question body. Do not slice names to force the soft cap.
  const fallback = promptWith(0, "");
  return `${fallback.trimEnd()}\n…\n${SHORTENED_NOTE}`;
}
