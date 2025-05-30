import { z } from "zod";

export const PaymentsHistorySchema = z.object({
  payment_id: z.number(),
  student: z.string(),
  school: z.string(),
  matricule: z.string(),
  amount: z.union([z.string(), z.number()]),
  date: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected"]),
  rejection_reason: z.string().optional(),
  //fileUrl: z.url(), // URL to the payment file (PDF/image)
});

export type PaymentsHistory = z.infer<typeof PaymentsHistorySchema>;

export const PaymentsHistoryArraySchema = z.array(PaymentsHistorySchema);
