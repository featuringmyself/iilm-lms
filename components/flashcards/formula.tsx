"use client";

import katex from "katex";
import { useMemo, type SyntheticEvent } from "react";

import {
  formulaToLatex,
  looksLikeFormula,
  splitProseAndFormulas,
} from "@/lib/flashcards/format-formula";
import { cn } from "@/lib/utils";

import "katex/dist/katex.min.css";

interface FormulaProps {
  /** Raw deck notation, e.g. E_n = n²h²/(8mL²) */
  expr: string;
  /** Block (centered display) vs inline */
  display?: boolean;
  className?: string;
}

/** Keep swipe/flip gestures from stealing horizontal scroll on formulas. */
function stopScrollGesture(event: SyntheticEvent) {
  event.stopPropagation();
}

export function Formula({ expr, display = false, className }: FormulaProps) {
  const html = useMemo(() => {
    const latex = formulaToLatex(expr);
    try {
      return katex.renderToString(latex, {
        throwOnError: false,
        displayMode: display,
        strict: "ignore",
        trust: false,
        output: "html",
      });
    } catch {
      return null;
    }
  }, [expr, display]);

  if (!html) {
    return (
      <span className={cn("break-words font-mono text-[13px]", className)}>
        {expr}
      </span>
    );
  }

  const math = (
    <span
      className={cn(
        "flash-formula",
        display && "block w-max max-w-none",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );

  if (!display) {
    return (
      <span
        className="flash-formula-inline-scroll"
        onTouchStart={stopScrollGesture}
        onTouchMove={stopScrollGesture}
        onWheel={stopScrollGesture}
      >
        {math}
      </span>
    );
  }

  return (
    <div
      className="flash-formula-scroll"
      onTouchStart={stopScrollGesture}
      onTouchMove={stopScrollGesture}
      onWheel={stopScrollGesture}
    >
      <div className="mx-auto w-max min-w-full text-center">{math}</div>
    </div>
  );
}

/** Renders a line that may be prose, a formula, or a mix. */
export function SmartMathText({
  text,
  className,
  formulaDisplay,
}: {
  text: string;
  className?: string;
  formulaDisplay?: boolean;
}) {
  const parts = useMemo(() => splitProseAndFormulas(text), [text]);
  const wholeIsFormula =
    parts.length === 1 && parts[0]?.type === "formula";

  if (wholeIsFormula) {
    return (
      <Formula
        expr={parts[0]!.value}
        display={formulaDisplay ?? true}
        className={className}
      />
    );
  }

  return (
    <span className={cn("break-words [word-spacing:0.02em]", className)}>
      {parts.map((part, i) =>
        part.type === "formula" ? (
          <Formula
            key={`${part.value}-${i}`}
            expr={part.value}
            display={false}
            className="mx-[0.12em] inline-block align-baseline"
          />
        ) : (
          <span key={`${part.value}-${i}`}>{part.value}</span>
        )
      )}
    </span>
  );
}

/** Standalone display formula — used for pure equations only. */
export function FormulaBlock({
  expr,
  className,
  tone = "default",
}: {
  expr: string;
  className?: string;
  tone?: "default" | "onColor";
}) {
  const shell = cn(
    "min-w-0 max-w-full overflow-x-auto overscroll-x-contain rounded-2xl px-5 py-4",
    tone === "onColor"
      ? "bg-black/[0.07]"
      : "border border-border bg-muted/40",
    className
  );

  // Never KaTeX prose patterns — math mode eats spaces and clips.
  if (!looksLikeFormula(expr)) {
    return (
      <div className={shell}>
        <p className="text-pretty text-[16px] font-medium leading-[1.55] tracking-[-0.01em] text-inherit sm:text-[17px]">
          <SmartMathText text={expr} />
        </p>
      </div>
    );
  }

  return (
    <div
      className={shell}
      onTouchStart={stopScrollGesture}
      onTouchMove={stopScrollGesture}
      onWheel={stopScrollGesture}
    >
      <Formula expr={expr} display />
    </div>
  );
}

export { looksLikeFormula };
