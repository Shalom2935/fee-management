"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { 
  Bell, 
  Lock, 
  Mail, 
  Shield, 
  Calendar
} from "lucide-react"

export default function SousAdminSettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  // Définition de l'école du sous-admin (SJP dans cet exemple)
  const sousAdminSchool = "SJP"

  const handleSaveProfile = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
      })
    }, 1000)
  }

  const handleSavePassword = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été modifié avec succès.",
      })
    }, 1000)
  }

  const handleSaveNotifications = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Préférences de notification mises à jour",
        description: "Vos préférences ont été enregistrées.",
      })
    }, 1000)
  }

  return (
    <DashboardLayout userType="sous-admin">
      <div className="space-y-6 max-w-5xl mx-auto">
        <Separator />
        
        {/* Profil */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du profil</CardTitle>
            <CardDescription>
              Modifiez vos informations personnelles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" defaultValue="Sous-Administrateur SJP" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue="sousadmin@univ-catho-sjd.com" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" defaultValue="+237 XXX XX XX XX" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="title">Titre</Label>
              <Input id="title" defaultValue="Responsable Administratif - École SJP" disabled />
            </div>
            <div className="space-y-1">
              <Label htmlFor="school">École</Label>
              <Input id="school" defaultValue={sousAdminSchool} disabled />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveProfile} disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Sécurité */}
        <Card>
          <CardHeader>
            <CardTitle>Sécurité du compte</CardTitle>
            <CardDescription>
              Modifiez votre mot de passe et les paramètres de sécurité
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="current-password">Mot de passe actuel</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="session-timeout">Déconnexion automatique</Label>
                <p className="text-sm text-muted-foreground">
                  Déconnexion après une période d'inactivité
                </p>
              </div>
              <Select defaultValue="30">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 heure</SelectItem>
                  <SelectItem value="120">2 heures</SelectItem>
                  <SelectItem value="never">Jamais</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSavePassword} disabled={loading}>
              {loading ? "Enregistrement..." : "Mettre à jour le mot de passe"}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Préférences de notification</CardTitle>
            <CardDescription>
              Configurez comment et quand vous souhaitez être notifié
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <Label htmlFor="notify-payments">Nouveaux paiements</Label>
              </div>
              <Switch id="notify-payments" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <Label htmlFor="notify-security">Alertes de sécurité</Label>
              </div>
              <Switch id="notify-security" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <Label htmlFor="notify-deadlines">Échéances de paiement</Label>
              </div>
              <Switch id="notify-deadlines" defaultChecked />
            </div>
            <Separator />
            <div className="space-y-1">
              <Label htmlFor="notification-method">Méthode de notification préférée</Label>
              <Select defaultValue="email">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="both">Email et SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveNotifications} disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer les préférences"}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Informations système - Lecture seule */}
        <Card>
          <CardHeader>
            <CardTitle>Informations système</CardTitle>
            <CardDescription>
              Consultez les paramètres généraux du système
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Année académique en cours</Label>
              <div className="p-2 border rounded-md bg-muted/50">2024-2025</div>
            </div>
            <div className="space-y-1">
              <Label>École gérée</Label>
              <div className="p-2 border rounded-md bg-muted/50">{sousAdminSchool}</div>
            </div>
            <Separator />
            <div className="space-y-4">
              <Label>Échéances de paiement pour l'année académique</Label>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left font-medium">Description</th>
                      <th className="p-2 text-left font-medium">Date limite</th>
                      <th className="p-2 text-left font-medium">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">Premier versement</td>
                      <td className="p-2">15/10/2024</td>
                      <td className="p-2">150 000 FCFA</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">Deuxième versement</td>
                      <td className="p-2">15/01/2025</td>
                      <td className="p-2">100 000 FCFA</td>
                    </tr>
                    <tr>
                      <td className="p-2">Troisième versement</td>
                      <td className="p-2">15/04/2025</td>
                      <td className="p-2">100 000 FCFA</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground italic">
                Seul l'administrateur principal peut modifier les échéances de paiement.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
