// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint'],
  $development: {
    modules: ['@nuxtjs/supabase'],
  },
  imports: {
    dirs: ['app/types/**/*.ts', 'app/types/*.ts', 'app/services/**/*.ts'],
  },
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: true,
      },
    },
  },
});
