import type { Collections } from '@nuxt/content'
import type { ContentCollection, ContentPageCollection } from '../../shared/types/content'

// Collection registered by this layer's content.config.ts for general site content
const SITE_COLLECTION = 'site' satisfies ContentCollection

export type GetPageOptions = { path?: never, category: string, slug: string } | { path: string, category?: never, slug?: never }

const resolvePagePath = (options: GetPageOptions) =>
    options.path ?? `/${options.category}/${options.slug}`

export const useContent = () => {
    return {
        // Gets a single page from a page collection via its route path, e.g. getPage('blog', { path: '/blog/hello-world' })
        // or via category and slug, e.g. getPage('blog', { category: 'blog', slug: 'hello-world' })
        getPage: <C extends ContentPageCollection>(collection: C, options: GetPageOptions) => {
            const path = resolvePagePath(options)
            return useAsyncData(`content:${collection}:${path}`, () => queryCollection(collection).path(path).first())
        },

        // Gets every item in a collection, optionally limited to the given fields, e.g. getCollection('blog', ['title', 'path'])
        getCollection: <C extends ContentCollection, K extends keyof Collections[C] = keyof Collections[C]>(collection: C, fields?: K[]) =>
            useAsyncData(`content:${collection}:${fields?.join(',') ?? '*'}`, () => {
                const query = queryCollection(collection)
                return (fields?.length ? query.select(...fields) : query).all() as Promise<Pick<Collections[C], K>[]>
            }),

        // Gets Content via Slug from the content collection "site"
        getContent: (slug: string) =>
            useAsyncData(`content:${SITE_COLLECTION}:${slug}`, () =>
                queryCollection(SITE_COLLECTION).where('stem', '=', `site/${slug}`).first()
            )
    }
}

export default useContent
