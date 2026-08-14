import { z } from 'zod';

export const seasonMountainFormSchema = z.object({
  mountainId: z.coerce.number().int().positive(),
  sortOrder: z.coerce.number().int().positive().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  price: z.coerce.number().positive(),
});

export type SeasonMountainFormSchema = z.infer<typeof seasonMountainFormSchema>;
