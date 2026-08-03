import { z } from 'zod';

const envSchema = z.object({
  VITE_NODE_ENV: z.string().default('local'),
  VITE_API_URL: z.url(),
});

const parsed = envSchema.safeParse(import.meta.env);
if (!parsed.success) {
  throw new Error(`Invalid environment variables:\n${parsed.error.message}`);
}

export const env = {
  nodeEnv: parsed.data.VITE_NODE_ENV,
  apiUrl: parsed.data.VITE_API_URL,
};
