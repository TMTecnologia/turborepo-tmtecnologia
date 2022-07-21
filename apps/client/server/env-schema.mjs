import { z } from 'zod';

export const envSchema = z.object({
  API_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']),
});
