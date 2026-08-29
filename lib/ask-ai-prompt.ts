const MAX_PROMPT_LENGTH = 1700;

const SHORTENED_NOTE =
  "(Question was shortened to fit the chat handoff limit.)";

export interface BuildAskAiPromptInput {
  fileName: string;
  fileUrl: string;
  courseName: string;
  semesterName: string;
  courseUrl: string;
  question: string;
}

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
