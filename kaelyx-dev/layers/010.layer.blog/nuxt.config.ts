export default defineNuxtConfig({
    routeRules: {
        '/feed': { redirect: { to: '/feed.xml', statusCode: 301 } }
    },
    nitro: {
        prerender: {
            routes: ['/feed.xml', '/feed']
        }
    },
    extends: ['~~/layers/005.layer.content']
})
