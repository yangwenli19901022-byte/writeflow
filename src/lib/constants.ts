import { Genre, Tone } from "@/types";

export const GENRE_OPTIONS: { value: Genre; label: string }[] = [
  { value: "wechat", label: "公众号文章" },
  { value: "xiaohongshu", label: "小红书文案" },
  { value: "news", label: "新闻消息" },
];

export const TONE_OPTIONS: { value: Tone; label: string }[] = [
  { value: "general", label: "通用自然" },
  { value: "professional", label: "专业严谨" },
  { value: "casual", label: "轻松口语" },
  { value: "emotional", label: "煽情走心" },
  { value: "sharp", label: "犀利观点" },
];

export const WORD_COUNT_OPTIONS = [
  { value: "short", label: "短（300字以内）" },
  { value: "medium", label: "中（300-800字）" },
  { value: "long", label: "长（800-1500字）" },
  { value: "custom", label: "自定义" },
];

export const WORD_COUNT_MAP: Record<string, string> = {
  short: "300字以内",
  medium: "300-800字",
  long: "800-1500字",
  custom: "自定义字数",
};
