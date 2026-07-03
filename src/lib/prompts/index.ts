import { Genre, Requirements } from '@/types'
import * as wechat from './wechat'
import * as xiaohongshu from './xiaohongshu'
import * as news from './news'

export const prompts = {
  wechat,
  xiaohongshu,
  news
}

export const genreOptions: { value: Genre; label: string }[] = [
  { value: 'wechat', label: wechat.name },
  { value: 'xiaohongshu', label: xiaohongshu.name },
  { value: 'news', label: news.name }
]

export function buildPrompt(genre: Genre, material: string, requirements: Requirements): string {
  const promptModule = prompts[genre]
  if (!promptModule) {
    throw new Error(`Unknown genre: ${genre}`)
  }
  return promptModule.buildPrompt(material, requirements)
}
