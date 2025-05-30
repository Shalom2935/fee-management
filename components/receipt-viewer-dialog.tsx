import { useState, useEffect, useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Document, Page, pdfjs } from "react-pdf";
import dynamic from "next/dynamic";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

const DynamicTransformWrapper = dynamic(
  () => import("react-zoom-pan-pinch").then(mod => mod.TransformWrapper),
  { ssr: false }
);
const DynamicTransformComponent = dynamic(
  () => import("react-zoom-pan-pinch").then(mod => mod.TransformComponent),
  { ssr: false }
);

interface ReceiptViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentId: number | string;
  apiBaseUrl?: string; // Optionally override API base
  token: string;
}

const PDF_VIEWER_MAX_WIDTH_DIALOG = 780;
const PDF_VIEWER_WIDTH_PERCENTAGE_DIALOG = 0.85;

export function ReceiptViewerDialog({ open, onOpenChange, paymentId, apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL, token }: ReceiptViewerDialogProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPdfPage, setCurrentPdfPage] = useState(1);
  const [pdfPageWidth, setPdfPageWidth] = useState(600);
  const [pdfLoadError, setPdfLoadError] = useState<string | null>(null);

  const documentOptions = useMemo(() => ({
    cMapUrl: "/cmaps/",
    cMapPacked: true,
  }), []);

  // Fetch file when dialog opens or paymentId changes
  useEffect(() => {
    if (!open) return;
    setFileUrl(null);
    setFileType(null);
    setNumPages(null);
    setCurrentPdfPage(1);
    setPdfLoadError(null);
    if (!paymentId) return;
    const fetchFile = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/payments/${paymentId}/file/`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.detail || errorData?.message || `Erreur ${response.status} lors du téléchargement du fichier.`);
        }
        const contentType = response.headers.get('content-type');
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setFileUrl(url);
        setFileType(contentType);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Une erreur inconnue est survenue.';
        setPdfLoadError(`Impossible d'afficher le reçu: ${message}`);
      }
    };
    fetchFile();
  }, [open, paymentId, apiBaseUrl, token]);

  // PDF Document Callbacks
  const onDocumentLoadSuccess = useCallback(({ numPages: nextNumPages }: { numPages: number }) => {
    setNumPages(nextNumPages);
    setCurrentPdfPage(1);
    setPdfLoadError(null);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    setPdfLoadError(error.message || 'Failed to load PDF document.');
    setNumPages(null);
  }, []);

  // PDF Page Width Effect
  useEffect(() => {
    if (!open || fileType?.toLowerCase() !== 'application/pdf') return;
    const calculateWidth = () => {
      if (typeof window !== 'undefined') {
        setPdfPageWidth(Math.min(PDF_VIEWER_MAX_WIDTH_DIALOG, window.innerWidth * PDF_VIEWER_WIDTH_PERCENTAGE_DIALOG));
      }
    };
    calculateWidth();
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(calculateWidth, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [open, fileType]);

  // PDF Pagination Functions
  const goToPrevPdfPage = () => setCurrentPdfPage((prev) => Math.max(1, prev - 1));
  const goToNextPdfPage = () => numPages && setCurrentPdfPage((prev) => Math.min(numPages, prev + 1));

  // Cleanup Blob URL when dialog closes or fileUrl changes
  useEffect(() => {
    let currentFileUrl = fileUrl;
    return () => {
      if (currentFileUrl && currentFileUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentFileUrl);
      }
    };
  }, [fileUrl]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[90vw] md:w-full h-[85vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Visualiseur de Reçu</DialogTitle>
          <DialogDescription>
            {fileType?.toLowerCase() === 'application/pdf' && numPages ? `Page ${currentPdfPage} sur ${numPages}` : 'Aperçu du fichier'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-100 dark:bg-gray-800">
          {!fileUrl && !pdfLoadError && (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">Chargement du fichier...</div>
          )}
          {pdfLoadError && (
            <div className="flex-1 flex items-center justify-center text-red-500 p-4">{pdfLoadError}</div>
          )}
          {fileUrl && !pdfLoadError && (
            <>
              {fileType?.toLowerCase() === 'application/pdf' ? (
                <>
                  <div className="flex-1 overflow-auto flex items-start justify-center p-1 sm:p-2">
                    <Document
                      file={fileUrl}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={onDocumentLoadError}
                      options={documentOptions}
                      loading={<div className="p-4 text-center text-muted-foreground">Chargement du PDF...</div>}
                      error={<div className="p-4 text-center text-red-500">{pdfLoadError || "Erreur de chargement du document PDF."}</div>}
                      className="flex justify-center"
                    >
                      {numPages && (
                        <Page
                          key={`page_${currentPdfPage}_${fileUrl}`}
                          pageNumber={currentPdfPage}
                          width={pdfPageWidth}
                          renderAnnotationLayer={true}
                          renderTextLayer={true}
                          loading={<div className="p-2 text-center text-sm text-muted-foreground">Chargement de la page {currentPdfPage}...</div>}
                          className="shadow-lg"
                        />
                      )}
                    </Document>
                  </div>
                  {numPages && (
                    <div className="flex items-center justify-center gap-2 py-2 px-4 border-t bg-background">
                      <Button onClick={goToPrevPdfPage} disabled={currentPdfPage <= 1} variant="outline" size="sm">Précédent</Button>
                      <span className="text-sm tabular-nums">Page {currentPdfPage} / {numPages}</span>
                      <Button onClick={goToNextPdfPage} disabled={currentPdfPage >= numPages} variant="outline" size="sm">Suivant</Button>
                    </div>
                  )}
                </>
              ) : fileType?.startsWith("image/") ? (
                <div className="flex-1 overflow-auto flex items-center justify-center p-2">
                  <DynamicTransformWrapper>
                    <DynamicTransformComponent contentStyle={{ width: '100%', height: '100%' }} wrapperStyle={{ width: '100%', height: '100%' }}>
                      <img src={fileUrl} alt="Reçu" className="max-h-full mx-auto object-contain" />
                    </DynamicTransformComponent>
                  </DynamicTransformWrapper>
                </div>
              ) : fileUrl && (
                <div className="flex-1 flex items-center justify-center text-red-500 p-4">Format de fichier non supporté ou erreur de chargement.</div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
