import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:3001/api'  // API URL backend Express
    }
  },

  modules: ['@nuxt/ui', '@nuxt/eslint'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})