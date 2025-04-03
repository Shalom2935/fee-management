"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Edit, Eye, FileText, Search, Trash, Upload, UserPlus } from "lucide-react"

export default function StudentManagement() {
  const students = [
    {
      id: 1,
      name: "Jean Dupont",
      matricule: "SJP-2023-12345",
      school: "SJP",
      level: "Licence 3",
      department: "Informatique",
      status: "active",
      paymentStatus: "up-to-date",
    },
    {
      id: 2,
      name: "Marie Curie",
      matricule: "SJP-2023-12346",
      school: "SJP",
      level: "Master 1",
      department: "Physique",
      status: "active",
      paymentStatus: "up-to-date",
    },
    {
      id: 3,
      name: "Pierre Martin",
      matricule: "SJMB-2023-12347",
      school: "SJMB",
      level: "Licence 2",
      department: "Gestion",
      status: "active",
      paymentStatus: "late",
    },
    {
      id: 4,
      name: "Sophie Dubois",
      matricule: "SJP-2023-12348",
      school: "SJP",
      level: "Licence 1",
      department: "Droit",
      status: "active",
      paymentStatus: "up-to-date",
    },
    {
      id: 5,
      name: "Lucas Bernard",
      matricule: "SJMB-2023-12349",
      school: "SJMB",
      level: "Master 2",
      department: "Finance",
      status: "inactive",
      paymentStatus: "late",
    },
    {
      id: 6,
      name: "Emma Moreau",
      matricule: "SJP-2023-12350",
      school: "SJP",
      level: "Licence 3",
      department: "Communication",
      status: "active",
      paymentStatus: "partial",
    },
  ]

  return (
    <DashboardLayout userType="admin">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestion des étudiants</CardTitle>
            <CardDescription>Gérez les comptes étudiants et leurs informations</CardDescription>
          </div>
          {/* Removed the "Ajouter" button from here */}
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="active">Actifs</TabsTrigger>
              <TabsTrigger value="inactive">Inactifs</TabsTrigger>
              <TabsTrigger value="late">En retard</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Rechercher par nom ou matricule..." className="pl-8" />
            </div>
            <div className="grid grid-cols-2 gap-4 md:flex md:w-auto">
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
                  <SelectValue placeholder="Département" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="informatique">Informatique</SelectItem>
                  <SelectItem value="gestion">Gestion</SelectItem>
                  <SelectItem value="droit">Droit</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Matricule</TableHead>
                  <TableHead className="hidden md:table-cell">École</TableHead>
                  <TableHead className="hidden md:table-cell">Niveau</TableHead>
                  <TableHead className="hidden md:table-cell">Département</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Paiement</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.matricule}</TableCell>
                    <TableCell className="hidden md:table-cell">{student.school}</TableCell>
                    <TableCell className="hidden md:table-cell">{student.level}</TableCell>
                    <TableCell className="hidden md:table-cell">{student.department}</TableCell>
                    <TableCell>
                      {student.status === "active" ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Actif</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactif</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {student.paymentStatus === "up-to-date" && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">À jour</Badge>
                      )}
                      {student.paymentStatus === "partial" && (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Partiel</Badge>
                      )}
                      {student.paymentStatus === "late" && (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">En retard</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
      </Card>
    </DashboardLayout>
  )
}

