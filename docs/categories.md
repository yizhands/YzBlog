---
title: 文章分类
---

<script setup>
import { data as categories } from './categories.data.ts'
</script>

<h1>文章分类</h1>

<div class="category-list">
  <div v-for="cat in categories" :key="cat.name" class="category-item">
    <h2 :id="cat.name" class="category-name">
      {{ cat.name }}
      <span style="font-weight: 400; font-size: 14px; color: var(--vp-c-text-2);">
        （{{ cat.count }} 篇）
      </span>
    </h2>
    <div class="category-post" v-for="post in cat.posts" :key="post.url">
      <a :href="post.url">{{ post.frontmatter.title }}</a>
      <span style="margin-left: 8px; font-size: 12px; color: var(--vp-c-text-3);">
        {{ post.frontmatter.date }}
      </span>
    </div>
  </div>
</div>
