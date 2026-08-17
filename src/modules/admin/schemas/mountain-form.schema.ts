import { z } from "zod";

export const mountainFormSchema = z.object({
  companyId: z.string().min(1),
  name: z.string().min(1, "El nombre es obligatorio"),
  altitudeMeters: z.coerce.number().positive("La altitud debe ser un número positivo"),
  location: z.string().min(1, "La ubicación es obligatoria"),
  reference: z.string().min(1).optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  generalDescription: z.string().optional(),
  technicalDescription: z.string().optional(),
  status: z.boolean().optional(),
  imageUrl: z.string().optional(),
});

export type MountainFormSchema = z.infer<typeof mountainFormSchema>;
