import { env as _env } from './src/server/env.mjs';
import pkg from './next-i18next.config.js';

const { i18n } = pkg;
/**
 * Use generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  reactStrictMode: true,
  i18n,
});
