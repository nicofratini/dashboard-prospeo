import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
  extends: ['..'],
  modules: ['@nuxt/eslint'],

  compatibilityDate: '2025-02-24',

  eslint: {
    config: {
      // Use the generated ESLint config for lint root project as well
      rootDir: fileURLToPath(new URL('..', import.meta.url)),
    },
  },
});
