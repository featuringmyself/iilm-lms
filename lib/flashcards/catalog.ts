import { quantumPhysicsUnit3 } from "./decks/quantum-physics-unit-3";
import type { FlashcardDeck, FlashcardSubject } from "./types";

function placeholderDeck(
  courseSlug: string,
  courseName: string,
  unitNumber: number,
  title: string
): FlashcardDeck {
  return {
    courseSlug,
    courseName,
    semesterSlug: "1stsem",
    unitSlug: `unit-${unitNumber}`,
    unitLabel: `Unit ${unitNumber}`,
    title,
    focus: [],
    cards: [],
    ready: false,
  };
}

const quantumPhysicsUnits: FlashcardDeck[] = [
  placeholderDeck(
    "quantum-physics",
    "Quantum Physics",
    1,
    "Crystal Structure & Bonding"
  ),
  placeholderDeck(
    "quantum-physics",
    "Quantum Physics",
    2,
    "Semiconductor Physics Basics"
  ),
  quantumPhysicsUnit3,
  placeholderDeck(
    "quantum-physics",
    "Quantum Physics",
    4,
    "Band Theory & Carrier Statistics"
  ),
  placeholderDeck(
    "quantum-physics",
    "Quantum Physics",
    5,
    "Semiconductor Devices"
  ),
];

const appliedCalculusUnits: FlashcardDeck[] = [1, 2, 3, 4, 5].map((n) =>
  placeholderDeck(
    "applied-calculus",
    "Applied Calculus",
    n,
    `Applied Calculus — Unit ${n}`
  )
);

const cProgrammingUnits: FlashcardDeck[] = [1, 2, 3, 4, 5].map((n) =>
  placeholderDeck(
    "c-programming",
    "C Programming",
    n,
    `C Programming — Unit ${n}`
  )
);

const aiUnits: FlashcardDeck[] = [1, 2, 3, 4, 5].map((n) =>
  placeholderDeck(
    "artificial-intelligence",
    "Artificial Intelligence",
    n,
    `Artificial Intelligence — Unit ${n}`
  )
);

const designThinkingUnits: FlashcardDeck[] = [1, 2, 3, 4].map((n) =>
  placeholderDeck(
    "comupational-design-and-thinking",
    "Comupational Design and Thinking",
    n,
    `Design & Thinking — Unit ${n}`
  )
);

const entrepreneurialUnits: FlashcardDeck[] = [1, 2, 3, 4].map((n) =>
  placeholderDeck(
    "entrepreneurial-mindset",
    "Entrepreneurial Mindset",
    n,
    `Entrepreneurial Mindset — Unit ${n}`
  )
);

const linuxLabUnits: FlashcardDeck[] = [1, 2, 3].map((n) =>
  placeholderDeck("linux-lab", "Linux Lab", n, `Linux Lab — Module ${n}`)
);

/** All subjects with per-unit decks. Ready decks are studyable. */
export const flashcardSubjects: FlashcardSubject[] = [
  {
    courseSlug: "quantum-physics",
    courseName: "Quantum Physics",
    semesterSlug: "1stsem",
    units: quantumPhysicsUnits,
  },
  {
    courseSlug: "applied-calculus",
    courseName: "Applied Calculus",
    semesterSlug: "1stsem",
    units: appliedCalculusUnits,
  },
  {
    courseSlug: "c-programming",
    courseName: "C Programming",
    semesterSlug: "1stsem",
    units: cProgrammingUnits,
  },
  {
    courseSlug: "artificial-intelligence",
    courseName: "Artificial Intelligence",
    semesterSlug: "1stsem",
    units: aiUnits,
  },
  {
    courseSlug: "comupational-design-and-thinking",
    courseName: "Comupational Design and Thinking",
    semesterSlug: "1stsem",
    units: designThinkingUnits,
  },
  {
    courseSlug: "entrepreneurial-mindset",
    courseName: "Entrepreneurial Mindset",
    semesterSlug: "1stsem",
    units: entrepreneurialUnits,
  },
  {
    courseSlug: "linux-lab",
    courseName: "Linux Lab",
    semesterSlug: "1stsem",
    units: linuxLabUnits,
  },
];

export const allFlashcardDecks: FlashcardDeck[] = flashcardSubjects.flatMap(
  (subject) => subject.units
);

export function getFlashcardSubject(
  courseSlug: string
): FlashcardSubject | undefined {
  return flashcardSubjects.find((s) => s.courseSlug === courseSlug);
}

export function getFlashcardDeck(
  courseSlug: string,
  unitSlug: string
): FlashcardDeck | undefined {
  return allFlashcardDecks.find(
    (deck) => deck.courseSlug === courseSlug && deck.unitSlug === unitSlug
  );
}

export function getReadyFlashcardDecks(): FlashcardDeck[] {
  return allFlashcardDecks.filter((deck) => deck.ready && deck.cards.length > 0);
}

export function flashcardDeckHref(deck: FlashcardDeck): string {
  return `/flashcards/${deck.courseSlug}/${deck.unitSlug}`;
}

export function flashcardSubjectHref(courseSlug: string): string {
  return `/flashcards?course=${courseSlug}`;
}
