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
import { useEffect, useState, useRef } from "react"
import { studentSchema } from "@/lib/schemas/student"
import { z } from "zod"
import { useAuth } from "@/components/auth-context"
import { SCHOOLS_LIST, FIELDS_LIST } from "@/config/constants"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const { toast } = require("@/components/ui/use-toast")

export default function StudentManagement() {
  const [students, setStudents] = useState<z.infer<typeof studentSchema>[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuth() 
  const [currentPage, setCurrentPage] = useState(1)
  const [totalStudents, setTotalStudents] = useState(0)
  const pageSize = 10
  const [search, setSearch] = useState("")
  const [school, setSchool] = useState("all")
  const [field, setField] = useState("all")
  const [status, setStatus] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<z.infer<typeof studentSchema> | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editStudent, setEditStudent] = useState<z.infer<typeof studentSchema> | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const [editSchool, setEditSchool] = useState("");
  const [editField, setEditField] = useState("");
  const [deleteStudent, setDeleteStudent] = useState<z.infer<typeof studentSchema> | null>(null)
  const [showDelete, setShowDelete] = useState(false)
  const [deletePassword, setDeletePassword] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string>("")
  const [showAdd, setShowAdd] = useState(false);
  const [addFullName, setAddFullName] = useState("");
  const [addMatricule, setAddMatricule] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addSchool, setAddSchool] = useState("");
  const [addCurrentYear, setAddCurrentYear] = useState("");
  const [addField, setAddField] = useState("");
  const [addFieldOption, setAddFieldOption] = useState("");
  const [addPaid, setAddPaid] = useState(0);
  const [addDebt, setAddDebt] = useState(0);
  const [addPassword, setAddPassword] = useState("");
  const [showAddPassword, setShowAddPassword] = useState(false);
  const addPasswordInputRef = useRef<HTMLInputElement>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string>("");

  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function generatePassword() {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=~";
    let pwd = "";
    while (true) {
      pwd = Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join("");
      if (
        /[a-z]/.test(pwd) &&
        /[A-Z]/.test(pwd) &&
        /[0-9]/.test(pwd) &&
        /[!@#$%^&*()_+\-=~]/.test(pwd)
      ) break;
    }
    return pwd;
  }

  useEffect(() => {
    if (!token) return;
    const fetchStudents = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        params.set("page", String(currentPage))
        params.set("limit", String(pageSize))
        if (search.trim()) params.set("search", search.trim())
        if (school !== "all") params.set("school", school)
        if (field !== "all") params.set("field", field)
        if (status !== "all") params.set("status", status)
        const res = await fetch(`${API_BASE_URL}/api/students/all?${params.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (!res.ok) throw new Error("Erreur lors du chargement des étudiants.")
        const data = await res.json()
        // data.data doit être un tableau, data.total le total
        const parsed = z.array(studentSchema).safeParse(data.data)
        if (!parsed.success) throw new Error("Format de données invalide.")
        setStudents(parsed.data)
        setTotalStudents(data.total || parsed.data.length)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue")
      } finally {
        setIsLoading(false)
      }
    }
    fetchStudents()
  }, [token, currentPage, search, school, field, status])

  useEffect(() => {
    if (editStudent) {
      setEditSchool(editStudent.school);
      setEditField(editStudent.field);
    }
  }, [editStudent])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setImportFile(e.target.files[0]);
      setImportError(null);
      setImportSuccess(null);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImportFile(e.dataTransfer.files[0]);
      setImportError(null);
      setImportSuccess(null);
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (!isDragging) setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  async function handleImportUpload() {
    if (!importFile) return;
    setImportLoading(true);
    setImportError(null);
    setImportSuccess(null);
    try {
      const formData = new FormData();
      formData.append("file", importFile);
      const res = await fetch(`${API_BASE_URL}/api/students/import`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Erreur lors de l'import du fichier.");
      }
      setImportSuccess("Importation réussie !");
      setImportFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setImportError(err.message);
    } finally {
      setImportLoading(false);
    }
  }

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
            <Dialog open={showAdd} onOpenChange={v => { setShowAdd(v); if (!v) { setAddFullName(""); setAddMatricule(""); setAddEmail(""); setAddPhone(""); setAddSchool(""); setAddCurrentYear(""); setAddField(""); setAddFieldOption(""); setAddPaid(0); setAddDebt(0); setAddPassword(""); setAddError(""); } }}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  Ajouter un étudiant
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-2xl h-[90vh] sm:max-w-3xl md:max-w-4xl p-0 overflow-auto">
                <DialogHeader className="bg-gray-50 px-6 py-4 border-b">
                  <DialogTitle className="text-lg">Ajouter un nouvel étudiant</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations de l'étudiant ci-dessous.
                  </DialogDescription>
                </DialogHeader>
                <form
                  className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsAdding(true);
                    setAddError("");
                    // Validation
                    if (!addFullName || !addMatricule || !addEmail || !addSchool || !addCurrentYear || !addField || !addPassword) {
                      setAddError("Veuillez remplir tous les champs obligatoires.");
                      setIsAdding(false);
                      return;
                    }
                    try {
                      const res = await fetch(`${API_BASE_URL}/api/students`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          full_name: addFullName.trim(),
                          matricule: addMatricule.trim(),
                          email: addEmail.trim(),
                          phone: addPhone.trim(),
                          school: addSchool.toUpperCase(),
                          current_year: addCurrentYear.trim(),
                          field: addField.toUpperCase(),
                          field_option: addFieldOption.trim(),
                          paid: Number(addPaid),
                          debt: Number(addDebt),
                          password: addPassword,
                        }),
                      });
                      let data: any = {};
                      try { data = await res.json(); } catch {}
                      if (!res.ok) {
                        const backendMsg = data?.message || "Erreur lors de l'ajout de l'étudiant.";
                        setAddError(backendMsg);
                        toast({ title: "Erreur", description: backendMsg, variant: "destructive" });
                        setIsAdding(false);
                        return;
                      }
                      toast({ title: "Étudiant ajouté", description: "L'étudiant a été ajouté avec succès.", variant: "success" });
                      setShowAdd(false);
                      setAddFullName(""); setAddMatricule(""); setAddEmail(""); setAddPhone(""); setAddSchool(""); setAddCurrentYear(""); setAddField(""); setAddFieldOption(""); setAddPaid(0); setAddDebt(0); setAddPassword(""); setAddError("");
                      setCurrentPage(1);
                    } catch (err) {
                      setAddError(err instanceof Error ? err.message : "Erreur inconnue");
                      toast({ title: "Erreur", description: err instanceof Error ? err.message : "Erreur inconnue", variant: "destructive" });
                    } finally {
                      setIsAdding(false);
                    }
                  }}
                >
                  {addError && (
                    <div className="text-red-600 bg-red-100 border border-red-200 rounded px-3 py-2 text-sm font-medium md:col-span-2">
                      {addError}
                    </div>
                  )}
                  <div>
                    <Label htmlFor="add-full_name">Nom complet</Label>
                    <Input id="add-full_name" name="add-full_name" value={addFullName} onChange={e => setAddFullName(e.target.value)} required disabled={isAdding} />
                  </div>
                  <div>
                    <Label htmlFor="add-matricule">Matricule</Label>
                    <Input id="add-matricule" name="add-matricule" value={addMatricule} onChange={e => setAddMatricule(e.target.value)} required disabled={isAdding} />
                  </div>
                  <div>
                    <Label htmlFor="add-email">Email</Label>
                    <Input id="add-email" name="add-email" type="email" value={addEmail} onChange={e => setAddEmail(e.target.value)} required disabled={isAdding} />
                  </div>
                  <div>
                    <Label htmlFor="add-phone">Téléphone</Label>
                    <Input id="add-phone" name="add-phone" value={addPhone} onChange={e => setAddPhone(e.target.value)} disabled={isAdding} />
                  </div>
                  <div>
                    <Label htmlFor="add-school">École</Label>
                    <Select value={addSchool} onValueChange={setAddSchool} disabled={isAdding}>
                      <SelectTrigger id="add-school" name="add-school">
                        <SelectValue placeholder="Sélectionner une école" />
                      </SelectTrigger>
                      <SelectContent>
                        {SCHOOLS_LIST.map(s => (
                          <SelectItem key={s.toLowerCase()} value={s.toLowerCase()}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="add-current_year">Niveau</Label>
                    <Input id="add-current_year" name="add-current_year" value={addCurrentYear} onChange={e => setAddCurrentYear(e.target.value)} required disabled={isAdding} />
                  </div>
                  <div>
                    <Label htmlFor="add-field">Filière</Label>
                    <Select value={addField} onValueChange={setAddField} disabled={isAdding}>
                      <SelectTrigger id="add-field" name="add-field">
                        <SelectValue placeholder="Sélectionner une filière" />
                      </SelectTrigger>
                      <SelectContent>
                        {FIELDS_LIST.map(f => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="add-field_option">Option</Label>
                    <Input id="add-field_option" name="add-field_option" value={addFieldOption} onChange={e => setAddFieldOption(e.target.value)} disabled={isAdding} />
                  </div>
                  <div className="relative flex flex-col gap-1 md:col-span-2">
                    <Label htmlFor="add-password">Mot de passe</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="add-password"
                        name="add-password"
                        type={showAddPassword ? "text" : "password"}
                        autoComplete="new-password"
                        ref={addPasswordInputRef}
                        className="flex-1"
                        value={addPassword}
                        onChange={e => setAddPassword(e.target.value)}
                        required
                        disabled={isAdding}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title={showAddPassword ? "Masquer" : "Afficher"}
                        onClick={() => setShowAddPassword(v => !v)}
                        tabIndex={-1}
                      >
                        {showAddPassword ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        title="Générer un mot de passe sécurisé"
                        onClick={() => {
                          const pwd = generatePassword();
                          setAddPassword(pwd);
                          if (addPasswordInputRef.current) addPasswordInputRef.current.value = pwd;
                          setShowAddPassword(true);
                          toast({ title: "Mot de passe généré", description: pwd, variant: "default" });
                        }}
                        tabIndex={-1}
                      >
                        <span className="font-bold">⚡</span>
                      </Button>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">8+ caractères, majuscule, minuscule, chiffre, symbole</span>
                  </div>
                  <div>
                    <Label htmlFor="add-paid">Montant payé (FCFA)</Label>
                    <Input id="add-paid" name="add-paid" type="number" min={0} value={addPaid} onChange={e => setAddPaid(Number(e.target.value))} required disabled={isAdding} />
                  </div>
                  <div>
                    <Label htmlFor="add-debt">Dette (FCFA)</Label>
                    <Input id="add-debt" name="add-debt" type="number" min={0} value={addDebt} onChange={e => setAddDebt(Number(e.target.value))} required disabled={isAdding} />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                    <Button type="button" variant="outline" onClick={() => setShowAdd(false)} disabled={isAdding}>Annuler</Button>
                    <Button type="submit" disabled={isAdding}>Enregistrer</Button>
                  </div>
                </form>
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
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${importFile ? 'border-green-500 bg-green-50' : isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 bg-gray-50 hover:border-primary/60'}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={e => {
                      if (!importFile) {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }
                    }}
                    style={{ minHeight: 120 }}
                    tabIndex={0}
                    role="button"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    {importFile ? (
                      <div>
                        <p className="font-medium">Fichier sélectionné : {importFile.name}</p>
                        <Button
                          onClick={e => { e.stopPropagation(); handleImportUpload(); }}
                          disabled={importLoading}
                          className="mt-2"
                        >
                          {importLoading ? "Import en cours..." : "Importer"}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          Glissez-déposez votre fichier ici ou cliquez sur "Parcourir"
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                        >
                          Parcourir
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          Formats acceptés: .csv, .xlsx 
                        </p>
                      </div>
                    )}
                    {importError && <p className="text-red-600 mt-2">{importError}</p>}
                    {importSuccess && <p className="text-green-600 mt-2">{importSuccess}</p>}
                  </div>
                  <div>
                    <a href="#" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      Télécharger le modèle de fichier
                    </a>
                  </div>
                </div>
                <DialogFooter className="justify-start">
                  {/* Le bouton Importer est dans la zone de drop maintenant */}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={status} onValueChange={v => { setCurrentPage(1); setStatus(v) }} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="up-to-date">À jour</TabsTrigger>
              <TabsTrigger value="late">En retard</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher par nom ou matricule..."
                className="pl-8"
                value={search}
                onChange={e => {
                  setCurrentPage(1)
                  setSearch(e.target.value)
                }}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:flex md:w-auto">
              <Select value={school} onValueChange={v => { setCurrentPage(1); setSchool(v) }}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="École" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les écoles</SelectItem>
                  {SCHOOLS_LIST.map(s => (
                    <SelectItem key={s.toLowerCase()} value={s.toLowerCase()}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={field} onValueChange={v => { setCurrentPage(1); setField(v) }}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filière" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les filières</SelectItem>
                  {FIELDS_LIST.map(f => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
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
                  <TableRow key={student.student_id} className="[&_td]:whitespace-nowrap">
                    <TableCell className="font-medium">{student.full_name}</TableCell>
                    <TableCell>{student.matricule}</TableCell>
                    <TableCell>{student.school}</TableCell>
                    <TableCell>{student.current_year}</TableCell>
                    <TableCell>{student.field}</TableCell>
                    <TableCell>
                      {student.on_time ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">À jour</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">En retard</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right flex justify-end gap-1">
                      <Button variant="ghost" size="icon" title="Voir les détails" onClick={() => { setSelectedStudent(student); setShowDetails(true); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Modifier" onClick={() => { setEditStudent(student); setShowEdit(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        title="Supprimer"
                        onClick={() => { setDeleteStudent(student); setShowDelete(true); }}
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
          <div className="grid gap-4 md:hidden">
            {students.map((student) => (
              <Card key={student.student_id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-base leading-tight">{student.full_name}</CardTitle>
                    <CardDescription>{student.matricule}</CardDescription>
                  </div>
                  <div>
                    {student.on_time ? <Badge className="bg-green-100 text-green-800 hover:bg-green-100">À jour</Badge> : <Badge className="bg-red-100 text-red-800 hover:bg-red-100">En retard</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="px-4 pt-0 pb-2 text-sm text-muted-foreground space-y-1">
                  <p>École: {student.school}</p>
                  <p>Niveau: {student.current_year}</p>
                  <p>Filière: {student.field}</p>
                </CardContent>
                <CardFooter className="p-2 flex items-stretch gap-2 sm:flex-row sm:justify-start border-t">
                  <Button variant="ghost" size="sm" className="h-8" onClick={() => { setSelectedStudent(student); setShowDetails(true); }}>
                    <Eye className="h-4 w-4 mr-1" /> Détails
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8" onClick={() => { setEditStudent(student); setShowEdit(true); }}>
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
            <div className="text-sm text-muted-foreground">
              Affichage de {students.length} étudiants sur {totalStudents}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Précédent
              </Button>
              <span className="text-sm">Page {currentPage}</span>
              <Button
                variant="outline"
                size="sm"
                disabled={students.length < pageSize}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Suivant
              </Button>
            </div>
          </div>
        </CardContent>
        {/* Missing </Card> was here, moved below */}
      </Card>
      </div> {/* Close padding wrapper */}

      {/* Student Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          <DialogHeader className="bg-gray-50 px-6 py-4 border-b">
            <DialogTitle className="text-lg">Informations de l'étudiant</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <div className="text-xs text-muted-foreground font-semibold mb-1">Nom complet</div>
                <div className="font-medium text-base">{selectedStudent.full_name}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-semibold mb-1">Matricule</div>
                <div className="font-mono text-base">{selectedStudent.matricule}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-semibold mb-1">Email</div>
                <div>{selectedStudent.email}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-semibold mb-1">Téléphone</div>
                <div>{selectedStudent.phone || <span className="italic text-muted-foreground">Non renseigné</span>}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-semibold mb-1">École</div>
                <div>{selectedStudent.school}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-semibold mb-1">Niveau</div>
                <div>{selectedStudent.current_year}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-semibold mb-1">Filière</div>
                <div>{selectedStudent.field}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-semibold mb-1">Option</div>
                <div>{selectedStudent.field_option || <span className="italic text-muted-foreground">Non renseigné</span>}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-semibold mb-1">Montant payé</div>
                <div className="text-green-700 font-bold">{selectedStudent.paid.toLocaleString()} FCFA</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-semibold mb-1">Dette</div>
                <div className="text-red-600 font-bold">{selectedStudent.debt.toLocaleString()} FCFA</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-semibold mb-1">Statut</div>
                <div className={selectedStudent.on_time ? "text-green-700 font-semibold" : "text-red-600 font-semibold"}>
                  {selectedStudent.on_time ? "À jour" : "En retard"}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-semibold mb-1">Créé le</div>
                <div>{selectedStudent.createdAt ? new Date(selectedStudent.createdAt).toLocaleString() : <span className="italic text-muted-foreground">Non renseigné</span>}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-semibold mb-1">Mis à jour le</div>
                <div>{selectedStudent.updatedAt ? new Date(selectedStudent.updatedAt).toLocaleString() : <span className="italic text-muted-foreground">Non renseigné</span>}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Student Edit Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="bg-gray-50 px-6 py-4 border-b">
            <DialogTitle className="text-lg">Modifier l'étudiant</DialogTitle>
          </DialogHeader>
          {editStudent && (
            <form
              className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);
                const payload: any = {};
                const fields = [
                  ["full_name", "edit-full_name"],
                  ["matricule", "edit-matricule"],
                  ["email", "edit-email"],
                  ["phone", "edit-phone"],
                  ["current_year", "edit-current_year"],
                  ["field_option", "edit-field_option"],
                ];
                for (const [key, name] of fields) {
                  const value = formData.get(name)?.toString().trim();
                  if (value) payload[key] = value;
                }
                // school & field depuis le state, envoyés en MAJUSCULE
                if (editSchool) payload.school = editSchool.toUpperCase();
                if (editField) payload.field = editField.toUpperCase();
                // paid & debt: 0 est une valeur valide, donc on inclut même si 0
                const paidRaw = formData.get("edit-paid");
                if (paidRaw !== null && paidRaw !== "") payload.paid = Number(paidRaw);
                const debtRaw = formData.get("edit-debt");
                if (debtRaw !== null && debtRaw !== "") payload.debt = Number(debtRaw);
                const password = formData.get("edit-password")?.toString();
                if (password) payload.password = password;
                try {
                  const res = await fetch(`${API_BASE_URL}/api/students/${editStudent.student_id}`, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                  });
                  if (!res.ok) throw new Error("Erreur lors de la mise à jour");
                  toast({ title: "Succès", description: "Étudiant mis à jour avec succès", variant: "success" });
                  setShowEdit(false);
                  setCurrentPage(1);
                } catch (err) {
                  toast({ title: "Erreur", description: err instanceof Error ? err.message : "Erreur inconnue", variant: "destructive" });
                }
              }}
            >
              <div>
                <Label htmlFor="edit-full_name">Nom complet</Label>
                <Input id="edit-full_name" name="edit-full_name" defaultValue={editStudent.full_name} />
              </div>
              <div>
                <Label htmlFor="edit-matricule">Matricule</Label>
                <Input id="edit-matricule" name="edit-matricule" defaultValue={editStudent.matricule} />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" name="edit-email" type="email" defaultValue={editStudent.email} />
              </div>
              <div>
                <Label htmlFor="edit-phone">Téléphone</Label>
                <Input id="edit-phone" name="edit-phone" defaultValue={editStudent.phone || ''} />
              </div>
              <div>
                <Label htmlFor="edit-school">École</Label>
                <Select value={editSchool} onValueChange={setEditSchool}>
                  <SelectTrigger id="edit-school" name="edit-school">
                    <SelectValue placeholder="Sélectionner une école" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHOOLS_LIST.map(s => (
                      <SelectItem key={s.toLowerCase()} value={s.toLowerCase()}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-current_year">Niveau</Label>
                <Input id="edit-current_year" name="edit-current_year" defaultValue={editStudent.current_year} />
              </div>
              <div>
                <Label htmlFor="edit-field">Filière</Label>
                <Select value={editField} onValueChange={setEditField}>
                  <SelectTrigger id="edit-field" name="edit-field">
                    <SelectValue placeholder="Sélectionner une filière" />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELDS_LIST.map(f => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-field_option">Option</Label>
                <Input id="edit-field_option" name="edit-field_option" defaultValue={editStudent.field_option || ''} />
              </div>
              <div className="relative flex flex-col gap-1">
                <Label htmlFor="edit-password">Mot de passe (laisser vide pour ne pas changer)</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="edit-password"
                    name="edit-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    ref={passwordInputRef}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title={showPassword ? "Masquer" : "Afficher"}
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    title="Générer un mot de passe sécurisé"
                    onClick={() => {
                      const pwd = generatePassword();
                      if (passwordInputRef.current) passwordInputRef.current.value = pwd;
                      setShowPassword(true);
                      toast({ title: "Mot de passe généré", description: pwd, variant: "default" });
                    }}
                    tabIndex={-1}
                  >
                    <span className="font-bold">⚡</span>
                  </Button>
                </div>
                <span className="text-xs text-muted-foreground mt-1">8+ caractères, majuscule, minuscule, chiffre, symbole</span>
              </div>
              <div>
                <Label htmlFor="edit-paid">Montant payé (FCFA)</Label>
                <Input id="edit-paid" name="edit-paid" type="number" min={0} defaultValue={editStudent.paid} />
              </div>
              <div>
                <Label htmlFor="edit-debt">Dette (FCFA)</Label>
                <Input id="edit-debt" name="edit-debt" type="number" min={0} defaultValue={editStudent.debt} />
              </div>
              {/* Ajoutez d'autres champs si besoin */}
              <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setShowEdit(false)}>Annuler</Button>
                <Button type="submit">Enregistrer</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Student Delete Confirmation Dialog */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <DialogHeader className="bg-red-50 px-6 py-4 border-b">
            <DialogTitle className="text-lg text-red-700 flex items-center gap-2">
              <Trash className="h-5 w-5 text-red-500" /> Suppression d'un étudiant
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-red-700">
              <span className="font-bold">Opération irréversible !</span><br />
              L'étudiant <span className="font-semibold">{deleteStudent?.full_name}</span> et <span className="font-semibold">tous ses paiements</span> seront définitivement supprimés.<br />
              Veuillez saisir votre mot de passe administrateur pour confirmer.
            </DialogDescription>
          </DialogHeader>
          <form
            className="px-6 py-5 flex flex-col gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!deleteStudent) return;
              setIsDeleting(true);
              setDeleteError("");
              try {
                console.log(deletePassword)
                const res = await fetch(`${API_BASE_URL}/api/students/${deleteStudent.student_id}`, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ password: deletePassword }),
                });
                let data: any = {};
                try {
                  data = await res.json();
                } catch {}
                if (!res.ok) {
                  // Affiche le message du backend si présent, sinon message générique
                  const backendMsg = data?.message || "Échec de la suppression. Mot de passe incorrect ou erreur serveur.";
                  setDeleteError(backendMsg);
                  toast({ title: "Erreur", description: backendMsg, variant: "destructive" });
                  return;
                }
                toast({ title: "Étudiant supprimé", description: `L'étudiant et ses paiements ont été supprimés.`, variant: "success" });
                setShowDelete(false);
                setDeletePassword("");
                setDeleteStudent(null);
                setCurrentPage(1);
              } catch (err) {
                setDeleteError(err instanceof Error ? err.message : "Erreur inconnue");
                toast({ title: "Erreur", description: err instanceof Error ? err.message : "Erreur inconnue", variant: "destructive" });
              } finally {
                setIsDeleting(false);
              }
            }}
          >
            {deleteError && (
              <div className="text-red-600 bg-red-100 border border-red-200 rounded px-3 py-2 text-sm font-medium">
                {deleteError}
              </div>
            )}
            <div>
              <Label htmlFor="delete-password">Mot de passe administrateur</Label>
              <Input
                id="delete-password"
                type="password"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
                autoFocus
                autoComplete="current-password"
                placeholder="Mot de passe..."
                disabled={isDeleting}
                className="mt-1"
              />
            </div>
            <DialogFooter className="flex flex-row gap-2 justify-end mt-2">
              <Button type="button" variant="outline" onClick={() => { setShowDelete(false); setDeletePassword(""); setDeleteError(""); }} disabled={isDeleting}>Annuler</Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={!deletePassword || isDeleting}
              >
                Supprimer définitivement
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
