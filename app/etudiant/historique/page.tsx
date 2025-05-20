"use client"

import { useEffect, useState, useMemo, useCallback } from "react" // Added useCallback
import { useAuth } from "@/components/auth-context"
import { useToast } from "@/hooks/use-toast"
import { z } from "zod"
// import { paymentSchema } from "@/lib/schemas/payment" // Not used directly
// import { PaymentData } from "@/lib/schemas/payment" // Not used directly
import { studentPaymentSchema, StudentPayment } from "@/lib/schemas/payment"
import { formatCurrency } from "@/lib/utils"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Eye, Search, XCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  // DialogFooter, // No longer needed for pdfLoadError specifically here
} from "@/components/ui/dialog"
import dynamic from 'next/dynamic';

import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

const DynamicTransformWrapper = dynamic(
  () => import('react-zoom-pan-pinch').then(mod => mod.TransformWrapper),
  { ssr: false }
);
const DynamicTransformComponent = dynamic(
  () => import('react-zoom-pan-pinch').then(mod => mod.TransformComponent),
  { ssr: false }
);

const PDF_VIEWER_MAX_WIDTH_DIALOG = 780; // Max width for PDF page in dialog
const PDF_VIEWER_WIDTH_PERCENTAGE_DIALOG = 0.85; // % of window width for PDF in dialog

export default function PaymentHistory() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [payments, setPayments] = useState<StudentPayment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  // State for PDF/Image Viewer Dialog
  const [showPdfDialog, setShowPdfDialog] = useState(false); // Renamed for clarity
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPdfPage, setCurrentPdfPage] = useState(1);
  const [pdfPageWidth, setPdfPageWidth] = useState(600); // Default, will be updated
  const [pdfLoadError, setPdfLoadError] = useState<string | null>(null);

  const documentOptions = useMemo(() => ({
    cMapUrl: "/cmaps/", // Make sure cmaps are in public/cmaps/
    cMapPacked: true,
    // standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`, // Optional
  }), []);

  useEffect(() => {
    if (!token) {
      setError("Authentification requise. Veuillez vous reconnecter.")
      setIsLoading(false)
      return
    }
    const fetchPayments = async () => {
      // ... (your existing fetchPayments logic - unchanged)
      setIsLoading(true)
      setError(null)
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/`
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        let data = null
        if (
          response.headers.get("content-length") !== "0" &&
          response.headers.get("content-type")?.includes("application/json")
        ) {
          data = await response.json()
        }
        if (!response.ok) {
          const errorMessage = data?.message || `Erreur ${response.status}: Impossible de récupérer les paiements.`
          
          throw new Error(errorMessage)
        }
        const schema = z.array(studentPaymentSchema)
        const result = schema.safeParse(data)
        if (!result.success) {
          console.error("Validation error:", result.error)
          throw new Error("Réponse invalide reçue du serveur.")
        }
        setPayments(result.data)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Une erreur inconnue est survenue."
        setError(message)
        toast({
          variant: "destructive",
          title: "Erreur de chargement",
          description: message,
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchPayments()
  }, [token, toast])

  const filteredPayments = payments.filter((p: any) =>
    p.reference?.toLowerCase().includes(search.toLowerCase()) ||
    p.amount?.toString().replace(/\s/g, "").includes(search.replace(/\s/g, "")) ||
    p.date?.toLowerCase().includes(search.toLowerCase())
  );

  // Fetch and display PDF/Image
  const handleViewReceipt = async (paymentId: number) => {
    setFileUrl(null);
    setFileType(null);
    setNumPages(null);
    setCurrentPdfPage(1); // Reset for new PDF
    setPdfLoadError(null);
    setShowPdfDialog(true); // Open dialog immediately, show loading inside

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/${paymentId}/file/`, {
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
      // No need to setShowPdfDialog(true) again, it's already open
    }
  };

  // PDF Document Callbacks
  const onDocumentLoadSuccess = useCallback(({ numPages: nextNumPages }: { numPages: number }) => {
    setNumPages(nextNumPages);
    setCurrentPdfPage(1); // Ensure it starts at page 1 for a newly loaded doc
    setPdfLoadError(null); // Clear any previous error
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('Error while loading PDF document:', error);
    setPdfLoadError(error.message || 'Failed to load PDF document.');
    setNumPages(null);
  }, []);

  // PDF Page Width Effect
  useEffect(() => {
    if (!showPdfDialog || fileType?.toLowerCase() !== 'application/pdf') {
      return;
    }

    const calculateWidth = () => {
      if (typeof window !== 'undefined') {
        setPdfPageWidth(Math.min(PDF_VIEWER_MAX_WIDTH_DIALOG, window.innerWidth * PDF_VIEWER_WIDTH_PERCENTAGE_DIALOG));
      }
    };

    calculateWidth(); // Initial calculation

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
  }, [showPdfDialog, fileType]);

  // PDF Pagination Functions
  const goToPrevPdfPage = () => {
    setCurrentPdfPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const goToNextPdfPage = () => {
    if (numPages) {
      setCurrentPdfPage((prevPage) => Math.min(numPages, prevPage + 1));
    }
  };

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
    <DashboardLayout>
      <div className="w-[90vw] md:w-full md:px-6">
        <Card>
          <CardHeader className="space-y-2 p-3 pb-1 pt-4 sm:p-4 sm:pb-2 md:p-6">
            <CardTitle className="text-xl md:text-xl">Paiements</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 md:p-6">
            {/* ... (your existing search and table/mobile cards layout - unchanged) ... */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher un paiement..."
                  className="pl-9 h-10 w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="rounded-md border hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant (FCFA)</TableHead>
                    <TableHead>Numéro de reçu</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">Chargement des paiements...</TableCell>
                    </TableRow>
                  )}
                  {!isLoading && error && (
                     <TableRow>
                      <TableCell colSpan={5} className="text-center text-red-500">{error}</TableCell>
                    </TableRow>
                  )}
                  {!isLoading && !error && filteredPayments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">Aucun paiement trouvé.</TableCell>
                    </TableRow>
                  )}
                  {!isLoading && !error && filteredPayments.map((payment) => (
                    <TableRow key={payment.payment_id}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{formatCurrency(payment.amount, undefined, undefined, false)}</TableCell>
                      <TableCell>{payment.reference}</TableCell>
                      <TableCell>
                        {payment.status === "approved" ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Approuvé
                          </Badge>
                        ) : payment.status === "rejected" ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 cursor-pointer">
                                <XCircle className="mr-1 h-3 w-3" />
                                Rejeté
                              </Badge>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Paiement rejeté</DialogTitle>
                                <DialogDescription>
                                  Votre paiement a été rejeté pour la raison suivante:
                                </DialogDescription>
                              </DialogHeader>
                              <div className="p-4 bg-red-50 rounded-md border border-red-200 text-red-800">
                                {payment.rejectionReason}
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                            En attente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" title="Voir les détails" onClick={() => handleViewReceipt(payment.payment_id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards View */}
            <div className="grid gap-4  md:hidden">
             {isLoading && <p className="text-center">Chargement des paiements...</p>}
             {!isLoading && error && <p className="text-center text-red-500">{error}</p>}
             {!isLoading && !error && filteredPayments.length === 0 && (
                <p className="text-center">Aucun paiement trouvé.</p>
              )}
              {!isLoading && !error && filteredPayments.map((payment) => (
                <Card key={payment.payment_id} className="overflow-hidden w-full relative">
                  <CardHeader className="p-4 pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <CardTitle className="text-lg font-semibold">
                          {formatCurrency(payment.amount)}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {payment.date}
                        </CardDescription>
                        <p className="text-sm text-muted-foreground">
                          Reçu: {payment.reference}
                        </p>
                      </div>
                      {payment.status === "approved" ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 w-fit">
                          <CheckCircle className="mr-1 h-3.5 w-3.5" />
                          Approuvé
                        </Badge>
                      ) : payment.status === "rejected" ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 cursor-pointer w-fit">
                              <XCircle className="mr-1 h-3.5 w-3.5" />
                              Rejeté
                            </Badge>
                          </DialogTrigger>
                          <DialogContent className="max-w-[90vw] sm:max-w-lg mx-3">
                            <DialogHeader className="space-y-3">
                              <DialogTitle>Paiement rejeté</DialogTitle>
                              <DialogDescription>
                                Votre paiement a été rejeté pour la raison suivante:
                              </DialogDescription>
                            </DialogHeader>
                            <div className="p-4 bg-red-50 rounded-md border border-red-200 text-red-800">
                              {payment.rejectionReason}
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800 w-fit">
                          En attente
                        </Badge>
                      )}
                      <Button variant="ghost" size="sm" className="h-9 flex-1 sm:flex-none absolute bottom-3 right-4" onClick={() => handleViewReceipt(payment.payment_id)}>
                        <Eye className="h-4 w-4" />
                        Voir Reçu
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PDF/Image Viewer Modal */}
      <Dialog open={showPdfDialog} onOpenChange={setShowPdfDialog}>
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
                        className="flex justify-center" // Center Document component if its content is narrower
                      >
                        {numPages && ( // Only render Page if numPages is known
                          <Page
                            key={`page_${currentPdfPage}_${fileUrl}`}
                            pageNumber={currentPdfPage}
                            width={pdfPageWidth}
                            renderAnnotationLayer={true}
                            renderTextLayer={true}
                            loading={<div className="p-2 text-center text-sm text-muted-foreground">Chargement de la page {currentPdfPage}...</div>}
                            className="shadow-lg" // Add some styling to the page
                          />
                        )}
                      </Document>
                    </div>
                    {numPages && (
                      <div className="flex items-center justify-center gap-2 py-2 px-4 border-t bg-background">
                        <Button onClick={goToPrevPdfPage} disabled={currentPdfPage <= 1} variant="outline" size="sm">
                          Précédent
                        </Button>
                        <span className="text-sm tabular-nums">
                          Page {currentPdfPage} / {numPages}
                        </span>
                        <Button onClick={goToNextPdfPage} disabled={currentPdfPage >= numPages} variant="outline" size="sm">
                          Suivant
                        </Button>
                      </div>
                    )}
                  </>
                ) : fileType?.startsWith("image/") ? (
                  <div className="flex-1 overflow-auto flex items-center justify-center p-2">
                    <DynamicTransformWrapper>
                      <DynamicTransformComponent
                        contentStyle={{ width: '100%', height: '100%' }}
                        wrapperStyle={{ width: '100%', height: '100%' }}
                      >
                        <img
                          src={fileUrl}
                          alt="Reçu"
                          className="max-h-full max-w-full object-contain" // Changed from max-h-[70vh]
                        />
                      </DynamicTransformComponent>
                    </DynamicTransformWrapper>
                  </div>
                ) : fileUrl && ( // If fileUrl is present but type is not PDF/Image or error occurred before type check
                  <div className="flex-1 flex items-center justify-center text-red-500 p-4">
                    Format de fichier non supporté ou erreur de chargement.
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}