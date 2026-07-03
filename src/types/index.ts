export type Genre = 'wechat' | 'xiaohongshu' | 'news'

export type Tone = 'professional' | 'casual' | 'emotional' | 'sharp' | 'general'

export interface Requirements {
  tone: Tone
  wordCount: string
  customWordCount?: string
  extra?: string
}

export interface Draft {
  id: string
  title: string
  material: string
  genre: Genre
  requirements: Requirements
  created_at: string
  updated_at: string
}

export interface Generation {
  id: string
  draft_id: string
  model: string
  prompt_version: string
  output: string
  tokens_used?: number
  created_at: string
}

export interface GenerateRequest {
  material: string
  genre: Genre
  requirements: Requirements
  apiKey: string
}
