# WriteFlow 部署指南

## 方案一：通过 Vercel Dashboard 部署（推荐）

### 1. 推送代码到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/writeflow.git
git push -u origin main
```

### 2. 在 Vercel 创建项目

1. 访问 [https://vercel.com/new](https://vercel.com/new)。
2. 导入你的 GitHub 仓库 `writeflow`。
3. 框架预设选择 **Next.js**。
4. 点击 Deploy。

### 3. 配置环境变量

部署完成后，进入项目 Settings → Environment Variables，添加：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

然后重新部署（Redeploy）。

### 4. 配置 Supabase

1. 在 [Supabase](https://app.supabase.com) 创建项目。
2. 进入 SQL Editor，执行 `src/lib/db/schema.sql` 中的脚本。
3. 在 Project Settings → API 中获取 URL 和 Anon Key。

## 方案二：通过 Vercel CLI 部署

### 1. 安装 Vercel CLI

```bash
npm i -g vercel
```

### 2. 登录并部署

```bash
cd /Users/bytedance/Documents/writeflow
vercel login
vercel --prod
```

按照提示完成项目创建和部署。

### 3. 配置环境变量

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel --prod
```

## 注意事项

- 用户填写的 Kimi API Key 不存储在服务端环境变量中，不需要配置。
- 若不配置 Supabase，应用将使用浏览器 localStorage 作为降级方案。
- 首次部署后，建议访问应用并测试生成流程是否正常。
