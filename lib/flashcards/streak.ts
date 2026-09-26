const STREAK_KEY = "iilm-flash-streak-v1";

export interface FlashStreak {
  count: number;
  lastDate: string; // YYYY-MM-DD in Asia/Kolkata
  best: number;
}

function todayKey(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function yesterdayKey(): string {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  now.setDate(now.getDate() - 1);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function readFlashStreak(): FlashStreak {
  if (typeof window === "undefined") {
    return { count: 0, lastDate: "", best: 0 };
  }
  try {
    const raw = window.localStorage.getItem(STREAK_KEY);
    if (!raw) return { count: 0, lastDate: "", best: 0 };
    const parsed = JSON.parse(raw) as FlashStreak;
    return {
      count: Number(parsed.count) || 0,
      lastDate: parsed.lastDate || "",
      best: Number(parsed.best) || 0,
    };
  } catch {
    return { count: 0, lastDate: "", best: 0 };
  }
}

/** Call when a study session is completed. Returns updated streak. */
export function bumpFlashStreak(): FlashStreak {
  const today = todayKey();
  const prev = readFlashStreak();
  if (prev.lastDate === today) {
    return prev;
  }
  const nextCount =
    prev.lastDate === yesterdayKey() ? prev.count + 1 : 1;
  const next: FlashStreak = {
    count: nextCount,
    lastDate: today,
    best: Math.max(prev.best, nextCount),
  };
  window.localStorage.setItem(STREAK_KEY, JSON.stringify(next));
  return next;
}
