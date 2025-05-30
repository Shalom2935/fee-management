"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent, // DialogDescription is used, DialogFooter is used
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle, Clock, Eye, Search, ThumbsDown, ThumbsUp, XCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-context"
import { PaymentsHistory, PaymentsHistoryArraySchema } from "@/lib/schemas/history"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useTableFilters } from "@/hooks/use-table-filters";
import { PERIODS_LIST, SCHOOLS_LIST } from "@/config/constants";
import { ReceiptViewerDialog } from "@/components/receipt-viewer-dialog";
import { useToast } from "@/components/ui/use-toast";

interface PaymentStats {
  pending: number
  approved: number
  rejected: number
}

export default function PendingPayments() {
   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
    const { token } = useAuth()
    const [ isLoading, setIsLoading ] = useState<boolean>(true)
    const [ paymentStats, setPaymentStats ] = useState<PaymentStats | null>(null)
    const [ payments, setPayments] = useState<PaymentsHistory[]>([])
    const [ paymentsLoading, setPaymentsLoading] = useState<boolean>(true)
    const [ paymentsError, setPaymentsError ] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPayments, setTotalPayments] = useState(0);
    const pageSize = 5;
  
    // PDF/Image Viewer State
    const [showPdfDialog, setShowPdfDialog] = useState(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
  
    const { toast } = useToast();
  
    const {
      filters,
      setSearch,
      setSchool,
      setPeriod,
      debouncedFilters
    } = useTableFilters({ search: "", school: "", period: "", status: "pending" });
  
    // Define fetch functions outside useEffect so they can be called independently
    const fetchPaymentStats = useCallback(async () => {
        if (!token) {
          setIsLoading(false);
          return;
        }
        setIsLoading(true);
        try {
          const response = await fetch(`${API_BASE_URL}/api/payments/stats`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des statistiques de paiement")
          }
          const data = await response.json()
          setPaymentStats(data)
        } catch (error) {
          console.error("Erreur fetchPaymentStats:", error);
          toast({
            variant: "destructive",
            title: "Erreur de chargement",
            description: error instanceof Error ? error.message : "Impossible de charger les statistiques.",
          });
        } finally {
          setIsLoading(false)
        }
      }, [token, API_BASE_URL, toast]);
  
    const fetchPayments = useCallback(async () => {
        if (!token) {
          setPaymentsLoading(false);
          return;
        }
        setPaymentsLoading(true);
        setPaymentsError(null);
        try {
          const params = new URLSearchParams({
            status: debouncedFilters.status || "pending",
            page: String(currentPage),
            limit: String(pageSize)
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
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Erreur lors de la récupération des paiements.");
          }
          const data = await response.json();
          const parsed = PaymentsHistoryArraySchema.safeParse(data.data || data.payments || []);
          if (!parsed.success) {
            console.error("Erreur de validation des paiements:", parsed.error);
            throw new Error("Format de réponse inattendu pour les paiements.");
          }
          setPayments(parsed.data);
          setTotalPayments(data.total || parsed.data.length);
        } catch (error: any) {
          setPaymentsError(error.message || "Erreur inconnue lors de la récupération des paiements.");
          setPayments([]);
          setTotalPayments(0);
          toast({
            variant: "destructive",
            title: "Erreur de chargement",
            description: `Impossible de charger les paiements: ${error.message}`,
          });
        } finally {
          setPaymentsLoading(false);
        }
      }, [token, API_BASE_URL, debouncedFilters, currentPage, pageSize, toast]);
  
    useEffect(() => {
      fetchPaymentStats()
      fetchPayments()
    }, [fetchPaymentStats, fetchPayments]) // Depends on the memoized functions
  
    const refetchData = useCallback(() => {
      fetchPaymentStats();
      fetchPayments();
    }, [fetchPaymentStats, fetchPayments]);
  
    // Fetch and display PDF/Image for a payment
    const handleViewReceipt = (paymentId: number) => {
      setSelectedPaymentId(paymentId);
      setShowPdfDialog(true);
    };
  
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

  // Add loading states for actions
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  // Approve payment handler
  const handleApprovePayment = async (payment: PaymentsHistory) => {
    setIsApproving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/${payment.payment_id}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Erreur lors de la validation du paiement");
      // Optimistic update: remove from pending list
      setPayments(prev => prev.filter(p => p.payment_id !== payment.payment_id));

      setShowApproveDialog(false);
      setSelectedPayment(null);
      toast({
        title: "Paiement validé",
        description: "Le paiement a été approuvé avec succès.",
        action: (
          <Button variant="ghost" onClick={refetchData}>
            Actualiser
          </Button>
        ),
      });
      // Add a short delay before refetching to allow toast to be seen
      setTimeout(() => {
        refetchData();
      }, 1000); // 1-second delay
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: error.message || "Une erreur inconnue est survenue lors de la validation.",
      });
    } finally {
      setIsApproving(false);
    }
  };

  // Reject payment handler
  const handleRejectPayment = async (payment: PaymentsHistory, reason: string) => {
    setIsRejecting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/${payment.payment_id}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rejection_reason: reason }),
      });
      if (!response.ok) throw new Error("Erreur lors du rejet du paiement");
      // Optimistic update: remove from pending list
      setPayments(prev => prev.filter(p => p.payment_id !== payment.payment_id));

      setShowRejectDialog(false);
      setSelectedPayment(null);
      setRejectReason("");
      setRejectPreset("");
      toast({
        title: "Paiement rejeté",
        description: "Le paiement a été rejeté avec succès.",
        action: (
          <Button variant="ghost" onClick={refetchData}>
            Actualiser
          </Button>
        ),
      });
      // Add a short delay before refetching to allow toast to be seen
      setTimeout(() => {
        refetchData();
      }, 1000); // 1-second delay
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de rejet",
        description: error.message || "Une erreur inconnue est survenue lors du rejet.",
      });
    } finally {
      setIsRejecting(false);
    }
  };

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
                  {SCHOOLS_LIST.map((school) => (
                    <SelectItem key={school.toLowerCase()} value={school.toLowerCase()}>{school}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filters.period} onValueChange={setPeriod}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les périodes</SelectItem>
                  {PERIODS_LIST.map((period) => (
                    <SelectItem key={period.value} value={period.value}>{period.label}</SelectItem>
                  ))}
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
                              <AlertDialogAction className="bg-green-500 hover:bg-green-400" onClick={() => handleApprovePayment(payment)} disabled={isApproving}>
                                {isApproving ? "Validation..." : "Valider"}
                              </AlertDialogAction>
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
                              <Label className="block text-sm font-medium">Motif</Label>
                              <Select value={rejectPreset} onValueChange={value => {
                                setRejectPreset(value);
                                setRejectReason(value !== "Autre raison" ? value : "");
                              }}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Choisir une raison..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="null">Choisir une raison...</SelectItem>
                                  {rejectPresets.map(r => (
                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {rejectPreset === "Autre raison" && (
                                <textarea className="w-full border rounded p-2 mt-2" placeholder="Saisir la raison..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
                              )}
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction className="bg-red-500 hover:bg-red-400" disabled={!rejectPreset || (rejectPreset === "Autre raison" && !rejectReason) || isRejecting} onClick={() => handleRejectPayment(payment, rejectReason || rejectPreset)}>
                                {isRejecting ? "Rejet..." : "Rejeter"}
                              </AlertDialogAction>
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
                  <Button variant="ghost" size="sm" className="h-8" title="Voir le reçu" onClick={() => handleViewReceipt(payment.payment_id)}>
                    <Eye className="h-3.5 w-3.5 mr-1" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 text-green-600" title="Approuver" onClick={() => { setSelectedPayment(payment); setShowApproveDialog(true); }}>
                    <CheckCircle className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 text-red-600" title="Rejeter" onClick={() => { setSelectedPayment(payment); setShowRejectDialog(true); }}>
                    <XCircle className="h-3.5 w-3.5 mr-1" />
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
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || paymentsLoading}>
                Précédent
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={payments.length < pageSize || (currentPage * pageSize) >= totalPayments || paymentsLoading}>
                Suivant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      </div> {/* Close the outer padding wrapper */}
            {/* PDF/Image Viewer Modal (reusable) */}
            <ReceiptViewerDialog
              open={showPdfDialog}
              onOpenChange={setShowPdfDialog}
              paymentId={selectedPaymentId ?? 0}
              token={token? token : ""}
            />
    </DashboardLayout>
  )
}
