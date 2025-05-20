"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Bell, Lock, ShieldAlert } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState, useRef } from "react"; 
import { useAuth } from "@/components/auth-context";
import { useToast } from "@/components/ui/use-toast";

export default function SettingsPage() {
  const { user, token } = useAuth();
  const { toast } = useToast();

  // Refs pour le focus
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null); // Pour focus en cas d'erreur spécifique

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [preferences, setPreferences] = useState({
    emailNotifications: false,
    paymentReminders: false,
    validationNotifications: false,
  });
  const [prefLoading, setPrefLoading] = useState(false);
  const [prefError, setPrefError] = useState<string | null>(null);
  const [prefSuccess, setPrefSuccess] = useState(false); // Gardé pour un feedback direct si besoin

  // Fonction pour fetch les préférences (réutilisable)
  const fetchPreferences = async (abortSignal?: AbortSignal) => {
    if (!user?.id || !token) return;

    setPrefLoading(true);
    setPrefError(null); // Reset error avant chaque fetch

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/students/me/preferences`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: abortSignal, // Permet d'annuler le fetch
      });

      if (abortSignal?.aborted) return;

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Erreur de communication." }));
        throw new Error(errorData.message || "Erreur lors du chargement des préférences");
      }

      const data = await res.json();
      if (abortSignal?.aborted) return;

      console.log("Preferences data fetched:", data);
      setPreferences({
        emailNotifications: !!data.mail_notification_pref,
        paymentReminders: !!data.payment_reminder_pref,
        validationNotifications: !!data.payment_validation_pref,
      });
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Preferences fetch aborted.');
        return;
      }
      setPrefError(err.message);
      toast({
        title: "Erreur de chargement",
        description: `Préférences: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      if (!abortSignal?.aborted) {
        setPrefLoading(false);
      }
    }
  };

  // Fetch initial des préférences
  useEffect(() => {
    const controller = new AbortController();
    fetchPreferences(controller.signal);
    return () => controller.abort(); // Cleanup
  }, [user?.id, token]); // Ne pas inclure `toast` ici si elle est stable

  // Password update handler
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!user?.id) {
      setPasswordError("Utilisateur non connecté.");
      currentPasswordRef.current?.focus();
      return;
    }
    if (!currentPassword) {
      setPasswordError("Veuillez entrer votre mot de passe actuel.");
      currentPasswordRef.current?.focus();
      return;
    }
    if (!newPassword) {
      setPasswordError("Veuillez entrer un nouveau mot de passe.");
      newPasswordRef.current?.focus();
      return;
    }
    if (newPassword === currentPassword) {
      setPasswordError("Le nouveau mot de passe doit être différent du mot de passe actuel.");
      newPasswordRef.current?.focus();
      setNewPassword("");
      setConfirmPassword("");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Erreur lors de la confirmation du nouveau mot de passe.");
      // On pourrait vider confirmPassword ou les deux
      setConfirmPassword("");
      newPasswordRef.current?.focus(); // Ou confirmPasswordRef si vous en aviez un
      return;
    }
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setPasswordError("Le nouveau mot de passe doit contenir au moins 8 caractères, incluant des lettres majuscules, minuscules et des chiffres.");
      newPasswordRef.current?.focus();
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/students/me/password/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json(); // Toujours essayer de parser la réponse

      if (!res.ok) {
        // L'erreur vient du serveur (ex: mot de passe actuel incorrect)
        throw new Error(data.message || "Erreur serveur lors de la mise à jour du mot de passe");
      }

      setPasswordSuccess(true);
      toast({ title: "Mot de passe mis à jour", description: "Votre mot de passe a été changé avec succès." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      currentPasswordRef.current?.focus(); // Focus sur le champ "mot de passe actuel" pour une éventuelle nouvelle modif
    } catch (err: any) {
      setPasswordError(err.message); // Affiche l'erreur spécifique (client ou serveur)
      toast({
        title: "Erreur de mise à jour",
        description: `Mot de passe: ${err.message}`,
        variant: "destructive",
      });
      // Si l'erreur est "Mot de passe actuel incorrect" (ou un code spécifique), on pourrait vouloir focus ce champ
      // if (err.message.includes("actuel incorrect")) { // Adapter selon le message exact du backend
      //   currentPasswordRef.current?.focus();
      //   setCurrentPassword(""); // Vider pour nouvelle saisie
      // } else {
      //   newPasswordRef.current?.focus();
      // }
      // Pour l'instant, laissons le focus général sur currentPassword après échec
      currentPasswordRef.current?.focus();
    } finally {
      setPasswordLoading(false);
    }
  };

  // Preferences update handler
  const handlePrefUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrefError(null);
    setPrefSuccess(false); // Reset avant la tentative

    if (!user?.id) {
      setPrefError("Utilisateur non connecté.");
      return;
    }

    setPrefLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/students/me/preferences/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mail_notification_pref: preferences.emailNotifications,
          payment_reminder_pref: preferences.paymentReminders,
          payment_validation_pref: preferences.validationNotifications,
        }),
      });
      console.log(res.body)
      const data = await res.json(); // Toujours parser

      if (!res.ok) {
        throw new Error(data.message || "Erreur serveur lors de la mise à jour des préférences");
      }

      setPrefSuccess(true); // Utile pour un feedback direct si on le souhaite
      toast({ title: "Préférences enregistrées", description: "Vos préférences de notification ont été mises à jour." });

      // **IMPORTANT : Refetch des préférences pour mettre à jour l'état local avec les données du serveur**
      await fetchPreferences(); // Appelle la fonction de fetch sans AbortController car c'est une action voulue

    } catch (err: any) {
      setPrefError(err.message);
      toast({
        title: "Erreur de mise à jour",
        description: `Préférences: ${err.message}`,
        variant: "destructive",
      });
      // Optionnel: si on voulait refetch même en cas d'erreur pour resynchroniser avec le serveur
      // await fetchPreferences();
    } finally {
      setPrefLoading(false); // S'assurer que loading est false même après le refetch
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full md:px-6  space-y-6 mx-auto max-w-5xl">
        <Card className="border-none shadow-md">
          <CardHeader className="border-b pb-4 p-3 md:p-6">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg">Sécurité</CardTitle>
                <CardDescription>Gérez votre mot de passe</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 p-3 md:p-6">
            <form className="space-y-4" onSubmit={handlePasswordUpdate}>
              <div className="grid gap-4 md:w-2/3">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mot de passe actuel</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={e => { setCurrentPassword(e.target.value); setPasswordError(null); setPasswordSuccess(false);}}
                    disabled={passwordLoading}
                    ref={currentPasswordRef} // Ref pour le focus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); setPasswordError(null); setPasswordSuccess(false);}}
                    disabled={passwordLoading}
                    ref={newPasswordRef} // Ref pour le focus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setPasswordError(null); setPasswordSuccess(false);}}
                    disabled={passwordLoading}
                  />
                </div>
              </div>
              <Alert variant="destructive" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                <ShieldAlert className="h-4 w-4" />
                <AlertDescription>
                  Assurez-vous que votre nouveau mot de passe contient au moins 8 caractères, incluant des lettres majuscules, minuscules et des chiffres.
                </AlertDescription>
              </Alert>
              {passwordError && <div className="text-red-600 text-sm pt-2">{passwordError}</div>}
              {passwordSuccess && <div className="text-green-600 text-sm pt-2">Mot de passe mis à jour avec succès.</div>}
              <Button className="mt-4" type="submit" disabled={passwordLoading}>{passwordLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="border-b pb-4 p-3 md:p-6">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg">Préférences de notifications</CardTitle>
                <CardDescription>Gérez vos notifications</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-6 md:p-6">
            {/* Afficher l'état de chargement pour les préférences ici aussi si besoin pendant le fetch initial */}
            {prefLoading && !preferences.emailNotifications && !preferences.paymentReminders && !preferences.validationNotifications && (
                <div className="text-sm text-muted-foreground py-4">Chargement des préférences...</div>
            )}
            <form className="space-y-6" onSubmit={handlePrefUpdate}>
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications par email pour les mises à jour importantes
                  </p>
                </div>
                <Switch
                  checked={preferences.emailNotifications}
                  onCheckedChange={v => setPreferences(p => ({ ...p, emailNotifications: v }))}
                  disabled={prefLoading} // Désactivé pendant le chargement ou la mise à jour
                />
              </div>
              <Separator />
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Rappels de paiement</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des rappels pour les échéances de paiement
                  </p>
                </div>
                <Switch
                  checked={preferences.paymentReminders}
                  onCheckedChange={v => setPreferences(p => ({ ...p, paymentReminders: v }))}
                  disabled={prefLoading}
                />
              </div>
              <Separator />
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notifications de validation</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications lors de la validation de vos paiements
                  </p>
                </div>
                <Switch
                  checked={preferences.validationNotifications}
                  onCheckedChange={v => setPreferences(p => ({ ...p, validationNotifications: v }))}
                  disabled={prefLoading}
                />
              </div>
              {prefError && <div className="text-red-600 text-sm pt-1">{prefError}</div>}
              {prefSuccess && <div className="text-green-600 text-sm pt-1">Préférences enregistrées avec succès.</div>}
              <Button className="mt-4" type="submit" disabled={prefLoading}>{prefLoading ? "Enregistrement..." : "Enregistrer les préférences"}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}