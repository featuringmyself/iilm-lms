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
      />

      <div className="max-w-2xl space-y-0">
        {changelog.map((entry, index) => (
          <section key={entry.id} id={entry.id}>
            {index > 0 ? <Separator className="my-6 sm:my-8" /> : null}
            <time
              dateTime={entry.date}
              className="mb-2 block text-[11px] font-medium tracking-wide text-muted-foreground uppercase"
            >
              {formatChangelogDate(entry.date)}
            </time>
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
                  <Badge variant={KIND_VARIANT[item.kind]} className="mt-0.5">
                    {KIND_LABEL[item.kind]}
                  </Badge>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
