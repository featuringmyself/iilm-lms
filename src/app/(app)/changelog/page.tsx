import type { Metadata } from "next";

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

      <div className="max-w-2xl">
        {changelog.map((entry, index) => (
          <div key={entry.id} id={entry.id}>
            {index > 0 ? <Separator className="my-6 sm:my-8" /> : null}
            <article className="grid gap-3 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-6">
              <time
                dateTime={entry.date}
                className="pt-0.5 font-mono text-[11px] tabular-nums text-muted-foreground sm:text-right"
              >
                {formatChangelogDate(entry.date)}
              </time>
              <div className="min-w-0 space-y-3">
                <div className="space-y-1">
                  <h2 className="text-[15px] font-semibold tracking-tight text-foreground sm:text-base">
                    {entry.title}
                  </h2>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {entry.summary}
                  </p>
                </div>
                <ul className="space-y-2">
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
              </div>
            </article>
          </div>
        ))}
      </div>
    </>
  );
}
