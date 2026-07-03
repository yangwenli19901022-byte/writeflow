# WriteFlow

一款面向内容创作者的 AI 辅助写稿工具。输入原始素材和写作要求，即可生成公众号文章、小红书文案、新闻消息等多种体裁的内容。

## 功能特性

- 🤖 接入 Kimi（Moonshot AI）大模型
- 📝 支持多种体裁：公众号文章、小红书文案、新闻消息
- 🎨 可调语言调性、字数要求、补充要求
- ⚡ 流式生成，实时展示输出内容
- 💾 草稿与生成历史持久化（Supabase / localStorage 降级）
- 📤 一键复制或导出 Markdown
- 🔐 用户自行填写 API Key，服务端仅做代理

## 技术栈

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Supabase

## 快速开始

### 1. 环境要求

- Node.js 18+
- npm / pnpm

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Supabase 为可选配置。未配置时将自动降级使用浏览器 localStorage 存储草稿。

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)。

## 使用说明

1. 在右上角「设置」中填写你的 Kimi API Key。
2. 在左侧创建新任务或选择已有草稿。
3. 在中间「写作工作台」输入原始素材并选择体裁、调性、字数。
4. 点击「开始生成」，右侧将实时展示 AI 生成的文案。
5. 可复制全文或导出为 Markdown 文件。

## 项目结构

```
src/
  app/                  # Next.js App Router
    api/generate/       # AI 生成 API 路由
    page.tsx            # 首页（写作工作台）
    layout.tsx          # 根布局
  components/           # React 组件
    ui/                 # shadcn/ui 组件
    layout/             # 布局组件
    features/           # 业务功能组件
  lib/                  # 工具库
    db/                 # Supabase 客户端与数据库脚本
    prompts/            # 各体裁 Prompt 模板
  hooks/                # 自定义 React Hooks
  types/                # TypeScript 类型定义
```

## 部署

详见 [DEPLOY.md](./DEPLOY.md)。

## 产品文档

详见 [PRD.md](./PRD.md)。
