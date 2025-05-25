import { z } from 'zod';

// Define ENUMs for role and logout_time to match your PSQL ENUMs
export const AdminRoleEnum = z.enum(['admin', 'delegate']);
export const LogoutDurationEnum = z.enum(['15 minutes', '30 minutes', '1 hour', '4 hours', 'never']);

// Base schema for common fields, used for creation and can be extended
export const AdminSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).max(255),
  password: z.string().min(1, { message: "Password is required" }).max(255), // Remember to handle hashing separately
  full_name: z.string().min(1, { message: "Full name is required" }).max(255),
  phone_number: z.string()
    .regex(/^237\d{8}$/, { message: "Phone number must start with 237 and be followed by 8-12 digits" }) // Adjust regex as needed
    .max(30),
  title: z.string().max(100),
  role: AdminRoleEnum,
  school: z.string().max(255).optional().nullable(), // School can be null
  logout_time: LogoutDurationEnum,
  new_payment_notification: z.boolean().default(true),
  security_alert_notification: z.boolean().default(true),
});

export type AdminData = z.infer<typeof AdminSchema>;