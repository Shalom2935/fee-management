"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle, Clock, Download, Eye, Search, ThumbsDown, ThumbsUp, XCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-context"
import { PaymentsHistory, PaymentsHistoryArraySchema } from "@/lib/schemas/history"
import { Document, Page, pdfjs } from "react-pdf"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import dynamic from "next/dynamic"
import { useTableFilters } from "@/hooks/use-table-filters";

interface PaymentStats {
  pending: number
  approved: number
  rejected: number
}

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;
const DynamicTransformWrapper = dynamic(() => import('react-zoom-pan-pinch').then(mod => mod.TransformWrapper), { ssr: false });
// Correction: import dynamique pour DynamicTransformComponent
const DynamicTransformComponent = dynamic(() => import('react-zoom-pan-pinch').then(mod => mod.TransformComponent), { ssr: false });

export default function PendingPayments() {
   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
    const { token } = useAuth()
    const [ isLoading, setIsLoading ] = useState<boolean>(true)
    const [ paymentStats, setPaymentStats ] = useState<PaymentStats | null>(null)
    const [ payments, setPayments] = useState<PaymentsHistory[]>([])
    const [ paymentsLoading, setPaymentsLoading] = useState<boolean>(true)
    const [ paymentsError, setPaymentsError ] = useState<string | null>(null)
    const [page, setPage] = useState(1);
    const [totalPayments, setTotalPayments] = useState(0);
    const pageSize = 5;
  
    // PDF/Image Viewer State
    const [showPdfDialog, setShowPdfDialog] = useState(false);
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
  
    const {
      filters,
      setSearch,
      setSchool,
      setPeriod,
      debouncedFilters
    } = useTableFilters({ search: "", school: "", period: "", status: "pending" });
  
    useEffect( () => {
      const fetchPaymentStats = async () => {
  
        if (!token) {
          setIsLoading(false);
          return;
        }
        setIsLoading(true)
        try {
          const response = await fetch(`${API_BASE_URL}/api/payments/stats`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
  
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données du tableau de bord")
          }
  
          const data = await response.json()
          setPaymentStats(data)
        } catch (error) {
          console.error("Erreur:", error)
        } finally {
          setIsLoading(false)
        }
      }
  
      const fetchPayments = async () => {
        if (!token) {
          setPaymentsLoading(false);
          return;
        }
        setPaymentsLoading(true);
        setPaymentsError(null);
        try {
          const params = new URLSearchParams({
            status: debouncedFilters.status || "pending",
            page: String(page),
            limit: String(pageSize),
          });
          if (debouncedFilters.search) params.append("search", debouncedFilters.search);
          if (debouncedFilters.school) params.append("school", debouncedFilters.school);
          if (debouncedFilters.period) params.append("period", debouncedFilters.period);
          const response = await fetch(`${API_BASE_URL}/api/history?${params.toString()}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des paiements récents");
          }
          const data = await response.json();
          const parsed = PaymentsHistoryArraySchema.safeParse(data.data || data.payments || []);
          if (!parsed.success) {
            console.error("Erreur de validation des paiements récents:", parsed.error);
            throw new Error("Format inattendu des paiements récents");
          }
          setPayments(parsed.data);
          setTotalPayments(data.total || parsed.data.length);
        } catch (error: any) {
          setPaymentsError(error.message || "Erreur inconnue lors de la récupération des paiements récents");
          setPayments([]);
          setTotalPayments(0);
        } finally {
          setPaymentsLoading(false);
        }
      };
  
      fetchPaymentStats()
      fetchPayments()
    }, [token, page, debouncedFilters])
  
    // Fetch and display PDF/Image for a payment
    const handleViewReceipt = async (paymentId: number) => {
      setFileUrl(null);
      setFileType(null);
      setNumPages(null);
      setCurrentPdfPage(1);
      setPdfLoadError(null);
      setShowPdfDialog(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/payments/${paymentId}/file/`, {
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
      if (!showPdfDialog || fileType?.toLowerCase() !== 'application/pdf') return;
      const calculateWidth = () => {
        if (typeof window !== 'undefined') {
          setPdfPageWidth(Math.min(780, window.innerWidth * 0.85));
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
    }, [showPdfDialog, fileType]);
  
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
  
    // Helper for formatting amount
    function formatAmount(amount: string | number) {
      if (typeof amount === 'number') {
        return amount.toLocaleString('fr-FR');
      }
      const num = Number(amount);
      if (isNaN(num)) return amount;
      return num.toLocaleString('fr-FR');
    }

  // State for dialog
  const [selectedPayment, setSelectedPayment] = useState<PaymentsHistory | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectPreset, setRejectPreset] = useState("");
  const rejectPresets = [
    "Montant incorrect",
    "Justificatif illisible",
    "Autre raison"
  ];

  return (
    <DashboardLayout>
      {/* Add a wrapper with horizontal padding */}
      <div className="md:px-6 lg:px-8">
        {/* Grid for summary cards */}
        <div className="grid gap-4 mb-6 md:grid-cols-3"> {/* Added mb-6 for spacing below */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paiements en attente</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentStats?.pending}</div>
              <p className="text-xs text-muted-foreground">Paiements nécessitant une vérification</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paiements approuvés</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentStats?.approved}</div>
              <p className="text-xs text-muted-foreground">Paiements approuvés ce mois-ci</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paiements rejetés</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentStats?.rejected}</div>
              <p className="text-xs text-muted-foreground">Paiements rejetés ce mois-ci</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Card - Now inside the padding div */}
        <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Paiements en attente d'approbation</CardTitle> {/* Responsive Title */}
          <CardDescription>Vérifiez et approuvez les paiements soumis par les étudiants</CardDescription>
        </CardHeader>
        <CardContent>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher par nom ou matricule..."
                className="pl-8"
                value={filters.search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 md:flex md:w-auto">
              <Select value={filters.school} onValueChange={setSchool}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="École" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les écoles</SelectItem>
                  <SelectItem value="sjp">SJP</SelectItem>
                  <SelectItem value="sjmb">SJMB</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.period} onValueChange={setPeriod}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les périodes</SelectItem>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="this-week">Cette semaine</SelectItem>
                  <SelectItem value="this-month">Ce mois</SelectItem>
                  <SelectItem value="last-3-months">3 derniers mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Version desktop: tableau */}
          <div className="rounded-md border hidden md:block overflow-x-auto"> {/* Added overflow-x-auto */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Étudiant</TableHead>
                  <TableHead className="hidden md:table-cell">École</TableHead>
                  <TableHead className="hidden md:table-cell">Matricule</TableHead>
                  <TableHead>Montant (FCFA)</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.payment_id}>
                    <TableCell className="font-medium">{payment.student}</TableCell>
                    <TableCell className="hidden md:table-cell">{payment.school}</TableCell>
                    <TableCell className="hidden md:table-cell">{payment.matricule}</TableCell>
                    <TableCell>{formatAmount(payment.amount)}</TableCell>
                    <TableCell className="hidden md:table-cell">{payment.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* Validation button with confirmation dialog */}
                        <AlertDialog open={showApproveDialog && selectedPayment?.payment_id === payment.payment_id} onOpenChange={open => { setShowApproveDialog(open); if (!open) setSelectedPayment(null); }}>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-green-600" title="Approuver" onClick={() => { setSelectedPayment(payment); setShowApproveDialog(true); }}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmer la validation</AlertDialogTitle>
                              <AlertDialogDescription>
                                Voulez-vous vraiment valider ce paiement pour <b>{payment.student}</b> ({payment.matricule}) ?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction className="bg-green-500 hover:bg-green-400"  onClick={() => {/* TODO: call approve API */ setShowApproveDialog(false); setSelectedPayment(null); }}>Valider</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        {/* Rejet button with reason dialog */}
                        <AlertDialog open={showRejectDialog && selectedPayment?.payment_id === payment.payment_id} onOpenChange={open => { setShowRejectDialog(open); if (!open) { setSelectedPayment(null); setRejectReason(""); setRejectPreset(""); } }}>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-600" title="Rejeter" onClick={() => { setSelectedPayment(payment); setShowRejectDialog(true); }}>
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Motif du rejet</AlertDialogTitle>
                              <AlertDialogDescription>
                                Merci de spécifier la raison du rejet pour le paiement de <b>{payment.student}</b> ({payment.matricule}) :
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="space-y-2 py-2">
                              <label className="block text-sm font-medium"></label>
                              <select className="w-full border rounded p-2" value={rejectPreset} onChange={e => { setRejectPreset(e.target.value); setRejectReason(e.target.value !== "Autre raison" ? e.target.value : ""); }}>
                                <option value="">Choisir une raison...</option>
                                {rejectPresets.map(r => <option key={r} value={r}>{r}</option>)}
                              </select>
                              {rejectPreset === "Autre raison" && (
                                <textarea className="w-full border rounded p-2 mt-2" placeholder="Saisir la raison..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
                              )}
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction className="bg-red-500 hover:bg-red-400" disabled={!rejectPreset || (rejectPreset === "Autre raison" && !rejectReason)} onClick={() => {/* TODO: call reject API with reason */ setShowRejectDialog(false); setSelectedPayment(null); setRejectReason(""); setRejectPreset(""); }}>Rejeter</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        {/* ...existing Dialog for details... */}
                            <Button variant="ghost" size="icon" title="Voir les détails" onClick={() => handleViewReceipt(payment.payment_id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Version mobile: cards */}
          <div className="grid gap-4 md:hidden">
            {payments.map((payment) => (
              <Card key={payment.payment_id} className="overflow-hidden">
                <CardHeader className="p-5 pb-2 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-base leading-tight">{payment.student}</CardTitle>
                    <CardDescription>{payment.matricule}</CardDescription>
                  </div>
                  <div className="font-bold text-right">{formatAmount(payment.amount)} FCFA</div>
                </CardHeader>
                <CardContent className="px-5 pt-2 pb-0">
                  <div className="text-sm text-muted-foreground flex justify-between">
                    <span className="truncate pr-2">École: {payment.matricule.substring(0, 3)}</span>
                    <span>Date: {payment.date}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-2 flex justify-end border-t mt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Détails
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Détails du paiement</DialogTitle>
                        <DialogDescription>
                          Informations complètes sur le paiement
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right font-medium">Étudiant</Label>
                          <div className="col-span-3">{payment.student}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right font-medium">École</Label>
                          <div className="col-span-3">{payment.matricule.substring(0, 3)}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right font-medium">Matricule</Label>
                          <div className="col-span-3">{payment.matricule}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right font-medium">Montant</Label>
                          <div className="col-span-3">{formatAmount(payment.amount)} FCFA</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right font-medium">Date</Label>
                          <div className="col-span-3">{payment.date}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right font-medium">Méthode</Label>
                          <div className="col-span-3">{payment.method}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right font-medium">Référence</Label>
                          <div className="col-span-3">{payment.receipt}</div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <Button className="mx-2 bg-green-600 hover:bg-green-700">
                          <ThumbsUp className="mr-2 h-4 w-4" />
                          Approuver
                        </Button>
                        <Button variant="outline" className="mx-2 text-red-600 border-red-600 hover:bg-red-50">
                          <ThumbsDown className="mr-2 h-4 w-4" />
                          Rejeter
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="sm" className="h-8 text-green-600">
                    <CheckCircle className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                    Approuver
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 text-red-600">
                    <XCircle className="h-3.5 w-3.5 mr-1" />
                    Rejeter
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Affichage de {payments.length} paiements sur {totalPayments}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || paymentsLoading}>
                Précédent
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={payments.length < pageSize || (page * pageSize) >= totalPayments || paymentsLoading}>
                Suivant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      </div> {/* Close the outer padding wrapper */}
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
                          <img src={fileUrl} alt="Reçu" className="max-h-full mx-auto object-cover" />
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
    </DashboardLayout>
  )
}
