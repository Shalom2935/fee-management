import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-blue-900">Gestion des Frais Universitaires</h1>
          <p className="text-blue-600 mt-1">SJP & SJMB</p>
        </div>

        <Tabs defaultValue="etudiant" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="etudiant">Étudiant</TabsTrigger>
            <TabsTrigger value="admin">Administrateur</TabsTrigger>
            <TabsTrigger value="sous-admin">Sous-Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="etudiant">
            <Card>
              <CardHeader>
                <CardTitle>Connexion Étudiant</CardTitle>
                <CardDescription>Entrez vos identifiants pour accéder à votre compte étudiant.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="matricule">Matricule</Label>
                  <Input id="matricule" placeholder="Entrez votre matricule" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input id="password" type="password" placeholder="Entrez votre mot de passe" />
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/etudiant">Se connecter</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Connexion Administrateur</CardTitle>
                <CardDescription>Entrez vos identifiants pour accéder au compte administrateur.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="admin@exemple.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Mot de passe</Label>
                  <Input id="admin-password" type="password" placeholder="Entrez votre mot de passe" />
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/admin">Se connecter</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="sous-admin">
            <Card>
              <CardHeader>
                <CardTitle>Connexion Sous-Administrateur</CardTitle>
                <CardDescription>Entrez vos identifiants pour accéder au compte sous-administrateur.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sous-admin-email">Email</Label>
                  <Input id="sous-admin-email" placeholder="sous-admin@exemple.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sous-admin-password">Mot de passe</Label>
                  <Input id="sous-admin-password" type="password" placeholder="Entrez votre mot de passe" />
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/sous-admin">Se connecter</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

