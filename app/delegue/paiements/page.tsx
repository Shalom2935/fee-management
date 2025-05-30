"use client"

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
import { PERIODS_LIST } from "@/config/constants"

export default function SubAdminPayments() {
  // Définition de l'école du sous-admin (SJP dans cet exemple)
  const sousAdminSchool = "SJP"
  
  // Filtrer les paiements pour ne montrer que ceux de l'école du sous-admin
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
      id: "PAY-008",
      student: "Camille Leroy",
      matricule: "SJP-2023-12352",
      date: "14/04/2024",
      amount: "300 000",
      method: "Chèque",
      receipt: "REF-45680",
      status: "pending",
    },
    {
      id: "PAY-012",
      student: "Emma Moreau",
      matricule: "SJP-2023-12356",
      date: "10/04/2024",
      amount: "250 000",
      method: "Mobile Money",
      receipt: "REF-45682",
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
          <CardDescription>Vérifiez et approuvez les paiements soumis par les étudiants de {sousAdminSchool}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Rechercher par nom ou matricule..." className="pl-8" />
            </div>
            <div className="grid grid-cols-2 gap-4 md:flex md:w-auto">
              <Select>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  {PERIODS_LIST.map((period) => (
                    <SelectItem key={period.value} value={period.value}>{period.label}</SelectItem>
                  ))}
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.student}</TableCell>
                    <TableCell className="hidden md:table-cell">{sousAdminSchool}</TableCell>
                    <TableCell className="hidden md:table-cell">{payment.matricule}</TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell className="hidden md:table-cell">{payment.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" title="Voir les détails">
                              <Eye className="h-4 w-4" />
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
                                <Label className="text-right font-medium">Matricule</Label>
                                <div className="col-span-3">{payment.matricule}</div>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Montant</Label>
                                <div className="col-span-3">{payment.amount} FCFA</div>
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
                        <Button variant="ghost" size="icon" className="text-green-600" title="Approuver">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600" title="Rejeter">
                          <XCircle className="h-4 w-4" />
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
            {pendingPayments.map((payment) => (
              <Card key={payment.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{payment.student}</CardTitle>
                    <CardDescription>{payment.matricule}</CardDescription>
                  </div>
                  <div className="font-bold text-right">{payment.amount} FCFA</div>
                </CardHeader>
                <CardContent className="p-4 pt-2 pb-0">
                  <div className="text-sm text-muted-foreground flex justify-between">
                    <span>École: {sousAdminSchool}</span>
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
                          <Label className="text-right font-medium">Matricule</Label>
                          <div className="col-span-3">{payment.matricule}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right font-medium">Montant</Label>
                          <div className="col-span-3">{payment.amount} FCFA</div>
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
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
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
              Affichage de {pendingPayments.length} paiements sur 12
            </div>
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
