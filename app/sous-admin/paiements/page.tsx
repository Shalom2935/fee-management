"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function SubAdminPayments() {
  const pendingPayments = [
    {
      id: "PAY-001",
      student: "Jean Dupont",
      matricule: "SJP-2023-12345",
      date: "20/04/2024",
      amount: "200 000",
      method: "Virement bancaire",
      receipt: "REF-45678",
      status: "pending",
    },
    {
      id: "PAY-005",
      student: "Lucas Bernard",
      matricule: "SJMB-2023-12349",
      date: "16/04/2024",
      amount: "200 000",
      method: "Mobile Money",
      receipt: "REF-45679",
      status: "pending",
    },
    {
      id: "PAY-008",
      student: "Camille Leroy",
      matricule: "SJP-2023-12352",
      date: "14/04/2024",
      amount: "300 000",
      method: "Chèque",
      receipt: "REF-45680",
      status: "pending",
    },
  ]

  return (
    <DashboardLayout userType="sous-admin">
      <div className="grid gap-4 mb-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements en attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Paiements nécessitant une vérification</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements approuvés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Paiements approuvés ce mois-ci</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements rejetés</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Paiements rejetés ce mois-ci</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paiements en attente d'approbation</CardTitle>
          <CardDescription>Vérifiez et approuvez les paiements soumis par les étudiants</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="approved">Approuvés</TabsTrigger>
              <TabsTrigger value="rejected">Rejetés</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Rechercher par nom ou matricule..." className="pl-8" />
            </div>
            <div className="grid grid-cols-2 gap-4 md:flex md:w-auto">
              <Select>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Département" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="informatique">Informatique</SelectItem>
                  <SelectItem value="gestion">Gestion</SelectItem>
                  <SelectItem value="droit">Droit</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les périodes</SelectItem>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="this-week">Cette semaine</SelectItem>
                  <SelectItem value="this-month">Ce mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Étudiant</TableHead>
                  <TableHead className="hidden md:table-cell">Matricule</TableHead>
                  <TableHead>Montant (FCFA)</TableHead>
                  <TableHead className="hidden md:table-cell">Méthode</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.student}</TableCell>
                    <TableCell className="hidden md:table-cell">{payment.matricule}</TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell className="hidden md:table-cell">{payment.method}</TableCell>
                    <TableCell className="hidden md:table-cell">{payment.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon" title="Voir les détails">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[625px]">
                            <DialogHeader>
                              <DialogTitle>Détails du paiement</DialogTitle>
                              <DialogDescription>
                                Paiement #{payment.id} soumis par {payment.student}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-muted-foreground">Étudiant</Label>
                                  <p className="font-medium">{payment.student}</p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">Matricule</Label>
                                  <p className="font-medium">{payment.matricule}</p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">Montant</Label>
                                  <p className="font-medium">{payment.amount} FCFA</p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">Méthode</Label>
                                  <p className="font-medium">{payment.method}</p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">Date</Label>
                                  <p className="font-medium">{payment.date}</p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">N° Reçu</Label>
                                  <p className="font-medium">{payment.receipt}</p>
                                </div>
                              </div>

                              <div>
                                <Label className="text-muted-foreground">Preuve de paiement</Label>
                                <div className="mt-2 border rounded-md p-2 flex items-center justify-center h-[200px] bg-muted/20">
                                  <p className="text-muted-foreground">Aperçu du reçu</p>
                                </div>
                              </div>

                              <div>
                                <Label htmlFor="notes">Notes (optionnel)</Label>
                                <Textarea id="notes" placeholder="Ajouter des notes concernant ce paiement" />
                              </div>
                            </div>
                            <DialogFooter className="flex flex-col sm:flex-row gap-2">
                              <Button variant="outline" className="sm:w-auto w-full">
                                <Download className="mr-2 h-4 w-4" />
                                Télécharger le reçu
                              </Button>
                              <Button variant="destructive" className="sm:w-auto w-full">
                                <ThumbsDown className="mr-2 h-4 w-4" />
                                Rejeter
                              </Button>
                              <Button className="sm:w-auto w-full bg-green-600 hover:bg-green-700">
                                <ThumbsUp className="mr-2 h-4 w-4" />
                                Approuver
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          title="Rejeter"
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </Button>

                        <Button size="icon" className="bg-green-600 hover:bg-green-700" title="Approuver">
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">Affichage de 3 paiements sur 12</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Précédent
              </Button>
              <Button variant="outline" size="sm">
                Suivant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

