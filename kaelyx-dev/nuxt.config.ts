// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content', 
    '@nuxt/image', 
    '@nuxt/scripts'
  ],
  content: {
    experimental: { sqliteConnector: 'native' }
  },
  css: ['~/assets/scss/base.scss'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})
