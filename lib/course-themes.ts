import type { LucideIcon } from "lucide-react";
import {
  Atom,
  BookOpen,
  Brain,
  Calculator,
  Code2,
  Lightbulb,
  Sigma,
} from "lucide-react";

export interface CourseTheme {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

/** Neutral gray wells in dark mode — light mode keeps course color tints */
const darkIconBg = "dark:bg-neutral-800";
const darkIconColor = "dark:text-neutral-300";

const defaultTheme: CourseTheme = {
  icon: BookOpen,
  iconBg: `bg-slate-100 ${darkIconBg}`,
  iconColor: "text-slate-600 dark:text-neutral-300",
};

const themes: Record<string, CourseTheme> = {
  "applied-calculus": {
    icon: Sigma,
    iconBg: `bg-violet-50 ${darkIconBg}`,
    iconColor: `text-violet-700 ${darkIconColor}`,
  },
  maths: {
    icon: Calculator,
    iconBg: `bg-sky-50 ${darkIconBg}`,
    iconColor: `text-sky-700 ${darkIconColor}`,
  },
  "c-programming": {
    icon: Code2,
    iconBg: `bg-emerald-50 ${darkIconBg}`,
    iconColor: `text-emerald-700 ${darkIconColor}`,
  },
  "comupational-design-and-thinking": {
    icon: Brain,
    iconBg: `bg-amber-50 ${darkIconBg}`,
    iconColor: `text-amber-700 ${darkIconColor}`,
  },
  "entrepreneurial-mindset": {
    icon: Lightbulb,
    iconBg: `bg-orange-50 ${darkIconBg}`,
    iconColor: `text-orange-700 ${darkIconColor}`,
  },
  "quantum-physics": {
    icon: Atom,
    iconBg: `bg-indigo-50 ${darkIconBg}`,
    iconColor: `text-indigo-700 ${darkIconColor}`,
  },
};

export function getCourseTheme(courseSlug: string): CourseTheme {
  return themes[courseSlug] ?? defaultTheme;
}

const darkBadge = "dark:bg-neutral-800 dark:text-neutral-300";

export function getFileTypeBadge(extension: string): { label: string; className: string } {
  switch (extension) {
    case "pdf":
      return {
        label: "PDF",
        className: `bg-rose-50 text-rose-700 ${darkBadge}`,
      };
    case "pptx":
      return {
        label: "PPTX",
        className: `bg-amber-50 text-amber-800 ${darkBadge}`,
      };
    case "docx":
      return {
        label: "DOCX",
        className: `bg-blue-50 text-blue-700 ${darkBadge}`,
      };
    default:
      return {
        label: extension.toUpperCase(),
        className: "bg-muted text-muted-foreground",
      };
  }
}
