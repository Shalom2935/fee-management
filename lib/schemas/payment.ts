import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
];
export const MAX_NOTES_LENGTH = 100; // Export the max length

export const paymentSchema = z.object({
  amount: z.coerce // Coerce string input to number
    .number({ invalid_type_error: "Le montant doit être un nombre." })
    .positive({ message: "Le montant doit être positif." })
    .min(1, { message: "Le montant est requis." }), // Ensure it's not zero if required
  receiptNumber: z.string()
    .min(1, { message: "Le numéro de reçu est requis." })
    .max(100, { message: "Le numéro de reçu est trop long (max 100 caractères)." }),
  notes: z.string()
    .max(MAX_NOTES_LENGTH, { message: `Les notes sont trop longues (max ${MAX_NOTES_LENGTH} caractères).` })
    .optional(),
  receiptFile: z.instanceof(File, { message: "Une preuve de paiement est requise." })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `La taille du fichier ne doit pas dépasser ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    })
    .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), {
      message: "Type de fichier invalide. Veuillez choisir un fichier PNG, JPG, JPEG ou PDF.",
    }),
});

export const studentPaymentSchema = z.object({
  payment_id: z.number(),
  date: z.any(),
  amount: z.number(),
  reference: z.string(),
  status: z.enum(["approved", "pending", "rejected"]),
  rejectionReason: z.any().optional(),
  //fileUrl: z.string().url(), // URL du fichier reçu du backend
});

export type StudentPayment = z.infer<typeof studentPaymentSchema>;
// Inferred type for type safety
export type PaymentData = z.infer<typeof paymentSchema>;

// Type for flattened errors (useful for displaying errors per field)
export type PaymentFormErrors = z.inferFlattenedErrors<typeof paymentSchema>;