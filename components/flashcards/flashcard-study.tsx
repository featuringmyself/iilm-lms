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
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Flame,
  ListChecks,
  Pencil,
  Play,
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
import { distillWhyThis } from "@/lib/flashcards/why";
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

function filterLabel(filter: StudyFilter): string {
  switch (filter) {
    case "cram":
      return "Cram";
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
  const immersive = phase === "study";

  useEffect(() => {
    posthog.capture("flashcard_deck_opened", {
      course_slug: deck.courseSlug,
      unit_slug: deck.unitSlug,
      card_count: deck.cards.length,
    });
  }, [deck.courseSlug, deck.unitSlug, deck.cards.length]);

  useEffect(() => {
    if (!immersive) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [immersive]);

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
    window.setTimeout(() => setBurst(null), 340);
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
        if (event.key === "Escape") setPhase("lobby");
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
        case "Escape":
          setPhase("lobby");
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

  const session = state.done ? (
    <SessionComplete
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
  ) : (
    <StudySession
      deck={deck}
      filter={filter}
      streak={streak}
      burst={burst}
      state={state}
      current={current}
      total={total}
      mastered={mastered}
      progress={progress}
      depthLeft={depthLeft}
      titleId={titleId}
      onBack={() => setPhase("lobby")}
      onFlip={() => dispatch({ type: "flip" })}
      onRate={handleRate}
      onShuffle={() => dispatch({ type: "shuffle" })}
    />
  );

  return createPortal(session, document.body);
}

function StudySession({
  deck,
  filter,
  streak,
  burst,
  state,
  current,
  total,
  mastered,
  progress,
  depthLeft,
  titleId,
  onBack,
  onFlip,
  onRate,
  onShuffle,
}: {
  deck: FlashcardDeck;
  filter: StudyFilter;
  streak: FlashStreak;
  burst: "known" | "learning" | null;
  state: StudyState;
  current?: Flashcard;
  total: number;
  mastered: number;
  progress: number;
  depthLeft: number;
  titleId: string;
  onBack: () => void;
  onFlip: () => void;
  onRate: (rate: Rate) => void;
  onShuffle: () => void;
}) {
  const cardNumber = Math.min(mastered + 1, total);
  const touchStartXRef = useRef<number | null>(null);

  return (
    <div
      className={cn(
        "flash-stage fixed inset-0 z-[100] flex flex-col",
        state.flipped && "is-check",
        burst === "known" && "flash-burst-known",
        burst === "learning" && "flash-burst-again"
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="relative z-10 mx-auto flex h-full w-full max-w-lg flex-col px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8">
        <header className="flex items-center gap-3 pt-2 pb-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Back to deck"
          >
            <ArrowLeft className="size-4" strokeWidth={2} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium tracking-tight text-white">
              {deck.unitLabel}
            </p>
            <p className="text-[11px] text-white/45">{filterLabel(filter)}</p>
          </div>
          <div className="flex items-center gap-2">
            {streak.count > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/8 px-2 py-1 font-mono text-[11px] font-semibold text-[var(--flash-yellow)]">
                <Flame className="size-3.5" strokeWidth={2} />
                {streak.count}
              </span>
            ) : null}
            <span className="font-mono text-[13px] font-semibold tabular-nums text-white/70">
              {cardNumber}{" "}
              <span className="text-white/30">/</span> {total}
            </span>
          </div>
        </header>

        <div className="mb-5 h-[3px] overflow-hidden rounded-full bg-white/10">
          <div
            className="flash-progress-bar h-full rounded-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="relative flex flex-1 flex-col justify-center">
          <div className="flash-rings" aria-hidden />
          <div
            key={state.animKey}
            className="flash-card-enter flash-slab relative"
            onTouchStart={(e) => {
              touchStartXRef.current = e.changedTouches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
              const start = touchStartXRef.current;
              const end = e.changedTouches[0]?.clientX;
              touchStartXRef.current = null;
              if (start == null || end == null || !state.flipped) return;
              const delta = end - start;
              if (Math.abs(delta) < 64) return;
              if (delta < 0) onRate("known");
              else onRate("learning");
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
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070708]"
              )}
              onClick={() => {
                if (!state.flipped) onFlip();
              }}
              aria-labelledby={titleId}
              aria-pressed={state.flipped}
            >
              <div
                key={state.flipped ? "check" : "prompt"}
                className={cn(
                  "flash-slab-card",
                  state.flipped ? "is-check" : "is-prompt"
                )}
              >
                {!state.flipped ? (
                  <>
                    <CardMeta card={current} side="prompt" />
                    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-1 py-3">
                      <p
                        id={titleId}
                        className="flash-face-text mx-auto max-w-[22ch] text-balance text-center text-[23px] font-semibold leading-[1.2] tracking-tight text-[#111] sm:text-[27px]"
                      >
                        {current?.front && looksLikeFormula(current.front) ? (
                          <SmartMathText text={current.front} formulaDisplay />
                        ) : (
                          current?.front
                        )}
                      </p>
                      {current?.diagram ? (
                        <p className="mt-7 inline-flex items-center gap-1.5 rounded-full bg-black/8 px-3 py-1.5 text-[11px] font-semibold text-black/65">
                          <Pencil className="size-3" strokeWidth={2} />
                          Draw this
                        </p>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <>
                    <CardMeta card={current} side="answer" />
                    <div
                      className="min-h-0 min-w-0 flex-1 overflow-auto overscroll-contain"
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchMove={(e) => e.stopPropagation()}
                    >
                      <CardAnswer card={current} />
                    </div>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        <div className="space-y-3 pt-5">
          {state.flipped && current ? <WhyTip card={current} /> : null}

          {!state.flipped ? (
            <button
              type="button"
              onClick={onFlip}
              className="mx-auto flex h-12 w-full max-w-[220px] items-center justify-center gap-2 rounded-full border border-white/25 text-[14px] font-semibold tracking-wide text-white transition-colors hover:bg-white/5 active:scale-[0.98]"
            >
              flip
              <span aria-hidden className="opacity-70">
                →
              </span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3 px-1">
              <button
                type="button"
                onClick={() => onRate("learning")}
                className="flex items-center justify-start gap-2 rounded-2xl px-2 py-3 text-[17px] font-semibold text-[var(--flash-forgot)] transition-opacity hover:opacity-90 active:scale-[0.98]"
              >
                <Undo2 className="size-4" strokeWidth={2.25} />
                Forgot
              </button>
              <button
                type="button"
                onClick={() => onRate("known")}
                className="flex items-center justify-end gap-2 rounded-2xl px-2 py-3 text-[17px] font-semibold text-[var(--flash-know)] transition-opacity hover:opacity-90 active:scale-[0.98]"
              >
                Know it
                <Check className="size-4" strokeWidth={2.5} />
              </button>
            </div>
          )}

          <div className="flex items-center justify-center">
            <button
              type="button"
              aria-label="Shuffle"
              onClick={onShuffle}
              className="rounded-full p-2 text-white/30 transition-colors hover:text-white/70"
            >
              <Shuffle className="size-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
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
  const [showNotes, setShowNotes] = useState(false);
  const defaultFilter: StudyFilter = hasCram ? "cram" : counts.A > 0 ? "A" : "all";
  const defaultCount = counts[defaultFilter];
  const hasNotes =
    (deck.diagramSet?.length ?? 0) > 0 || (deck.formulaSheet?.length ?? 0) > 0;

  return (
    <div className="flex min-h-[calc(100svh-8.5rem)] w-full flex-col items-center justify-center py-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/flashcards"
          className="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="All decks"
        >
          <ArrowLeft className="size-4" strokeWidth={2} />
        </Link>
        {streak.count > 0 ? (
          <span className="inline-flex items-center gap-1.5 font-mono text-[14px] font-semibold tabular-nums text-orange-500">
            <Flame className="size-4" strokeWidth={2.25} />
            {streak.count}
          </span>
        ) : (
          <span className="size-10" aria-hidden />
        )}
      </div>

      <div className="text-center">
        <p className="text-[12px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
          {deck.unitLabel}
        </p>
        <h1
          className="mt-2 text-[36px] leading-none tracking-tight text-foreground sm:text-[40px]"
          style={{
            fontFamily: "var(--font-flash-serif), ui-serif, Georgia, serif",
          }}
        >
          {deck.courseName}
        </h1>
      </div>

      <button
        type="button"
        onClick={() => onStart(defaultFilter)}
        className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[var(--flash-yellow)] text-[16px] font-bold text-[#111] shadow-[0_8px_0_0_#c4b020] transition-transform active:translate-y-1 active:shadow-none"
      >
        <Play className="size-4 fill-current" strokeWidth={2} />
        Start
        <span className="font-mono text-[13px] font-semibold opacity-60">
          {defaultCount}
        </span>
      </button>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {(
          [
            ...(hasCram
              ? [{ key: "cram" as const, label: "Cram", value: counts.cram }]
              : []),
            { key: "A" as const, label: "A", value: counts.A },
            { key: "B" as const, label: "B", value: counts.B },
            { key: "C" as const, label: "C", value: counts.C },
            { key: "all" as const, label: "All", value: counts.all },
          ] as const
        ).map(({ key, label, value }) => (
          <button
            key={key}
            type="button"
            onClick={() => onStart(key)}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[12px] font-semibold transition-colors",
              key === defaultFilter
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
            <span className="font-mono tabular-nums opacity-60">{value}</span>
          </button>
        ))}
      </div>

      {hasNotes ? (
        <div className="border-t border-border pt-4">
          <button
            type="button"
            onClick={() => setShowNotes((v) => !v)}
            aria-expanded={showNotes}
            className="mx-auto flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ListChecks className="size-3.5" strokeWidth={1.75} />
            {showNotes ? "Hide notes" : "Notes"}
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform duration-300 ease-[cubic-bezier(0.2,0.9,0.25,1)]",
                showNotes && "rotate-180"
              )}
              strokeWidth={2}
              aria-hidden
            />
          </button>
          <div
            className={cn(
              "flash-notes-panel",
              showNotes && "is-open"
            )}
            aria-hidden={!showNotes}
          >
            <div className="flash-notes-panel-inner">
              <div className="space-y-4 pt-4">
                {deck.diagramSet && deck.diagramSet.length > 0 ? (
                  <ul className="space-y-1.5">
                    {deck.diagramSet.map((item) => (
                      <li
                        key={item}
                        className="rounded-xl bg-muted/50 px-3 py-2 text-[12px] text-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {deck.formulaSheet && deck.formulaSheet.length > 0 ? (
                  <ul className="space-y-2">
                    {deck.formulaSheet.map((formula) => (
                      <li key={formula}>
                        <FormulaBlock expr={formula} />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
      </div>
    </div>
  );
}

function SessionComplete({
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
    <div className="flash-stage fixed inset-0 z-[100] flex flex-col items-center justify-center px-5">
      <div className="flash-complete relative w-full max-w-sm overflow-hidden rounded-[1.75rem] bg-white px-7 py-10 text-center text-[#111] shadow-2xl">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-[var(--flash-lime)]">
          <Check className="size-8 text-[#111]" strokeWidth={2.75} />
        </div>
        <h2
          className="text-[36px] leading-none tracking-tight"
          style={{
            fontFamily: "var(--font-flash-serif), ui-serif, Georgia, serif",
          }}
        >
          Done
        </h2>
        <div className="mx-auto mt-6 flex max-w-[220px] items-center justify-between gap-3 font-mono text-[13px] tabular-nums text-zinc-500">
          <span>{total}</span>
          <span className="text-[var(--flash-know)]">{knownHits}✓</span>
          <span className="text-[var(--flash-forgot)]">{learningHits}↩</span>
          {streak.count > 0 ? (
            <span className="inline-flex items-center gap-0.5 text-orange-500">
              <Flame className="size-3.5" strokeWidth={2} />
              {streak.count}
            </span>
          ) : null}
        </div>
        <div className="mt-8 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#111] text-[14px] font-semibold text-white transition-transform active:scale-[0.98]"
          >
            Continue
          </button>
          {filter !== "all" ? (
            <button
              type="button"
              onClick={onFullBank}
              className="inline-flex h-11 items-center justify-center text-[13px] font-medium text-zinc-500"
            >
              Full bank · {counts.all}
            </button>
          ) : (
            <button
              type="button"
              onClick={onLobby}
              className="inline-flex h-11 items-center justify-center text-[13px] font-medium text-zinc-500"
            >
              Back
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
    <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {card?.priority ? (
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-black px-2 font-mono text-[11px] font-bold text-white">
            {card.priority}
          </span>
        ) : null}
        {card?.cardType ? (
          <span className="rounded-full bg-black/8 px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] text-black/45 uppercase">
            {typeLabel(card.cardType)}
          </span>
        ) : null}
      </div>
      <span className="font-mono text-[10px] font-semibold tracking-[0.14em] text-black/30 uppercase">
        {side === "prompt" ? "Prompt" : "Check"}
      </span>
    </div>
  );
}

function CardAnswer({ card }: { card?: Flashcard }) {
  if (!card) return null;
  const answers = asLines(card.answer);
  const patterns = asLines(card.answerPattern);
  const mustInclude = card.mustInclude ?? [];
  const hasStructured =
    answers.length > 0 || patterns.length > 0 || mustInclude.length > 0;

  return (
    <div className="flex min-h-full min-w-0 w-full flex-col justify-center py-3">
      <div className="mx-auto w-full max-w-[34rem] space-y-7">
        {answers.length > 0 ? (
          <div className="space-y-4">
            {answers.map((line) =>
              looksLikeFormula(line) ? (
                <FormulaBlock
                  key={line}
                  expr={line.replace(/\.$/, "")}
                  tone="onColor"
                />
              ) : (
                <p
                  key={line}
                  className="text-pretty text-[18px] font-medium leading-[1.55] tracking-[-0.01em] text-[#111]"
                >
                  <SmartMathText text={line} />
                </p>
              )
            )}
          </div>
        ) : null}

        {patterns.length > 0 ? (
          <section className="space-y-3.5">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-black/35 uppercase">
              Pattern
            </p>
            <div className="space-y-3">
              {patterns.map((line) => {
                const cleaned = line.replace(/\.$/, "");
                return looksLikeFormula(cleaned) ? (
                  <FormulaBlock key={line} expr={cleaned} tone="onColor" />
                ) : (
                  <p
                    key={line}
                    className="rounded-2xl bg-black/[0.07] px-5 py-4 text-pretty text-[16px] font-medium leading-[1.55] tracking-[-0.01em] text-[#111] sm:text-[17px]"
                  >
                    <SmartMathText text={cleaned} />
                  </p>
                );
              })}
            </div>
          </section>
        ) : null}

        {mustInclude.length > 0 ? (
          <section className="space-y-4">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-black/35 uppercase">
              Must include
            </p>
            <ol className="space-y-0 divide-y divide-black/10">
              {mustInclude.map((item, i) => (
                <li
                  key={item}
                  className="flex gap-4 py-3.5 first:pt-0 last:pb-0"
                >
                  <span className="mt-[0.2em] w-6 shrink-0 font-mono text-[12px] font-medium text-black/30 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="min-w-0 flex-1 text-[16px] leading-[1.55] tracking-[-0.01em] text-[#111] sm:text-[17px]">
                    <SmartMathText text={item} />
                  </p>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {!hasStructured ? (
          looksLikeFormula(card.back) ? (
            <FormulaBlock expr={card.back.replace(/\.$/, "")} tone="onColor" />
          ) : (
            <p className="text-pretty text-[18px] font-medium leading-[1.55] tracking-[-0.01em] text-[#111]">
              <SmartMathText text={card.back} />
            </p>
          )
        ) : null}

        {card.diagramRequired ? (
          <p className="rounded-2xl border border-dashed border-black/15 bg-black/[0.04] px-4 py-3.5 text-[13px] leading-relaxed text-black/55">
            <span className="font-semibold text-[#111]">Draw · </span>
            {card.diagramRequired}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** Duolingo-style tip: appears under the card after flip — never during recall. */
function WhyTip({ card }: { card: Flashcard }) {
  const why = distillWhyThis(card);
  if (!why) return null;
  if (!why.chips.length && !why.line && !why.note) return null;

  return (
    <div
      className="flash-why-tip mx-auto w-full max-w-lg px-1"
      role="note"
    >
      <div className="rounded-2xl bg-white/[0.07] px-4 py-3.5 ring-1 ring-white/10">
        {why.chips.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {why.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full bg-[var(--flash-yellow)]/15 px-2.5 py-1 text-[11px] font-bold tracking-wide text-[var(--flash-yellow)]"
              >
                {chip}
              </span>
            ))}
          </div>
        ) : null}
        {why.line ? (
          <p
            className={cn(
              "text-[13px] leading-snug text-white/70",
              why.chips.length > 0 && "mt-2"
            )}
          >
            {why.line}
          </p>
        ) : null}
        {why.note ? (
          <p
            className={cn(
              "text-[12px] leading-snug text-white/40",
              (why.chips.length > 0 || why.line) && "mt-1.5"
            )}
          >
            {why.note}
          </p>
        ) : null}
      </div>
    </div>
  );
}
