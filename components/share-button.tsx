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
import { cn } from "@/lib/utils";

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

function toAbsoluteUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const path = url.startsWith("/") ? url : `/${url}`;
  return `${window.location.origin}${path}`;
}

interface ShareButtonProps {
  url: string;
  title: string;
  className?: string;
}

export function ShareButton({ url, title, className }: ShareButtonProps) {
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
    const materialUrl = toAbsoluteUrl(url);

    if (canUseNativeShare()) {
      try {
        await navigator.share({ url: materialUrl, title });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
      }
    }

    const didCopy = await copyToClipboard(materialUrl);
    if (didCopy) {
      showCopiedFeedback();
    }
  }, [url, title, showCopiedFeedback]);

  const tooltipLabel = copied ? "Link copied" : "Share";
  const ariaLabel = copied ? "Link copied" : "Share";

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
                variant="ghost"
                size="icon-sm"
                className={cn(
                  "size-9 text-muted-foreground hover:text-foreground sm:size-7",
                  className
                )}
                onClick={handleShare}
                aria-label={ariaLabel}
              />
            }
          >
            <Share2 className="size-3.5" strokeWidth={1.75} />
          </TooltipTrigger>
          <TooltipContent>{tooltipLabel}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
