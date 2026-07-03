import { Requirements } from '@/types'
import { WORD_COUNT_MAP } from '@/lib/constants'

export const name = '新闻消息'
export const genre = 'news'

export function buildPrompt(material: string, requirements: Requirements): string {
  const { tone, wordCount, customWordCount, extra } = requirements

  const wordCountDisplay = wordCount === 'custom' && customWordCount
    ? customWordCount
    : WORD_COUNT_MAP[wordCount] || wordCount

  const toneMap: Record<string, string> = {
    professional: '客观中立，用词规范，符合新闻写作标准',
    casual: '语言平实，便于大众理解',
    emotional: '在客观报道基础上适度体现人文关怀',
    sharp: '角度犀利，直击问题核心',
    general: '客观简洁，突出事实'
  }

  return `你是一位经验丰富的新闻记者。请根据以下原始素材和写作要求，撰写一篇规范的新闻消息稿。

## 新闻消息规范
- 采用倒金字塔结构：最重要的事实放在开头，次要信息依次递减。
- 导语（第一段）必须包含 5W1H 中的核心要素：何时 When、何地 Where、何人 Who、何事 What、为何 Why、如何 How。
- 正文按重要性递减排列，一段一意，每段不宜过长。
- 语言客观、准确、简洁，避免主观评价、抒情和夸张修辞。
- 引述素材中的关键信息，不添加未经验证的内容，不编造数据、时间、地点、人物。
- 语言风格：${toneMap[tone] || toneMap.general}
- 字数控制：${wordCountDisplay}。

## 原始素材
${material || '（无素材）'}

## 写作要求
- 目标调性：${toneMap[tone] || toneMap.general}
- 字数要求：${wordCountDisplay}
${extra ? `- 额外要求：${extra}` : ''}

## 输出格式
请严格按照以下格式输出，不要添加格式说明以外的内容：

# 标题
[简洁有力的标题，一行]

# 导语
[包含核心 5W1H 要素的导语]

# 正文
[按倒金字塔结构展开的新闻正文]

# 新闻要素
- 时间：
- 地点：
- 人物：
- 事件：
- 原因：
- 结果：`}
