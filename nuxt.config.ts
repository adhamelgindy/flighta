// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
  ],
  runtimeConfig: {
    public: {
      GPT_API_KEY: process.env.GPT_API_KEY ?? '',
      EMAILJS_API_KEY: process.env.EMAILJS_API_KEY ?? '',
    }
  },
  vite: {
    build: {
      rollupOptions: {
        external: ['@emailjs/browser']
      }
    }
  }
})
