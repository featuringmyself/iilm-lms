import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  publicPath: string;
  fileName: string;
}

export function DownloadButton({ publicPath, fileName }: DownloadButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      nativeButton={false}
      render={<a href={publicPath} download={fileName} />}
    >
      <Download />
      Download
    </Button>
  );
}
