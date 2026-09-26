"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Atom, BookOpen, Play } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import posthog from "posthog-js";

import {
  flashcardDeckHref,
  getReadyFlashcardDecks,
} from "@/lib/flashcards";

const subjectIcons: Record<string, LucideIcon> = {
  "quantum-physics": Atom,
};

export function FlashcardsHub() {
  const decks = useMemo(() => getReadyFlashcardDecks(), []);

  if (decks.length === 0) {
    return (
      <div className="py-16 text-center text-[13px] text-muted-foreground">
        No decks yet.
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 pb-8">
      <h1
        className="text-[28px] leading-none tracking-tight text-foreground sm:text-[32px]"
        style={{
          fontFamily: "var(--font-flash-serif), ui-serif, Georgia, serif",
        }}
      >
        Flashcards
      </h1>

      <ul className="flex flex-col gap-3">
        {decks.map((deck) => {
          const Icon = subjectIcons[deck.courseSlug] ?? BookOpen;
          const count =
            deck.minimumExamSet?.length ??
            deck.cards.filter((c) => c.priority === "A").length ??
            deck.cards.length;

          return (
            <li key={`${deck.courseSlug}-${deck.unitSlug}`}>
              <Link
                href={flashcardDeckHref(deck)}
                onClick={() =>
                  posthog.capture("flashcard_deck_clicked", {
                    course_slug: deck.courseSlug,
                    unit_slug: deck.unitSlug,
                  })
                }
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card px-4 py-4 transition-colors hover:border-foreground/20 hover:bg-muted/40"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                  <Icon className="size-4" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
                    {deck.unitLabel}
                  </p>
                  <p className="mt-0.5 truncate text-[15px] font-semibold tracking-tight text-foreground">
                    {deck.courseName}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] tabular-nums text-muted-foreground">
                    {count} cards
                  </p>
                </div>
                <span className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-[var(--flash-yellow)] px-3.5 text-[13px] font-bold text-[#111] transition-transform group-active:scale-[0.98]">
                  <Play className="size-3 fill-current" strokeWidth={2} />
                  Start
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
