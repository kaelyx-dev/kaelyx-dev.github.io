import { defineNuxtPlugin } from '#imports'
import { syncTheme } from './useTheme'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:mounted', () => syncTheme())
})
