interface PdfViewerProps {
  publicPath: string;
}

export function PdfViewer({ publicPath }: PdfViewerProps) {
  return (
    <iframe
      src={publicPath}
      title="PDF document"
      className="fixed inset-0 h-screen w-screen border-0"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
