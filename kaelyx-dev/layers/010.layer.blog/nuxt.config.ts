export default defineNuxtConfig({
    nitro: {
        prerender: {
            routes: ['/feed.xml']
        }
    },
    extends: ['~~/layers/005.layer.content']
})
