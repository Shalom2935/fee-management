"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-context"
import { 
  Bell, 
  Lock, 
  User, 
  Mail, 
  Shield, 
  Calendar,
  Plus,
  Edit,
  Trash,
  DollarSign,
  ListChecks,
  Settings2,
  Search
} from "lucide-react"
import { adminSchema, Admin } from "@/lib/schemas/admin"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// --- Types ---
interface PaymentProfile {
  id: string; 
  year: string; // Corresponds to academic_year in backend PaymentProfile model
  level: string;
  is_gci: boolean;
  total_amount: number;
}

interface Deadline {
  id: string;
  // These might not be directly on the Deadline model from backend if it only has profile_id
  // but are useful for frontend filtering and context if joined or denormalized.
  // For the purpose of this component, we assume the fetchDeadlines API returns them.
  year: string; 
  level: string;
  gci: boolean; 
  
  description: string;
  due_date: string; // Should be in YYYY-MM-DD format for input type="date"
  amount: number;
  profile_id?: string; // The backend Deadline model (PaymentDueDate) will have profile_id
}


export default function SettingsPage() {
  const { toast } = useToast()
  const { token } = useAuth()
  const [loading, setLoading] = useState(false) 
  
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState("")
  const [profileSaving, setProfileSaving] = useState(false)
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [title, setTitle] = useState("")

  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const academicYears = ["2023-2024", "2024-2025", "2025-2026"]; 
  const levels = ["1", "2", "3", "4", "5"]; 

  const [selectedYear, setSelectedYear] = useState(academicYears[1]);
  const [selectedLevel, setSelectedLevel] = useState(levels[0]); 
  const [isGCI, setIsGCI] = useState(false); 

  const [paymentProfiles, setPaymentProfiles] = useState<PaymentProfile[]>([]);
  const [loadingPaymentProfiles, setLoadingPaymentProfiles] = useState(false);
  const [errorPaymentProfiles, setErrorPaymentProfiles] = useState("");
  const [editingProfileAmounts, setEditingProfileAmounts] = useState<{ [profileId: string]: string }>({});
  const [savingProfileAmount, setSavingProfileAmount] = useState<{ [profileId: string]: boolean }>({});

  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loadingDeadlines, setLoadingDeadlines] = useState(false);
  const [errorDeadlines, setErrorDeadlines] = useState("");
  
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);
  const [deadlineDesc, setDeadlineDesc] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineAmount, setDeadlineAmount] = useState("");
  const [savingDeadline, setSavingDeadline] = useState(false);

  useEffect(() => {
    if (!token) return;
    const fetchAdmin = async () => {
      setProfileLoading(true);
      setProfileError("");
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Erreur lors du chargement du profil administrateur.");
        const data = await res.json();
        const parsed = adminSchema.safeParse(data);
        if (!parsed.success) throw new Error("Données administrateur invalides.");
        setAdmin(parsed.data);
        setFullName(parsed.data.full_name);
        setEmail(parsed.data.email);
        setPhone(parsed.data.phone_number);
        setTitle(parsed.data.title);
      } catch (err: any) {
        setProfileError(err.message);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchAdmin();
  }, [token]);

  useEffect(() => {
    if (!token || !selectedYear) return;
    const fetchProfiles = async () => {
      setLoadingPaymentProfiles(true);
      setErrorPaymentProfiles("");
      setPaymentProfiles([]); 
      try {
        const res = await fetch(`${API_BASE_URL}/api/payment-profiles?year=${selectedYear}&is_gci=${isGCI}`, { // Kept as per client's last version
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Erreur lors du chargement des profils de paiement.");
        const data: PaymentProfile[] = await res.json();
        setPaymentProfiles(data);
        const initialEditingAmounts: { [profileId: string]: string } = {};
        data.forEach(p => {
          initialEditingAmounts[p.id] = p.total_amount.toString();
        });
        setEditingProfileAmounts(initialEditingAmounts);
      } catch (err: any) {
        setErrorPaymentProfiles(err.message);
        toast({ title: "Erreur Profils", description: err.message, variant: "destructive" });
      } finally {
        setLoadingPaymentProfiles(false);
      }
    };
    fetchProfiles();
  }, [token, selectedYear, isGCI, toast]);


  const handleSaveProfile = async () => {
    setProfileSaving(true)
    setProfileError("")
    try {
      const parsed = adminSchema.safeParse({
        ...admin,
        full_name: fullName,
        email,
        phone_number: phone,
        title,
      })
      if (!parsed.success) {
        const errorMessages = parsed.error.issues.map(issue => issue.message).join(", ")
        setProfileError(`Veuillez remplir correctement tous les champs: ${errorMessages}`)
        setProfileSaving(false)
        return
      }
      const res = await fetch(`${API_BASE_URL}/api/admin/me`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone_number: phone,
          title,
        }),
      })
      if (!res.ok) throw new Error("Erreur lors de la mise à jour du profil.")
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
      })
    } catch (err: any) {
      setProfileError(err.message || "Erreur inconnue")
      toast({
        title: "Erreur",
        description: err.message || "Erreur inconnue",
        variant: "destructive",
      })
    } finally {
      setProfileSaving(false)
    }
  }

  const handleSavePassword = async () => {
    setPasswordSaving(true)
    setPasswordError("")
    try {
      if (newPassword.length < 8) throw new Error("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      if (!/[A-Z]/.test(newPassword)) throw new Error("Le nouveau mot de passe doit contenir au moins une majuscule.");
      if (!/[a-z]/.test(newPassword)) throw new Error("Le nouveau mot de passe doit contenir au moins une minuscule.");
      if (!/[0-9]/.test(newPassword)) throw new Error("Le nouveau mot de passe doit contenir au moins un chiffre.");
      if (newPassword !== confirmPassword) throw new Error("La confirmation du mot de passe ne correspond pas.");
      
      const res = await fetch(`${API_BASE_URL}/api/admin/password`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur lors de la mise à jour du mot de passe.");
      }
      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été modifié avec succès.",
      })
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: any) {
      setPasswordError(err.message)
      toast({ title: "Erreur Mot de Passe", description: err.message, variant: "destructive" })
    } finally {
      setPasswordSaving(false)
    }
  }
  
  const handleSaveNotifications = async () => { /* ... */ }
  const handleSaveSystem = async () => { /* ... */ }

  const handleProfileTotalAmountChange = (profileId: string, amount: string) => {
    setEditingProfileAmounts(prev => ({ ...prev, [profileId]: amount }));
  };

  const handleSaveProfileTotalAmount = async (profileId: string) => {
    if (!token) return;
    const newTotalAmount = parseFloat(editingProfileAmounts[profileId]);
    if (isNaN(newTotalAmount) || newTotalAmount < 0) {
      toast({ title: "Montant invalide", description: "Veuillez entrer un montant valide.", variant: "destructive" });
      return;
    }
    setSavingProfileAmount(prev => ({ ...prev, [profileId]: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/api/payment-profiles/${profileId}/total`, { // Kept as per client's last version
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ total_amount: newTotalAmount }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur lors de la mise à jour du montant total.");
      }
      setPaymentProfiles(prev => prev.map(p => p.id === profileId ? { ...p, total_amount: newTotalAmount } : p));
      toast({ title: "Montant total mis à jour", description: `Le montant total du profil a été sauvegardé.` });
    } catch (err: any) {
      toast({ title: "Erreur Sauvegarde Profil", description: err.message, variant: "destructive" });
      const originalProfile = paymentProfiles.find(p => p.id === profileId);
      if (originalProfile) {
        setEditingProfileAmounts(prev => ({ ...prev, [profileId]: originalProfile.total_amount.toString() }));
      }
    } finally {
      setSavingProfileAmount(prev => ({ ...prev, [profileId]: false }));
    }
  };
  
  // --- Deadlines Handlers (MODIFIED FOR CONSISTENCY WITH BACKEND) ---
  const fetchDeadlines = async () => {
    if (!token || !selectedYear || !selectedLevel) return;
    setLoadingDeadlines(true);
    setErrorDeadlines("");
    setDeadlines([]); 
    try {
      // MODIFIED: Endpoint to fetch deadlines, assuming it's under /api/admin/deadlines
      const res = await fetch(`${API_BASE_URL}/api/payment-profiles/deadlines?year=${selectedYear}&level=${selectedLevel}&gci=${isGCI}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur lors du chargement des échéances.");
      }
      const data: Deadline[] = await res.json();
      // The backend returns PaymentDueDate objects which have profile_id.
      // We might need to enrich them with year, level, gci on the frontend if the API doesn't join.
      // For now, assuming API returns them or they are already part of the Deadline type from a previous join.
      // If API returns raw PaymentDueDate, you'd map them:
      // const enrichedData = data.map(d => ({...d, year: selectedYear, level: selectedLevel, gci: isGCI }));
      // setDeadlines(enrichedData);
      setDeadlines(data); // Assuming API returns deadlines with year, level, gci context or they are already in type
      
      if (data.length === 0 && !errorDeadlines) { // ensure no error before this toast
        toast({ title: "Info", description: "Aucune échéance trouvée pour ce profil." });
      }
    } catch (err: any) {
      setErrorDeadlines(err.message);
      toast({ title: "Erreur Échéances", description: err.message, variant: "destructive" });
    } finally {
      setLoadingDeadlines(false);
    }
  };

  const handleEditDeadline = (dl: Deadline) => {
    setEditingDeadline(dl);
    setDeadlineDesc(dl.description);
    setDeadlineDate(dl.due_date.split('T')[0]); 
    setDeadlineAmount(dl.amount.toString());
  };

  const handleDeleteDeadline = async (deadlineId: string) => {
    if (!token) return;
    setSavingDeadline(true); 
    try {
      // MODIFIED: Endpoint for deleting a deadline
      const res = await fetch(`${API_BASE_URL}/api/payment-profiles/deadlines/${deadlineId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur lors de la suppression de l'échéance.");
      }
      setDeadlines(ds => ds.filter(d => d.id !== deadlineId));
      if (editingDeadline?.id === deadlineId) handleCancelEdit();
      toast({ title: "Échéance supprimée", description: "L'échéance a été supprimée avec succès." });
    } catch (err: any) {
      toast({ title: "Erreur Suppression", description: err.message, variant: "destructive" });
    } finally {
      setSavingDeadline(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingDeadline(null);
    setDeadlineDesc("");
    setDeadlineDate("");
    setDeadlineAmount("");
  };

  const handleSaveDeadline = async () => {
    if (!token) return;
    if (!deadlineDesc || !deadlineDate || !deadlineAmount) {
      toast({ title: "Champs requis", description: "Tous les champs sont requis pour l'échéance.", variant: "destructive" });
      return;
    }
    
    setSavingDeadline(true);
    const amount = Number(deadlineAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Montant invalide", description: "Veuillez entrer un montant d'échéance valide.", variant: "destructive" });
      setSavingDeadline(false);
      return;
    }

    try {
      let res;
      if (editingDeadline) {
        // MODIFIED: Payload for PATCH should only include fields that can be updated on the deadline itself.
        // year, level, gci define the profile and are not changed here.
        const updatePayload = {
          description: deadlineDesc,
          due_date: deadlineDate,
          amount: amount,
        };
        res = await fetch(`${API_BASE_URL}/api/payment-profiles/deadlines/${editingDeadline.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(updatePayload),
        });
      } else {
        // For POST (create), include year, level, gci to associate with/create a profile.
        const createPayload = {
          description: deadlineDesc,
          due_date: deadlineDate,
          amount: amount,
          year: selectedYear, 
          level: selectedLevel, 
          gci: isGCI, 
        };
        res = await fetch(`${API_BASE_URL}/api/payment-profiles/deadlines`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(createPayload),
        });
      }

      if (!res.ok) {
         const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur lors de ${editingDeadline ? 'la modification' : "l'ajout"} de l'échéance.`);
      }
      
      fetchDeadlines(); 
      handleCancelEdit();
      toast({ title: `Échéance ${editingDeadline ? 'modifiée' : 'ajoutée'}`, description: `L'échéance a été enregistrée.` });
      // Optionally, if adding/deleting deadlines could affect total_amount of a profile *and*
      // the backend doesn't auto-update it, you might need to refetch profiles or update manually.
      // The provided backend for createDeadline creates a profile with total_amount: 0 if not exists,
      // but doesn't sum up deadlines. So, total_amount is managed independently in this UI.
    } catch (e: any) {
      toast({ title: "Erreur Échéance", description: e.message, variant: "destructive" });
    } finally {
      setSavingDeadline(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 space-y-6 max-w-4xl mx-auto">

        {/* Profil Admin */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du profil</CardTitle>
            <CardDescription>Modifiez vos informations personnelles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {profileLoading ? <p>Chargement...</p> : profileError ? <p className="text-red-500">{profileError}</p> : (
              <>
                <div className="space-y-1"><Label htmlFor="name">Nom complet</Label><Input id="name" value={fullName} onChange={e => setFullName(e.target.value)} disabled={profileSaving} /></div>
                <div className="space-y-1"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={profileSaving} /></div>
                <div className="space-y-1"><Label htmlFor="phone">Téléphone</Label><Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} disabled={profileSaving} /></div>
                <div className="space-y-1"><Label htmlFor="title">Titre</Label><Input id="title" value={title} onChange={e => setTitle(e.target.value)} disabled={profileSaving} /></div>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveProfile} disabled={profileSaving || profileLoading}>
              {profileSaving ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Sécurité */}
        <Card>
          <CardHeader>
            <CardTitle>Sécurité du compte</CardTitle>
            <CardDescription>Modifiez votre mot de passe</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1"><Label htmlFor="current-password">Mot de passe actuel</Label><Input id="current-password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} disabled={passwordSaving} /></div>
            <div className="space-y-1"><Label htmlFor="new-password">Nouveau mot de passe</Label><Input id="new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} disabled={passwordSaving} /></div>
            <div className="space-y-1"><Label htmlFor="confirm-password">Confirmer le mot de passe</Label><Input id="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={passwordSaving} /></div>
            {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="session-timeout">Déconnexion automatique</Label>
                <p className="text-sm text-muted-foreground">Déconnexion après une période d'inactivité</p>
              </div>
              <Select defaultValue="30">
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem><SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 heure</SelectItem><SelectItem value="120">2 heures</SelectItem>
                  <SelectItem value="never">Jamais</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSavePassword} disabled={passwordSaving}>
              {passwordSaving ? "Enregistrement..." : "Mettre à jour le mot de passe"}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Notifications & Système */}
        <Card>
          <CardHeader><CardTitle>Préférences de notification</CardTitle><CardDescription>Configurez comment vous êtes notifié</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between"><div className="flex items-center space-x-2"><Bell className="h-4 w-4" /><Label htmlFor="notify-payments">Nouveaux paiements</Label></div><Switch id="notify-payments" defaultChecked disabled /></div>
            <div className="flex items-center justify-between"><div className="flex items-center space-x-2"><Shield className="h-4 w-4" /><Label htmlFor="notify-security">Alertes de sécurité</Label></div><Switch id="notify-security" defaultChecked disabled /></div>
            <Separator />
            <div className="space-y-1"><Label htmlFor="notification-method">Méthode de notification</Label><Select defaultValue="email" disabled><SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger><SelectContent><SelectItem value="email">Email</SelectItem></SelectContent></Select></div>
          </CardContent>
          <CardFooter><Button onClick={handleSaveNotifications} disabled>Enregistrer les préférences</Button></CardFooter>
        </Card>
        
        <Card>
          <CardHeader><CardTitle>Paramètres du système</CardTitle><CardDescription>Configurez les paramètres généraux</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="academic-year-global">Année académique en cours (global)</Label>
              <Select defaultValue={academicYears[1]} disabled>
                <SelectTrigger id="academic-year-global" disabled><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>{academicYears.map(year => <SelectItem key={year} value={year} disabled>{year}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-reminders">Rappels automatiques</Label>
                <p className="text-sm text-muted-foreground">Envoyer des rappels automatiques</p>
              </div>
              <Switch id="auto-reminders" defaultChecked disabled />
            </div>
          </CardContent>
          <CardFooter><Button onClick={handleSaveSystem} disabled>{loading ? "Enregistrement..." : "Enregistrer les paramètres"}</Button></CardFooter>
        </Card>

        {/* --- Nouvelle Section: Configuration des Paiements --- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Settings2 className="mr-2 h-6 w-6" /> Configuration des Paiements</CardTitle>
            <CardDescription>
              Gérez les montants totaux des profils de paiement et leurs échéances associées.
              Les filtres ci-dessous s'appliquent aux deux sections.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Filtres Globaux */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-4 p-4 border rounded-md items-end">
              <div className="space-y-1">
                <Label htmlFor="config-year">Année Académique</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger id="config-year"><SelectValue placeholder="Sélectionner Année" /></SelectTrigger>
                  <SelectContent>{academicYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="config-level">Niveau (pour échéances)</Label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger id="config-level"><SelectValue placeholder="Sélectionner Niveau" /></SelectTrigger>
                  <SelectContent>{levels.map(lvl => <SelectItem key={lvl} value={lvl}>{`Niveau ${lvl}`}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="config-gci">Statut GCI</Label>
                <div className="flex items-center space-x-2 h-10">
                  <Switch id="config-gci" checked={isGCI} onCheckedChange={setIsGCI} />
                  <Label htmlFor="config-gci" className="text-sm font-normal cursor-pointer">
                    {isGCI ? "Activé (GCI)" : "Désactivé (Non-GCI)"}
                  </Label>
                </div>
              </div>
            </div>

            {/* Section 1: Montants Totaux des Profils */}
            <div className="pt-2">
              <div className="flex items-center mb-3">
                <DollarSign className="mr-2 h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">Profils de Paiement et Montants Totaux</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Affiche les profils pour l'année <span className="font-semibold">{selectedYear}</span> et statut GCI <span className="font-semibold">{isGCI ? "Activé" : "Désactivé"}</span>.
                Modifiez le montant total attendu pour chaque niveau.
              </p>
              
              {loadingPaymentProfiles && <p>Chargement des profils...</p>}
              {errorPaymentProfiles && <p className="text-red-500">{errorPaymentProfiles}</p>}
              {!loadingPaymentProfiles && !errorPaymentProfiles && paymentProfiles.length === 0 && (
                <p className="text-muted-foreground p-4 border rounded-md text-center">
                  Aucun profil de paiement trouvé pour {selectedYear} avec GCI {isGCI ? "activé" : "désactivé"}.
                </p>
              )}
              {!loadingPaymentProfiles && paymentProfiles.length > 0 && (
                <div className="space-y-3">
                  {paymentProfiles.map(profile => (
                    <Card key={profile.id} className="bg-slate-50/50 dark:bg-slate-800/30">
                      <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <span className="font-medium text-md">Niveau {profile.level}</span>
                          <span className="text-xs text-muted-foreground ml-2">{profile.is_gci ? "(GCI)" : ""}</span>
                          <p className="text-sm text-muted-foreground">Année: {profile.year}</p>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Input
                            type="number"
                            value={editingProfileAmounts[profile.id] || ""}
                            onChange={(e) => handleProfileTotalAmountChange(profile.id, e.target.value)}
                            placeholder="Montant total"
                            className="w-full sm:w-40"
                            disabled={savingProfileAmount[profile.id]}
                          />
                          <span className="ml-1 mr-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {Number(editingProfileAmounts[profile.id] || 0).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} FCFA
                          </span>
                          <Button 
                            onClick={() => handleSaveProfileTotalAmount(profile.id)}
                            disabled={savingProfileAmount[profile.id] || (parseFloat(editingProfileAmounts[profile.id]) === profile.total_amount)}
                            size="sm"
                          >
                            {savingProfileAmount[profile.id] ? "..." : "Enregistrer"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <Separator className="my-8" />

            {/* Section 2: Gestion des Échéances */}
            <div>
              <div className="flex items-center mb-3">
                <ListChecks className="mr-2 h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">Échéances du Profil Sélectionné</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Gérez les échéances pour: Année <span className="font-semibold">{selectedYear}</span>,
                Niveau <span className="font-semibold">{selectedLevel}</span>,
                GCI <span className="font-semibold">{isGCI ? "Activé" : "Désactivé"}</span>.
              </p>
              <Button onClick={fetchDeadlines} disabled={loadingDeadlines} className="mb-4 w-full sm:w-auto">
                <Search className="mr-2 h-4 w-4" /> {loadingDeadlines ? "Chargement..." : "Afficher / Rafraîchir les échéances"}
              </Button>

              {loadingDeadlines && <p>Chargement des échéances...</p>}
              {errorDeadlines && <p className="text-red-500">{errorDeadlines}</p>}
              
              {!loadingDeadlines && !errorDeadlines && deadlines.length > 0 && (
                <div className="rounded-md border mt-4">
                  <table className="w-full text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b"><th className="p-3 text-left font-medium">Description</th><th className="p-3 text-left font-medium">Date limite</th><th className="p-3 text-left font-medium">Montant (FCFA)</th><th className="p-3 text-right font-medium">Actions</th></tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {deadlines.map((deadline) => (
                        <tr key={deadline.id} className="border-b">
                          <td className="p-3 whitespace-nowrap">{deadline.description}</td>
                          <td className="p-3">{new Date(deadline.due_date + "T00:00:00Z").toLocaleDateString('fr-CA')}</td> {/* Ensure date is parsed as UTC if it's date-only */}
                          <td className="p-3 whitespace-nowrap">{Number(deadline.amount).toLocaleString('fr-FR', { maximumFractionDigits: 0 })}</td>
                          <td className="p-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" title="Modifier" onClick={() => handleEditDeadline(deadline)}><Edit className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" title="Supprimer" onClick={() => handleDeleteDeadline(deadline.id)}><Trash className="h-4 w-4" /></Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {!loadingDeadlines && deadlines.length === 0 && !errorDeadlines && ( // Corrected condition to show if no deadlines and no error
                 <p className="text-muted-foreground mt-4 p-4 border rounded-md text-center">
                  Cliquez sur "Afficher / Rafraîchir" pour voir les échéances, ou il n'y en a aucune pour ce profil.
                </p>
              )}

              {/* Formulaire Ajout/Modif Échéance */}
              <div className="border rounded-md p-4 mt-6">
                <h4 className="text-lg font-medium mb-1">{editingDeadline ? "Modifier l'échéance" : "Ajouter une échéance"}</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Pour profil: Année {selectedYear}, Niveau {selectedLevel}, GCI {isGCI ? "Oui" : "Non"}.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1"><Label htmlFor="dl-desc">Description</Label><Input id="dl-desc" value={deadlineDesc} onChange={e => setDeadlineDesc(e.target.value)} placeholder="Ex: Premier versement" /></div>
                  <div className="space-y-1"><Label htmlFor="dl-date">Date limite</Label><Input id="dl-date" type="date" value={deadlineDate} onChange={e => setDeadlineDate(e.target.value)} /></div>
                  <div className="space-y-1"><Label htmlFor="dl-amount">Montant (FCFA)</Label><Input id="dl-amount" type="number" value={deadlineAmount} onChange={e => setDeadlineAmount(e.target.value)} placeholder="Ex: 150000" /></div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleSaveDeadline} disabled={savingDeadline}>
                    <Plus className="h-4 w-4 mr-2" />
                    {savingDeadline ? "Enregistrement..." : editingDeadline ? "Sauvegarder" : "Ajouter"}
                  </Button>
                  {editingDeadline && <Button variant="outline" onClick={handleCancelEdit} disabled={savingDeadline}>Annuler</Button>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}