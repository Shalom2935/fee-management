"use client"

import { useState, ChangeEvent, FormEvent, useRef, DragEvent, useEffect } from "react" // Import useEffect
import { z } from "zod" // Import z
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Upload, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { useToast } from "@/hooks/use-toast"
import { paymentSchema, PaymentFormErrors, MAX_NOTES_LENGTH } from "@/lib/schemas/payment" // Import the schema, error type, and max length
import Image from "next/image"

export default function PaymentSubmission() {
  const [amount, setAmount] = useState<string>("")
  const [receiptNumber, setReceiptNumber] = useState<string>("")
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [notes, setNotes] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false) // State for drag-over visual feedback
  // Use a more structured error state for Zod errors
  const [formErrors, setFormErrors] = useState<PaymentFormErrors | null>(null)
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false) // State for success message
  const [isTouchDevice, setIsTouchDevice] = useState(false) // State for touch device detection
  const { token } = useAuth()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null) // Ref for the hidden file input
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Detect touch device on component mount (client-side only)
  useEffect(() => {
    const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(touchSupport);
  }, []);

  // Nettoie l'URL de prévisualisation quand le fichier change ou le composant démonte
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      processFile(file)
    }
  }

  // Nettoie le champ fichier avant d'en sélectionner un nouveau
  const processFile = (file: File | null) => {
    setReceiptFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    if (file) {
      setReceiptFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
    if (formErrors?.fieldErrors.receiptFile) {
      setFormErrors(prev => {
        if (!prev) return null
        return {
          formErrors: prev.formErrors,
          fieldErrors: {
            ...prev.fieldErrors,
            receiptFile: undefined
          }
        }
      })
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormErrors(null)
    setSubmissionSuccess(false)

    // Convertit le montant en nombre pour la validation
    const numericAmount = Number(amount.replace(/\s/g, ""))

    // --- Zod Validation ---
    const validationResult = paymentSchema.safeParse({
      amount: numericAmount,
      receiptNumber,
      notes,
      receiptFile,
    })

    if (!validationResult.success) {
      const errors = validationResult.error.flatten()
      setFormErrors(errors)
      toast({
        variant: "destructive",
        title: "Champs manquants",
        description: "Le montant, le numéro de reçu et la preuve de paiement sont requis.",
      })
      return
    }
    // --- End Zod Validation ---

    const validatedData = validationResult.data

    if (!token) {
      toast({
        variant: "destructive",
        title: "Erreur d'authentification",
        description: "Impossible de soumettre le paiement sans être connecté.",
      })
      return
    }

    setIsLoading(true)

    const formData = new FormData()
    formData.append("amount", numericAmount.toString())
    formData.append("reference", validatedData.receiptNumber)
    formData.append("receiptFile", validatedData.receiptFile)
    if (validatedData.notes) {
      formData.append("note", notes)
    }

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/submit`
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      // Affiche un message d'erreur unique pour toute erreur serveur
      if (!response.ok) {
        throw new Error("Erreur lors de la soumission du formulaire.")
      }

      toast({
        title: "Paiement soumis",
        description: "Votre paiement a été soumis avec succès et est en attente de validation.",
      })

      setSubmissionSuccess(true)
      setAmount("")
      setReceiptNumber("")
      setReceiptFile(null)
      setNotes("")
      resetFileInput()
    } catch (err) {
      setFormErrors({ formErrors: ["Erreur lors de la soumission du formulaire."], fieldErrors: {} })
      toast({
        variant: "destructive",
        title: "Échec de la soumission",
        description: "Erreur lors de la soumission du formulaire.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetFileInput = () => {
    setReceiptFile(null);
    setFormErrors(prev => {
        if (!prev) return null; // If no errors existed, return null
        // Otherwise, return previous errors but clear the file one
        return {
          formErrors: prev.formErrors,
          fieldErrors: {
            ...prev.fieldErrors,
            receiptFile: undefined
          }
        };
      });
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input visually
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Necessary to allow dropping
    event.stopPropagation();
    if (!isTouchDevice) { // Only allow drag over on non-touch devices
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isTouchDevice) {
      setIsDraggingOver(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isTouchDevice) return; // Ignore drop on touch devices

    setIsDraggingOver(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      processFile(event.dataTransfer.files[0]); // Process the dropped file
    }
  }

  const formatAmountInput = (value: string) => {
    // Retire tout sauf les chiffres
    const numeric = value.replace(/\D/g, "")
    // Ajoute un espace tous les 3 chiffres (français)
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  }

  return (
    <DashboardLayout>
      <div className="w-full md:px-6">
        <div className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <div className="flex-1">
              <AlertTitle className="text-blue-600">Information</AlertTitle>
              <AlertDescription className="mt-1 text-sm">
                Veuillez remplir ce formulaire pour soumettre un nouveau paiement. Assurez-vous de joindre une preuve de
                paiement valide.
              </AlertDescription>
            </div>
          </Alert>

          <form onSubmit={handleSubmit}>
            <Card className="w-full">
              <CardHeader className="space-y-2 px-4 sm:px-6">
                <CardTitle>Soumettre un paiement</CardTitle>
                <CardDescription>Entrez les détails de votre paiement et téléchargez votre reçu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 px-4 sm:px-6">
                {/* Display success message */}
                {submissionSuccess && (
                  <Alert className="bg-green-50 border-green-200 text-green-800">
                    {/* You might need to add a CheckCircle icon here if you have one */}
                    <AlertTitle>Succès</AlertTitle>
                    <AlertDescription>Votre paiement a été soumis avec succès et est en attente de validation.</AlertDescription>
                  </Alert>
                )}
                {/* Display general form errors */}
                {formErrors?.formErrors && formErrors.formErrors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>{formErrors.formErrors.join(', ')}</AlertDescription>
                  </Alert>
                )}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2 w-full">
                    <Label htmlFor="amount" className="text-sm font-medium">Montant (FCFA) *</Label>
                    <Input
                      id="amount"
                      type="text"
                      placeholder="Ex: 100 000"
                      className="h-10"
                      value={amount}
                      onChange={(e) => {
                        // Formatte dynamiquement l'affichage
                        const formatted = formatAmountInput(e.target.value)
                        setAmount(formatted)
                      }}
                      inputMode="numeric"
                      pattern="[0-9 ]*"
                      disabled={isLoading}
                    />
                    {/* Display field-specific error */}
                    {formErrors?.fieldErrors.amount && (
                      <p className="text-sm text-destructive mt-1">{formErrors.fieldErrors.amount.join(', ')}</p>
                    )}
                  </div>
                  <div className="space-y-2 w-full">
                    <Label htmlFor="receipt-number" className="text-sm font-medium">Numéro de reçu *</Label>
                    <Input
                      id="receipt-number"
                      placeholder="Ex: REF-12345"
                      className="h-10"
                      value={receiptNumber}
                      onChange={(e) => setReceiptNumber(e.target.value)}
                      // required // Zod handles requirement
                      disabled={isLoading}
                    />
                    {/* Display field-specific error */}
                    {formErrors?.fieldErrors.receiptNumber && (
                      <p className="text-sm text-destructive mt-1">{formErrors.fieldErrors.receiptNumber.join(', ')}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="receipt-upload-button" className="text-sm font-medium">Preuve de paiement *</Label>
                  {/* Drop Zone Area */}
                  <div
                    className={`
                      border-2 border-dashed rounded-md p-4 sm:p-6 transition-colors duration-200 ease-in-out cursor-pointer
                      ${isDraggingOver ? 'border-primary bg-primary/10' : 'border-border'}
                      ${!isTouchDevice ? 'hover:border-primary/50' : ''}
                      ${isLoading ? 'cursor-not-allowed opacity-70' : ''}
                    `}
                    onDragOver={!isTouchDevice ? handleDragOver : undefined} // Disable drag/drop on touch
                    onDragLeave={!isTouchDevice ? handleDragLeave : undefined}
                    onDrop={!isTouchDevice ? handleDrop : undefined}
                    onClick={!isLoading ? () => fileInputRef.current?.click() : undefined} // Always allow click
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground mb-2">
                        {receiptFile ? receiptFile.name : (isTouchDevice ? "Appuyez pour choisir" : "Glissez-déposez votre reçu ici ou")}
                      </p>
                      <Button type="button" variant="outline" size="sm" className="h-9 pointer-events-none" disabled={isLoading}>
                        {isTouchDevice ? "Choisir depuis l'appareil" : "Parcourir les fichiers"}
                      </Button>
                      {/* Hidden file input */}
                      <Input ref={fileInputRef} id="receipt-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/jpg, application/pdf" disabled={isLoading} />
                      <p className="text-xs text-muted-foreground mt-3">PNG, JPG ou PDF (max. 5MB)</p>
                    </div>
                    {/* Affichage de la prévisualisation */}
                    {previewUrl && (
                      <div className="mt-4 flex flex-col items-center">
                        {receiptFile?.type.startsWith("image/") ? (
                          <Image
                            src={previewUrl}
                            alt="Prévisualisation du reçu"
                            width={220}
                            height={220}
                            className="rounded shadow border"
                          />
                        ) : receiptFile?.type === "application/pdf" ? (
                          <iframe
                            src={previewUrl}
                            title="Prévisualisation PDF"
                            className="w-full h-48 border rounded"
                            style={{ minHeight: 200 }}
                          />
                        ) : null}
                      </div>
                    )}
                    {/* ...erreurs éventuelles... */}
                    {formErrors?.fieldErrors.receiptFile && (
                      <p className="text-sm text-destructive mt-1">{formErrors.fieldErrors.receiptFile.join(', ')}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium">Notes (optionnel)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Informations supplémentaires concernant ce paiement..."
                    className="min-h-[100px] resize-none"
                    value={notes}
                    maxLength={MAX_NOTES_LENGTH} // Limit the length of notes
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {notes.length} / {MAX_NOTES_LENGTH}
                  </p>
                  {/* Display field-specific error */}
                  {formErrors?.fieldErrors.notes && (
                    <p className="text-sm text-destructive mt-1">{formErrors.fieldErrors.notes.join(', ')}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="px-4 sm:px-6 pt-2 pb-6">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isLoading ? "Soumission en cours..." : "Soumettre le paiement"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
