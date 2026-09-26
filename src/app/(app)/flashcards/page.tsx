import { FlashcardsHub } from "@/components/flashcards/flashcards-hub";
import { flashcardSubjects } from "@/lib/flashcards";

export const metadata = {
  title: "Flashcards",
  description:
    "Per-subject, per-unit exam revision flashcards for IILM courses.",
};

export default async function FlashcardsPage({
  searchParams,
}: PageProps<"/flashcards">) {
  const params = await searchParams;
  const course =
    typeof params.course === "string" ? params.course : undefined;

  return (
    <FlashcardsHub
      subjects={flashcardSubjects}
      initialCourseSlug={course}
    />
  );
}
