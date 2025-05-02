"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card" // Added CardFooter here
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Edit, Eye, FileText, Search, Trash, Upload, UserPlus, Download } from "lucide-react"

export default function StudentManagement() {
  const students = [
    {
      id: 1,
      name: "Jean Dupont",
      matricule: "SJP-2023-12345",
      school: "SJP",
      level: "Licence 3",
      filiere: "Génie Infotronique",
      paymentStatus: "up-to-date",
    },
    {
      id: 2,
      name: "Marie Curie",
      matricule: "SJP-2023-12346",
      school: "SJP",
      level: "Master 1",
      filiere: "Génie Civil",
      paymentStatus: "up-to-date",
    },
    {
      id: 3,
      name: "Pierre Martin",
      matricule: "SJMB-2023-12347",
      school: "SJMB",
      level: "Licence 2",
      filiere: "Comptabilité Contrôle Audit",
      paymentStatus: "late",
    },
    {
      id: 4,
      name: "Sophie Dubois",
      matricule: "SJP-2023-12348",
      school: "SJP",
      level: "Licence 1",
      filiere: "Génie Mécatronique",
      paymentStatus: "up-to-date",
    },
    {
      id: 5,
      name: "Lucas Bernard",
      matricule: "SJMB-2023-12349",
      school: "SJMB",
      level: "Master 2",
      filiere: "Banques et Institutions financières",
      paymentStatus: "late",
    },
    {
      id: 6,
      name: "Emma Moreau",
      matricule: "SJP-2023-12350",
      school: "SJP",
      level: "Licence 3",
      filiere: "Génie Civil",
      paymentStatus: "late", // Changed from "partial" to "late"
    },
  ]

  return (
    <DashboardLayout>
      {/* Add padding wrapper */}
      <div className="px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"> {/* Stack on mobile, row on sm+ */}
          <div>
            <CardTitle className="text-xl md:text-2xl">Liste des étudiants</CardTitle> {/* Responsive title */}
            {/* Removed empty CardDescription */}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row"> {/* Stack buttons on mobile */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  Ajouter un étudiant
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouvel étudiant</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations de l'étudiant ci-dessous.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nom complet
                    </Label>
                    <Input id="name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="school" className="text-right">
                      École
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner une école" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sjp">SJP</SelectItem>
                        <SelectItem value="sjmb">SJMB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="level" className="text-right">
                      Niveau
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner un niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="licence-1">Licence 1</SelectItem>
                        <SelectItem value="licence-2">Licence 2</SelectItem>
                        <SelectItem value="licence-3">Licence 3</SelectItem>
                        <SelectItem value="master-1">Master 1</SelectItem>
                        <SelectItem value="master-2">Master 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="filiere" className="text-right">
                      Filière
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner une filière" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="genie-civil">Génie Civil</SelectItem>
                        <SelectItem value="genie-mecatronique">Génie Mécatronique</SelectItem>
                        <SelectItem value="genie-infotronique">Génie Infotronique</SelectItem>
                        <SelectItem value="banques-finances">Banques et Institutions financières</SelectItem>
                        <SelectItem value="comptabilite">Comptabilité Contrôle Audit</SelectItem>
                        <SelectItem value="supply-chain">Supply Chain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="justify-start"> {/* Align button to the left */}
                  <Button type="submit">Enregistrer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Upload className="h-4 w-4" />
                  Importer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Importer des étudiants</DialogTitle>
                  <DialogDescription>
                    Téléchargez un fichier CSV ou Excel contenant la liste des étudiants.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        Glissez-déposez votre fichier ici ou cliquez pour parcourir
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Formats acceptés: .csv, .xlsx (max 5MB)
                      </p>
                      <Input type="file" className="hidden" id="file-upload" />
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" className="mt-2">
                          Parcourir
                        </Button>
                      </Label>
                    </div>
                  </div>
                  <div>
                    <a href="#" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      Télécharger le modèle de fichier
                    </a>
                  </div>
                </div>
                <DialogFooter className="justify-start"> {/* Align button to the left */}
                  <Button type="submit">Importer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="mb-6">
            <TabsList> {/* Temporarily remove grid classes for testing */}
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="up-to-date">À jour</TabsTrigger>
              <TabsTrigger value="late">En retard</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Rechercher par nom ou matricule..." className="pl-8" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:flex md:w-auto"> {/* Stack selects on xs, 2 cols on sm, flex row on md */}
              <Select>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="École" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="sjp">SJP</SelectItem>
                  <SelectItem value="sjmb">SJMB</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filière" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="genie-civil">Génie Civil</SelectItem>
                  <SelectItem value="genie-mecatronique">Génie Mécatronique</SelectItem>
                  <SelectItem value="genie-infotronique">Génie Infotronique</SelectItem>
                  <SelectItem value="banques-finances">Banques et Institutions financières</SelectItem>
                  <SelectItem value="comptabilite">Comptabilité Contrôle Audit</SelectItem>
                  <SelectItem value="supply-chain">Supply Chain</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="rounded-md border overflow-x-auto hidden md:block"> {/* Hide below md, add scroll */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Matricule</TableHead>
                  <TableHead>École</TableHead>
                  <TableHead>Niveau</TableHead>
                  <TableHead>Filière</TableHead>
                  <TableHead>Paiement</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id} className="[&_td]:whitespace-nowrap"> {/* Prevent wrapping */}
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.matricule}</TableCell>
                    <TableCell>{student.school}</TableCell>
                    <TableCell>{student.level}</TableCell>
                    <TableCell>{student.filiere}</TableCell>
                    <TableCell>
                      {student.paymentStatus === "up-to-date" && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">À jour</Badge>
                      )}
                      {student.paymentStatus === "late" && (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">En retard</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right flex justify-end gap-1"> {/* Use flex for actions */}
                      <Button variant="ghost" size="icon" title="Voir les détails">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Modifier">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        title="Supprimer"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile/Tablet Cards */}
          <div className="grid gap-4 md:hidden"> {/* Show below md */}
            {students.map((student) => (
              <Card key={student.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-base leading-tight">{student.name}</CardTitle>
                    <CardDescription>{student.matricule}</CardDescription>
                  </div>
                  <div>
                    {student.paymentStatus === "up-to-date" && <Badge className="bg-green-100 text-green-800 hover:bg-green-100">À jour</Badge>}
                    {student.paymentStatus === "late" && <Badge className="bg-red-100 text-red-800 hover:bg-red-100">En retard</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="px-4 pt-0 pb-2 text-sm text-muted-foreground space-y-1">
                  <p>École: {student.school}</p>
                  <p>Niveau: {student.level}</p>
                  <p>Filière: {student.filiere}</p>
                </CardContent>
                <CardFooter className="p-2 flex items-stretch gap-2 sm:flex-row sm:justify-start border-t"> {/* Stack buttons on xs, row on sm+ */}
                  <Button variant="ghost" size="sm" className="h-8">
                    <Eye className="h-4 w-4 mr-1" /> Détails
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8">
                    <Edit className="h-4 w-4 mr-1" /> Modifier
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash className="h-4 w-4 mr-1" /> Supprimer
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">Affichage de 6 étudiants sur 1,248</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Précédent
              </Button>
              <Button variant="outline" size="sm">
                Suivant
              </Button>
            </div>
          </div>
        </CardContent>
        {/* Missing </Card> was here, moved below */}
      </Card>
      </div> {/* Close padding wrapper */}
    </DashboardLayout>
  )
}
