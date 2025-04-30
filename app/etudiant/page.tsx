"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CreditCard, Download, ArrowUpRight, Clock, CheckCircle, User, Mail, Phone, School } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function StudentDashboard() {
  return (
    <DashboardLayout userType="etudiant">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"> {/* Adjusted padding and max-width */}
        {/* Personal Information Card */}
        <Card className="mb-6">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Informations Personnelles</CardTitle>
                <CardDescription>Vos informations d'étudiant</CardDescription>
              </div>
              <User className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3"> {/* Adjusted grid for tablets */}
              <div className="flex flex-col gap-3 p-4 rounded-lg bg-secondary/10">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">Nom complet</p>
                    <p className="text-sm text-muted-foreground">Jean Dupont</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">Email</p>
                    <p className="text-sm text-muted-foreground">jean.dupont@example.com</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 p-4 rounded-lg bg-secondary/10">
                <div className="flex items-center gap-3">
                  <School className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">École</p>
                    <p className="text-sm text-muted-foreground">SJP</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <School className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">Niveau et Filière</p>
                    <p className="text-sm text-muted-foreground">GME 4 RIA</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 p-4 rounded-lg bg-secondary/10">
                <div className="flex items-center gap-3">
                  <School className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">Matricule</p>
                    <p className="text-sm text-muted-foreground">12345</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">Téléphone</p>
                    <p className="text-sm text-muted-foreground">+123 456 789</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Section */}
        <Card className="mb-6">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Progression des Paiements</CardTitle>
                <CardDescription>État actuel de vos paiements</CardDescription>
              </div>
              <ArrowUpRight className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-end gap-4 mb-4">
              <div className="text-2xl font-bold text-primary">67%</div>
              <p className="text-sm text-muted-foreground pb-1">Progression des paiements pour l'année académique</p>
            </div>
            <Progress value={67} className="h-2 rounded-full" />
          </CardContent>
        </Card>

        {/* Payment Information Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-4">
          <Card className="bg-secondary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Total année en cours</CardTitle>
              <School className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-primary">900 000 FCFA</div>
              <p className="text-sm text-muted-foreground mt-1">Montant total pour l'année académique</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50 dark:bg-green-950/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Montant payé</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-500">600 000 FCFA</div>
              <p className="text-sm text-muted-foreground mt-1">Montant total payé à ce jour</p>
            </CardContent>
          </Card>
          <Card className="bg-secondary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Reste à payer</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" /> {/* Changed icon color to yellow */}
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-yellow-500">300 000 FCFA</div> {/* Changed text color to yellow */}
              <p className="text-sm text-muted-foreground mt-1">Montant restant à payer</p>
            </CardContent>
          </Card>
        </div>

        {/* Dette Card */}
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
                className="h-4 w-4 text-red-500" // Changed icon color to red
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-red-500">100 000 FCFA</div> {/* Changed text color to red */}
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
              <div className="text-xl font-bold">1 000 000 FCFA</div>
              <p className="text-xs text-muted-foreground">Total année en cours + dettes</p>
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
