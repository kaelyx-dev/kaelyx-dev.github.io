export default defineNuxtPlugin(() => {
    useHead({
        link: [{ rel: 'alternate', type: 'application/rss+xml', title: 'Kaelyx Blog', href: '/feed.xml' }],
    })
})