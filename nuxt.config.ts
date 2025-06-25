// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
    '@formkit/auto-animate/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@vee-validate/nuxt',
    'shadcn-nuxt',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@unlok-co/nuxt-stripe',
    '@nuxtjs/supabase',
    '@nuxtjs/seo',
    '@nuxt/scripts',
    '@nuxthub/core',
  ],
  /*  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  }, */
  $development: {
    routeRules: {
      '/**': {
        prerender: false,
        isr: false,
      },
    },
    logLevel: 'verbose',
    ogImage: {
      enabled: false,
    },
    robots: {
      enabled: false,
    },
    sitemap: {
      enabled: false,
    },
  },
  $production: {
    icon: {
      clientBundle: {
        scan: true,
        sizeLimitKb: 512,
      },
    },
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  imports: {
    dirs: ['types/**/*.ts', 'types/*.ts'],
  },
  devtools: { enabled: true },
  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },
  site: {
    url: process.env.BASE_URL || 'http://localhost:3000',
    name: 'Prospimmo - The ultimate conversational agent for your lead qualification',
    description: 'Prospimmo - The ultimate conversational agent for your lead qualification',
    defaultLocale: 'en',
  },
  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark',
  },
  runtimeConfig: {
    sendEmailHookSecret: '',
    stripeWebhookSecret: '',
    lemonsqueezyApiKey: '',
    lemonsqueezyWebhookSecret: '',
    githubToken: '',
    openaiApiKey: process.env.OPENAI_API_KEY,
    replicateApiKey: process.env.REPLICATE_API_TOKEN,
    mailing: {
      provider: 'resend', // can be overridden by NUXT_MAILING_PROVIDER
      resendApiKey: '', // can be overridden by NUXT_MAILING_RESEND_API_KEY
      resendAudienceId: '', // can be overridden by NUXT_MAILING_RESEND_AUDIENCE_ID
    },
    public: {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    },
  },
  build: {
    transpile: ['@vueuse/motion'],
  },
  routeRules: {
    '/': {
      prerender: true,
      isr: true,
    },
    '/license': {
      prerender: true,
      isr: true,
    },
    '/privacy-policy': {
      prerender: true,
      isr: true,
    },
    '/terms-of-service': {
      prerender: true,
      isr: true,
    },
    '/faq': {
      prerender: true,
      isr: true,
    },
    '/docs/**': {
      prerender: true,
      isr: true,
    },
    '/blog/**': {
      prerender: true,
      isr: true,
    },
    '/changelog/**': {
      prerender: true,
      isr: true,
    },
    '/dashboard/**': {
      ssr: false,
    },
    '/dashboard/settings': {
      redirect: '/dashboard/settings/general',
    },
    '/dashboard': {
      redirect: '/dashboard/cards',
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  experimental: {
    viewTransition: true,
    typedPages: true,
  },
  compatibilityDate: '2024-04-03',
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: true,
      },
    },
  },
  ogImage: {
    enabled: false,
  },
  robots: {
    enabled: true,
    disallow: ['/dashboard'],
  },
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },
  stripe: {
    server: {
      key: process.env.STRIPE_SERVER_SECRET_KEY,
    },
  },
  supabase: {
    redirectOptions: {
      login: '/sign-in',
      callback: '/api/auth/callback',
      exclude: [
        '/',
        '/privacy-policy',
        '/terms-of-service',
        '/license',
        '/pricing',
        '/contact',
        '/faq',
        '/blog',
        '/blog/(.*)',
        '/changelog',
        '/changelog/(.*)',
        '/docs',
        '/docs/(.*)',
        '/sign-up',
        '/sign-up-confirmation',
        '/forgot-password',
        '/sign-in-otp',
        '/error',
        '/directory',
        '/directory/categories(/(.*)?)?',
        '/directory/tags(/(.*)?)?',
      ],
      saveRedirectToCookie: true,
    },
  },
});

// todo: remove ai package from the package.json
