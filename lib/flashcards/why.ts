import type { Flashcard } from "./types";

export interface WhyThis {
  /** Compact provenance chips, e.g. AKTU, IILM, Tutorial */
  chips: string[];
  /** One insight line — never raw provenance dump */
  line: string | null;
  /** Exam caution / revision-only note */
  note: string | null;
}

function uniq(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function shortenSource(source: string): string | null {
  const s = source.trim();
  const assignment = s.match(/IILM\s+Assignment\s+(Q\d+)/i);
  if (assignment) return `IILM ${assignment[1]}`;
  if (/^IILM\s+tutorial/i.test(s)) return "Tutorial";
  if (/AKTU\s+repeated/i.test(s)) return null; // covered by chips
  if (/current SLM/i.test(s)) return "SLM";
  return null;
}

const INSIGHT_VERB =
  /\b(tests?|prevents?|combines?|forces?|creates?|connects?|makes?|ensures?|reduces?|helps?|bridges?|worth|required when|must be|can be asked|provides|forms the|directly tests|ensures you)\b/i;

const PROVENANCE_ONLY =
  /^(this\s+)?(is\s+)?(the\s+)?(direct|exact|very\s+common|often\s+bundled|explicitly\s+(included|listed)|a\s+natural\s+follow-up|not\s+just\s+one)/i;

function capitalize(line: string): string {
  if (!line) return line;
  return line[0]!.toUpperCase() + line.slice(1);
}

/** Pull the teaching insight out of whyExists; drop exam-bank provenance. */
function extractInsight(why: string): string | null {
  const cleaned = why.trim().replace(/\s+/g, " ");
  if (!cleaned) return null;

  // Split into clauses on ". " and " and " when left side is provenance.
  const sentences = cleaned
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const keep: string[] = [];
  for (const sentence of sentences) {
    if (!INSIGHT_VERB.test(sentence)) {
      // Pure "appears in / listed in / recurring" provenance — skip.
      if (
        /\b(appears? in|listed in|included in|recurring|repeatedly|exact IILM|direct IILM|tutorial problem|AKTU|UPTU|assignment)\b/i.test(
          sentence
        ) &&
        !INSIGHT_VERB.test(sentence)
      ) {
        continue;
      }
      // Short provenance-only openers
      if (PROVENANCE_ONLY.test(sentence) && sentence.length < 120) {
        continue;
      }
      continue;
    }

    let line = sentence;
    // Trim leading provenance clause before an insight verb.
    line = line.replace(
      /^.+?\b(tests?|prevents?|combines?|forces?|creates?|connects?|makes?|ensures?|reduces?|helps?|bridges?|provides|forms|worth)\b/i,
      (_m, verb: string) => capitalize(String(verb))
    );
    // If that ate too much, fall back to original sentence without provenance prefix.
    if (line.length < 8) {
      line = sentence
        .replace(
          /^(This\s+)?(exact\s+)?(numerical|problem|question)?\s*(appears in|is)\s+.+?\.\s*/i,
          ""
        )
        .replace(
          /^(Direct|Exact)\s+IILM\s+\w+\s+question\s+and\s+(a\s+)?/i,
          ""
        )
        .trim();
      line = capitalize(line);
    }

    line = line
      .replace(/\bin the IILM tutorial and repeatedly in older UPTU\/AKTU material\.?/gi, "")
      .replace(/\brepeatedly used in IILM and AKTU exams\.?/gi, "used in exams.")
      .replace(/\s{2,}/g, " ")
      .replace(/\s+\./g, ".")
      .trim();

    if (line.length >= 16) keep.push(line.replace(/\.$/, ""));
  }

  if (keep.length === 0) {
    // Whole string has an insight verb — use a tightened version.
    if (INSIGHT_VERB.test(cleaned)) {
      let line = cleaned
        .replace(/^(This\s+)?/i, "")
        .replace(/\s{2,}/g, " ")
        .trim();
      line = capitalize(line).replace(/\.$/, "");
      // Still too provenance-heavy?
      if (
        line.length > 140 ||
        /^(Direct|Exact)\b/i.test(line) ||
        (/IILM|AKTU|UPTU|tutorial|assignment|SLM/i.test(line) &&
          (line.match(/\b(IILM|AKTU|UPTU|tutorial|assignment|SLM)\b/gi)?.length ??
            0) >= 2 &&
          !/\b(tests|prevents|combines|forces|connects|makes|ensures)\b/i.test(
            line
          ))
      ) {
        // Try to keep only from insight verb onward.
        const m = line.match(
          /\b(tests?|prevents?|combines?|forces?|creates?|connects?|makes?|ensures?|reduces?|helps?|bridges?|provides|forms|worth)\b[\s\S]+/i
        );
        if (m) line = capitalize(m[0]!).replace(/\.$/, "");
        else return null;
      }
      if (line.length >= 16 && line.length <= 160) return line;
    }
    return null;
  }

  const joined = keep.join(". ");
  if (joined.length > 160) return keep[0]!;
  return joined;
}

/** Distill card provenance into chips + one insight line for the study UI. */
export function distillWhyThis(card: Flashcard): WhyThis | null {
  const why = card.whyExists?.trim() ?? "";
  const note = card.priorityNote?.trim() || null;
  const sources = card.sources ?? [];
  const blob = `${why} ${sources.join(" ")}`;

  const chips: string[] = [];

  if (/\bAKTU\b/i.test(blob) || /\bUPTU\b/i.test(blob)) chips.push("AKTU");
  if (/\bIILM\b/i.test(blob)) chips.push("IILM");
  if (/\btutorial\b/i.test(blob)) chips.push("Tutorial");
  if (/\bSLM\b/i.test(blob)) chips.push("SLM");
  if (/\b(recurring|repeated|repeat|common)\b/i.test(blob)) {
    chips.push("Repeated");
  }
  if (/\bhighest[- ]value\b/i.test(why) || /\bmost important\b/i.test(why)) {
    chips.push("High yield");
  }

  for (const source of sources) {
    const short = shortenSource(source);
    if (short) chips.push(short);
  }

  const uniqueChips = uniq(chips).slice(0, 4);
  const line = why ? extractInsight(why) : null;

  if (uniqueChips.length === 0 && !line && !note) return null;

  return {
    chips: uniqueChips,
    line,
    note,
  };
}
