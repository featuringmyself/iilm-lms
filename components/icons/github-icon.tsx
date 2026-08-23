import { forwardRef, type SVGProps } from "react";

import { cn } from "@/lib/utils";

/** Lucide-style GitHub mark (brand icons removed from lucide v1). */
export const GitHubIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  ({ className, strokeWidth = 1.75, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-4 shrink-0", className)}
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-.1.56-.27.82-.47 1.08-.96 1.67-2.34 1.63-3.75 0-2.45-2-4.5-4.5-4.5-1.3 0-2.56.56-3.45 1.5C10.56 1.5 9.3 1 8 1 5.5 1 3.5 3 3.5 5.5c-.04 1.41.55 2.79 1.63 3.75.26.2.54.37.82.47-1.03 1.03-1.1 2.7-.25 3.87C4 14.5 6 16.5 9 16.5v4" />
    </svg>
  )
);

GitHubIcon.displayName = "GitHubIcon";
