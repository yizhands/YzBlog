---
title: 文章标签
---

<script setup>
import { data as tags } from './tags.data.ts'
</script>

<h1>文章标签</h1>

<div class="post-tag-cloud">
  <a
    v-for="tag in tags"
    :key="tag.name"
    :href="`#${encodeURIComponent(tag.name)}`"
    class="tag-cloud-item"
  >
    #{{ tag.name }}（{{ tag.count }}）
  </a>
</div>

<hr />

<div class="category-list">
  <div v-for="tag in tags" :key="tag.name" class="category-item">
    <h2 :id="tag.name" class="category-name">
      #{{ tag.name }}
      <span style="font-weight: 400; font-size: 14px; color: var(--vp-c-text-2);">
        （{{ tag.count }} 篇）
      </span>
    </h2>
    <div class="category-post" v-for="post in tag.posts" :key="post.url">
      <a :href="post.url">{{ post.frontmatter.title }}</a>
      <span style="margin-left: 8px; font-size: 12px; color: var(--vp-c-text-3);">
        {{ post.frontmatter.date }}
      </span>
    </div>
  </div>
</div>
