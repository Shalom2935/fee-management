"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Eye, Search, XCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

export default function PaymentHistory() {
  // Sample payment history data
  const payments = [
    {
      id: "PAY-001",
      date: "20/04/2024",
      amount: "200 000",
      status: "approved",
      receipt: "REF-45678",
    },
    {
      id: "PAY-002",
      date: "15/03/2024",
      amount: "300 000",
      status: "approved",
      receipt: "REF-45679",
    },
    {
      id: "PAY-003",
      date: "10/02/2024",
      amount: "150 000",
      status: "rejected",
      receipt: "REF-45680",
      rejectionReason: "Preuve de paiement illisible", // Added rejection reason
    },
    {
      id: "PAY-004",
      date: "05/01/2024",
      amount: "150 000",
      status: "approved",
      receipt: "REF-45681",
    },
    {
      id: "PAY-005",
      date: "10/12/2023",
      amount: "200 000",
      status: "rejected",
      receipt: "REF-45682",
      rejectionReason: "Montant incorrect", // Added rejection reason
    },
  ]

  return (
    <DashboardLayout userType="etudiant">
      <div className="max-w-5xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle>Historique des paiements</CardTitle>
            <CardDescription>Consultez l'historique de vos paiements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher un paiement..."
                  className="pl-8"
                />
              </div>
              <Button variant="outline" className="md:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>

            {/* Version desktop: tableau */}
            <div className="rounded-md border hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant (FCFA)</TableHead>
                    <TableHead>Numéro de reçu</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>{payment.receipt}</TableCell>
                      <TableCell>
                        {payment.status === "approved" ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Approuvé
                          </Badge>
                        ) : payment.status === "rejected" ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 cursor-pointer">
                                <XCircle className="mr-1 h-3 w-3" />
                                Rejeté
                              </Badge>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Paiement rejeté</DialogTitle>
                                <DialogDescription>
                                  Votre paiement a été rejeté pour la raison suivante:
                                </DialogDescription>
                              </DialogHeader>
                              <div className="p-4 bg-red-50 rounded-md border border-red-200 text-red-800">
                                {payment.rejectionReason}
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                            En attente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" title="Voir les détails">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Version mobile: cards */}
            <div className="grid gap-4 md:hidden px-0 w-full">
              {payments.map((payment) => (
                <Card key={payment.id} className="overflow-hidden w-full mx-0">
                  <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{payment.date}</CardTitle>
                      <CardDescription>{payment.receipt}</CardDescription>
                    </div>
                    <div className="font-bold text-right">{payment.amount} FCFA</div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 pb-0">
                    <div className="mt-2">
                      {payment.status === "approved" ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Approuvé
                        </Badge>
                      ) : payment.status === "rejected" ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 cursor-pointer">
                              <XCircle className="mr-1 h-3 w-3" />
                              Rejeté
                            </Badge>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Paiement rejeté</DialogTitle>
                              <DialogDescription>
                                Votre paiement a été rejeté pour la raison suivante:
                              </DialogDescription>
                            </DialogHeader>
                            <div className="p-4 bg-red-50 rounded-md border border-red-200 text-red-800">
                              {payment.rejectionReason}
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                          En attente
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-2 flex justify-end border-t mt-2">
                    <Button variant="ghost" size="sm" className="h-8">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Détails
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8">
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Reçu
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}