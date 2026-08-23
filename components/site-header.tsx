import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";

import { ContributeButton } from "./contribute-button";
import { ContentBreadcrumb, type BreadcrumbSegment } from "./content-breadcrumb";

interface SiteHeaderProps {
  breadcrumbs?: BreadcrumbSegment[];
}

export function SiteHeader({ breadcrumbs }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur-sm sm:px-6">
      <SidebarTrigger className="-ml-1 size-8" />
      <Separator orientation="vertical" className="hidden h-4 sm:block" />
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <div className="min-w-0 flex-1 overflow-hidden">
            <ContentBreadcrumb segments={breadcrumbs} />
          </div>
        ) : (
          <span className="truncate text-[13px] font-medium tracking-tight text-foreground">
            IILM LMS
          </span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        <ContributeButton />
        <ThemeToggle />
      </div>
    </header>
  );
}
