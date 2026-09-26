"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
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

import { getCourseTheme } from "@/lib/course-themes";
import {
  flashcardDeckHref,
  getReadyFlashcardDecks,
  type FlashcardDeck,
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

  const cardCount = useMemo(
    () => readyDecks.reduce((sum, d) => sum + d.cards.length, 0),
    [readyDecks]
  );

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
      <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-[13px] text-muted-foreground">
        No flashcard decks yet.
      </div>
    );
  }

  const theme = getCourseTheme(subject.courseSlug);
  const Icon = subjectIcons[subject.courseSlug] ?? theme.icon ?? BookOpen;

  return (
    <div className="space-y-7 sm:space-y-9">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            Study
          </p>
          <h1 className="mt-1 text-[28px] font-semibold tracking-tight text-foreground sm:text-4xl">
            Flashcards
          </h1>
          <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-muted-foreground">
            Short active-recall sessions. Misses loop back. Wins leave the queue.
          </p>
        </div>
        {streak.count > 0 ? (
          <div className="shrink-0 rounded-2xl border border-border bg-card px-3.5 py-2.5 text-center shadow-sm">
            <Flame className="mx-auto size-4 text-orange-500" strokeWidth={2} />
            <p className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight">
              {streak.count}
            </p>
            <p className="font-mono text-[10px] text-muted-foreground">
              day streak
            </p>
          </div>
        ) : null}
      </header>

      {featured ? (
        <FeaturedDeck
          deck={featured}
          totalCards={cardCount}
          streak={streak.count}
        />
      ) : null}

      <div>
        <h2 className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Subjects
        </h2>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {subjects.map((item) => {
            const SubjectIcon = subjectIcons[item.courseSlug] ?? BookOpen;
            const isActive = item.courseSlug === subject.courseSlug;
            const live = item.units.some((u) => u.ready);
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
                  "inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[12px] transition-all duration-200",
                  isActive
                    ? "border-foreground bg-foreground text-background shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                )}
              >
                <SubjectIcon className="size-3.5" strokeWidth={1.75} />
                <span className="font-medium">{item.courseName}</span>
                {live ? (
                  <span
                    className={cn(
                      "flash-live-dot size-1.5 rounded-full",
                      isActive ? "bg-background/70" : "bg-emerald-500"
                    )}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-2xl border border-border/50",
              theme.iconBg
            )}
          >
            <Icon className={cn("size-4", theme.iconColor)} strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
              {subject.courseName}
            </h3>
            <p className="font-mono text-[11px] tabular-nums text-muted-foreground">
              {subject.units.filter((u) => u.ready).length} live ·{" "}
              {subject.units.length} units
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subject.units.map((deck, index) => (
            <UnitDeckCard key={deck.unitSlug} deck={deck} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}

function FeaturedDeck({
  deck,
  totalCards,
  streak,
}: {
  deck: FlashcardDeck;
  totalCards: number;
  streak: number;
}) {
  const a = deck.cards.filter((c) => c.priority === "A").length;
  const cram = deck.minimumExamSet?.length ?? a;

  return (
    <Link
      href={flashcardDeckHref(deck)}
      onClick={() =>
        posthog.capture("flashcard_featured_clicked", {
          course_slug: deck.courseSlug,
          unit_slug: deck.unitSlug,
        })
      }
      className="flash-featured group relative block overflow-hidden rounded-[1.75rem] bg-[oklch(0.88_0.14_85)] p-6 text-zinc-900 transition-transform active:scale-[0.995] sm:p-8 dark:bg-[oklch(0.82_0.14_85)]"
    >
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-lg space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900/10 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wide uppercase">
              <span className="flash-live-dot size-1.5 rounded-full bg-emerald-600" />
              Live
            </span>
            <span className="font-mono text-[11px] opacity-70">
              {deck.unitLabel} · {deck.cards.length} Qs · {cram} cram
            </span>
            {streak > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900/10 px-2 py-1 font-mono text-[11px] font-semibold">
                <Flame className="size-3" strokeWidth={2} />
                {streak}
              </span>
            ) : null}
          </div>
          <h2 className="text-[26px] font-semibold tracking-tight sm:text-[32px]">
            {deck.courseName}
          </h2>
          <p className="max-w-md text-[14px] leading-relaxed opacity-75">
            Think → flip → Forgot / Know it. Built for exam retrieval, not
            re-reading notes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/70 px-3.5 py-2.5 backdrop-blur-sm">
            <p className="font-mono text-[10px] uppercase opacity-60">Library</p>
            <p className="text-lg font-semibold tabular-nums">{totalCards}</p>
          </div>
          <span className="inline-flex h-12 items-center gap-2 rounded-full bg-zinc-900 px-5 text-[13px] font-semibold text-[oklch(0.88_0.14_85)] transition-transform group-hover:scale-[1.02]">
            <Play className="size-3.5" strokeWidth={2} />
            Open deck
            <ArrowUpRight className="size-3.5 opacity-70" strokeWidth={2} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function UnitDeckCard({
  deck,
  index,
}: {
  deck: FlashcardDeck;
  index: number;
}) {
  const ready = deck.ready && deck.cards.length > 0;
  const a = deck.cards.filter((c) => c.priority === "A").length;
  const b = deck.cards.filter((c) => c.priority === "B").length;
  const c = deck.cards.filter((c) => c.priority === "C").length;
  const mixTotal = a + b + c || 1;

  const inner = (
    <>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
            {deck.unitLabel}
          </p>
          <h4 className="text-[14px] font-semibold leading-snug tracking-tight text-foreground">
            {ready ? deck.title : `${deck.unitLabel} — coming soon`}
          </h4>
        </div>
        {ready ? (
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover:scale-105">
            <Play className="size-3.5" strokeWidth={2} />
          </span>
        ) : (
          <Lock
            className="size-3.5 shrink-0 text-muted-foreground"
            strokeWidth={1.75}
          />
        )}
      </div>

      {ready ? (
        <>
          <div className="mb-3 flex h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="bg-foreground"
              style={{ width: `${(a / mixTotal) * 100}%` }}
            />
            <div
              className="bg-foreground/40"
              style={{ width: `${(b / mixTotal) * 100}%` }}
            />
            <div
              className="bg-foreground/15"
              style={{ width: `${(c / mixTotal) * 100}%` }}
            />
          </div>
          <div className="mt-auto flex items-center justify-between gap-2">
            <p className="font-mono text-[11px] tabular-nums text-muted-foreground">
              {deck.cards.length} Qs
              {deck.minimumExamSet?.length
                ? ` · ${deck.minimumExamSet.length} cram`
                : ""}
            </p>
            <span className="text-[12px] font-semibold text-muted-foreground transition-colors group-hover:text-foreground">
              Study →
            </span>
          </div>
        </>
      ) : (
        <p className="mt-auto font-mono text-[11px] text-muted-foreground">
          Slot reserved
        </p>
      )}
    </>
  );

  if (!ready) {
    return (
      <div
        className="flash-unit-in flex h-full min-h-35 flex-col rounded-2xl border border-dashed border-border bg-muted/15 p-4 opacity-70"
        style={{ animationDelay: `${index * 45}ms` }}
      >
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={flashcardDeckHref(deck)}
      onClick={() =>
        posthog.capture("flashcard_deck_clicked", {
          course_slug: deck.courseSlug,
          unit_slug: deck.unitSlug,
        })
      }
      className={cn(
        "flash-unit-in group flex h-full min-h-35 flex-col rounded-2xl border border-border bg-card p-4",
        "transition-all duration-200 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
      style={{ animationDelay: `${index * 45}ms` }}
    >
      {inner}
    </Link>
  );
}
