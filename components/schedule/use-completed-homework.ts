"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "iilm-lms:completed-homework";

type Listener = () => void;

const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) listener();
}

function readIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id): id is string => typeof id === "string"));
  } catch {
    return new Set();
  }
}

function writeIds(ids: Set<string>) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  emit();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): string {
  return JSON.stringify([...readIds()].sort());
}

function getServerSnapshot(): string {
  return "[]";
}

export function useCompletedHomework(): {
  completed: Set<string>;
  toggle: (id: string) => void;
  isCompleted: (id: string) => boolean;
} {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const completed = new Set(JSON.parse(snapshot) as string[]);

  return {
    completed,
    isCompleted: (id) => completed.has(id),
    toggle: (id) => {
      const next = readIds();
      if (next.has(id)) next.delete(id);
      else next.add(id);
      writeIds(next);
    },
  };
}
