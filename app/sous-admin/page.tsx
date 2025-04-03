"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, CreditCard, Clock, CheckCircle, ArrowUpRight, Eye } from "lucide-react"
import Link from "next/link"

export default function SubAdminDashboard() {
  const recentPayments = [
    {
      id: "PAY-001",
      student: "Jean Dupont",
      matricule: "SJP-2023-12345",
      date: "20/04/2024",
      amount: "200 000",
      status: "pending",
    },
    {
      id: "PAY-002",
      student: "Marie Curie",
      matricule: "SJP-2023-12346",
      date: "19/04/2024",
      amount: "300 000",
      status: "approved",
    },
    {
      id: "PAY-003",
      student: "Pierre Martin",
      matricule: "SJMB-2023-12347",
      date: "18/04/2024",
      amount: "150 000",
      status: "rejected",
    },
  ]

  return (
    <DashboardLayout userType="sous-admin">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Étudiants assignés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">+2.1%</span>
              <span className="ml-1">depuis le mois dernier</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements en attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>Nécessitant une vérification</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conformité des paiements</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72%</div>
            <Progress value={72} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Pourcentage d'étudiants à jour</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>Les derniers paiements soumis</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/sous-admin/paiements">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Étudiant</TableHead>
                  <TableHead className="hidden md:table-cell">Matricule</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.student}</TableCell>
                    <TableCell className="hidden md:table-cell">{payment.matricule}</TableCell>
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par département</CardTitle>
            <CardDescription>Distribution des étudiants assignés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Informatique</h4>
                  <span className="text-sm text-muted-foreground">68 étudiants</span>
                </div>
                <Progress value={27} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Gestion</h4>
                  <span className="text-sm text-muted-foreground">52 étudiants</span>
                </div>
                <Progress value={21} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Droit</h4>
                  <span className="text-sm text-muted-foreground">45 étudiants</span>
                </div>
                <Progress value={18} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Communication</h4>
                  <span className="text-sm text-muted-foreground">43 étudiants</span>
                </div>
                <Progress value={17} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Finance</h4>
                  <span className="text-sm text-muted-foreground">40 étudiants</span>
                </div>
                <Progress value={16} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statut des paiements</CardTitle>
            <CardDescription>Vue d'ensemble des paiements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-green-500"></div>
                  <span className="text-sm">À jour</span>
                </div>
                <span className="text-sm font-medium">178 étudiants (72%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
                  <span className="text-sm">Paiement partiel</span>
                </div>
                <span className="text-sm font-medium">45 étudiants (18%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-red-500"></div>
                  <span className="text-sm">En retard</span>
                </div>
                <span className="text-sm font-medium">25 étudiants (10%)</span>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Total collecté</h4>
                  <span className="text-sm font-medium">124,500,000 FCFA</span>
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Reste à collecter</h4>
                  <span className="text-sm font-medium">48,300,000 FCFA</span>
                </div>
              </div>

              <div className="pt-4">
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/sous-admin/paiements">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Gérer les paiements
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

