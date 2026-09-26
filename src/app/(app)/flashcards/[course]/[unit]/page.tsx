import { notFound } from "next/navigation";

import { FlashcardStudy } from "@/components/flashcards/flashcard-study";
import {
  allFlashcardDecks,
  getFlashcardDeck,
} from "@/lib/flashcards";

export function generateStaticParams() {
  return allFlashcardDecks
    .filter((deck) => deck.ready && deck.cards.length > 0)
    .map((deck) => ({
      course: deck.courseSlug,
      unit: deck.unitSlug,
    }));
}

export async function generateMetadata({
  params,
}: PageProps<"/flashcards/[course]/[unit]">) {
  const { course, unit } = await params;
  const deck = getFlashcardDeck(course, unit);
  if (!deck) return { title: "Flashcards" };
  return {
    title: `${deck.unitLabel} · ${deck.courseName}`,
    description: deck.title,
  };
}

export default async function FlashcardDeckPage({
  params,
}: PageProps<"/flashcards/[course]/[unit]">) {
  const { course, unit } = await params;
  const deck = getFlashcardDeck(course, unit);

  if (!deck || !deck.ready || deck.cards.length === 0) {
    notFound();
  }

  return <FlashcardStudy deck={deck} />;
}
