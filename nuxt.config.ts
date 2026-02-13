// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  dir: {
    public: 'src/public'
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt'
  ],
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:4000',
    },
  },
  vite: {
    optimizeDeps: {
      include: ['vue', '@vueuse/core']
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    },
    server: {
      hmr: {
        protocol: 'ws',
        host: 'localhost'
      }
    }
  },
  build: {
    transpile: []
  },
  nitro: {
    devServer: {
      watch: [],
    },
    experimental: {
      wasm: true
    }
  },
  experimental: {
    watcher: 'chokidar',
  },
  ssr: true,
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap' },
      ],
    }
  }
})
