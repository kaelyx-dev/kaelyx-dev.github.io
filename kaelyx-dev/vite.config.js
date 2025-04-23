import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@'       : fileURLToPath(new URL('./src', import.meta.url)),
      '@core'   : fileURLToPath(new URL('./src/components/core', import.meta.url)),
      '@module' : fileURLToPath(new URL('./src/components/modules', import.meta.url)),
      '@utility': fileURLToPath(new URL('./src/components/utilities', import.meta.url)),
      '@store'  : fileURLToPath(new URL('./src/stores', import.meta.url)),
      '@view'   : fileURLToPath(new URL('./src/views', import.meta.url)),
      '@config' : fileURLToPath(new URL('./src/config', import.meta.url)),

    },
  },
})
