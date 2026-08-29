import type { Document } from "@/lib/content";

interface CourseFileIndexProps {
  materials: Document[];
  notes: Document[];
  pyq: Document[];
}

const SECTIONS: Array<{
  key: "materials" | "notes" | "pyq";
  label: string;
  docsKey: keyof CourseFileIndexProps;
}> = [
  { key: "materials", label: "Materials", docsKey: "materials" },
  { key: "notes", label: "Notes", docsKey: "notes" },
  { key: "pyq", label: "Previous-year questions (PYQ)", docsKey: "pyq" },
];

/**
 * Always-in-HTML inventory of course files. Tabs only mount the active panel,
 * so notes/PYQ would otherwise be invisible to anything that only reads the
 * course page (including ChatGPT browsing the library URL).
 */
export function CourseFileIndex({
  materials,
  notes,
  pyq,
}: CourseFileIndexProps) {
  const docsByKey = { materials, notes, pyq };
  const sections = SECTIONS.map((section) => ({
    ...section,
    docs: docsByKey[section.docsKey],
  })).filter((section) => section.docs.length > 0);

  if (sections.length === 0) return null;

  const total = sections.reduce((sum, section) => sum + section.docs.length, 0);

  return (
    <details className="mb-5 rounded-lg border border-border bg-card open:pb-2 sm:mb-6">
      <summary className="cursor-pointer list-none px-3.5 py-2.5 text-[13px] font-medium tracking-tight text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-3">
          <span>All course files</span>
          <span className="font-mono text-[11px] font-normal tabular-nums text-muted-foreground">
            {total}
          </span>
        </span>
      </summary>
      <div className="space-y-3 border-t border-border px-3.5 py-3">
        {sections.map((section) => (
          <div key={section.key} className="min-w-0 space-y-1.5">
            <p className="font-mono text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              {section.label}
            </p>
            <ul className="space-y-1">
              {section.docs.map((doc) => (
                <li key={doc.publicPath} className="min-w-0">
                  <a
                    href={doc.publicPath}
                    className="wrap-anywhere text-[12px] leading-snug text-foreground transition-colors hover:text-primary"
                  >
                    {doc.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </details>
  );
}
