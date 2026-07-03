# WriteFlow 项目搭建指南

## 环境要求

- Node.js 18+（已通过 nvm 安装 v24.18.0）
- npm 或 pnpm
- Kimi（Moonshot AI）API Key：[https://platform.moonshot.cn/](https://platform.moonshot.cn/)
- Supabase 项目：[https://app.supabase.com](https://app.supabase.com)

## 1. 安装依赖

项目已初始化，直接安装依赖即可：

```bash
npm install
```

## 2. 配置 Supabase

1. 在 [Supabase](https://app.supabase.com) 创建一个新项目。
2. 进入项目的 SQL Editor。
3. 打开 `src/lib/db/schema.sql`，复制全部内容并执行。
4. 进入 Project Settings → API，复制以下两个值：
   - Project URL
   - anon public API key

## 3. 配置环境变量

复制环境变量模板：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入你的 Supabase 配置：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

注意：Kimi API Key 由用户在应用设置页面自行填写，不需要写入 `.env.local`。

## 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)。

## 5. 项目结构

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

## 6. 后续开发阶段

- 阶段 1：基础 UI 与输入功能
- 阶段 2：AI 接入与流式生成
- 阶段 3：历史记录与数据库持久化
- 阶段 4：优化与部署
