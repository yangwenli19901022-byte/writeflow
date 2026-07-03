import { Requirements } from '@/types'
import { WORD_COUNT_MAP } from '@/lib/constants'

export const name = '小红书文案'
export const genre = 'xiaohongshu'

export function buildPrompt(material: string, requirements: Requirements): string {
  const { tone, wordCount, customWordCount, extra } = requirements

  const wordCountDisplay = wordCount === 'custom' && customWordCount
    ? customWordCount
    : WORD_COUNT_MAP[wordCount] || wordCount

  const toneMap: Record<string, string> = {
    professional: '专业可信，像资深博主分享经验',
    casual: '轻松随意，像和闺蜜聊天',
    emotional: '走心真诚，引发共鸣',
    sharp: '观点直接，态度鲜明',
    general: '亲切自然，有网感'
  }

  return `你是一位资深的小红书内容创作者，擅长写高互动、高收藏的种草/分享类笔记。请根据以下原始素材和写作要求，创作一篇小红书文案。

## 小红书文案规范
- 标题：16-24 字，有吸引力，可加入 1-2 个 emoji，制造好奇或利益点。
- 正文：口语化、真实感强，多使用第一人称"我"，避免像广告文案。
- 排版：多分段，每段 1-3 行，适当加入 emoji 增加视觉层次。
- 价值：内容要有实用价值或情绪价值，引导点赞、收藏、评论。
- 标签：结尾必须带 3-5 个相关话题标签，格式为 #关键词。
- 语言风格：${toneMap[tone] || toneMap.general}
- 字数控制：${wordCountDisplay}。
- 不得编造素材中没有的产品功效、价格、数据等信息。

## 原始素材
${material || '（无素材）'}

## 写作要求
- 目标调性：${toneMap[tone] || toneMap.general}
- 字数要求：${wordCountDisplay}
${extra ? `- 额外要求：${extra}` : ''}

## 输出格式
请严格按照以下格式输出，不要添加格式说明以外的内容：

# 标题
[吸引眼球的标题，加 emoji]

# 正文
[口语化正文，多分段，加 emoji]

# 标签
#标签1 #标签2 #标签3 #标签4 #标签5`
}
