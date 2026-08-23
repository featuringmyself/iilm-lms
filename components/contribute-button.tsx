"use client";

import { FolderGit2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const GITHUB_URL = "https://github.com/featuringmyself/iilm-lms";

export function ContributeButton() {
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="icon-sm"
                className="size-10 sm:hidden"
                nativeButton={false}
                render={
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              />
            }
          >
            <FolderGit2 className="size-4" strokeWidth={1.75} />
            <span className="sr-only">Contribute</span>
          </TooltipTrigger>
          <TooltipContent>Contribute</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Button
        variant="outline"
        size="sm"
        className="hidden h-8 sm:inline-flex"
        nativeButton={false}
        render={
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" />
        }
      >
        <FolderGit2 className="size-4" strokeWidth={1.75} />
        Contribute
      </Button>
    </>
  );
}
