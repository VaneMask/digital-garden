import { defineCollection, z } from 'astro:content'

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    summary: z.string().optional(),
    coverImage: z.string().optional(),
    techTags: z.array(z.string()).default([]),
    githubUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    date: z.date(),
  }),
})

const tools = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    url: z.string().url(),
    category: z.enum(['dev', 'ai', 'productivity', 'design', 'browser']),
    featured: z.boolean().default(false),
  }),
})

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    coverImage: z.string().optional(),
    updatedDate: z.date().optional(),
  }),
})

const photos = defineCollection({
  type: 'data',
  schema: z.object({
    image: z.string(),
    thumbnail: z.string().optional(),
    alt: z.string(),
    description: z.string().optional(),
    date: z.string(),
    camera: z.string().optional(),
    lens: z.string().optional(),
    iso: z.number().optional(),
    aperture: z.string().optional(),
    shutter: z.string().optional(),
    location: z.string().optional(),
  }),
})

const moments = defineCollection({
  type: 'content',
  schema: z.object({
    content: z.string(),
    images: z.array(z.string()).optional(),
    tags: z.array(z.string()).default([]),
    date: z.date(),
    location: z.string().optional(),
  }),
})

export const collections = { projects, tools, posts, photos, moments }
