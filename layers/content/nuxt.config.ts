export default defineNuxtConfig({
  modules: ['@nuxt/content'],
  components: {
    dirs: [
      {
        path: './components/content',
        ignore: ['**/*.ts'],
        pathPrefix: false,
      },
    ],
  },
  devtools: { enabled: true },
  content: {
    build: {
      markdown: {
        toc: {
          depth: 3,
          searchDepth: 3,
        },
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
            sepia: 'monokai',
          },
          langs: ['json', 'js', 'ts', 'html', 'css', 'vue', 'diff', 'shell', 'markdown', 'yaml', 'bash', 'ini', 'sql'],
        },
      },
    },
    preview: {
      api: 'https://api.nuxt.studio',
    },
  },
  build: {
    transpile: ['shiki'],
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-07-05',

  typescript: {
    tsConfig: {
      compilerOptions: {
        baseUrl: '.',
      },
    },
  },
});
