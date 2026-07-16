import { createContentLoader } from 'vitepress'

interface Post {
  url: string
  frontmatter: {
    title: string
    date: string
    category?: string
    tags?: string[]
  }
}

export default createContentLoader('**/*.md', {
  transform(raw) {
    const posts = raw.filter(p => p.frontmatter.date) as Post[]
    const tagMap = new Map<string, Post[]>()

    posts.forEach((post) => {
      const tags = post.frontmatter.tags || []
      tags.forEach((tag) => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, [])
        }
        tagMap.get(tag)!.push(post)
      })
    })

    return Array.from(tagMap.entries())
      .map(([name, posts]) => ({
        name,
        count: posts.length,
        posts: posts.sort((a, b) => {
          const dateA = new Date(a.frontmatter.date).getTime()
          const dateB = new Date(b.frontmatter.date).getTime()
          return dateB - dateA
        }),
      }))
      .sort((a, b) => b.count - a.count)
  },
})
