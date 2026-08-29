const MAX_PROMPT_LENGTH = 1700;

const SHORTENED_NOTE =
  "(Question was shortened to fit the chat handoff limit.)";

const MORE_FILES_NOTE_PREFIX = "(…and ";

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
2. If the primary file is not enough or you cannot access it, use the course library URL to find other relevant files for this same subject, or tell the student exactly which linked file on that page they should open next.
3. If you still cannot verify something from those sources, say so clearly (e.g. "Not in the linked materials") instead of inventing lecture content, quotes, page numbers, or fake citations.
4. Teach clearly: short sections, steps, and formulas when useful. For graded homework, give a hint or method first; provide a full worked solution only if they still need it.
5. End with 1–3 follow-up study questions the student can try, tied to this course when possible.

Student question:
${params.question}`;
}

function formatFileLine(file: AskAiCourseFile): string {
  return `- "${file.name}" — ${file.url}`;
}

function formatFilesSection(
  files: AskAiCourseFile[],
  omittedCount: number,
  courseUrl: string
): string {
  if (files.length === 0 && omittedCount === 0) {
    return "(No files listed — use the course library URL above.)";
  }

  const groups: string[] = [];

  for (const kind of KIND_SECTION_ORDER) {
    const kindFiles = files.filter((file) => file.kind === kind);
    if (kindFiles.length === 0) continue;

    groups.push(
      `${KIND_SECTION_LABEL[kind]}:\n${kindFiles.map(formatFileLine).join("\n")}`
    );
  }

  let section = groups.join("\n\n");

  if (omittedCount > 0) {
    const moreNote = `${MORE_FILES_NOTE_PREFIX}${omittedCount} more file${omittedCount === 1 ? "" : "s"} on the course page: ${courseUrl})`;
    section = section ? `${section}\n${moreNote}` : moreNote;
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
2. If the listed files are not enough or you cannot access them, use the course library URL to find other relevant files for this same subject, or tell the student exactly which linked file on that page they should open next.
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
 * Soft-caps length by omitting trailing files first, then truncating the question.
 */
export function buildCourseAskAiPrompt({
  courseName,
  semesterName,
  courseUrl,
  files,
  question,
}: BuildCourseAskAiPromptInput): string {
  const trimmedQuestion = question.trim();
  const totalFiles = files.length;

  function promptWith(includedCount: number, questionText: string): string {
    const included = files.slice(0, includedCount);
    const omittedCount = totalFiles - includedCount;
    return buildCoursePromptBody({
      courseName,
      semesterName,
      courseUrl,
      filesSection: formatFilesSection(included, omittedCount, courseUrl),
      question: questionText,
    });
  }

  // Prefer the full question; drop trailing files until it fits.
  for (let includedCount = totalFiles; includedCount >= 0; includedCount -= 1) {
    const candidate = promptWith(includedCount, trimmedQuestion);
    if (candidate.length <= MAX_PROMPT_LENGTH) {
      return candidate;
    }
  }

  // Question still overflows — keep as many files as fit with a truncated question.
  const questionOverhead = `\n…\n${SHORTENED_NOTE}`.length;

  for (let includedCount = totalFiles; includedCount >= 0; includedCount -= 1) {
    const withEmptyQuestion = promptWith(includedCount, "");
    const available =
      MAX_PROMPT_LENGTH - withEmptyQuestion.length - questionOverhead;

    if (available <= 0) continue;

    const truncatedQuestion = trimmedQuestion.slice(0, available).trimEnd();
    const candidate = promptWith(
      includedCount,
      `${truncatedQuestion}\n…\n${SHORTENED_NOTE}`
    );

    if (candidate.length <= MAX_PROMPT_LENGTH) {
      return candidate;
    }
  }

  // Extremely long URLs/names: keep instructions + course URL only.
  const fallback = promptWith(0, "");
  return `${fallback.trimEnd()}\n…\n${SHORTENED_NOTE}`.slice(
    0,
    MAX_PROMPT_LENGTH
  );
}
