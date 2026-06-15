import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'

export default defineConfig({
  site: 'https://vanemask.me',
  integrations: [
    tailwind(),
    mdx(),
    react(),
    sitemap({
      filter: (page) => !page.includes('/draft'),
    }),
  ],
  output: 'static',
  adapter: vercel({
    webAnalytics: { enabled: false },
  }),
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true,
    },
  },
  devToolbar: {
    enabled: false,
  },
})
