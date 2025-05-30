"use client"

import { useState, useEffect } from 'react'
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, AlertTriangle, CheckCircle, ArrowUpRight, ArrowDownRight, Eye, Loader2, ServerCrash } from "lucide-react"
import Link from "next/link"
import { useAuth } from '@/components/auth-context'
import { PaymentsHistory, PaymentsHistoryArraySchema } from "@/lib/schemas/history"
import { ReceiptViewerDialog } from "@/components/receipt-viewer-dialog";

// Interface pour les statistiques du tableau de bord
interface DashboardStats {
  totalStudents: {
    count: number;
    changePercent: number;
    changeDirection: "up" | "down";
  };
  paymentCompliance: {
    percentage: number;
  };
  pendingPayments: {
    count: number;
    changePercent: number;
    changeDirection: "up" | "down";
  };
  overdueAccounts: {
    count: number;
    changePercent: number;
    changeDirection: "up" | "down";
  };
}

// Interface pour la répartition par école
interface SchoolDistribution {
  name: string;
  studentCount: number;
  upToDatePercentage: number;
  overduePercentage: number;
}

export default function AdminDashboard() {

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  const { token } = useAuth()
  const [ dashboardData, setDashboardData ] = useState<DashboardStats>()
  const [ isLoading, setIsLoading ] = useState<boolean>(true)
  const [ schoolDistributionData, setSchoolDistributionData] = useState<SchoolDistribution[] | null>(null);
  const [ schoolDistLoading, setSchoolDistLoading ] = useState<boolean>(true);
  const [ schoolDistError, setSchoolDistError ] = useState<string | null>(null);
  const [ recentPayments, setRecentPayments] = useState<PaymentsHistory[]>([]);
  const [ recentPaymentsLoading, setRecentPaymentsLoading] = useState<boolean>(true);
  const [ recentPaymentsError, setRecentPaymentsError ] = useState<string | null>(null);

  // PDF/Image Viewer State
  const [showPdfDialog, setShowPdfDialog] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);

  useEffect( () => {
    const fetchDashboardData = async () => {

      if (!token) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true)
      try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
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
        setDashboardData(data)
      } catch (error) {
        console.error("Erreur:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchSchoolDistributionData = async () => {
      
      if (!token) {
        setSchoolDistLoading(false);
        return;
      }
      setSchoolDistLoading(true)
      setSchoolDistError(null)
      try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/school-distribution`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données de répartition par école")
        }

        const data = await response.json()
        setSchoolDistributionData(data.schools || data); // adapt to your API shape
      } catch (error: any) {
        setSchoolDistError(error.message || "Erreur inconnue lors de la récupération de la répartition par école");
        setSchoolDistributionData(null);
      } finally {
        setSchoolDistLoading(false);
      }
    }

    const fetchRecentPayments = async () => {
      if (!token) {
        setRecentPaymentsLoading(false);
        return;
      }
      setRecentPaymentsLoading(true);
      setRecentPaymentsError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/history/recent?status=pending&limit=5`, {
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
        const parsed = PaymentsHistoryArraySchema.safeParse(data.payments || data);
        if (!parsed.success) {
          console.error("Erreur de validation des paiements récents:", parsed.error);
          throw new Error("Format inattendu des paiements récents");
        }
        setRecentPayments(parsed.data);
      } catch (error: any) {
        setRecentPaymentsError(error.message || "Erreur inconnue lors de la récupération des paiements récents");
        setRecentPayments([]);
      } finally {
        setRecentPaymentsLoading(false);
      }
    };

    fetchDashboardData()
    fetchSchoolDistributionData()
    fetchRecentPayments()
  }, [token])

  // Replace handleViewReceipt to use selectedPaymentId
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

  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des étudiants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.totalStudents.count}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {dashboardData?.totalStudents.changeDirection === "up" ? <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" /> : <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />}
              <span className="text-green-500 font-medium">{dashboardData?.totalStudents.changePercent}%</span>
              <span className="ml-1">depuis le mois dernier</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conformité des paiements</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.paymentCompliance.percentage}%</div>
            <Progress value={dashboardData?.paymentCompliance.percentage} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Pourcentage d'étudiants à jour</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements en attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.pendingPayments.count}</div>
            {/* <div className="flex items-center text-xs text-muted-foreground">
              {dashboardData?.pendingPayments.changeDirection === "up"
                ? <ArrowUpRight className="mr-1 h-3 w-3 text-red-500" />
                : <ArrowDownRight className="mr-1 h-3 w-3 text-green-500" />}
              <span className={
                dashboardData?.pendingPayments.changeDirection === "up"
                  ? "text-red-500 font-medium"
                  : "text-green-500 font-medium"
              }>
                {dashboardData?.pendingPayments.changePercent}%
              </span>
              <span className="ml-1">depuis la semaine dernière</span>
            </div> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comptes en retard</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.overdueAccounts.count}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {dashboardData?.overdueAccounts.changeDirection === "up"
                ? <ArrowUpRight className="mr-1 h-3 w-3 text-red-500" />
                : <ArrowDownRight className="mr-1 h-3 w-3 text-green-500" />}
              <span className={
                dashboardData?.overdueAccounts.changeDirection === "up"
                  ? "text-red-500 font-medium"
                  : "text-green-500 font-medium"
              }>
                {dashboardData?.overdueAccounts.changePercent}%
              </span>
              <span className="ml-1">depuis le mois dernier</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7 mt-4">
        <Card className="md:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>Les 5 derniers paiements soumis</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/paiements">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {/* Table for Desktop (hidden below md breakpoint) */}
            <div className="hidden md:block">
              {recentPaymentsLoading ? (
                <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
                  <Loader2 className="animate-spin h-5 w-5" /> Chargement des paiements récents...
                </div>
              ) : recentPaymentsError ? (
                <div className="text-red-600 text-sm py-4 flex items-center gap-2"><ServerCrash className="h-4 w-4" /> {recentPaymentsError}</div>
              ) : recentPayments && recentPayments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Étudiant</TableHead>
                      <TableHead>École</TableHead>
                      <TableHead>Matricule</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPayments.map((payment) => (
                      <TableRow key={payment.payment_id}>
                        <TableCell>{payment.student}</TableCell>
                        <TableCell>{payment.school}</TableCell>
                        <TableCell>{payment.matricule}</TableCell>
                        <TableCell>{formatAmount(payment.amount)} FCFA</TableCell>
                        <TableCell>
                          {payment.status === "approved" && (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approuvé</Badge>
                          )}
                          {payment.status === "pending" && (
                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En attente</Badge>
                          )}
                          {payment.status === "rejected" && (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejeté</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                              <Button variant="ghost" size="icon" title="Voir le fichier" onClick={() => handleViewReceipt(payment.payment_id)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-muted-foreground py-8 text-center">Aucun paiement récent trouvé.</div>
              )}
            </div>
            {/* Cards for Mobile/Tablet (visible below md breakpoint) */}
            <div className="space-y-4 md:hidden">
              {recentPaymentsLoading ? (
                <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
                  <Loader2 className="animate-spin h-5 w-5" /> Chargement des paiements récents...
                </div>
              ) : recentPaymentsError ? (
                <div className="text-red-600 text-sm py-4 flex items-center gap-2"><ServerCrash className="h-4 w-4" /> {recentPaymentsError}</div>
              ) : recentPayments && recentPayments.length > 0 ? (
                recentPayments.map((payment) => (
                  <Card className="bg-muted/30" key={payment.payment_id}>
                    <CardContent className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2 relative">
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">{payment.student}</p>
                        <p className="text-sm text-muted-foreground">{payment.school} - {payment.matricule}</p>
                        <p className="text-sm font-semibold">{formatAmount(payment.amount)} FCFA</p>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
                        <div>
                          {payment.status === "approved" && <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approuvé</Badge>}
                          {payment.status === "pending" && <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En attente</Badge>}
                          {payment.status === "rejected" && <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejeté</Badge>}
                        </div>
                        <div>
                              <Button variant="ghost" size="icon" title="Voir le fichier" className="absolute right-4 bottom-4" onClick={() => handleViewReceipt(payment.payment_id)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-muted-foreground py-8 text-center">Aucun paiement récent trouvé.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Répartition par école</CardTitle>
            <CardDescription>Distribution des étudiants et paiements</CardDescription>
          </CardHeader>
          <CardContent>
            {schoolDistLoading ? (
      <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
        <Loader2 className="animate-spin h-5 w-5" /> Chargement de la répartition par école...
      </div>
    ) : schoolDistError ? (
      <div className="text-red-600 text-sm py-4 flex items-center gap-2"><ServerCrash className="h-4 w-4" /> {schoolDistError}</div>
    ) : schoolDistributionData && schoolDistributionData.length > 0 ? (
      <div className="space-y-6">
        {schoolDistributionData.map((school) => (
          <div key={school.name}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">{school.name}</h4>
              <span className="text-sm text-muted-foreground">{school.studentCount} étudiants</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs">Paiements à jour</span>
                <span className="text-xs">{school.upToDatePercentage}%</span>
              </div>
              <Progress value={school.upToDatePercentage} className="h-1" />
              <div className="flex items-center justify-between">
                <span className="text-xs">Paiements en retard</span>
                <span className="text-xs">{school.overduePercentage}%</span>
              </div>
              <Progress value={school.overduePercentage} className="h-1 bg-muted [&>div]:bg-red-500" />
            </div>
          </div>
        ))}
        <div className="pt-4 border-t">
          <div className="flex">
            <Button asChild variant="outline" className="w-auto">
              <Link href="/admin/etudiants">
                <Users className="mr-2 h-4 w-4" />
                Gérer les étudiants
              </Link>
            </Button>
          </div>
        </div>
      </div>
    ) : (
      <div className="text-muted-foreground py-8 text-center">Aucune donnée de répartition disponible.</div>
    )}
          </CardContent>
        </Card>
      </div>
  <ReceiptViewerDialog
    open={showPdfDialog}
    onOpenChange={setShowPdfDialog}
    paymentId={selectedPaymentId ?? 0}
    token={token || ""}
  />
    </DashboardLayout>
  )
}
