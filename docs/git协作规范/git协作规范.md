---
title: Git 协作规范
date: 2026-08-12
category: 工程化
tags:
  - Git
  - 协作
  - 规范
---

# Git 协作规范

## 1: 文档目的

统一团队 Git 使用方式，规范分支创建、代码提交、合并、版本发布流程，减少代码冲突、避免提交混乱、防止代码丢失，保障代码库稳定可追溯，适配 CI/CD 自动化流水线以及适应 AI 时代项目开发的需求。

## 2: Gitee SSH 配置

### 2.1: 生成 SSH 密钥

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

按提示回车，默认生成在 `~/.ssh/id_ed25519`（私钥）和 `~/.ssh/id_ed25519.pub`（公钥）。

> 如果遇到不支持 Ed25519 的旧系统，改用 RSA：
> ```bash
> ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
> ```

### 2.2: 添加公钥到 Gitee

查看并复制公钥内容：

```bash
cat ~/.ssh/id_ed25519.pub
```

登录 [Gitee](https://gitee.com) → 头像下拉 → **设置** → **SSH 公钥** → 粘贴公钥 → 确定。

### 2.3: 验证连接

```bash
ssh -T git@gitee.com
```

成功返回 `You've successfully authenticated` 即配置完成。

### 2.4: 使用 SSH 地址操作仓库

克隆仓库时使用 SSH 地址（而非 HTTPS）：

```bash
git clone git@gitee.com:username/repo.git
```

已有 HTTPS 仓库可切换为 SSH：

```bash
git remote set-url origin git@gitee.com:username/repo.git
```

之后 `push`、`pull` 不再需要输入密码。

## 3: 分支管理

### 分支策略

| 分支        | 用途                   |
| ----------- | ---------------------- |
| `master`    | 开发主分支             |
| `main`      | 生产环境，只接受 merge |
| `人名`      | 个人日常开发分支       |

### 命名规范

团队早期（2-3 人）以开发人员名字命名个人分支，如 `zhangsan`、`lisi`。

若同一周期内存在多个互不相关的任务，建议加上功能后缀：`zhangsan/order-module`、`lisi/fix-login`。

## 4: Commit 规范

### 4.1: Commit 的本质：diff + message

一次提交由两部分组成——**diff** 和 **message**：

- **diff**：精确记录代码从哪一行变成哪一行，是"变更的客观事实"。
- **message**：解释为什么产生这个变更，是"变更的主观意图"。

Git 只承诺保存 diff，不承诺保存意图。每次提交都只留下了最终的 diff，而决策过程——遇到的问题、考虑过的方案、被否定的理由、约束条件——全部蒸发，这种现象被称为 **Decision Shadow（决策阴影）**。代码库因此变成了"有结果、无推理"的档案馆。

在过去，这个代价由后来读代码的人承担：`git blame` 到一行代码，看到的只有 `update`，你只能考古。而在 AI 编程时代，这个代价被放大了——AI 对代码库的理解，高度依赖历史变更信息。主流 AI 编程工具在补全、审查、修复代码时，依赖 `git log`、`git diff` 所代表的变更历史来建立"当前代码为什么长这样"的认知。

**AI 替你写代码之前，先要读懂这份历史。历史写得好，AI 事半功倍；历史写得烂，AI 和你一样失忆。**

### 4.2: 反面教材：那些让历史失忆的提交信息

先看一组真实仓库里天天出现的提交信息：

```
1. update            # 改了什么？为什么？零信息
2. fix               # 修了什么 bug？怎么修的？零信息
3. .                 # 一个字，Git 允许，历史从此失明
4. wip               # 永远进行中的工作，永远不会被回顾
5. 修改代码           # 中文版 update，换种语言重复同样的空话
6. asdf              # 键盘滚脸，比空提交更不尊重读者
```

**这些提交为什么是灾难？**

1. **零意图**。diff 已经告诉了你"什么变了"，message 的价值是告诉"为什么变"。`update` 之类的信息没有提供任何 diff 之外的东西，等于写了个空话。
2. **不可检索**。`git log --oneline` 扫过去，无法定位任何一次变更；用 `git log -S "关键字"` 按内容找代码改动时，这些提交帮不上任何忙——索引里只有噪音。
3. **不可追溯**。半年后线上出问题，`git blame` 定位到一行代码，提交信息写着 `update`。没有 issue 号、没有动机、没有权衡，"为什么这么写"的答案永远丢失。
4. **对 AI 是纯噪音**。模型拿到 diff 却拿不到意图，只能靠猜；猜错了，生成的代码就带着错误假设继续污染历史。AI 检索历史作上下文时，一个 `update` 密集的仓库，等于让 AI 在一个"失忆的代码库"上工作——它补全出的每一行代码，都少了历史依据。

### 4.3: Conventional Commits 规范

采用 [Conventional Commits 1.0.0](https://www.conventionalcommits.org/)：一套"给人看、也给机器看"的提交信息规范，与语义化版本（SemVer）联动，让提交历史变成结构化数据。

**结构：**

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**type 语义表：**

| type              | 含义           | 对应 SemVer |
| ----------------- | -------------- | ----------- |
| `feat`            | 引入新功能     | MINOR       |
| `fix`             | 修复 bug       | PATCH       |
| `docs`            | 只改文档       | 无          |
| `refactor`        | 重构，不改行为 | 无          |
| `perf`            | 性能优化       | 无          |
| `test`            | 测试相关       | 无          |
| `chore`           | 构建、工具等   | 无          |

`BREAKING CHANGE` 在 footer 中声明，或在 type 后加 `!`，对应 MAJOR 版本号。scope 用括号放在 type 后，指明影响范围，如 `feat(parser)`。

**写法要领：**

- **标题行**：祈使句，动词开头（add 而非 added），不超过 50 个字符。
- **正文**：写 Why，不写 What。diff 已经展示了 What；正文要回答"为什么现在改、为什么这么改、有什么权衡"，并关联 issue 号。
- **footer**：放 `BREAKING CHANGE:`、`Refs: #123` 等结构化信息。

### 4.4: 让AI按规范代写(提示词或制成skill)

把"写规范 message"这件事委托给 AI。关键是提示词要约束严格：

```markdown
你是一位严格遵守 Conventional Commits 1.0.0 规范的提交信息写手。
请根据下面的 git diff 输出，生成一条 commit message，要求：

1. 第一行格式：type(scope): description
   - type 只能从 feat/fix/docs/refactor/perf/test/chore 中选择
   - description 用祈使句（如 "add" 而非 "added"），不超过 50 个字符
2. 空一行，正文说明"为什么"做这个改动（动机、约束、权衡），
   不要复述 diff 里的代码内容（那是 What，diff 自己已经写了）
3. 若存在破坏性变更，正文后加 footer：BREAKING CHANGE: <说明>
4. 严格基于 diff 内容，不虚构 diff 中不存在的信息
5. 只输出 commit message 本身，不要任何解释

<diff>
【粘贴 git diff 的输出】
</diff>
```

### 4.5: 快速参考

| 场景           | 格式                                  | 示例                                        |
| -------------- | ------------------------------------- | ------------------------------------------- |
| 新功能         | `feat(scope): description`            | `feat(order): 新增订单状态机模块`           |
| Bug 修复       | `fix(scope): description`             | `fix(order): 修复状态流转时的空指针异常`    |
| 文档           | `docs: description`                   | `docs: 更新 README 部署说明`                |
| 重构           | `refactor(scope): description`        | `refactor(login): 提取密码校验为独立方法`   |
| 性能优化       | `perf(scope): description`            | `perf(cache): 分片锁替换全局锁`             |
| 破坏性变更     | `feat(scope)!: description`           | `feat(api)!: 移除 v1 用户接口`              |

## 5: 工作流程

1. 从 `master` 拉取最新代码，创建个人开发分支
2. 在个人分支上开发，按 Conventional Commits 规范提交
3. 开发完成后发起 PR/MR 到 `master`
4. Code Review 通过后合并
5. 定期将 `master` 合并到 `main` 进行发布

## 6: 常用操作

```bash
# 创建并切换到个人开发分支
git checkout -b zhangsan

# 提交代码
git add .
git commit -m "feat(order): 新增订单状态机模块"

# 推送远程
git push origin zhangsan

# 拉取 master 最新代码合并到当前分支
git fetch origin master
git merge origin/master
```

## 7: 注意事项

- 不要直接 push 到 `master` 或 `main`，必须通过 PR/MR 合并
- 不要提交 `.env`、`node_modules`、IDE 配置文件
- 不要提交 `.workbuddy`、`.zcode`等agent配置文件，只保留`.agent`、`.claude`等团队要求通用的agent配置文件
- 每次提交前先拉取目标分支最新代码，解决冲突后再 push
- PR 描述清楚改动内容、测试情况和影响范围
