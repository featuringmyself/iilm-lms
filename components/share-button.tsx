"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function canUseNativeShare(): boolean {
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
    return false;
  }

  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function ShareButton() {
  const [copied, setCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const showCopiedFeedback = useCallback(() => {
    setCopied(true);
    setTooltipOpen(true);

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = setTimeout(() => {
      setCopied(false);
      setTooltipOpen(false);
      resetTimerRef.current = null;
    }, 2000);
  }, []);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const title = document.title;

    if (canUseNativeShare()) {
      try {
        await navigator.share({ url, title });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
      }
    }

    const didCopy = await copyToClipboard(url);
    if (didCopy) {
      showCopiedFeedback();
    }
  }, [showCopiedFeedback]);

  const tooltipLabel = copied ? "Link copied" : "Share";
  const ariaLabel = copied ? "Link copied" : "Share page";

  return (
    <>
      <div aria-live="polite" className="sr-only">
        {copied ? "Link copied" : null}
      </div>

      <TooltipProvider>
        <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="icon-sm"
                className="size-10 sm:hidden"
                onClick={handleShare}
                aria-label={ariaLabel}
              />
            }
          >
            <Share2 className="size-4" />
          </TooltipTrigger>
          <TooltipContent>{tooltipLabel}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip open={copied ? tooltipOpen : false} onOpenChange={setTooltipOpen}>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="hidden h-8 sm:inline-flex"
                onClick={handleShare}
                aria-label={ariaLabel}
              />
            }
          >
            <Share2 className="size-4" />
            {copied ? "Link copied" : "Share"}
          </TooltipTrigger>
          <TooltipContent>{tooltipLabel}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
