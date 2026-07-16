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
    const categoryMap = new Map<string, Post[]>()

    posts.forEach((post) => {
      const cat = post.frontmatter.category || '未分类'
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, [])
      }
      categoryMap.get(cat)!.push(post)
    })

    return Array.from(categoryMap.entries()).map(([name, items]) => ({
      name,
      count: items.length,
      posts: items.sort((a, b) => {
        const dateA = new Date(a.frontmatter.date).getTime()
        const dateB = new Date(b.frontmatter.date).getTime()
        return dateB - dateA
      }),
    }))
  },
})
