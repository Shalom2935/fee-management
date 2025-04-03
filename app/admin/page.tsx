"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, AlertTriangle, CheckCircle, BarChart3, ArrowUpRight, ArrowDownRight, Eye } from "lucide-react"
import Link from "next/link"
// Importation de recharts pour le graphique
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts'

export default function AdminDashboard() {
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
    {
      id: "PAY-004",
      student: "Sophie Dubois",
      matricule: "SJP-2023-12348",
      date: "17/04/2024",
      amount: "250 000",
      status: "approved",
    },
    {
      id: "PAY-005",
      student: "Lucas Bernard",
      matricule: "SJMB-2023-12349",
      date: "16/04/2024",
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
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link href="/admin/rapports">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Voir les rapports
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Aperçu financier</CardTitle>
            <CardDescription>Résumé des transactions financières</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="sjp">SJP</TabsTrigger>
                <TabsTrigger value="sjmb">SJMB</TabsTrigger>
                <TabsTrigger value="monthly">Mensuel</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">Total collecté</h3>
                    <p className="text-2xl font-bold text-blue-900">752,450,000 FCFA</p>
                    <p className="text-xs text-blue-700 mt-1">Année académique 2023-2024</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-green-800 mb-2">Paiements approuvés</h3>
                    <p className="text-2xl font-bold text-green-900">685,200,000 FCFA</p>
                    <p className="text-xs text-green-700 mt-1">91% du total</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-yellow-800 mb-2">Paiements en attente</h3>
                    <p className="text-2xl font-bold text-yellow-900">67,250,000 FCFA</p>
                    <p className="text-xs text-yellow-700 mt-1">9% du total</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-4">Tendance des paiements</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={paymentTrendData}
                        margin={{ top: 10, right: 10, left: 20, bottom: 20 }}
                      >
                        <defs>
                          <linearGradient id="colorMontant" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="mois" 
                          tick={{ fill: '#64748b', fontSize: 12 }}
                          axisLine={{ stroke: '#e2e8f0' }}
                        />
                        <YAxis 
                          tickFormatter={(value) => `${value/1000000}M`} 
                          domain={[0, 'dataMax + 500000']}
                          tick={{ fill: '#64748b', fontSize: 12 }}
                          axisLine={{ stroke: '#e2e8f0' }}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value.toLocaleString()} FCFA`, 'Montant']}
                          labelFormatter={(label) => `Mois: ${label}`}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            borderRadius: '6px', 
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
                            border: 'none' 
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="montant" 
                          name="Montant des paiements" 
                          stroke="#2563eb" 
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorMontant)"
                          activeDot={{ r: 8, stroke: '#2563eb', strokeWidth: 2, fill: 'white' }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="sjp">
                <div className="h-[300px] bg-muted/20 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Données financières SJP</p>
                </div>
              </TabsContent>
              <TabsContent value="sjmb">
                <div className="h-[300px] bg-muted/20 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Données financières SJMB</p>
                </div>
              </TabsContent>
              <TabsContent value="monthly">
                <div className="h-[300px] bg-muted/20 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Données financières mensuelles</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

// Données pour le graphique de tendance des paiements
const paymentTrendData = [
  { mois: 'Jan', montant: 1200000 },
  { mois: 'Fév', montant: 1900000 },
  { mois: 'Mar', montant: 2800000 },
  { mois: 'Avr', montant: 3100000 },
  { mois: 'Mai', montant: 2500000 },
  { mois: 'Juin', montant: 3800000 },
];

