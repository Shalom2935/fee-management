import { z } from "zod"

export const studentSchema = z.object({
  student_id: z.number(),
  matricule: z.string(),
  email: z.string().email(),
  full_name: z.string(),
  school: z.string(),
  current_year: z.number(),
  field: z.string(),
  phone: z.string().optional(),
  paid: z.number(),
  debt: z.number(),
  on_time: z.boolean(),
  field_option: z.any(),
  createdAt: z.any().optional(),
  updatedAt: z.any().optional(),
})

export type StudentData = z.infer<typeof studentSchema>