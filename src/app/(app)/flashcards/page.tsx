import { FlashcardsHub } from "@/components/flashcards/flashcards-hub";

export const metadata = {
  title: "Flashcards",
  description:
    "Per-subject, per-unit exam revision flashcards for IILM courses.",
};

export default function FlashcardsPage() {
  return <FlashcardsHub />;
}
