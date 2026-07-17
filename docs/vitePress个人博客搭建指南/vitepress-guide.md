---
title: VitePress 个人博客搭建指南
date: 2026-07-16
category: 前端
tags:
  - VitePress
  - 博客
  - Vue
---

# VitePress 个人博客搭建指南

VitePress 是由 Vue 团队开发的静态站点生成器，基于 Vite 构建，速度极快。

## 为什么选择 VitePress

- **极快的开发体验**：Vite 驱动，热更新秒级响应
- **Markdown 原生支持**：所有内容都是 Markdown，简洁高效
- **Vue 组件集成**：可以在 Markdown 中直接使用 Vue 组件
- **内置搜索**：开箱即用的本地全文搜索

## 快速开始

```bash
pnpm add -D vitepress
pnpm vitepress init
pnpm docs:dev
```

## 项目结构

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions 自动部署
├── docs/
│   ├── .vitepress/
│   │   ├── config.mts    # 站点配置
│   │   └── theme/        # 自定义主题
│   ├── index.md          # 首页
│   └── *.md              # 博客文章（直接放 docs/ 下）
├── assets/               # 静态资源（图片等）
└── package.json
```

## 核心配置

VitePress 的配置集中在 `docs/.vitepress/config.mts`，支持导航栏、侧边栏、搜索、社交链接等丰富配置。

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'My Blog',
  description: '个人技术博客',
  base: '/repo-name/',         // 仓库名，项目站点必需
  publicDir: '../assets',      // 图片存放目录
  cleanUrls: false,            // GitHub Pages 不支持无后缀，必须关掉
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '分类', link: '/categories' },
    ],
  },
})
```

## 部署到 GitHub Pages

### 准备工作

1. 在 GitHub 上创建一个**公开仓库**（仓库名假设为 `YzBlog`）
2. 仓库 Setting → Pages → Source 选择 **GitHub Actions**

### 配置 base 路径

在 `config.mts` 中设置 `base`，值必须与仓库名一致：

```ts
export default defineConfig({
  base: '/YzBlog/',  // 格式：/<仓库名>/
  // ...
})
```

> - **自定义域名**或**用户站点**（`用户名.github.io`）：不需要设置 `base`
> - **项目站点**（`用户名.github.io/仓库名`）：必须设置 `base`

### 创建自动部署工作流

新建 `.github/workflows/deploy.yml`：

```yaml
name: 部署到 GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install
      - run: pnpm docs:build

      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist
      - uses: actions/deploy-pages@v4
```

### 初始化 Git 并推送

```bash
git init
git add .
git commit -m "init: VitePress 博客"
git remote add origin https://github.com/yizhands/YzBlog.git
git push -u origin main
```

推送后 GitHub Actions 会自动运行，部署完成后访问：

```
https://yizhands.github.io/YzBlog/
```

### 本地预览生产构建

```bash
pnpm docs:build
pnpm docs:preview
```

这样可以在部署前预览最终效果（包括 `base` 路径是否正确）。

更多内容可以参考 [VitePress 官方文档](https://vitepress.dev)。
