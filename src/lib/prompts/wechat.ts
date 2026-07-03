import { Requirements } from '@/types'
import { WORD_COUNT_MAP } from '@/lib/constants'

export const name = '公众号文章'
export const genre = 'wechat'

export function buildPrompt(material: string, requirements: Requirements): string {
  const { tone, wordCount, customWordCount, extra } = requirements

  const wordCountDisplay = wordCount === 'custom' && customWordCount
    ? customWordCount
    : WORD_COUNT_MAP[wordCount] || wordCount

  const toneMap: Record<string, string> = {
    professional: '专业严谨，逻辑清晰，适合行业深度分析',
    casual: '轻松自然，像朋友聊天一样娓娓道来',
    emotional: '情感真挚，有温度，能打动读者',
    sharp: '观点鲜明，语言犀利，有冲击力',
    general: '通用自然，通俗易懂'
  }

  return `你是一位资深的公众号内容编辑和撰稿人。请根据以下原始素材和写作要求，创作一篇适合微信公众号发布的长文章。

## 公众号文章规范
- 文章结构必须包含：引人入胜的标题、一段简短有力的开头引入、2-4 个正文章节（带二级小标题）、结尾总结或互动引导。
- 语言风格：${toneMap[tone] || toneMap.general}
- 字数控制：${wordCountDisplay}。请合理分配内容，不要明显超出或不足。
- 适合手机屏幕阅读：段落控制在 3-5 行，适当留白。
- 可适当使用金句、案例、数据增强说服力，但不得编造素材中没有的信息。
- 避免使用"首先/其次/最后"等过于刻板的连接词堆砌。

## 原始素材
${material || '（无素材）'}

## 写作要求
- 目标调性：${toneMap[tone] || toneMap.general}
- 字数要求：${wordCountDisplay}
${extra ? `- 额外要求：${extra}` : ''}

## 输出格式
请严格按照以下格式输出，不要添加格式说明以外的内容：

# 标题
[文章标题，15-30 字为宜]

# 正文
[文章正文，使用 Markdown 二级标题分节]

# 摘要
[50-100 字的内容摘要，适合用于公众号摘要]`
}
