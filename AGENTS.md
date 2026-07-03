<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# WriteFlow 项目说明

WriteFlow 是一款 AI 辅助写稿工具，基于 Next.js + TypeScript + Tailwind CSS + shadcn/ui 构建。

## 关键上下文

- 默认接入 **Kimi（Moonshot AI）** API。
- 用户需在前端设置页填写自己的 Kimi API Key，后端仅做代理，不持久化存储 Key。
- 历史记录保存在 **Supabase** 数据库中。
- MVP 仅支持浅色模式。
- 产品需求文档见 `PRD.md`，搭建指南见 `SETUP.md`。

## 技术栈

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui v4
- Supabase

## 项目结构

- `src/app/api/generate/` — AI 生成 API 路由
- `src/components/ui/` — shadcn/ui 组件
- `src/components/features/` — 业务组件
- `src/lib/prompts/` — 各体裁 Prompt 模板
- `src/lib/db/` — Supabase 客户端与数据库脚本
- `src/types/` — TypeScript 类型定义

## 开发规范

- 使用 TypeScript 严格模式。
- UI 组件优先使用 shadcn/ui。
- 新增体裁时，在 `src/lib/prompts/` 下新增模板文件并在 `src/lib/prompts/index.ts` 注册。
- 后端 API 路由中禁止泄露用户 API Key。
