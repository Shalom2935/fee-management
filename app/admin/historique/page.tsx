"use client"

import { PaymentsHistory, PaymentsHistoryArraySchema } from "@/lib/schemas/history"; // Correction de l'import
import { useTableFilters } from "@/hooks/use-table-filters";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Eye, Search, XCircle, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ReceiptViewerDialog } from "@/components/receipt-viewer-dialog";
import { useAuth } from "@/components/auth-context";
import { SCHOOLS_LIST, PERIODS_LIST } from "@/config/constants";
import { useToast } from "@/components/ui/use-toast";

export default function AdminPaymentHistory() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { token } = useAuth();
  const { toast } = useToast();
  const [payments, setPayments] = useState<PaymentsHistory[]>([]); // Utilisation du type PaymentsHistory
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  const pageSize = 10;

  // Use reusable filter hook
  const {
    filters,
    setFilters,
    debouncedFilters,
    setSearch,
    setSchool,
    setStatus,
    setPeriod
  } = useTableFilters({ search: "", school: "all", period: "all", status: "all" });

  useEffect(() => {
    if (!token) {
      setError("Authentification requise. Veuillez vous reconnecter.");
      setPayments([]);
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Non authentifié",
        description: "Votre session a expiré ou vous n'êtes pas connecté. Veuillez vous reconnecter."
      });
      return;
    }
    const fetchPayments = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (debouncedFilters.search) params.append("search", debouncedFilters.search);
        if (debouncedFilters.school !== "all") params.append("school", debouncedFilters.school);
        if (debouncedFilters.period && debouncedFilters.period !== "all") params.append("period", debouncedFilters.period);
        params.append("page", String(currentPage));
        params.append("limit", String(pageSize));
        // Correction : envoyer plusieurs status séparés si 'all'
        if (!debouncedFilters.status || debouncedFilters.status === "all") {
          params.append("status", "approved");
          params.append("status", "rejected");
        } else {
          params.append("status", debouncedFilters.status);
        }
        const response = await fetch(`${API_BASE_URL}/api/history?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 401) {
          setError("Session expirée ou non autorisé. Veuillez vous reconnecter.");
          setPayments([]);
          toast({
            variant: "destructive",
            title: "Non autorisé",
            description: "Votre session a expiré ou vous n'avez pas les droits. Veuillez vous reconnecter."
          });
          setLoading(false);
          return;
        }
        if (!response.ok) throw new Error("Erreur lors du chargement de l'historique des paiements");
        const data = await response.json();
        const parsed = PaymentsHistoryArraySchema.safeParse(data.data || data.payments || []);
        if (!parsed.success) {
          console.error("Erreur de validation des paiements:", parsed.error);
          throw new Error("Format inattendu des paiements");
        }
        setPayments(parsed.data);
        setTotalPayments(data.total || parsed.data.length);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: err.message || "Erreur inconnue lors du chargement de l'historique."
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [API_BASE_URL, token, debouncedFilters, currentPage, toast]);

  function formatAmount(amount: string | number) {
    const num = Number(amount);
    if (isNaN(num)) return amount;
    return num.toLocaleString("fr-FR");
  }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Rechercher par nom ou matricule..." className="pl-8" value={filters.search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4 md:flex md:w-auto">
              <Select value={filters.school} onValueChange={setSchool}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="École" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les écoles</SelectItem>
                  {SCHOOLS_LIST.map(s => <SelectItem key={s.toLowerCase()} value={s.toLowerCase()}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filters.period} onValueChange={setPeriod}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les périodes</SelectItem>
                  {PERIODS_LIST.map(period => (
                    <SelectItem key={period.value} value={period.value}>{period.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filters.status} onValueChange={setStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="approved">Approuvés</SelectItem>
                  <SelectItem value="rejected">Rejetés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Version desktop: tableau */}
          <div className="rounded-md border hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Étudiant</TableHead>
                  <TableHead className="hidden md:table-cell">École</TableHead>
                  <TableHead className="hidden md:table-cell">Matricule</TableHead>
                  <TableHead>Montant (FCFA)</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7}>Chargement...</TableCell></TableRow>
                ) : error ? (
                  <TableRow><TableCell colSpan={7} className="text-red-500">{error}</TableCell></TableRow>
                ) : payments.length === 0 ? (
                  <TableRow><TableCell colSpan={7}>Aucun paiement trouvé.</TableCell></TableRow>
                ) : payments.map((payment) => {
                  console.log("[ADMIN HISTORIQUE] Paiement reçu:", payment);
                  // console.log("[ADMIN HISTORIQUE] payment.date:", payment.date); // Le 'as any' ne devrait plus être nécessaire si le type est correct
                  return (
                    <TableRow key={payment.payment_id}>
                      <TableCell className="font-medium">{payment.student}</TableCell>
                      <TableCell className="hidden md:table-cell">{payment.school}</TableCell>
                      <TableCell className="hidden md:table-cell">{payment.matricule}</TableCell>
                      <TableCell>{formatAmount(payment.amount)}</TableCell>
                      <TableCell className="hidden md:table-cell">{(payment as any).date || "-"}</TableCell>
                      <TableCell> {/* Affichage de la date, (payment as any) peut être retiré si le type est bien défini */}
                        {payment.status === "approved" ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approuvé</Badge>
                        ) : (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 cursor-pointer">Rejeté</Badge>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Paiement rejeté</DialogTitle>
                                <DialogDescription>
                                  Ce paiement a été rejeté pour la raison suivante :
                                </DialogDescription>
                              </DialogHeader>
                              <div className="p-4 bg-red-50 rounded-md border border-red-200 text-red-800">
                                {(payment as any).rejection_reason || "Aucune raison précisée."}
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedPaymentId(payment.payment_id); setShowReceiptDialog(true); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Version mobile: cards */}
          <div className="grid gap-4 md:hidden">
            {loading ? (
              <div className="p-4 text-center">Chargement...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : payments.length === 0 ? (
              <div className="p-4 text-center">Aucun paiement trouvé.</div>
            ) : payments.map((payment) => (
              <Card key={payment.payment_id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{payment.student}</CardTitle>
                    <CardDescription>{payment.matricule}</CardDescription>
                  </div>
                  <div className="font-bold text-right">{formatAmount(payment.amount)} FCFA</div>
                </CardHeader>
                <CardContent className="p-4 pt-2 relative">
                  <div className="text-sm text-muted-foreground flex justify-between">
                    <span>École: {payment.school}</span>
                    <span>Date: {payment.date || "-"}</span> {/* Affichage de la date */}
                  </div>
                  <div className="mt-2">
                    {payment.status === "approved" ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approuvé</Badge>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 cursor-pointer">Rejeté</Badge>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Paiement rejeté</DialogTitle>
                            <DialogDescription>
                              Ce paiement a été rejeté pour la raison suivante :
                            </DialogDescription>
                          </DialogHeader>
                          <div className="p-4 bg-red-50 rounded-md border border-red-200 text-red-800">
                            {(payment as any).rejection_reason || "Aucune raison précisée."}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 absolute right-4 bottom-2" title="Voir le reçu" onClick={() => { setSelectedPaymentId(payment.payment_id); setShowReceiptDialog(true); }}>
                    <Eye className="h-3.5 w-3.5 mr-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Affichage de {payments.length} paiements sur {totalPayments}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                Précédent
              </Button>
              <span className="text-sm">Page {currentPage}</span>
              <Button variant="outline" size="sm" disabled={payments.length < pageSize} onClick={() => setCurrentPage(p => p + 1)}>
                Suivant
              </Button>
            </div>
          </div>

          <ReceiptViewerDialog
            open={showReceiptDialog}
            onOpenChange={setShowReceiptDialog}
            paymentId={selectedPaymentId ?? 0}
            token={token || ""}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}