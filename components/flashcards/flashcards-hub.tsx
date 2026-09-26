"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Atom,
  BookOpen,
  Brain,
  Calculator,
  Code2,
  Flame,
  Lightbulb,
  Lock,
  Play,
  Sparkles,
  Terminal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import posthog from "posthog-js";

import {
  flashcardDeckHref,
  getReadyFlashcardDecks,
  type FlashcardSubject,
} from "@/lib/flashcards";
import {
  readFlashStreak,
  type FlashStreak,
} from "@/lib/flashcards/streak";
import { cn } from "@/lib/utils";

const subjectIcons: Record<string, LucideIcon> = {
  "quantum-physics": Atom,
  "applied-calculus": Calculator,
  "c-programming": Code2,
  "artificial-intelligence": Brain,
  "comupational-design-and-thinking": Lightbulb,
  "entrepreneurial-mindset": Sparkles,
  "linux-lab": Terminal,
};

/** Short labels for the subject strip — Duo keeps chrome tiny. */
const subjectShort: Record<string, string> = {
  "quantum-physics": "Physics",
  "applied-calculus": "Calc",
  "c-programming": "C",
  "artificial-intelligence": "AI",
  "comupational-design-and-thinking": "Design",
  "entrepreneurial-mindset": "Startup",
  "linux-lab": "Linux",
};

interface FlashcardsHubProps {
  subjects: FlashcardSubject[];
  initialCourseSlug?: string;
}

export function FlashcardsHub({
  subjects,
  initialCourseSlug,
}: FlashcardsHubProps) {
  const readyDecks = useMemo(() => getReadyFlashcardDecks(), []);
  const featured = readyDecks[0];
  const [streak] = useState<FlashStreak>(() => readFlashStreak());

  const [activeCourse, setActiveCourse] = useState(() =>
    initialCourseSlug &&
    subjects.some((s) => s.courseSlug === initialCourseSlug)
      ? initialCourseSlug
      : (featured?.courseSlug ?? subjects[0]?.courseSlug ?? "")
  );

  const subject =
    subjects.find((s) => s.courseSlug === activeCourse) ?? subjects[0];

  if (!subject) {
    return (
      <div className="py-16 text-center text-[13px] text-muted-foreground">
        No decks yet.
      </div>
    );
  }

  const current =
    subject.units.find((u) => u.ready && u.cards.length > 0) ?? null;
  const startCount =
    current?.minimumExamSet?.length ??
    current?.cards.filter((c) => c.priority === "A").length ??
    current?.cards.length ??
    0;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 pb-8">
      {/* Status — Duo top bar energy */}
      <div className="flex h-10 items-center justify-between">
        <span
          className="text-[22px] leading-none tracking-tight text-foreground"
          style={{
            fontFamily: "var(--font-flash-serif), ui-serif, Georgia, serif",
          }}
        >
          Flashcards
        </span>
        {streak.count > 0 ? (
          <span className="inline-flex items-center gap-1.5 font-mono text-[15px] font-bold tabular-nums text-orange-500">
            <Flame className="size-5 fill-orange-500/20" strokeWidth={2.25} />
            {streak.count}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 font-mono text-[15px] font-bold tabular-nums text-muted-foreground/40">
            <Flame className="size-5" strokeWidth={2} />
            0
          </span>
        )}
      </div>

      {/* One primary Continue */}
      {current ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <div>
            <p className="text-[12px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              {current.unitLabel}
            </p>
            <h2
              className="mt-1.5 text-[28px] leading-none tracking-tight text-foreground"
              style={{
                fontFamily: "var(--font-flash-serif), ui-serif, Georgia, serif",
              }}
            >
              {subject.courseName}
            </h2>
          </div>
          <Link
            href={flashcardDeckHref(current)}
            onClick={() =>
              posthog.capture("flashcard_featured_clicked", {
                course_slug: current.courseSlug,
                unit_slug: current.unitSlug,
              })
            }
            className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[var(--flash-yellow)] text-[16px] font-bold tracking-wide text-[#111] shadow-[0_6px_0_0_#c4b020] transition-transform active:translate-y-1 active:shadow-none"
          >
            <Play className="size-4 fill-current" strokeWidth={2} />
            Start
            <span className="font-mono text-[13px] font-semibold opacity-55">
              {startCount}
            </span>
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl bg-muted/40 px-4 py-8 text-center text-[13px] text-muted-foreground">
          Nothing live in this subject yet.
        </div>
      )}

      {/* Subject strip */}
      <div className="flex justify-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
        {subjects.map((item) => {
          const SubjectIcon = subjectIcons[item.courseSlug] ?? BookOpen;
          const isActive = item.courseSlug === subject.courseSlug;
          const live = item.units.some((u) => u.ready && u.cards.length > 0);
          return (
            <button
              key={item.courseSlug}
              type="button"
              onClick={() => {
                setActiveCourse(item.courseSlug);
                posthog.capture("flashcard_subject_selected", {
                  course_slug: item.courseSlug,
                });
              }}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3 text-[12px] font-semibold transition-colors",
                isActive
                  ? "bg-foreground text-background"
                  : live
                    ? "bg-muted text-foreground hover:bg-muted/80"
                    : "bg-transparent text-muted-foreground/50"
              )}
            >
              <SubjectIcon className="size-3.5" strokeWidth={2} />
              {subjectShort[item.courseSlug] ?? item.courseName}
            </button>
          );
        })}
      </div>

      {/* Learning path */}
      <ol className="relative mx-auto flex w-full max-w-[220px] flex-col items-center">
        {subject.units.map((deck, index) => {
          const ready = deck.ready && deck.cards.length > 0;
          const isCurrent = current?.unitSlug === deck.unitSlug;
          const unitNum = index + 1;

          return (
            <li
              key={deck.unitSlug}
              className="relative flex w-full flex-col items-center"
            >
              {index > 0 ? (
                <div
                  className={cn(
                    "h-7 w-1.5 rounded-full",
                    ready ||
                      subject.units
                        .slice(0, index)
                        .some((u) => u.ready && u.cards.length > 0)
                      ? "bg-foreground/20"
                      : "bg-border"
                  )}
                  aria-hidden
                />
              ) : null}

              {ready ? (
                <Link
                  href={flashcardDeckHref(deck)}
                  onClick={() =>
                    posthog.capture("flashcard_deck_clicked", {
                      course_slug: deck.courseSlug,
                      unit_slug: deck.unitSlug,
                    })
                  }
                  className={cn(
                    "flash-unit-in group relative flex size-[4.25rem] items-center justify-center rounded-full transition-transform active:scale-95",
                    isCurrent
                      ? "bg-[var(--flash-yellow)] text-[#111] shadow-[0_5px_0_0_#c4b020]"
                      : "bg-card text-foreground ring-[3px] ring-border hover:ring-foreground/25"
                  )}
                  style={{ animationDelay: `${index * 40}ms` }}
                  aria-label={`${deck.unitLabel}${isCurrent ? ", current" : ""}`}
                >
                  {isCurrent ? (
                    <Play className="size-6 fill-current" strokeWidth={2} />
                  ) : (
                    <span className="font-mono text-[18px] font-bold tabular-nums">
                      {unitNum}
                    </span>
                  )}
                </Link>
              ) : (
                <div
                  className="flash-unit-in flex size-[4.25rem] items-center justify-center rounded-full bg-muted/60 text-muted-foreground/50"
                  style={{ animationDelay: `${index * 40}ms` }}
                  aria-label={`${deck.unitLabel}, locked`}
                >
                  <Lock className="size-4" strokeWidth={2} />
                </div>
              )}

              <p
                className={cn(
                  "mt-2 max-w-[9rem] text-center text-[11px] font-medium leading-tight",
                  ready ? "text-foreground" : "text-muted-foreground/50"
                )}
              >
                {deck.unitLabel}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
