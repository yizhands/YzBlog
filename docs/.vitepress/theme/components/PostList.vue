<script setup lang="ts">
import { withBase } from 'vitepress'

defineProps<{
  posts: Array<{
    url: string
    frontmatter: {
      title: string
      date: string
      category?: string
      tags?: string[]
    }
  }>
}>()
</script>

<template>
  <div class="post-list">
    <h2>最新文章</h2>
    <div v-if="posts.length === 0" class="post-item">
      <p>还没有文章，即将更新...</p>
    </div>
    <div v-for="post in posts" :key="post.url" class="post-item">
      <div class="post-title">
        <a :href="withBase(post.url)">{{ post.frontmatter.title }}</a>
      </div>
      <div class="post-meta">
        <span class="post-date">{{ post.frontmatter.date }}</span>
        <a
          v-if="post.frontmatter.category"
          :href="withBase(`/categories#${encodeURIComponent(post.frontmatter.category)}`)"
          class="post-category"
        >
          {{ post.frontmatter.category }}
        </a>
        <span v-if="post.frontmatter.tags?.length" class="post-tags">
          <a
            v-for="tag in post.frontmatter.tags"
            :key="tag"
            :href="withBase(`/tags#${encodeURIComponent(tag)}`)"
            class="post-tag"
          >
            #{{ tag }}
          </a>
        </span>
      </div>
    </div>
  </div>
</template>
