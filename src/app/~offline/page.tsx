"use client";

import { useEffect } from "react";
import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  useEffect(() => {
    const goHome = () => {
      window.location.assign("/");
    };

    window.addEventListener("online", goHome);
    return () => window.removeEventListener("online", goHome);
  }, []);

  return (
    <main className="relative flex min-h-svh flex-col overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[55vh] bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_72%)]"
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="flex w-full max-w-[22rem] flex-col items-center text-center">
          {/* Native img so the precached icon works without next/image in the SW fallback. */}
          <img
            src="/icons/icon-192.png"
            alt=""
            width={72}
            height={72}
            className="size-[4.5rem] rounded-[1.05rem] shadow-sm"
          />

          <p className="mt-6 text-[28px] font-semibold tracking-tight text-foreground sm:text-[32px]">
            IILM LMS
          </p>

          <div className="mt-10 flex size-11 items-center justify-center rounded-lg border border-border bg-card">
            <WifiOff
              className="size-4 animate-pulse text-muted-foreground"
              strokeWidth={1.75}
              aria-hidden
            />
          </div>

          <h1 className="mt-5 text-[15px] font-medium tracking-tight text-foreground">
            You’re offline
          </h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
            No network right now. Courses and materials will load again when
            you’re back online.
          </p>

          <Button
            type="button"
            size="lg"
            className="mt-8 min-w-[10.5rem]"
            onClick={() => window.location.assign("/")}
          >
            Try again
          </Button>
        </div>
      </div>

      <p className="relative z-10 pb-8 text-center font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
        Waiting for network
      </p>
    </main>
  );
}
