import { z } from "zod";

const envSchema = z.object({
  VITE_NODE_ENV: z.string().default("local"),
  VITE_API_URL: z.url(),
  VITE_COOKIE_EXPIRES_DAYS: z.coerce.number().default(7),
});

const parsed = envSchema.safeParse(import.meta.env);
if (!parsed.success) {
  throw new Error(`Invalid environment variables:\n${parsed.error.message}`);
}

export const env = {
  nodeEnv: parsed.data.VITE_NODE_ENV,
  apiUrl: parsed.data.VITE_API_URL,
  cookieExpiresDays: parsed.data.VITE_COOKIE_EXPIRES_DAYS,
};
