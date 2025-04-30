"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Upload } from "lucide-react"

export default function PaymentSubmission() {
  return (
    <DashboardLayout userType="etudiant">
      <div className="w-full px-3 sm:px-4 md:px-6">
        <div className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <div className="flex-1">
              <AlertTitle className="text-blue-600">Information</AlertTitle>
              <AlertDescription className="mt-1 text-sm">
                Veuillez remplir ce formulaire pour soumettre un nouveau paiement. Assurez-vous de joindre une preuve de
                paiement valide.
              </AlertDescription>
            </div>
          </Alert>

          <Card className="w-full">
            <CardHeader className="space-y-2 px-4 sm:px-6">
              <CardTitle>Soumettre un paiement</CardTitle>
              <CardDescription>Entrez les détails de votre paiement et téléchargez votre reçu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 px-4 sm:px-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2 w-full">
                  <Label htmlFor="amount" className="text-sm font-medium">Montant (FCFA)</Label>
                  <Input id="amount" type="number" placeholder="Ex: 100000" className="h-10" />
                </div>
                <div className="space-y-2 w-full">
                  <Label htmlFor="receipt-number" className="text-sm font-medium">Numéro de reçu</Label>
                  <Input id="receipt-number" placeholder="Ex: REF-12345" className="h-10" />
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="receipt-upload" className="text-sm font-medium">Preuve de paiement</Label>
                <div className="border-2 border-dashed rounded-md p-4 sm:p-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground mb-2">Glissez-déposez votre reçu ici ou</p>
                    <Button variant="outline" size="sm" className="h-9">
                      Parcourir les fichiers
                    </Button>
                    <p className="text-xs text-muted-foreground mt-3">PNG, JPG ou PDF (max. 5MB)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">Notes (optionnel)</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Informations supplémentaires concernant ce paiement..." 
                  className="min-h-[100px] resize-none"
                />
              </div>
            </CardContent>
            <CardFooter className="px-4 sm:px-6 pt-2 pb-6">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 h-11">
                Soumettre le paiement
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
