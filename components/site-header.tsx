import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";

import { ContributeButton } from "./contribute-button";
import { ShareButton } from "./share-button";
import { ContentBreadcrumb, type BreadcrumbSegment } from "./content-breadcrumb";
import Link from "next/link";

interface SiteHeaderProps {
  breadcrumbs?: BreadcrumbSegment[];
}

export function SiteHeader({ breadcrumbs }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur-sm sm:h-12 sm:gap-3 sm:px-6">
      <SidebarTrigger className="-ml-0.5 size-10 sm:-ml-1 sm:size-8" />
      <Separator orientation="vertical" className="hidden h-4 sm:block" />
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <div className="min-w-0 flex-1 overflow-hidden">
            <ContentBreadcrumb segments={breadcrumbs} />
          </div>
        ) : (
          <Link
            href="/"
            className="truncate text-[13px] font-medium tracking-tight text-foreground"
          >
            IILM LMS
          </Link>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <ContributeButton />
        <ShareButton />
        <ThemeToggle />
      </div>
    </header>
  );
}
