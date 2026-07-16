import { defineConfig } from 'vitepress'

export default defineConfig({
  // 站点基础信息
  lang: 'zh-CN',                    // 语言：简体中文
  title: 'YiZhanBlog',                  // 站点标题（显示在浏览器标签页）
  description: '前端技术博客 — 记录学习，分享技术', // SEO 描述

  // 站点根路径（项目站点部署到 https://yizhands.github.io/YzBlog/，仓库名 YzBlog）
  base: '/YzBlog/',

  // 静态资源目录：映射到项目根目录 assets/，图片用根路径引用如 /photo.jpg
  publicDir: '../assets',

  // GitHub Pages 不支持无后缀 URL，必须设为 false
  cleanUrls: false,

  // <head> 内的 HTML 标签注入
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }], // PWA 主题色
  ],

  // ========== 主题配置 ==========
  themeConfig: {
    // 顶部导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '分类', link: '/categories' },
      { text: '标签', link: '/tags' },
    ],

    // 侧边栏（目前为静态占位，实际文章列表由首页 PostList 组件渲染）
    sidebar: [
      {
        text: '最近文章',
        items: [
          { text: '文章列表', link: '#' },
        ],
      },
    ],

    // 顶部导航栏右侧社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yizhands' },
    ],

    // 页脚
    footer: {
      message: '基于 VitePress 构建',
      copyright: `Copyright © ${new Date().getFullYear()} YzBlog`, // 动态年份
    },

    // 文章底部上一篇/下一篇的文字
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },

    // 右侧大纲（目录）
    outline: {
      label: '目录',     // 标题文字
      level: [2, 3],     // 只显示 h2 和 h3
    },

    // 文章底部最后更新时间
    lastUpdated: {
      text: '最后更新',
    },

    // 本地搜索（无需外部服务）
    search: {
      provider: 'local',
    },
  },

  // Markdown 代码块主题
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },
})
