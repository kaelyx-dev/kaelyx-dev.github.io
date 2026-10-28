import { defineContentConfig, defineCollection } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    site: defineCollection({
      type: 'page',
      source: 'site/**/*.md',
      schema: z.object({})
    })
  }
})