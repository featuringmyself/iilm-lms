export type FlashcardPriority = "A" | "B" | "C";

export type FlashcardType =
  | "derivation"
  | "long_answer"
  | "numerical"
  | "probability"
  | "concept"
  | "short_answer"
  | "formula_revision"
  | "exam_method"
  | "mock_exam";

export interface Flashcard {
  id: string;
  front: string;
  /** Plain-text fallback / primary answer line */
  back: string;
  priority?: FlashcardPriority;
  cardType?: FlashcardType;
  whyExists?: string;
  mustInclude?: string[];
  answerPattern?: string | string[];
  answer?: string | string[];
  diagram?: boolean;
  diagramRequired?: string;
  sources?: string[];
  priorityNote?: string;
}

export interface FlashcardDeck {
  /** Matches course slug from content scanner, e.g. `quantum-physics` */
  courseSlug: string;
  courseName: string;
  semesterSlug: string;
  /** e.g. `unit-3` */
  unitSlug: string;
  unitLabel: string;
  title: string;
  focus: string[];
  cards: Flashcard[];
  /** When false, deck appears as coming soon in the hub */
  ready: boolean;
  courseCode?: string;
  purpose?: string;
  minimumExamSet?: string[];
  formulaSheet?: string[];
  diagramSet?: string[];
}

export interface FlashcardSubject {
  courseSlug: string;
  courseName: string;
  semesterSlug: string;
  units: FlashcardDeck[];
}
