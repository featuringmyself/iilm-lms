import Link from "next/link";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface ContentBreadcrumbProps {
  segments: BreadcrumbSegment[];
}

export function ContentBreadcrumb({ segments }: ContentBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap gap-1 sm:gap-1.5">
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          // On narrow screens, hide intermediate crumbs when there are 3+.
          const hideOnMobile =
            segments.length > 2 && !isLast && index !== 0;

          return (
            <Fragment key={`${segment.label}-${index}`}>
              <BreadcrumbItem
                className={hideOnMobile ? "hidden sm:inline-flex" : undefined}
              >
                {isLast || !segment.href ? (
                  <BreadcrumbPage className="max-w-[140px] truncate text-[12px] font-medium sm:max-w-[200px] sm:text-[13px] md:max-w-xs">
                    {segment.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    className="max-w-[100px] truncate text-[12px] text-muted-foreground transition-colors duration-150 hover:text-foreground sm:max-w-[160px] sm:text-[13px]"
                    render={<Link href={segment.href} />}
                  >
                    {segment.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast ? (
                <BreadcrumbSeparator
                  className={hideOnMobile ? "hidden sm:block" : undefined}
                />
              ) : null}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
