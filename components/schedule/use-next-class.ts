"use client";

import { useSyncExternalStore } from "react";

import { getNextClass } from "@/lib/schedule";
import type { NextClassResult } from "@/lib/schedule";

/**
 * The clock is a client-only external store. The server snapshot is null, so
 * the server HTML and the first client render match and React does not throw a
 * hydration mismatch. After hydration the value fills in and updates each minute.
 */
let current: NextClassResult | null = null;
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function refresh() {
  current = getNextClass();
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    refresh();
    timer = setInterval(refresh, 60_000);
  }
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  };
}

function getSnapshot(): NextClassResult | null {
  return current;
}

function getServerSnapshot(): NextClassResult | null {
  return null;
}

export function useNextClass(): NextClassResult | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
