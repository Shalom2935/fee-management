"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
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
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell>{payment.receipt}</TableCell>
                    <TableCell>
                      {payment.status === "approved" ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Approuvé
                        </Badge>
                      ) : payment.status === "rejected" ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100 cursor-pointer">
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
                      <Button variant="outline" size="icon" title="Voir les détails">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}