import { z } from 'zod';
import { seasonMountainFormSchema } from './season-mountain-form.schema';

export const seasonFormSchema = z.object({
  companyId: z.string(),
  name: z.string().min(1, 'El nombre es obligatorio'),
  year: z.coerce.number().int(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  isCurrent: z.boolean().optional(),
  mountains: z.array(seasonMountainFormSchema),
});

export type SeasonFormSchema = z.infer<typeof seasonFormSchema>;
