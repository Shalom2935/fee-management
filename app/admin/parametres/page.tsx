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
  User, 
  Mail, 
  Shield, 
  Calendar,
  Plus,
  Edit,
  Trash
} from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

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

  const handleSaveSystem = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Paramètres système mis à jour",
        description: "Les paramètres système ont été enregistrés.",
      })
    }, 1000)
  }

  const handleAddDeadline = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Échéance ajoutée",
        description: "La nouvelle échéance de paiement a été ajoutée avec succès.",
      })
    }, 1000)
  }

  return (
    <DashboardLayout>
      {/* Added padding wrapper */}
      <div className="px-4 sm:px-6 lg:px-8 space-y-6 max-w-4xl mx-auto"> {/* Widened max-width slightly */}
        {/* Removed top Separator, spacing handled by space-y-6 */}

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
              <Input id="name" defaultValue="Administrateur Principal" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue="admin@univ-catho-sjd.com" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" defaultValue="+237 XXX XX XX XX" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="title">Titre</Label>
              <Input id="title" defaultValue="Directeur Administratif et Financier" />
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
            <div className="flex items-center justify-between"> {/* Keep side-by-side */}
              <div className="space-y-0.5">
                <Label htmlFor="session-timeout">Déconnexion automatique</Label>
                <p className="text-sm text-muted-foreground">
                  Déconnexion après une période d'inactivité
                </p>
              </div>
              <Select defaultValue="30">
                <SelectTrigger className="w-[180px] flex-shrink-0"> {/* Fixed width, prevent shrinking */}
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
            <div className="flex items-center justify-between"> {/* Keep side-by-side */}
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <Label htmlFor="notify-payments">Nouveaux paiements</Label>
              </div>
              <Switch id="notify-payments" defaultChecked />
            </div>
            <div className="flex items-center justify-between"> {/* Keep side-by-side */}
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <Label htmlFor="notify-security">Alertes de sécurité</Label>
              </div>
              <Switch id="notify-security" defaultChecked />
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
        
        {/* Système */}
        <Card>
          <CardHeader>
            <CardTitle>Paramètres du système</CardTitle>
            <CardDescription>
              Configurez les paramètres généraux du système de gestion des frais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="academic-year">Année académique en cours</Label>
              <Select defaultValue="2024-2025">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2025-2026">2025-2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between"> {/* Keep side-by-side */}
              <div className="space-y-0.5">
                <Label htmlFor="auto-reminders">Rappels automatiques</Label>
                <p className="text-sm text-muted-foreground">
                  Envoyer des rappels automatiques aux étudiants en retard de paiement
                </p>
              </div>
              <Switch id="auto-reminders" defaultChecked />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSystem} disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer les paramètres"}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Échéances de paiement */}
        <Card>
          <CardHeader>
            <CardTitle>Échéances de paiement</CardTitle>
            <CardDescription>
              Gérez les échéances de paiement pour l'année académique en cours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 ">
            <div className="rounded-md border"> {/* Removed min-w-0 */}
              <table className=""> {/* Removed table-fixed */}
                <thead className="[&_tr]:border-b">
                  <tr className="border-b">
                    <th className="p-2 text-left font-medium">Description</th>
                    <th className="p-2 text-left font-medium">Date limite</th>
                    <th className="p-2 text-left font-medium">Montant</th>
                    <th className="p-2 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  <tr className="border-b">
                    <td className="p-2 whitespace-nowrap">Premier versement</td> {/* Prevent wrap */}
                    <td className="p-2">15/10/2024</td>
                    <td className="p-2 whitespace-nowrap">150 000 FCFA</td> {/* Prevent wrap */}
                    <td className="p-2 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Modifier">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500" title="Supprimer">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 whitespace-nowrap">Deuxième versement</td> {/* Prevent wrap */}
                    <td className="p-2">15/01/2025</td>
                    <td className="p-2 whitespace-nowrap">100 000 FCFA</td> {/* Prevent wrap */}
                    <td className="p-2 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Modifier">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500" title="Supprimer">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 whitespace-nowrap">Troisième versement</td> {/* Prevent wrap */}
                    <td className="p-2">15/04/2025</td>
                    <td className="p-2 whitespace-nowrap">100 000 FCFA</td> {/* Prevent wrap */}
                    <td className="p-2 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Modifier">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500" title="Supprimer">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="border rounded-md p-4 mt-4">
              <h4 className="font-medium mb-2">Ajouter une nouvelle échéance</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="deadline-desc">Description</Label>
                  <Input id="deadline-desc" placeholder="Ex: Versement final" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="deadline-date">Date limite</Label>
                  <Input id="deadline-date" type="date" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="deadline-amount">Montant (FCFA)</Label>
                  <Input id="deadline-amount" type="number" placeholder="Ex: 100000" />
                </div>
              </div>
              <Button onClick={handleAddDeadline} className="mt-4" disabled={loading}>
                <Plus className="h-4 w-4 mr-2" />
                {loading ? "Ajout en cours..." : "Ajouter l'échéance"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
