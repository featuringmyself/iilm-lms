import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  publicPath: string;
  fileName: string;
}

export function DownloadButton({ publicPath, fileName }: DownloadButtonProps) {
  return (
    <>
      <Button
        variant="outline"
        size="icon-sm"
        className="size-10 shrink-0 sm:hidden"
        nativeButton={false}
        render={<a href={publicPath} download={fileName} />}
      >
        <Download className="size-4" strokeWidth={1.75} />
        <span className="sr-only">Download</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="hidden shrink-0 sm:inline-flex"
        nativeButton={false}
        render={<a href={publicPath} download={fileName} />}
      >
        <Download strokeWidth={1.75} />
        Download
      </Button>
    </>
  );
}
