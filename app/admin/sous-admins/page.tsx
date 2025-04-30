"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table" // CardFooter needed for mobile view
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
import { CardFooter } from "@/components/ui/card" // Import CardFooter
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Edit, Eye, Plus, Search, Trash, UserCog } from "lucide-react"

export default function SubAdminManagement() {
  const subAdmins = [
    {
      id: 1,
      name: "Thomas Dubois",
      email: "thomas.dubois@sjp.edu",
      matricule: "ADM-SJP-001",
      school: "SJP",
    },
    {
      id: 2,
      name: "Sophie Martin",
      email: "sophie.martin@sjmb.edu",
      matricule: "ADM-SJMB-001",
      school: "SJMB",
    },
    {
      id: 3,
      name: "Marc Leroy",
      email: "marc.leroy@sjp.edu",
      matricule: "ADM-SJP-002",
      school: "SJP",
    },
    {
      id: 4,
      name: "Camille Bernard",
      email: "camille.bernard@sjmb.edu",
      matricule: "ADM-SJMB-002",
      school: "SJMB",
    },
    {
      id: 5,
      name: "Laurent Moreau",
      email: "laurent.moreau@sjp.edu",
      matricule: "ADM-SJP-003",
      school: "SJP",
    },
  ]

  return (
    <DashboardLayout userType="admin">
      {/* Add padding wrapper */}
      <div className="px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"> {/* Stack on mobile, row on sm+ */}
          <div>
            <CardTitle className="text-xl md:text-2xl">Gestion des sous-administrateurs</CardTitle> {/* Responsive title */}
            <CardDescription>Gérez les comptes des sous-administrateurs du système</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Ajouter</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Ajouter un sous-administrateur</DialogTitle>
                <DialogDescription>
                  Créez un nouveau compte sous-administrateur pour le système.
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
                  <Label htmlFor="matricule" className="text-right">
                    Matricule
                  </Label>
                  <Input id="matricule" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input id="email" type="email" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Mot de passe
                  </Label>
                  <Input id="password" type="password" className="col-span-3" />
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
              </div>
              <DialogFooter className="justify-start"> {/* Align button left */}
                <Button type="submit">Créer le compte</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="all">Tous</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Rechercher par nom ou email..." className="pl-8" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:flex sm:w-auto"> {/* Stack select on xs, flex row on sm+ */}
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
            </div>
          </div>

          {/* Desktop Table */}
          <div className="rounded-md border overflow-x-auto hidden md:block"> {/* Hide below md, add scroll */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">École</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subAdmins.map((admin) => (
                  <TableRow key={admin.id} className="[&_td]:whitespace-nowrap"> {/* Prevent wrapping */}
                    <TableCell className="font-medium">{admin.name}</TableCell>
                    <TableCell>{admin.matricule}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{admin.school}</TableCell>
                    <TableCell className="text-right flex justify-end gap-1"> {/* Use flex for actions */}
                      {/* <div className="flex justify-end gap-2"> */}
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
                      {/* </div> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile/Tablet Cards */}
          <div className="grid gap-4 md:hidden"> {/* Show below md */}
            {subAdmins.map((admin) => (
              <Card key={admin.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-base leading-tight">{admin.name}</CardTitle>
                    <CardDescription>{admin.matricule}</CardDescription>
                  </div>
                  <Badge variant="outline">{admin.school}</Badge>
                </CardHeader>
                <CardContent className="px-4 pt-0 pb-2 text-sm text-muted-foreground">
                  <p>{admin.email}</p>
                </CardContent>
                <CardFooter className="p-2 flex flex-col items-stretch gap-2 sm:flex-row sm:justify-end border-t"> {/* Stack buttons on xs, row on sm+ */}
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
            <div className="text-sm text-muted-foreground">Affichage de 5 sous-administrateurs sur 5</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Précédent
              </Button>
              <Button variant="outline" size="sm" disabled>
                Suivant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      </div> {/* Close padding wrapper */}
    </DashboardLayout>
  )
}