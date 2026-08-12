import { z } from 'zod';

export const bookingFormSchema = z.object({
  userId: z.string().optional(),
  seasonMountainId: z.coerce.number().int().positive(),
  createdBy: z.string().optional(),
  status: z.boolean().optional(),
  bookedAt: z.coerce.date().optional(),
});

export type BookingFormSchema = z.infer<typeof bookingFormSchema>;
