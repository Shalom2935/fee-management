import { z } from 'zod';

export const AdminRoleEnum = z.enum(['admin', 'delegate']);
export const LogoutDurationEnum = z.enum(['15 minutes', '30 minutes', '1 hour', '2 hours', 'never']);

export const adminSchema = z.object({
  admin_id: z.number().int().optional(),
  email: z.string().email().max(100),
  password: z.string().max(255),
  full_name: z.string().max(100),
  title: z.string().max(50),
  role: AdminRoleEnum,
  phone_number: z.string().max(20).regex(/^\d+$/),
  school: z.string().max(100).nullable().optional(),
  logout_time: LogoutDurationEnum.nullable().optional(),
  new_payment_notification: z.boolean(),
  security_alert_notification: z.boolean(),
});

export type Admin = z.infer<typeof adminSchema>;