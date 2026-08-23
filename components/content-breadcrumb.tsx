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
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;

          return (
            <Fragment key={`${segment.label}-${index}`}>
              <BreadcrumbItem>
                {isLast || !segment.href ? (
                  <BreadcrumbPage className="max-w-[200px] truncate text-[13px] font-medium sm:max-w-xs">
                    {segment.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    className="text-[13px] text-muted-foreground transition-colors duration-150 hover:text-foreground"
                    render={<Link href={segment.href} />}
                  >
                    {segment.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast ? <BreadcrumbSeparator /> : null}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
