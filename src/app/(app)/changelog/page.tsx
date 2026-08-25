import type { Metadata } from "next";
import { Circle } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  changelog,
  formatChangelogDate,
  type ChangelogKind,
} from "@/lib/changelog";

export const metadata: Metadata = {
  title: "Changelog · IILM LMS",
  description: "Notable changes to the IILM LMS student app.",
};

const KIND_LABEL: Record<ChangelogKind, string> = {
  added: "Added",
  changed: "Changed",
  fixed: "Fixed",
};

const KIND_VARIANT: Record<
  ChangelogKind,
  "default" | "secondary" | "outline"
> = {
  added: "default",
  changed: "secondary",
  fixed: "outline",
};

export default function ChangelogPage() {
  return (
    <>
      <PageHeader
        title="Changelog"
        description="Notable product changes, grouped by release theme — not every commit."
      />

      <ol className="max-w-3xl">
        {changelog.map((entry) => (
          <li
            key={entry.id}
            id={entry.id}
            className="grid grid-cols-[5.5rem_1rem_minmax(0,1fr)] gap-x-3 last:[&_article]:pb-0 sm:grid-cols-[7rem_1rem_minmax(0,1fr)] sm:gap-x-4"
          >
            <time
              dateTime={entry.date}
              className="pt-0.5 text-right font-mono text-[11px] tabular-nums text-muted-foreground"
            >
              {formatChangelogDate(entry.date)}
            </time>

            <div className="relative flex justify-center">
              <Separator
                orientation="vertical"
                className="absolute inset-y-0 data-vertical:h-full"
              />
              <Circle
                aria-hidden
                className="relative z-10 mt-1 size-2.5 fill-primary text-primary"
                strokeWidth={0}
              />
            </div>

            <article className="min-w-0 pb-8 sm:pb-10">
              <h2 className="text-[15px] font-semibold tracking-tight text-foreground sm:text-base">
                {entry.title}
              </h2>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                {entry.summary}
              </p>
              <ul className="mt-3 space-y-2">
                {entry.items.map((item) => (
                  <li
                    key={`${entry.id}-${item.kind}-${item.text}`}
                    className="flex items-start gap-2.5 text-[13px] leading-relaxed text-foreground/90"
                  >
                    <Badge
                      variant={KIND_VARIANT[item.kind]}
                      className="mt-0.5"
                    >
                      {KIND_LABEL[item.kind]}
                    </Badge>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </>
  );
}
