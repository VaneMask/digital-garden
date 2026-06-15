import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { SITE } from '@config/constants'

export async function GET(context) {
  const posts = await getCollection('posts', ({ data }) => !data.draft)
  posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/archive`,
    })),
    customData: `<language>zh-CN</language>`,
  })
}
