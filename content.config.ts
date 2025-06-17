import { defineCollection, defineContentConfig, z } from '@nuxt/content';
import { asSeoCollection } from '@nuxtjs/seo/content';

export default defineContentConfig({
  collections: {
    docs: defineCollection(asSeoCollection({
      // Load every file inside the `content` directory
      source: 'docs/**/*.{md,yml}',
      // Specify the type of content in this collection
      type: 'page',
      schema: z.object({
        title: z.string(),
        icon: z.string(),
        description: z.string(),
        redirect: z.string().optional(),
      }),
    })),
    blog: defineCollection(asSeoCollection({
      source: 'blog/**/*.{md,yml}',
      type: 'page',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        image: z.object({
          src: z.string(),
        }),
        authors: z.array(z.object({
          name: z.string(),
          to: z.string(),
          avatar: z.object({
            src: z.string(),
          }),
        })),
        date: z.string(),
        badge: z.object({
          label: z.string(),
        }),
      }),
    })),
    changelog: defineCollection(asSeoCollection({
      source: 'changelog/**/*.{md,yml}',
      type: 'page',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string(),
        image: z.object({
          src: z.string(),
        }),
        authors: z.array(z.object({
          name: z.string(),
          to: z.string(),
          avatar: z.object({
            src: z.string(),
          }),
        })),
        badge: z.object({
          label: z.string(),
        }),
        publishedAt: z.date(),
      }),
    })),
  },
});
