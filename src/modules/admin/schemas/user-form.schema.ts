import { z } from 'zod';
import { bookingFormSchema } from './booking-form.schema';

export const userFormSchema = z.object({
  companyId: z.string().min(1),
  seasonId: z.coerce.number().positive().optional(),
  name: z.string().min(1),
  lastname: z.string().min(1),
  username: z.string().min(1).optional(),
  email: z.string().email('El email no es válido').optional(),
  phone: z.string().min(1).optional(),
  role: z.enum(['customer', 'admin', 'superadmin']).optional(),
  status: z.boolean().optional(),
  password: z.string().min(1),
  bookings: z.array(bookingFormSchema),
});

export type UserFormSchema = z.infer<typeof userFormSchema>;
