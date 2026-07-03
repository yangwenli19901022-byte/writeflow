-- WriteFlow 数据库表结构
-- 在 Supabase SQL Editor 中执行此脚本

-- 草稿/任务表
CREATE TABLE IF NOT EXISTS drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  material TEXT NOT NULL,
  genre TEXT NOT NULL CHECK (genre IN ('wechat', 'xiaohongshu', 'news')),
  requirements JSONB NOT NULL DEFAULT '{}',
  -- custom_word_count is stored inside requirements JSONB, kept here for clarity
  -- requirements structure: { tone, wordCount, customWordCount, extra }
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 生成结果表
CREATE TABLE IF NOT EXISTS generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID NOT NULL REFERENCES drafts(id) ON DELETE CASCADE,
  model TEXT NOT NULL DEFAULT 'kimi',
  prompt_version TEXT NOT NULL DEFAULT '1.0',
  output TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 更新 updated_at 的触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_drafts_updated_at ON drafts;
CREATE TRIGGER update_drafts_updated_at
BEFORE UPDATE ON drafts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 索引
CREATE INDEX IF NOT EXISTS idx_generations_draft_id ON generations(draft_id);
CREATE INDEX IF NOT EXISTS idx_drafts_updated_at ON drafts(updated_at DESC);

-- 启用 RLS（行级安全），MVP 阶段可先关闭或配置公开访问策略
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- 公开访问策略（仅用于 MVP 快速验证，后续需改为基于用户认证）
CREATE POLICY "Allow public access to drafts" ON drafts
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public access to generations" ON generations
  FOR ALL USING (true) WITH CHECK (true);
