import { slugify } from "./slug";
import type { ContentTree, Course, Semester } from "./types";

export interface MatchedCourse {
  semester: Semester;
  course: Course;
  href: string;
  score: number;
}

const STOP_WORDS = new Set([
  "and",
  "for",
  "the",
  "of",
  "in",
  "a",
  "an",
  "to",
  "lab",
  "laboratory",
  "engineers",
]);

function normalizeTokens(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

/** Simple edit distance for near-miss folder typos (e.g. comupational). */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i - 1;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = temp;
    }
  }
  return row[b.length];
}

function tokensSimilar(a: string, b: string): boolean {
  if (a === b) return true;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen <= 3) return false;
  const distance = levenshtein(a, b);
  return distance <= Math.max(1, Math.floor(maxLen * 0.25));
}

function scoreSubjectAgainstCourse(
  subjectName: string,
  course: Course
): number {
  const subjectSlug = slugify(subjectName);
  if (subjectSlug === course.slug) return 100;

  // Strip trailing "lab" for slug compare: "applied-calculus-lab" ≈ "applied-calculus"
  const subjectSlugNoLab = subjectSlug.replace(/-lab$/, "");
  if (subjectSlugNoLab === course.slug) return 95;

  const subjectTokens = normalizeTokens(subjectName);
  const courseTokens = normalizeTokens(course.name);

  if (subjectTokens.length === 0 || courseTokens.length === 0) return 0;

  let matched = 0;
  for (const ct of courseTokens) {
    if (subjectTokens.some((st) => tokensSimilar(st, ct))) {
      matched += 1;
    }
  }

  const coverage = matched / courseTokens.length;
  if (matched === 0) return 0;

  // Need solid coverage so "Physics Lab" doesn't steal every physics-adjacent subject
  if (courseTokens.length === 1) {
    return coverage >= 1 ? 70 : 0;
  }
  if (matched < 2 && coverage < 0.67) return 0;

  return Math.round(40 + coverage * 50);
}

/**
 * Fuzzy-map a timetable subject name onto a content course.
 * Returns null when nothing is reasonably close.
 */
export function matchScheduleSubjectToCourse(
  subjectName: string,
  tree: ContentTree
): MatchedCourse | null {
  let best: MatchedCourse | null = null;

  for (const semester of tree.semesters) {
    for (const course of semester.courses) {
      const score = scoreSubjectAgainstCourse(subjectName, course);
      if (score < 55) continue;
      if (!best || score > best.score) {
        best = {
          semester,
          course,
          href: `/${semester.slug}/${course.slug}`,
          score,
        };
      }
    }
  }

  return best;
}
