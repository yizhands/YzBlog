# AGENTS.md

## 项目概览

基于 VitePress 的个人技术博客。

## 常用命令

| 命令 | 用途 |
|------|------|
| `pnpm docs:dev` | 启动开发服务器 |
| `pnpm docs:build` | 构建静态站点（输出到 `docs/.vitepress/dist/`） |
| `pnpm docs:preview` | 预览构建结果 |

没有 lint、test、typecheck 等其他命令。

## 架构要点

- **内容目录**：`docs/` — 所有 Markdown 文件放在这里，博客文章直接放 `docs/` 根下
- **配置**：`docs/.vitepress/config.mts` — TypeScript 格式
- **包管理**：pnpm（`package.json` 已声明 `"type": "module"`）
- **语言**：站点和内容使用简体中文（`lang: 'zh-CN'`）

## 博客功能

- **文章**：直接放在 `docs/` 下，需包含 frontmatter（`title`、`date`、`category`、`tags`）
- **静态资源**：图片放项目根目录 `assets/`，已在配置中通过 `publicDir: '../assets'` 映射，文章中引用根路径即可（如 `/photo.jpg`）
- **数据加载**：`docs/*.data.ts` 文件使用 `createContentLoader` 加载文章元数据，首页、分类页、标签页均依赖 `.data.ts`
- **自定义主题**：`docs/.vitepress/theme/` 包含 PostList 组件和全局样式

## 注意事项

- `"type": "module"` 是必需的，否则 `.data.ts` 中 `import from 'vitepress'` 会在构建时报 ESM 错误
- 安装新依赖后，如 esbuild 等原生模块的构建脚本被 pnpm 阻止，需运行 `pnpm approve-builds` 放行
- 添加新文章只需在 `docs/` 下创建 `.md` 文件并写好 frontmatter，无需修改其他文件
