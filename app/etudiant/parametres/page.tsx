"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Bell, Lock, ShieldAlert } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SettingsPage() {
  return (
    <DashboardLayout userType="etudiant">
      <div className="max-w-[70%] space-y-6">
        <Card className="border-none shadow-md">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg">Sécurité</CardTitle>
                <CardDescription>Gérez votre mot de passe</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid gap-4 md:w-2/3">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mot de passe actuel</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
              <Alert variant="destructive" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                <ShieldAlert className="h-4 w-4" />
                <AlertDescription>
                  Assurez-vous que votre nouveau mot de passe contient au moins 8 caractères, incluant des lettres majuscules, minuscules et des chiffres.
                </AlertDescription>
              </Alert>
              <Button className="mt-4">Mettre à jour le mot de passe</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg">Préférences de notifications</CardTitle>
                <CardDescription>Gérez vos notifications</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications par email pour les mises à jour importantes
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Rappels de paiement</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des rappels pour les échéances de paiement
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notifications de validation</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications lors de la validation de vos paiements
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button className="mt-4">Enregistrer les préférences</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}