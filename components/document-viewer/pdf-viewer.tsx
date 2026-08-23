interface PdfViewerProps {
  publicPath: string;
}

/**
 * Native browser PDF viewer (iframe).
 *
 * Do NOT defer width/height to useEffect: Chrome/Safari rasterize the PDF for the
 * iframe's size at load time. Mounting without dimensions (HTML default ~300×150)
 * then growing to the viewport upscales that raster and looks soft.
 *
 * Avoid #view=FitH on scanned PDFs — our content under public/content includes
 * ~720px-wide JPEG page strips (~85 DPI). FitH upscales them ~3–4× on retina.
 * Default #zoom=100 maps 1 PDF point ≈ 1 CSS pixel (closer to source resolution).
 */
function pdfSrc(publicPath: string): string {
  const hash = "zoom=100";
  const [base, existingHash] = publicPath.split("#");
  return existingHash ? `${base}#${existingHash}&${hash}` : `${base}#${hash}`;
}

export function PdfViewer({ publicPath }: PdfViewerProps) {
  return (
    <iframe
      src={pdfSrc(publicPath)}
      title="PDF document"
      className="fixed inset-0 size-full border-0 bg-white"
    />
  );
}
