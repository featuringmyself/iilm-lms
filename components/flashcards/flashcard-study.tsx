"use client";

import Link from "next/link";
import {
  useEffect,
  useEffectEvent,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  Check,
  Flame,
  ListChecks,
  Pencil,
  Play,
  RotateCcw,
  Shuffle,
  Undo2,
} from "lucide-react";
import posthog from "posthog-js";

import {
  FormulaBlock,
  SmartMathText,
  looksLikeFormula,
} from "@/components/flashcards/formula";
import type {
  Flashcard,
  FlashcardDeck,
  FlashcardPriority,
} from "@/lib/flashcards";
import {
  bumpFlashStreak,
  readFlashStreak,
  type FlashStreak,
} from "@/lib/flashcards/streak";
import { cn } from "@/lib/utils";

type Rate = "known" | "learning";
type StudyFilter = "all" | "cram" | FlashcardPriority;
type Phase = "lobby" | "study";

type StudyAction =
  | { type: "flip" }
  | { type: "rate"; rate: Rate }
  | { type: "shuffle" }
  | { type: "restart"; cards: Flashcard[] };

interface StudyState {
  queue: Flashcard[];
  index: number;
  flipped: boolean;
  knownIds: Set<string>;
  learningHits: number;
  knownHits: number;
  direction: 1 | -1;
  animKey: number;
  done: boolean;
}

function shuffleCards(cards: Flashcard[]): Flashcard[] {
  const next = [...cards];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function initState(cards: Flashcard[]): StudyState {
  return {
    queue: shuffleCards(cards),
    index: 0,
    flipped: false,
    knownIds: new Set(),
    learningHits: 0,
    knownHits: 0,
    direction: 1,
    animKey: 0,
    done: cards.length === 0,
  };
}

function studyReducer(state: StudyState, action: StudyAction): StudyState {
  switch (action.type) {
    case "flip":
      return { ...state, flipped: !state.flipped };
    case "rate": {
      const current = state.queue[state.index];
      if (!current) return state;

      const knownIds = new Set(state.knownIds);
      let queue = [...state.queue];
      let learningHits = state.learningHits;
      let knownHits = state.knownHits;

      if (action.rate === "known") {
        knownIds.add(current.id);
        knownHits += 1;
        queue = queue.filter((card) => card.id !== current.id);
      } else {
        knownIds.delete(current.id);
        learningHits += 1;
        const [card] = queue.splice(state.index, 1);
        queue.push(card);
      }

      if (queue.length === 0) {
        return {
          ...state,
          queue,
          knownIds,
          learningHits,
          knownHits,
          flipped: false,
          done: true,
          animKey: state.animKey + 1,
        };
      }

      return {
        ...state,
        queue,
        index: Math.min(state.index, queue.length - 1),
        knownIds,
        learningHits,
        knownHits,
        flipped: false,
        direction: 1,
        animKey: state.animKey + 1,
        done: false,
      };
    }
    case "shuffle": {
      const remaining = state.queue.filter((c) => !state.knownIds.has(c.id));
      const pool = remaining.length > 0 ? remaining : state.queue;
      return {
        ...state,
        queue: shuffleCards(pool),
        index: 0,
        flipped: false,
        direction: 1,
        animKey: state.animKey + 1,
        done: pool.length === 0,
      };
    }
    case "restart":
      return initState(action.cards);
    default:
      return state;
  }
}

function filterCards(deck: FlashcardDeck, filter: StudyFilter): Flashcard[] {
  if (filter === "all") return deck.cards;
  if (filter === "cram") {
    const set = new Set(deck.minimumExamSet ?? []);
    if (set.size === 0) return deck.cards.filter((c) => c.priority === "A");
    return deck.cards.filter((c) => set.has(c.id));
  }
  return deck.cards.filter((c) => c.priority === filter);
}

function asLines(value?: string | string[]): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function typeLabel(type?: string): string {
  if (!type) return "card";
  return type.replaceAll("_", " ");
}

interface FlashcardStudyProps {
  deck: FlashcardDeck;
}

export function FlashcardStudy({ deck }: FlashcardStudyProps) {
  const hasCram = (deck.minimumExamSet?.length ?? 0) > 0;
  const [phase, setPhase] = useState<Phase>("lobby");
  const [filter, setFilter] = useState<StudyFilter>(hasCram ? "cram" : "all");
  const [streak, setStreak] = useState<FlashStreak>(() => readFlashStreak());
  const [burst, setBurst] = useState<"known" | "learning" | null>(null);
  const activeCards = useMemo(
    () => filterCards(deck, filter),
    [deck, filter]
  );
  const [state, dispatch] = useReducer(studyReducer, activeCards, initState);
  const touchStartX = useRef<number | null>(null);
  const titleId = useId();

  const counts = useMemo(() => {
    const a = deck.cards.filter((c) => c.priority === "A").length;
    const b = deck.cards.filter((c) => c.priority === "B").length;
    const c = deck.cards.filter((c) => c.priority === "C").length;
    return {
      all: deck.cards.length,
      cram: deck.minimumExamSet?.length ?? a,
      A: a,
      B: b,
      C: c,
    };
  }, [deck]);

  const total = activeCards.length;
  const remaining = state.queue.length;
  const mastered = Math.max(0, total - remaining);
  const progress = total === 0 ? 0 : Math.round((mastered / total) * 100);
  const current = state.queue[state.index];
  const depthLeft = Math.min(2, Math.max(0, remaining - 1));

  useEffect(() => {
    posthog.capture("flashcard_deck_opened", {
      course_slug: deck.courseSlug,
      unit_slug: deck.unitSlug,
      card_count: deck.cards.length,
    });
  }, [deck.courseSlug, deck.unitSlug, deck.cards.length]);

  function startSession(nextFilter: StudyFilter = filter) {
    const cards = filterCards(deck, nextFilter);
    setFilter(nextFilter);
    dispatch({ type: "restart", cards });
    setPhase("study");
    posthog.capture("flashcard_session_started", {
      course_slug: deck.courseSlug,
      unit_slug: deck.unitSlug,
      filter: nextFilter,
      card_count: cards.length,
    });
  }

  function handleRate(rate: Rate) {
    posthog.capture("flashcard_rated", {
      course_slug: deck.courseSlug,
      unit_slug: deck.unitSlug,
      rate,
      priority: current?.priority,
      card_id: current?.id,
    });
    const finishing =
      rate === "known" && state.queue.length === 1 && Boolean(current);
    setBurst(rate);
    window.setTimeout(() => setBurst(null), 320);
    dispatch({ type: "rate", rate });
    if (finishing) {
      const nextStreak = bumpFlashStreak();
      setStreak(nextStreak);
      posthog.capture("flashcard_session_complete", {
        course_slug: deck.courseSlug,
        unit_slug: deck.unitSlug,
        filter,
        known: state.knownHits + 1,
        learning: state.learningHits,
        streak: nextStreak.count,
      });
    }
  }

  const onRateKey = useEffectEvent((rate: Rate) => {
    handleRate(rate);
  });

  useEffect(() => {
    if (phase !== "study") return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement) return;
      if (state.done) {
        if (event.key === "r" || event.key === "R") {
          dispatch({ type: "restart", cards: activeCards });
        }
        return;
      }

      switch (event.key) {
        case " ":
        case "Enter":
          event.preventDefault();
          if (!state.flipped) dispatch({ type: "flip" });
          break;
        case "1":
          if (state.flipped) onRateKey("learning");
          break;
        case "2":
          if (state.flipped) onRateKey("known");
          break;
        case "s":
        case "S":
          dispatch({ type: "shuffle" });
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeCards, phase, state.done, state.flipped]);


  if (phase === "lobby") {
    return (
      <DeckLobby
        deck={deck}
        counts={counts}
        hasCram={hasCram}
        streak={streak}
        onStart={startSession}
      />
    );
  }

  if (state.done) {
    return (
      <SessionComplete
        deck={deck}
        total={total}
        knownHits={state.knownHits}
        learningHits={state.learningHits}
        filter={filter}
        counts={counts}
        streak={streak}
        onRestart={() => startSession(filter)}
        onFullBank={() => startSession("all")}
        onLobby={() => setPhase("lobby")}
      />
    );
  }

  const cardNumber = Math.min(mastered + 1, total);

  return (
    <div
      className={cn(
        "flash-immerse -mx-3 flex min-h-[calc(100svh-7.5rem)] flex-col transition-colors duration-500 sm:-mx-6 sm:min-h-[calc(100svh-8rem)]",
        state.flipped ? "flash-immerse-check" : "flash-immerse-prompt",
        burst === "known" && "flash-burst-known",
        burst === "learning" && "flash-burst-again"
      )}
    >
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-5 sm:px-6 sm:pb-7">
        <div className="flex items-center gap-3 pt-2 pb-4 text-[var(--flash-ink)]">
          <button
            type="button"
            onClick={() => setPhase("lobby")}
            className="inline-flex size-10 items-center justify-center rounded-full border-2 border-[var(--flash-ink)]/20 bg-[var(--flash-card)]/40 transition-transform active:scale-95"
            aria-label="Back to deck"
          >
            <ArrowLeft className="size-4" strokeWidth={2} />
          </button>
          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-[13px] font-semibold tracking-tight">
              {deck.unitLabel}
            </p>
            <p className="text-[11px] opacity-70">{filterLabel(filter)}</p>
          </div>
          <div className="flex items-center gap-1.5">
            {streak.count > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--flash-ink)]/10 px-2 py-1 font-mono text-[11px] font-semibold">
                <Flame className="size-3.5" strokeWidth={2} />
                {streak.count}
              </span>
            ) : null}
            <span className="rounded-full bg-[var(--flash-ink)]/10 px-2.5 py-1 font-mono text-[12px] font-semibold tabular-nums">
              {String(cardNumber).padStart(2, "0")}/
              {String(total).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-[var(--flash-ink)]/15">
          <div
            className="flash-progress-bar h-full rounded-full bg-[var(--flash-ink)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="relative flex flex-1 flex-col justify-center py-2">
          <div
            key={state.animKey}
            className="flash-card-enter relative"
            onTouchStart={(e) => {
              touchStartX.current = e.changedTouches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
              const start = touchStartX.current;
              const end = e.changedTouches[0]?.clientX;
              touchStartX.current = null;
              if (start == null || end == null || !state.flipped) return;
              const delta = end - start;
              if (Math.abs(delta) < 64) return;
              if (delta < 0) handleRate("known");
              else handleRate("learning");
            }}
          >
            {depthLeft >= 2 ? (
              <div className="flash-stack-layer flash-stack-2" aria-hidden />
            ) : null}
            {depthLeft >= 1 ? (
              <div className="flash-stack-layer flash-stack-1" aria-hidden />
            ) : null}

            <button
              type="button"
              className={cn(
                "flash-scene group relative z-10 block w-full cursor-pointer text-left",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--flash-ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--flash-stage)]"
              )}
              onClick={() => {
                if (!state.flipped) dispatch({ type: "flip" });
              }}
              aria-labelledby={titleId}
              aria-pressed={state.flipped}
            >
              <div className={cn("flash-card", state.flipped && "is-flipped")}>
                <div className="flash-face flash-face-front">
                  <CardMeta card={current} side="prompt" />
                  <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-1">
                    <p
                      id={titleId}
                      className="flash-face-text mx-auto max-w-prose text-balance text-center text-[22px] font-semibold leading-tight tracking-tight text-zinc-900 sm:text-[26px]"
                    >
                      {current?.front && looksLikeFormula(current.front) ? (
                        <SmartMathText text={current.front} formulaDisplay />
                      ) : (
                        current?.front
                      )}
                    </p>
                    {current?.diagram ? (
                      <p className="mx-auto mt-6 inline-flex items-center gap-1.5 rounded-full bg-zinc-900/5 px-3 py-1.5 text-[11px] font-medium text-zinc-600">
                        <Pencil className="size-3" strokeWidth={2} />
                        Draw this
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="flash-face flash-face-back">
                  <CardMeta card={current} side="answer" />
                  <div
                    className="min-h-0 min-w-0 flex-1 overflow-auto overscroll-contain"
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                  >
                    <CardAnswer card={current} />
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-4 pb-[max(0.25rem,env(safe-area-inset-bottom))]">
          {!state.flipped ? (
            <button
              type="button"
              onClick={() => dispatch({ type: "flip" })}
              className="flash-flip-cta mx-auto flex h-14 w-full max-w-xs items-center justify-center gap-2 rounded-full border-2 border-[var(--flash-ink)] bg-transparent text-[15px] font-semibold tracking-wide text-[var(--flash-ink)] transition-transform active:scale-[0.98]"
            >
              flip
              <span aria-hidden>→</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRate("learning")}
                className="flash-rate-forgot flex h-16 flex-col items-center justify-center gap-0.5 rounded-[1.25rem] border-2 border-[var(--flash-ink)]/25 bg-[var(--flash-card)]/50 text-[var(--flash-ink)] transition-transform active:scale-[0.97]"
              >
                <span className="inline-flex items-center gap-1.5 text-[15px] font-semibold">
                  <Undo2 className="size-4" strokeWidth={2} />
                  Forgot
                </span>
                <span className="text-[11px] opacity-60">comes back</span>
              </button>
              <button
                type="button"
                onClick={() => handleRate("known")}
                className="flash-rate-know flex h-16 flex-col items-center justify-center gap-0.5 rounded-[1.25rem] bg-[var(--flash-ink)] text-[var(--flash-stage)] transition-transform active:scale-[0.97]"
              >
                <span className="inline-flex items-center gap-1.5 text-[15px] font-semibold">
                  <Check className="size-4" strokeWidth={2.5} />
                  Know it
                </span>
                <span className="text-[11px] opacity-70">locked</span>
              </button>
            </div>
          )}
          <div className="flex items-center justify-center gap-4 text-[var(--flash-ink)]/55">
            <button
              type="button"
              aria-label="Shuffle"
              onClick={() => dispatch({ type: "shuffle" })}
              className="rounded-full p-2 transition-colors hover:text-[var(--flash-ink)]"
            >
              <Shuffle className="size-4" strokeWidth={2} />
            </button>
            <p className="font-mono text-[10px] tracking-wide uppercase">
              {current?.id}
              {current?.cardType ? ` · ${typeLabel(current.cardType)}` : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function filterLabel(filter: StudyFilter): string {
  switch (filter) {
    case "cram":
      return "Cram set";
    case "A":
      return "Priority A";
    case "B":
      return "Priority B";
    case "C":
      return "Priority C";
    default:
      return "Full bank";
  }
}

function DeckLobby({
  deck,
  counts,
  hasCram,
  streak,
  onStart,
}: {
  deck: FlashcardDeck;
  counts: Record<StudyFilter, number>;
  hasCram: boolean;
  streak: FlashStreak;
  onStart: (filter: StudyFilter) => void;
}) {
  const [showFormulas, setShowFormulas] = useState(false);
  const priorityTotal = counts.A + counts.B + counts.C || 1;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 sm:space-y-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link
            href="/flashcards"
            className="mb-3 inline-flex items-center gap-1 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" strokeWidth={1.75} />
            All decks
          </Link>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {deck.unitLabel}
          </p>
          <h1 className="mt-1 text-[28px] font-semibold tracking-tight text-foreground sm:text-4xl">
            {deck.courseName}
          </h1>
          <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
            {deck.courseCode ?? deck.title}
          </p>
        </div>
        {streak.count > 0 ? (
          <div className="shrink-0 rounded-2xl border border-border bg-card px-3 py-2.5 text-center">
            <Flame className="mx-auto size-4 text-orange-500" strokeWidth={2} />
            <p className="mt-1 text-xl font-semibold tabular-nums">{streak.count}</p>
            <p className="font-mono text-[10px] text-muted-foreground">day streak</p>
          </div>
        ) : null}
      </div>

      <section className="flash-lobby-hero relative overflow-hidden rounded-[1.75rem] bg-[oklch(0.88_0.14_85)] p-6 text-zinc-900 sm:p-8 dark:bg-[oklch(0.82_0.14_85)]">
        <div className="relative space-y-5">
          <p className="text-[12px] font-semibold tracking-[0.16em] uppercase opacity-70">
            Commit to a set
          </p>
          <h2 className="max-w-md text-[26px] font-semibold leading-tight tracking-tight sm:text-3xl">
            One short session beats a panic re-read.
          </h2>
          <p className="max-w-md text-[14px] leading-relaxed opacity-75">
            Think → flip → rate. Misses loop back. Wins leave the queue. That&apos;s
            how memory sticks.
          </p>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            {hasCram ? (
              <button
                type="button"
                onClick={() => onStart("cram")}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-zinc-900 px-5 text-[14px] font-semibold text-[oklch(0.88_0.14_85)] transition-transform active:scale-[0.98]"
              >
                <Play className="size-4" strokeWidth={2} />
                Start cram · {counts.cram}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => onStart("A")}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border-2 border-zinc-900/20 px-5 text-[14px] font-semibold transition-transform active:scale-[0.98]"
            >
              Priority A · {counts.A}
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-[12px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Mix
        </h3>
        <div className="flex h-3 overflow-hidden rounded-full bg-muted">
          <div className="bg-zinc-900 dark:bg-zinc-100" style={{ width: `${(counts.A / priorityTotal) * 100}%` }} />
          <div className="bg-zinc-900/45 dark:bg-zinc-100/45" style={{ width: `${(counts.B / priorityTotal) * 100}%` }} />
          <div className="bg-zinc-900/20 dark:bg-zinc-100/20" style={{ width: `${(counts.C / priorityTotal) * 100}%` }} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              ["A", "Must prep", counts.A],
              ["B", "Next up", counts.B],
              ["C", "Quick", counts.C],
            ] as const
          ).map(([key, label, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => onStart(key)}
              className="rounded-2xl border border-border bg-card px-3 py-3.5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
            >
              <p className="font-mono text-[10px] text-muted-foreground">P{key}</p>
              <p className="mt-0.5 text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
              <p className="text-[11px] text-muted-foreground">{label}</p>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onStart("all")}
          className="w-full rounded-full border border-border py-3 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Full bank · {counts.all}
        </button>
      </section>

      {deck.diagramSet && deck.diagramSet.length > 0 ? (
        <section className="space-y-2.5">
          <h3 className="flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            <Pencil className="size-3.5" strokeWidth={1.75} />
            Draw cold
          </h3>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {deck.diagramSet.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-border bg-card px-3 py-2.5 text-[12px] text-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {deck.formulaSheet && deck.formulaSheet.length > 0 ? (
        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          <button
            type="button"
            onClick={() => setShowFormulas((v) => !v)}
            className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/40"
          >
            <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-foreground">
              <ListChecks className="size-4 text-muted-foreground" strokeWidth={1.75} />
              Formula sheet
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              {showFormulas ? "Hide" : "Peek"}
            </span>
          </button>
          {showFormulas ? (
            <ul className="space-y-2 border-t border-border px-4 py-3">
              {deck.formulaSheet.map((formula) => (
                <li key={formula}>
                  <FormulaBlock expr={formula} />
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function SessionComplete({
  deck,
  total,
  knownHits,
  learningHits,
  filter,
  counts,
  streak,
  onRestart,
  onFullBank,
  onLobby,
}: {
  deck: FlashcardDeck;
  total: number;
  knownHits: number;
  learningHits: number;
  filter: StudyFilter;
  counts: Record<StudyFilter, number>;
  streak: FlashStreak;
  onRestart: () => void;
  onFullBank: () => void;
  onLobby: () => void;
}) {
  return (
    <div className="flash-complete-stage -mx-3 flex min-h-[calc(100svh-7.5rem)] flex-col items-center justify-center px-4 py-10 sm:-mx-6 sm:min-h-[calc(100svh-8rem)]">
      <div className="flash-complete relative w-full max-w-md overflow-hidden rounded-[1.75rem] bg-white px-6 py-10 text-center text-zinc-900 shadow-xl sm:px-10 sm:py-12">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-[oklch(0.72_0.19_145)] text-white shadow-lg">
          <Check className="size-8" strokeWidth={2.5} />
        </div>
        <p className="text-[12px] font-semibold tracking-[0.18em] text-[oklch(0.55_0.15_145)] uppercase">
          Good job
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Queue cleared
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-zinc-600">
          {total} cards from {deck.unitLabel}. Real retrieval — not passive scrolling.
        </p>
        <div className="mx-auto mt-8 grid max-w-xs grid-cols-3 gap-2">
          <StatPill label="Know" value={knownHits} />
          <StatPill label="Forgot" value={learningHits} />
          <StatPill label="Streak" value={streak.count} />
        </div>
        <div className="mt-8 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-zinc-900 text-[14px] font-semibold text-white transition-transform active:scale-[0.98]"
          >
            <RotateCcw className="size-4" strokeWidth={2} />
            Run it back
          </button>
          {filter !== "all" ? (
            <button
              type="button"
              onClick={onFullBank}
              className="inline-flex h-12 items-center justify-center rounded-full border-2 border-zinc-900/15 text-[14px] font-semibold text-zinc-700"
            >
              Full bank · {counts.all}
            </button>
          ) : (
            <button
              type="button"
              onClick={onLobby}
              className="inline-flex h-12 items-center justify-center rounded-full border-2 border-zinc-900/15 text-[14px] font-semibold text-zinc-700"
            >
              Deck home
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CardMeta({
  card,
  side,
}: {
  card?: Flashcard;
  side: "prompt" | "answer";
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {card?.priority ? (
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-zinc-900 px-2 font-mono text-[11px] font-bold text-white">
            {card.priority}
          </span>
        ) : null}
        {card?.cardType ? (
          <span className="rounded-full bg-zinc-900/5 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-zinc-500 uppercase">
            {typeLabel(card.cardType)}
          </span>
        ) : null}
      </div>
      <span className="font-mono text-[10px] font-semibold tracking-[0.14em] text-zinc-400 uppercase">
        {side === "prompt" ? "Prompt" : "Check"}
        {card?.id ? ` · ${card.id}` : ""}
      </span>
    </div>
  );
}

function CardAnswer({ card }: { card?: Flashcard }) {
  if (!card) return null;
  const answers = asLines(card.answer);
  const patterns = asLines(card.answerPattern);
  const mustInclude = card.mustInclude ?? [];

  return (
    <div className="min-w-0 w-full space-y-3.5 overflow-x-auto overscroll-x-contain">
      {answers.length > 0 ? (
        <div className="space-y-2">
          {answers.map((line) =>
            looksLikeFormula(line) ? (
              <FormulaBlock key={line} expr={line.replace(/\.$/, "")} />
            ) : (
              <p
                key={line}
                className="text-balance text-[16px] leading-relaxed text-zinc-900 sm:text-[17px]"
              >
                <SmartMathText text={line} />
              </p>
            )
          )}
        </div>
      ) : null}

      {patterns.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-zinc-400 uppercase">
            Pattern
          </p>
          {patterns.map((line) => (
            <FormulaBlock key={line} expr={line.replace(/\.$/, "")} />
          ))}
        </div>
      ) : null}

      {mustInclude.length > 0 ? (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-zinc-400 uppercase">
            Must include
          </p>
          <ul className="space-y-2">
            {mustInclude.map((item, i) => (
              <li key={item} className="flex gap-2.5">
                <span className="mt-1 font-mono text-[10px] text-zinc-400 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1 text-[13px] leading-snug text-zinc-800">
                  {looksLikeFormula(item) ? (
                    <FormulaBlock expr={item} />
                  ) : (
                    <SmartMathText text={item} />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {!answers.length && !patterns.length && !mustInclude.length ? (
        looksLikeFormula(card.back) ? (
          <FormulaBlock expr={card.back.replace(/\.$/, "")} />
        ) : (
          <p className="text-balance text-[16px] leading-relaxed text-zinc-900 sm:text-[17px]">
            <SmartMathText text={card.back} />
          </p>
        )
      ) : null}

      {card.diagramRequired ? (
        <p className="rounded-xl border border-dashed border-zinc-300 px-3 py-2.5 text-[12px] leading-relaxed text-zinc-600">
          <span className="font-semibold text-zinc-900">Draw · </span>
          {card.diagramRequired}
        </p>
      ) : null}

      {card.priorityNote ? (
        <p className="text-[12px] leading-relaxed text-zinc-500">{card.priorityNote}</p>
      ) : null}
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-zinc-100 px-3 py-3 text-left">
      <p className="text-[10px] font-semibold tracking-[0.12em] text-zinc-500 uppercase">
        {label}
      </p>
      <p className="mt-0.5 text-2xl font-semibold tabular-nums tracking-tight text-zinc-900">
        {value}
      </p>
    </div>
  );
}
