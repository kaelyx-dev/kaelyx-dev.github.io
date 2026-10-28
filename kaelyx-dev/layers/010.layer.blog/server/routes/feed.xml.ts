import { Feed } from 'feed'

import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(() => {

    const feed = new Feed({
        id: 'https://kaelyx.dev/',
        title: 'Kaelyx Blog',
        description: 'Kaelyx Blog',
        link: 'https://kaelyx.dev/',
        copyright: `© ${new Date().getFullYear()} Kaelyx`,
    })

    return feed.rss2()
})