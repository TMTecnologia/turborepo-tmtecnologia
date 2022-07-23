// @ts-check
/**
 * Importing this file in `/next.config.mjs` will ensure the app isn't built with invalid env vars.
 * Use a `.mjs`-file to import files there.
 */
import { envSchema } from './env-schema.mjs';

const _env = envSchema.safeParse(process.env);

const formatErrors = (
  /** @type {import('zod').ZodFormattedError<Map<string,string>,string>} */
  errors
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && '_errors' in value)
        return `${name}: ${value._errors.join(', ')}\n`;
    })
    .filter(Boolean);

if (!_env.success) {
  // eslint-disable-next-line no-console
  console.error(
    '❌ Invalid environment variables:\n',
    ...formatErrors(_env.error.format())
  );
  process.exit(1);
}

export const env = _env.data;
