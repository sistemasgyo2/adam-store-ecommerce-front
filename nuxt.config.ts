import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: true,
  modules: [
    'shadcn-nuxt',
    '@nuxt/eslint',
    '@nuxt/image',
    '@pinia/nuxt',
    'shadcn-nuxt',
    'nuxt-auth-sanctum',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-sanctum-precognition'
  ],
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'es',
        class: 'scroll-smooth',
      },
      bodyAttrs: {
        class: 'antialiased',
      },
      link: [
        {
          rel: 'icon',
          href: '/favicon.ico',
        },
        {
          rel: 'shortcut icon',
          href: '/favicon.ico',
        },
        {
          rel: 'apple-touch-icon',
          href: '/favicon.ico',
        },
      ],
    },
  },
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  nitro: {
    compressPublicAssets: true,
  },
  runtimeConfig: {
    public: {
      culqiPublicKey: process.env.NUXT_PUBLIC_CULQI_PUBLIC_KEY
    }
  },
  shadcn: {
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  sanctum: {
    baseUrl: process.env.NUXT_BASE_URL,
    redirect: {
      onGuestOnly: '/dashboard',
      onLogin: '/dashboard',
    },
    // logLevel: 5,
  },
  piniaPluginPersistedstate: {
    storage: 'sessionStorage',
    debug: true,
  },
  routeRules: {
    // '/': { prerender: true },
    '/cart': { ssr: false },
    '/checkout': { ssr: false },
    '/login': { ssr: false },
    '/register': { ssr: false },
    '/forgot-password': { ssr: false },
    '/reset-password/*': { ssr: false },
    '/dashboard': { ssr: false },
    '/payment-success': { ssr: false },
  },
  image: {
    quality: 80,
    format: ['webp']
  },
})