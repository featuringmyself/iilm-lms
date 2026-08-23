import { ExternalLink, PlayCircle } from "lucide-react";

const EMBED_URL = "https://www.youtube.com/embed/iL7D-5gHORQ";
const WATCH_URL = "https://www.youtube.com/watch?v=iL7D-5gHORQ";

export function ProductExplainer() {
  return (
    <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <PlayCircle
            className="size-3.5 text-muted-foreground"
            strokeWidth={1.75}
          />
          <h2 className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Product explainer
          </h2>
        </div>
        <a
          href={WATCH_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Watch on YouTube
          <ExternalLink className="size-3" strokeWidth={1.75} />
        </a>
      </div>

      <div className="mb-4 max-w-2xl">
        <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
          How IILM LMS works
        </h3>
        <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
          A quick tour of the student-led LMS — classes, materials, notes, and
          schedule in one place.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <div className="aspect-video w-full">
          <iframe
            src={EMBED_URL}
            title="IILM LMS product explainer"
            className="size-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </section>
  );
}
