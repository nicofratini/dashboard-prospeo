// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
  ],
  components: {
    dirs: [
      {
        path: './components',
      },
    ],
  },
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
});
