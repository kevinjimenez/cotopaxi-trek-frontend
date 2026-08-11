import { z } from 'zod';

export const companyFormSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  whatsapp: z.string().min(1),
  logoUrl: z.string().optional(),
  primaryColor: z.string().optional(),
  instagram: z.string().optional(),
  status: z.boolean().optional(),
});

export type CompanyFormSchema = z.infer<typeof companyFormSchema>;
