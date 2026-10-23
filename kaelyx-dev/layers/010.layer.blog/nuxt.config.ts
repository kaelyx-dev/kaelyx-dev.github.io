export default defineNuxtConfig({
    nitro: {
        prerender: {
            routes: ['/feed.xml']
        }
    }
})
