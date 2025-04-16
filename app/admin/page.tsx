"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, AlertTriangle, CheckCircle, ArrowUpRight, ArrowDownRight, Eye } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const recentPayments = [
    {
      id: "PAY-001",
      student: "Jean Dupont",
      school: "SJP",
      matricule: "SJP-2023-12345", 
      amount: "200 000",
      status: "pending",
    },
    {
      id: "PAY-002",
      student: "Marie Curie",
      school: "SJP",
      matricule: "SJP-2023-12346",
      amount: "300 000", 
      status: "approved",
    },
    {
      id: "PAY-003",
      student: "Pierre Martin",
      school: "SJMB",
      matricule: "SJMB-2023-12347",
      amount: "150 000",
      status: "rejected",
    },
    {
      id: "PAY-004", 
      student: "Sophie Dubois",
      school: "SJP",
      matricule: "SJP-2023-12348",
      amount: "250 000",
      status: "approved",
    },
    {
      id: "PAY-005",
      student: "Lucas Bernard", 
      school: "SJMB",
      matricule: "SJMB-2023-12349",
      amount: "200 000",
      status: "pending",
    },
  ]

  return (
    <DashboardLayout userType="admin">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des étudiants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">+5.2%</span>
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
            <div className="text-2xl font-bold">68%</div>
            <Progress value={68} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Pourcentage d'étudiants à jour</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements en attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-3 w-3 text-red-500" />
              <span className="text-red-500 font-medium">+12.5%</span>
              <span className="ml-1">depuis la semaine dernière</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comptes en retard</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">398</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDownRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">-2.5%</span>
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
                  <TableRow key={payment.id}>
                    <TableCell>{payment.student}</TableCell>
                    <TableCell>{payment.school}</TableCell>
                    <TableCell>{payment.matricule}</TableCell>
                    <TableCell>{payment.amount} FCFA</TableCell>
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
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Répartition par école</CardTitle>
            <CardDescription>Distribution des étudiants et paiements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">SJP</h4>
                  <span className="text-sm text-muted-foreground">742 étudiants</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Paiements à jour</span>
                    <span className="text-xs">72%</span>
                  </div>
                  <Progress value={72} className="h-1" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Paiements en retard</span>
                    <span className="text-xs">28%</span>
                  </div>
                  <Progress value={28} className="h-1 bg-muted [&>div]:bg-red-500" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">SJMB</h4>
                  <span className="text-sm text-muted-foreground">506 étudiants</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Paiements à jour</span>
                    <span className="text-xs">63%</span>
                  </div>
                  <Progress value={63} className="h-1" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Paiements en retard</span>
                    <span className="text-xs">37%</span>
                  </div>
                  <Progress value={37} className="h-1 bg-muted [&>div]:bg-red-500" />
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/admin/etudiants">
                      <Users className="mr-2 h-4 w-4" />
                      Gérer les étudiants
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
