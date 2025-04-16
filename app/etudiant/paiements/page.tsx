"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Upload } from "lucide-react"

export default function PaymentSubmission() {
  return (
    <DashboardLayout userType="etudiant">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
        <div className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-600">Information</AlertTitle>
            <AlertDescription>
              Veuillez remplir ce formulaire pour soumettre un nouveau paiement. Assurez-vous de joindre une preuve de
              paiement valide.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Soumettre un paiement</CardTitle>
              <CardDescription>Entrez les détails de votre paiement et téléchargez votre reçu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="amount">Montant (FCFA)</Label>
                  <Input id="amount" type="number" placeholder="Ex: 100000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receipt-number">Numéro de reçu</Label>
                  <Input id="receipt-number" placeholder="Ex: REF-12345" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-method">Méthode de paiement</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une méthode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Virement bancaire</SelectItem>
                    <SelectItem value="mobile">Mobile Money</SelectItem>
                    <SelectItem value="cash">Espèces</SelectItem>
                    <SelectItem value="check">Chèque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="receipt-upload">Preuve de paiement</Label>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1 text-center">Glissez-déposez votre reçu ici ou</p>
                  <Button variant="outline" size="sm">
                    Parcourir les fichiers
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">PNG, JPG ou PDF (max. 5MB)</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea id="notes" placeholder="Informations supplémentaires concernant ce paiement..." />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Soumettre le paiement</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
