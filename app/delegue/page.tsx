"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card" // Added CardFooter
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils" // Import cn utility
import { Users, Clock, AlertTriangle, CheckCircle, ArrowUpRight, ArrowDownRight, Eye } from "lucide-react"
import Link from "next/link"

export default function SubAdminDashboard() {
  // Définition de l'école du sous-admin (SJP dans cet exemple)
  const sousAdminSchool = "SJP"
  
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
      id: "PAY-008",
      student: "Camille Leroy",
      school: "SJP",
      matricule: "SJP-2023-12352",
      amount: "300 000",
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
      id: "PAY-007",
      student: "Yao Emmanuel",
      school: "SJP",
      matricule: "SJP-2023-12356",
      amount: "175 000",
      status: "pending",
    },
  ]

  return (
    <DashboardLayout userType="sous-admin">
      {/* Add padding wrapper */}
      <div className="px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total des étudiants</CardTitle>
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
              <CardTitle className="text-sm font-medium">Conformité des paiements</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">72%</div>
              <Progress value={72} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-2">Pourcentage d'étudiants à jour</p>
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
                <ArrowUpRight className="mr-1 h-3 w-3 text-red-500" />
                <span className="text-red-500 font-medium">+8.1%</span>
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
              <div className="text-2xl font-bold">70</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowDownRight className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500 font-medium">-1.5%</span>
                <span className="ml-1">depuis le mois dernier</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid (Recent Activity & Breakdown) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> {/* 1 col default, 3 cols on lg */}
          {/* Recent Activity Card */}
          <Card className="lg:col-span-2"> {/* Takes 2/3 width on lg screens */}
            <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>Les 5 derniers paiements soumis</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/sous-admin/paiements">Voir tout</Link>
            </Button>
          </CardHeader>
            <CardContent>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto rounded-md border">
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
                      <TableRow key={payment.id} className="[&_td]:whitespace-nowrap">
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
              </div>

              {/* Mobile/Tablet Cards */}
              <div className="grid gap-4 md:hidden">
                {recentPayments.map((payment) => (
                  <Card key={payment.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
                      <div>
                        <CardTitle className="text-base leading-tight">{payment.student}</CardTitle>
                        <CardDescription>{payment.matricule}</CardDescription>
                      </div>
                      <Badge variant={payment.status === 'approved' ? 'default' : payment.status === 'pending' ? 'secondary' : 'destructive'} className={cn(payment.status === 'approved' && 'bg-green-100 text-green-800', payment.status === 'pending' && 'bg-yellow-100 text-yellow-800', payment.status === 'rejected' && 'bg-red-100 text-red-800')}>{payment.status === 'approved' ? 'Approuvé' : payment.status === 'pending' ? 'En attente' : 'Rejeté'}</Badge>
                    </CardHeader>
                    <CardContent className="px-4 pt-0 pb-2 text-sm text-muted-foreground">
                      <p>Montant: {payment.amount} FCFA</p>
                    </CardContent>
                    <CardFooter className="p-2 flex justify-end border-t">
                      <Button variant="ghost" size="sm" className="h-8"><Eye className="h-4 w-4 mr-1" /> Détails</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
          </CardContent>
        </Card>

          {/* Department Breakdown Card */}
          <Card className="lg:col-span-1"> {/* Takes 1/3 width on lg screens */}
          <CardHeader>
            <CardTitle>Répartition par département</CardTitle>
            <CardDescription>Distribution des étudiants de {sousAdminSchool}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Génie Civil</h4>
                  <span className="text-sm text-muted-foreground">68 étudiants</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Paiements à jour</span>
                    <span className="text-xs">76%</span>
                  </div>
                  <Progress value={76} className="h-1" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Paiements en retard</span>
                    <span className="text-xs">24%</span>
                  </div>
                  <Progress value={24} className="h-1 bg-muted [&>div]:bg-red-500" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Génie Infotronique</h4>
                  <span className="text-sm text-muted-foreground">52 étudiants</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Paiements à jour</span>
                    <span className="text-xs">68%</span>
                  </div>
                  <Progress value={68} className="h-1" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Paiements en retard</span>
                    <span className="text-xs">32%</span>
                  </div>
                  <Progress value={32} className="h-1 bg-muted [&>div]:bg-red-500" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Génie Mécatronique</h4>
                  <span className="text-sm text-muted-foreground">45 étudiants</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Paiements à jour</span>
                    <span className="text-xs">71%</span>
                  </div>
                  <Progress value={71} className="h-1" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Paiements en retard</span>
                    <span className="text-xs">29%</span>
                  </div>
                  <Progress value={29} className="h-1 bg-muted [&>div]:bg-red-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div> {/* Close padding wrapper */}
    </DashboardLayout>
  )
}
