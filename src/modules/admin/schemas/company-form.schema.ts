import { z } from 'zod';

export const companyFormSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  slug: z.string().min(1, 'El slug es obligatorio'),
  whatsapp: z.string().min(1, 'El whatsapp es obligatorio'),
  logoUrl: z.string().optional(),
  primaryColor: z.string().optional(),
  instagram: z.string().optional(),
  status: z.boolean().optional(),
});

export type CompanyFormSchema = z.infer<typeof companyFormSchema>;
