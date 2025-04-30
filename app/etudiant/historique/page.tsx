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
      {/* Standardized padding wrapper */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <Card> {/* Removed mx-auto to fill padded width */}
          <CardHeader className="space-y-2"> {/* Removed internal padding */}
            <CardTitle>Historique des paiements</CardTitle>
            <CardDescription>Consultez l'historique de vos paiements</CardDescription>
          </CardHeader>
          <CardContent> {/* Removed internal padding */}
            {/* Search and Export Section */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1 min-w-0"> {/* Added min-w-0 to prevent overflow */}
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher un paiement..."
                  className="pl-9 h-10 w-full"
                />
              </div>
              <Button variant="outline" className="h-10 w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>

            {/* Desktop Table View */}
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

            {/* Mobile Cards View */}
            <div className="grid gap-4 md:hidden">
              {payments.map((payment) => (
                <Card key={payment.id} className="overflow-hidden w-full">
                  <CardHeader className="p-4 pb-3"> {/* Simplified padding */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <CardTitle className="text-lg font-semibold">
                          {payment.amount} FCFA
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {payment.date}
                        </CardDescription>
                        <p className="text-sm text-muted-foreground">
                          Reçu: {payment.receipt}
                        </p>
                      </div>
                      {payment.status === "approved" ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 w-fit">
                          <CheckCircle className="mr-1 h-3.5 w-3.5" />
                          Approuvé
                        </Badge>
                      ) : payment.status === "rejected" ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 cursor-pointer w-fit">
                              <XCircle className="mr-1 h-3.5 w-3.5" />
                              Rejeté
                            </Badge>
                          </DialogTrigger>
                          <DialogContent className="max-w-[90vw] sm:max-w-lg mx-3">
                            <DialogHeader className="space-y-3">
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
                        <Badge className="bg-yellow-100 text-yellow-800 w-fit">
                          En attente
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardFooter className="px-4 py-3 flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap border-t bg-muted/5"> {/* Stack buttons on xs */}
                    <Button variant="ghost" size="sm" className="h-9 flex-1 sm:flex-none">
                      <Eye className="h-4 w-4 mr-2" />
                      Détails
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 flex-1 sm:flex-none">
                      <Download className="h-4 w-4 mr-2" />
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