/**
 * Convert IILM flashcard physics notation → KaTeX-friendly LaTeX.
 * Handles deck strings like: E_n = n²h²/(8mL²), P = ∫ₐᵇ |ψ_n|² dx
 */

const SUPER: Record<string, string> = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
  "⁺": "+",
  "⁻": "-",
  "ⁿ": "n",
  "ᵃ": "a",
  "ᵇ": "b",
  "ᶜ": "c",
  "ᵈ": "d",
  "ᵉ": "e",
  "ᶠ": "f",
  "ᵍ": "g",
  "ʰ": "h",
  "ⁱ": "i",
  "ʲ": "j",
  "ᵏ": "k",
  "ˡ": "l",
  "ᵐ": "m",
  "ᵒ": "o",
  "ᵖ": "p",
  "ʳ": "r",
  "ˢ": "s",
  "ᵗ": "t",
  "ᵘ": "u",
  "ᵛ": "v",
  "ʷ": "w",
  "ˣ": "x",
  "ʸ": "y",
  "ᶻ": "z",
  "ᴸ": "L",
  "ᴬ": "A",
  "ᴮ": "B",
  "ᴰ": "D",
  "ᴱ": "E",
  "ᴳ": "G",
  "ᴴ": "H",
  "ᴵ": "I",
  "ᴶ": "J",
  "ᴷ": "K",
  "ᴹ": "M",
  "ᴺ": "N",
  "ᴼ": "O",
  "ᴾ": "P",
  "ᴿ": "R",
  "ᵀ": "T",
  "ᵁ": "U",
  "ⱽ": "V",
  "ᵂ": "W",
};

const SUB: Record<string, string> = {
  "₀": "0",
  "₁": "1",
  "₂": "2",
  "₃": "3",
  "₄": "4",
  "₅": "5",
  "₆": "6",
  "₇": "7",
  "₈": "8",
  "₉": "9",
  "₊": "+",
  "₋": "-",
  "ₙ": "n",
  "ₘ": "m",
  "ₓ": "x",
  "ᵢ": "i",
  "ⱼ": "j",
  "ₖ": "k",
  "ₐ": "a",
  "ₑ": "e",
  "ₒ": "o",
  "ᵣ": "r",
  "ᵤ": "u",
  "ᵥ": "v",
  "ₕ": "h",
  "ₚ": "p",
  "ₛ": "s",
  "ₜ": "t",
  "ₗ": "l",
};

/** Heuristic: does this string look like a physics formula worth rendering? */
export function looksLikeFormula(text: string): boolean {
  const t = text.trim();
  if (!t || t.length > 180) return false;
  if (/^(Given|Cover|Diagram|Include|Compare|Start|Know|Explain)\b/i.test(t)) {
    return false;
  }

  const tokens = t.split(/\s+/).filter(Boolean);
  const longEnglish = tokens.filter((w) => /^[A-Za-z]{4,}$/.test(w));
  // Mixed checklist lines: "ψ is probability amplitude" — not a display formula.
  if (longEnglish.length >= 2 && tokens.length >= 3) return false;

  // English-heavy lines are prose (maybe with inline math), not a display formula.
  // Fixes answers like "Ground: n=1; first excited: n=2; …" being KaTeX'd + clipped.
  const proseWords =
    t.match(/\b[A-Za-z]{3,}\b/g)?.filter(
      (w) =>
        !/^(sin|cos|tan|max|min|log|exp|dx|dt|dV|psi|hbar|int|frac|sqrt|left|right|cdot|times|partial|lambda|alpha|beta|varphi|delta|infty|propto|approx)$/i.test(
          w
        )
    ) ?? [];
  if (proseWords.length >= 3) return false;
  if (/[.;:]\s+[A-Za-z]/.test(t) && proseWords.length >= 2) return false;

  // Prose sentences with a formula fragment — still treat as formula if mostly math
  if (/\bis the\b|\bof finding\b|\band set\b/i.test(t) && t.split(/\s+/).length > 8) {
    return /[=∫√λψℏ]/.test(t);
  }
  return (
    /[=≈∝∫√λψℏ∂πΔαβφΦν]/.test(t) ||
    /[_^²³¹⁰]|E_n|ψ_n|\\frac|\\sqrt|h\^|mL|Kmax|\|ψ\|/.test(t) ||
    /\b(sin|cos|tan)\s*\(/.test(t)
  );
}

function unicodeScriptsToLatex(input: string): string {
  let out = "";
  let i = 0;
  while (i < input.length) {
    const ch = input[i]!;

    if (SUPER[ch]) {
      let body = SUPER[ch]!;
      i += 1;
      while (i < input.length && SUPER[input[i]!]) {
        body += SUPER[input[i]!]!;
        i += 1;
      }
      out += `^{${body}}`;
      continue;
    }

    if (SUB[ch]) {
      let body = SUB[ch]!;
      i += 1;
      while (i < input.length && SUB[input[i]!]) {
        body += SUB[input[i]!]!;
        i += 1;
      }
      out += `_{${body}}`;
      continue;
    }

    out += ch;
    i += 1;
  }
  return out;
}

/** Convert underscore subscripts: E_n, ψ_n → E_{n}, ψ_{n} */
function underscoreSubs(input: string): string {
  return input.replace(
    /([A-Za-zψλφΦΔαβνπℏΨ])_([A-Za-z0-9]+)/g,
    (_m, base: string, sub: string) => `${base}_{${sub}}`
  );
}

/**
 * Normalize integrals:
 *   ∫ₐᵇ → \int_{a}^{b}
 *   ∫_{a}^{b} → \int_{a}^{b}
 *   ∫₀ᴸ → after scripts: ∫_{0}^{L}
 */
function normalizeIntegrals(input: string): string {
  let s = input;

  // ASCII style: ∫_a^b or \int_a^b
  s = s.replace(
    /(?:∫|\\int)\s*_\{?([A-Za-z0-9]+)\}?\s*\^\{?([A-Za-z0-9]+)\}?/g,
    (_m, lo: string, hi: string) => `\\int_{${lo}}^{${hi}}`
  );

  // After unicode script conversion: ∫_{a}^{b} or ∫_{0}^{L}
  s = s.replace(
    /(?:∫|\\int)\s*_\{([^}]+)\}\s*\^\{([^}]+)\}/g,
    (_m, lo: string, hi: string) => `\\int_{${lo}}^{${hi}}`
  );

  // Bare ∫ left — ensure control word
  s = s.replaceAll("∫", "\\int ");

  // Collapse "\int _{a}" spacing
  s = s.replace(/\\int\s+/g, "\\int ");
  s = s.replace(/\\int\s*(_\{[^}]+\})/g, "\\int$1");
  s = s.replace(/(\\int_\{[^}]+\})\s*(\^\{[^}]+\})/g, "$1$2");

  return s;
}

/** √(expr) or √expr → \sqrt{expr}; √(a/b) → \sqrt{\dfrac{a}{b}} */
function sqrtToLatex(input: string): string {
  let out = input;
  out = out.replace(
    /√\(([^()/]+)\/([^()]+)\)/g,
    (_m, num: string, den: string) => `\\sqrt{\\dfrac{${num}}{${den}}}`
  );
  out = out.replace(
    /√\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g,
    (_m, inner: string) => `\\sqrt{${inner}}`
  );
  out = out.replace(
    /√([A-Za-z0-9_{}\\^]+)/g,
    (_m, inner: string) => `\\sqrt{${inner}}`
  );
  return out;
}

function slashFractions(input: string): string {
  let out = input;

  out = out.replace(
    /([A-Za-z0-9Α-ωℏλψφΦΔαβνπ\\_{}^+-]+)\s*\/\s*\(([^()]+)\)/g,
    (_m, num: string, den: string) => `\\dfrac{${num}}{${den}}`
  );

  out = out.replace(
    /(?<![A-Za-z])([A-Za-z0-9Α-ωℏλψφΦΔαβνπ\\_{}^+-]+)\s*\/\s*([A-Za-z0-9Α-ωℏλψφΦΔαβνπ\\_{}^+-]+)(?![A-Za-z])/g,
    (_m, num: string, den: string) => {
      if (/^[a-z]{3,}$/i.test(num) && /^[a-z]{3,}$/i.test(den)) {
        return `${num}/${den}`;
      }
      return `\\dfrac{${num}}{${den}}`;
    }
  );

  return out;
}

function greekAndOps(input: string): string {
  return input
    .replaceAll("λ", "\\lambda")
    .replaceAll("ψ", "\\psi")
    .replaceAll("Ψ", "\\Psi")
    .replaceAll("π", "\\pi")
    .replaceAll("ℏ", "\\hbar")
    .replaceAll("∂", "\\partial")
    .replaceAll("Δ", "\\Delta")
    .replaceAll("α", "\\alpha")
    .replaceAll("β", "\\beta")
    .replaceAll("φ", "\\varphi")
    .replaceAll("Φ", "\\Phi")
    .replaceAll("ν", "\\nu")
    .replaceAll("∞", "\\infty")
    .replaceAll("·", "\\cdot ")
    .replaceAll("−", "-")
    .replaceAll("–", "-")
    .replaceAll("—", "-")
    .replaceAll("≤", "\\le ")
    .replaceAll("≥", "\\ge ")
    .replaceAll("≈", "\\approx ")
    .replaceAll("∝", "\\propto ")
    .replaceAll("×", "\\times ")
    .replace(/\bsin\b/g, "\\sin")
    .replace(/\bcos\b/g, "\\cos")
    .replace(/\btan\b/g, "\\tan")
    .replace(/\|([^|]+)\|/g, "\\left|$1\\right|")
    .replace(/d²/g, "d^2")
    .replace(/∂²/g, "\\partial^2")
    .replace(/∂t/g, "\\partial t")
    .replace(/dx²/g, "dx^2")
    .replace(/Kmax/g, "K_{\\max}")
    .replace(/V₀/g, "V_0")
    .replace(/V0/g, "V_0");
}

function tidyLatex(input: string): string {
  return input
    .replace(/\\(lambda|psi|Psi|pi|hbar|partial|Delta|alpha|beta|varphi|Phi|nu)(?=[A-Za-z])/g, "\\$1 ")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([_^])/g, "$1")
    .replace(/\{\s+/g, "{")
    .replace(/\s+\}/g, "}")
    .replace(/\\int\s+/g, "\\int")
    .replace(/\\int(_\{)/g, "\\int$1")
    .trim();
}

/**
 * Convert a single formula expression to LaTeX.
 */
export function formulaToLatex(raw: string): string {
  let s = raw.trim().replace(/\.$/, "");

  // Already mostly latex — still normalize abs bars / psi_n
  if (
    s.includes("\\frac") ||
    s.includes("\\sqrt") ||
    s.includes("\\lambda") ||
    s.includes("\\int_") ||
    s.includes("\\psi")
  ) {
    s = s
      .replace(/\|([^|]+)\|/g, "\\left|$1\\right|")
      .replace(/\\psi_([A-Za-z0-9]+)/g, "\\psi_{$1}")
      .replace(/\\psi_n/g, "\\psi_{n}");
    return tidyLatex(s);
  }

  s = unicodeScriptsToLatex(s);
  s = underscoreSubs(s);
  s = normalizeIntegrals(s);

  // h/√(...) → \dfrac{h}{\sqrt{...}}
  s = s.replace(
    /([A-Za-z0-9Α-ωℏλψ_{}^]+)\s*\/\s*√\(([^()]+)\)/g,
    (_m, num: string, inner: string) => {
      if (inner.includes("/")) {
        const [a, b] = inner.split("/");
        return `\\dfrac{${num}}{\\sqrt{\\dfrac{${a}}{${b}}}}`;
      }
      return `\\dfrac{${num}}{\\sqrt{${inner}}}`;
    }
  );
  s = s.replace(
    /([A-Za-z0-9Α-ωℏλψ_{}^]+)\s*\/\s*√([A-Za-z0-9]+)/g,
    (_m, num: string, inner: string) => `\\dfrac{${num}}{\\sqrt{${inner}}}`
  );

  s = slashFractions(s);
  s = sqrtToLatex(s);
  s = s.replace(
    /\\sqrt\{([^{}]+)\/([^{}]+)\}/g,
    (_m, num: string, den: string) => `\\sqrt{\\dfrac{${num}}{${den}}}`
  );
  s = greekAndOps(s);

  s = s.replace(
    /d\^2\s*\\psi\s*\/\s*dx\^2/g,
    "\\dfrac{d^2\\psi}{dx^2}"
  );
  s = s.replace(
    /(\\int(?:_\{[^}]+\})?(?:\^\{[^}]+\})?\s*(?:\\left\|[^|]+\\right\|(?:\^\{[^}]+\})?|[^\s]+))\s*(dx|dt|dV)/g,
    "$1\\, $2"
  );

  return tidyLatex(s);
}

/**
 * Inline math tokens embedded in checklist / prose lines.
 * e.g. ψ, |ψ|², E_n, ψ_n, ℏ
 */
const INLINE_MATH_TOKEN =
  /\|[^|\s]+\|(?:[⁰¹²³⁴⁵⁶⁷⁸⁹]+|\^[0-9]+|\^{[^}]+})?|ΔE|[EVψΨλφΦ]\s*[₀-₉](?:\s*[−–—-]\s*[EVψΨλφΦ]\s*[₀-₉])?|[ψΨλφΦΔαβνπℏ](?:_[A-Za-z0-9]+)?(?:[⁰¹²³⁴⁵⁶⁷⁸⁹]+)?|(?:E|V|K|P|n|m|L|h|ħ)_\{?[A-Za-z0-9]+\}?(?:[⁰¹²³⁴⁵⁶⁷⁸⁹]+)?|\bn\s*=\s*\d+\b/g;

function splitInlineMath(
  text: string
): Array<{ type: "text" | "formula"; value: string }> {
  const out: Array<{ type: "text" | "formula"; value: string }> = [];
  let last = 0;
  for (const match of text.matchAll(INLINE_MATH_TOKEN)) {
    const start = match.index ?? 0;
    if (start > last) {
      out.push({ type: "text", value: text.slice(last, start) });
    }
    out.push({ type: "formula", value: match[0]! });
    last = start + match[0]!.length;
  }
  if (last < text.length) {
    out.push({ type: "text", value: text.slice(last) });
  }
  return out.length > 0 ? out : [{ type: "text", value: text }];
}

/**
 * For mixed prose + formula, split and mark formula chunks.
 */
export function splitProseAndFormulas(
  text: string
): Array<{ type: "text" | "formula"; value: string }> {
  const trimmed = text.trim();
  if (!trimmed) return [{ type: "text", value: text }];

  // Pure display formula — no prose mix.
  if (looksLikeFormula(trimmed)) {
    return [{ type: "formula", value: trimmed.replace(/\.$/, "") }];
  }

  // Arrow / middle-dot chains: "ψ → |ψ|² → normalization"
  if (/[·→]/.test(trimmed)) {
    const parts = trimmed.split(/(\s*[·→]\s*)/);
    const out: Array<{ type: "text" | "formula"; value: string }> = [];
    for (const part of parts) {
      if (!part) continue;
      if (/^\s*[·→]\s*$/.test(part)) {
        out.push({ type: "text", value: part });
        continue;
      }
      out.push(...splitProseAndFormulas(part));
    }
    return out;
  }

  // Checklist / sentence with embedded symbols.
  const inline = splitInlineMath(trimmed);
  if (inline.some((p) => p.type === "formula")) {
    return inline;
  }

  return [{ type: "text", value: text }];
}
