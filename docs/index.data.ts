import { createContentLoader } from 'vitepress'

export default createContentLoader('**/*.md', {
  transform(raw) {
    return raw
      .filter(page => page.frontmatter.date)
      .sort((a, b) => {
        const dateA = new Date(a.frontmatter.date).getTime()
        const dateB = new Date(b.frontmatter.date).getTime()
        return dateB - dateA
      })
  },
})
