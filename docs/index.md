---
layout: home

hero:
  name: YzBlog
  text: 技术博客
  tagline: 记录学习，分享技术
  actions:
    - theme: brand
      text: 开始阅读
      link: /categories
    - theme: alt
      text: GitHub
      link: https://github.com/yizhands

features:
  - icon: 🖥️
    title: 全栈开发
    details: JavaScript、TypeScript、Vue、Java、SpringBoot、SpringCloud 等技术探索
  - icon: 🛠️
    title: 工程化
    details: Vite、Webpack、CI/CD 等工程化实践
  - icon: 💡
    title: 经验分享
    details: 踩坑记录、最佳实践、性能优化等实战经验
---

<script setup>
import { data as posts } from './index.data.ts'
</script>

<PostList :posts="posts" />
