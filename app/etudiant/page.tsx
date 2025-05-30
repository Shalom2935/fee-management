"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CreditCard, Download, ArrowUpRight, Clock, CheckCircle, User, Mail, Phone, School, AlertTriangle } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { studentSchema, StudentData } from "@/lib/schemas/student"
import { InfoRow } from "@/components/student/InfoRow"

export default function StudentDashboard() {
  const [userData, setUserData] = useState<StudentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (!token) {
      setError("Authentification requise. Veuillez vous reconnecter.")
      setIsLoading(false)
      return
    }

    const fetchUserData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        let data = null
        if (
          response.headers.get("content-length") !== "0" &&
          response.headers.get("content-type")?.includes("application/json")
        ) {
          data = await response.json()
          console.log("Response data:", data)
        }

        if (!response.ok) {
          const errorMessage = data?.message || `Erreur ${response.status}: Impossible de récupérer les données.`
          throw new Error(errorMessage)
        }

        // Zod validation here
        const result = studentSchema.safeParse(data)
        if (!result.success) {
          console.error("Validation error:", result.error)
          throw new Error("Réponse invalide reçue du serveur.")
        }

        setUserData(result.data)

        // --- Fetch total_amount for the student's profile (academic year, level, GCI) ---
        const academicYear = new Date().getMonth() >= 8 ? `${new Date().getFullYear()}-${new Date().getFullYear() + 1}` : `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`;
        const academicYearToString = academicYear.toString()
        const isGCI = (result.data.field || "").toUpperCase().includes("GCI")
        const level = result.data.current_year
        const totalApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment-profiles/me/total?academic_year=${academicYearToString}&level=${level}&is_gci=${isGCI}`
        const totalRes = await fetch(totalApiUrl, {
          headers: { Authorization: `Bearer ${token}` }
        })
        let totalData = null
        if (totalRes.headers.get("content-length") !== "0" && totalRes.headers.get("content-type")?.includes("application/json")) {
          totalData = await totalRes.json()
        }
        if (!totalRes.ok) {
          throw new Error(totalData?.message || "Impossible de récupérer le montant total du profil.")
        }
        setTotalAmount(Number(totalData.total_amount || 0))
      } catch (err) {
        const message = err instanceof Error ? err.message : "Une erreur inconnue est survenue."
        setError(message)
        toast({
          variant: "destructive",
          title: "Erreur de chargement",
          description: message,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [token, toast])

  // --- State for total_amount from API ---
  const [totalAmount, setTotalAmount] = useState<number>(0)

  // Import Students Section
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importLoading, setImportLoading] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setImportFile(e.target.files[0])
      setImportError(null)
      setImportSuccess(null)
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImportFile(e.dataTransfer.files[0])
      setImportError(null)
      setImportSuccess(null)
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    if (!isDragging) setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
  }

  async function handleImportUpload() {
    if (!importFile) return
    setImportLoading(true)
    setImportError(null)
    setImportSuccess(null)
    try {
      const formData = new FormData()
      formData.append("file", importFile)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/students/import`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || "Erreur lors de l'import du fichier.")
      }
      setImportSuccess("Importation réussie !")
      setImportFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (err: any) {
      setImportError(err.message)
    } finally {
      setImportLoading(false)
    }
  }

  // Calcul du pourcentage de progression
  const total = totalAmount // Utilise le montant total récupéré dynamiquement
  const paid = userData?.paid ?? 0
  const progress = total > 0 ? Math.round((paid / total) * 100) : 0
  const debt = userData?.debt ?? 0
  const rest = total - paid
  const totalToPay = debt + rest

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="w-[90vw] md:w-[60vw] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <Card className="w-full">
            <CardHeader className="w-full">
              <Skeleton className="h-6 w-full" />
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 w-full">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
          <div className="grid gap-6 md:grid-cols-3 w-full">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 w-full">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="w-full mx-auto md:px-6 lg:px-8 py-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>Impossible de charger les données du serveur</AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    )
  }

  if (!userData) {
    return (
      <DashboardLayout>
        <div className="w-full mx-auto md:px-6 lg:px-8 py-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>Impossible d'afficher les données du tableau de bord.</AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="w-[90vw] md:w-full max-w-7xl mx-auto md:px-6 lg:px-8 py-6">
        {/* Personal Information Card */}
        <Card className="mb-6">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Informations Personnelles</CardTitle>
                <CardDescription>Vos informations d'étudiant</CardDescription>
              </div>
              <User className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-3 gap-2">
            <InfoRow
              icon={<User className="h-4 w-4 text-primary" />}
              label="Nom complet"
              value={
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-sm text-muted-foreground truncate uppercase md:w-[70%] block">{userData.full_name}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>{userData.full_name}</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              }
            />
            <InfoRow
              icon={<Mail className="h-4 w-4 text-primary" />}
              label="Email"
              value={userData.email}
            />
            <InfoRow
              icon={<School className="h-4 w-4 text-primary" />}
              label="École"
              value={userData.school}
            />
            <InfoRow
              icon={<School className="h-4 w-4 text-primary" />}
              label="Niveau et Filière"
              value={`${userData.field}  ${userData.current_year}${userData.field_option ? ` ${userData.field_option}` : ""}`}
            />
            <InfoRow
              icon={<School className="h-4 w-4 text-primary" />}
              label="Matricule"
              value={userData.matricule}
            />
            <InfoRow
              icon={<Phone className="h-4 w-4 text-primary" />}
              label="Téléphone"
              value={userData.phone || "Non spécifié"}
            />
          </CardContent>
        </Card>

        {/* Progress Section */}
        <Card className="mb-6">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-semibold text-lg">Progression des Paiements</CardTitle>
                <CardDescription>État actuel de vos paiements</CardDescription>
              </div>
              <ArrowUpRight className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-end gap-4 mb-4">
              <div className="text-2xl font-bold text-primary">{progress}%</div>
              <p className="text-sm text-muted-foreground pb-1">Progression des paiements pour l'année académique</p>
            </div>
            <Progress value={progress} className="h-2 rounded-full" />
          </CardContent>
        </Card>

        {/* Payment Information Cards */}
        <div className="flex flex-col md:flex-row md:flex-wrap justify-between gap-4 mb-4">
          <Card className="flex-1 bg-secondary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">Total année en cours</CardTitle>
              <School className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-primary">{formatCurrency(total)}</div>
              <p className="text-sm text-muted-foreground mt-1">Montant total pour l'année académique</p>
            </CardContent>
          </Card>
          <Card className="flex-1 bg-green-50 dark:bg-green-950/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">Montant payé</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-500">{formatCurrency(userData.paid)}</div>
              <p className="text-sm text-muted-foreground mt-1">Montant total payé à ce jour</p>
            </CardContent>
          </Card>
          <Card className="flex-1 bg-secondary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">Reste à payer</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold text-yellow-500">{formatCurrency(rest)}</div>
              <p className="text-sm text-muted-foreground mt-1">Montant restant à payer</p>
            </CardContent>
          </Card>
        </div>

        {/* Debt and Total Due Cards */}
        <div className="grid gap-4 md:grid-cols-2 mb-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-medium">Dettes</CardTitle>
                <CardDescription>Montant des dettes accumulées</CardDescription>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-red-500"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold text-red-500">{formatCurrency(debt)}</div>
              <p className="text-xs text-muted-foreground">Dettes accumulées à ce jour</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-medium">Total à payer</CardTitle>
                <CardDescription>Montant total avec dettes</CardDescription>
              </div>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{formatCurrency(totalToPay)}</div>
              <p className="text-xs text-muted-foreground">Reste à payer + dettes</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:flex gap-4 mt-8">
          <Link href="/etudiant/paiements" passHref>
            <Button className="w-full md:w-auto">
              <CreditCard className="mr-2 h-4 w-4" /> Soumettre un paiement
            </Button>
          </Link>
          <Link href="/etudiant/parametres" passHref>
            <Button variant="outline" className="w-full md:w-auto">
              <User className="mr-2 h-4 w-4" /> Paramètres du compte
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
