"use client"

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

export default function AdminPaymentHistory() {
  // Sample payment history data remains the same
interface Payment {
  id: string;
  student: string;
  matricule: string;
  amount: number;
  date: string;
  status: 'approved' | 'rejected';
  rejectionReason?: string;
  method?: string;
  receipt?: string;
  notes?: string;
}

const paymentHistory: Payment[] = [
  {
    id: "PAY-001",
    student: "Kouadio Jean-Marc",
    matricule: "SJP2023001",
    amount: 150000,
    date: "15/04/2025",
    status: "approved"
  },
  {
    id: "PAY-002",
    student: "Diallo Aminata",
    matricule: "SJMB2023045",
    amount: 75000,
    date: "14/04/2025",
    status: "approved"
  },
  {
    id: "PAY-003",
    student: "Koné Ibrahim",
    matricule: "SJP2023012",
    amount: 200000,
    date: "12/04/2025",
    status: "rejected",
    rejectionReason: "Montant incorrect."
  },
  {
    id: "PAY-004",
    student: "Traoré Mariam",
    matricule: "SJMB2023078",
    amount: 125000,
    date: "10/04/2025",
    status: "approved"
  },
  {
    id: "PAY-005",
    student: "Ouattara Paul",
    matricule: "SJP2023034",
    amount: 300000,
    date: "08/04/2025",
    status: "approved"
  },
  {
    id: "PAY-006",
    student: "Bamba Fatou",
    matricule: "SJMB2023022",
    amount: 100000,
    date: "05/04/2025",
    status: "rejected",
    rejectionReason: "Image floue",
  },
  {
    id: "PAY-007",
    student: "Yao Emmanuel",
    matricule: "SJP2023056",
    amount: 175000,
    date: "01/04/2025",
    status: "approved"
  }
];
  return (
    <DashboardLayout userType="admin">
      {/* Previous cards and header section remain unchanged */}
      
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          {/* Previous Tabs and filters section remain unchanged */}

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Rechercher par nom ou matricule..." className="pl-8" />
            </div>
            <div className="grid grid-cols-2 gap-4 md:flex md:w-auto">
              <Select>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="École" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les écoles</SelectItem>
                  <SelectItem value="sjp">SJP</SelectItem>
                  <SelectItem value="sjmb">SJMB</SelectItem>
                </SelectContent>
              </Select>
              <Select>
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
                {paymentHistory.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.student}</TableCell>
                    <TableCell className="hidden md:table-cell">{payment.matricule.substring(0, 3)}</TableCell>
                    <TableCell className="hidden md:table-cell">{payment.matricule}</TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell className="hidden md:table-cell">{payment.date}</TableCell>
                    <TableCell>
                      {payment.status === "approved" ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Approuvé
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Rejeté
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
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
                              <Label className="text-right font-medium">École</Label>
                              <div className="col-span-3">{payment.matricule.substring(0, 3)}</div>
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
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right font-medium">Statut</Label>
                              <div className="col-span-3">
                                {payment.status === "approved" ? (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Approuvé
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                    Rejeté
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {payment.status === "rejected" && payment.notes && (
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Motif du rejet</Label>
                                <div className="col-span-3">{payment.notes}</div>
                              </div>
                            )}
                          </div>
                          <DialogFooter>
                            <Button variant="outline">
                              <Download className="mr-2 h-4 w-4" />
                              Télécharger le reçu
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Version mobile: cards */}
          <div className="grid gap-4 md:hidden">
            {paymentHistory.map((payment) => (
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
                    <span>École: {payment.matricule.substring(0, 3)}</span>
                    <span>Date: {payment.date}</span>
                  </div>
                  <div className="mt-2">
                    {payment.status === "approved" ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Approuvé
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Rejeté
                      </Badge>
                    )}
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
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right font-medium">Statut</Label>
                          <div className="col-span-3">
                            {payment.status === "approved" ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Approuvé
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                Rejeté
                              </Badge>
                            )}
                          </div>
                        </div>
                        {payment.status === "rejected" && payment.notes && (
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right font-medium">Motif du rejet</Label>
                            <div className="col-span-3">{payment.notes}</div>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger le reçu
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="sm" className="h-8">
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Reçu
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Affichage de 7 paiements sur 42
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