"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GENRE_OPTIONS, TONE_OPTIONS, WORD_COUNT_OPTIONS } from "@/lib/constants";
import { Genre, Requirements, Tone } from "@/types";
import { Wand2 } from "lucide-react";

interface InputPanelProps {
  material: string;
  onMaterialChange: (value: string) => void;
  genre: Genre;
  onGenreChange: (value: Genre) => void;
  requirements: Requirements;
  onRequirementsChange: (requirements: Requirements) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function InputPanel({
  material,
  onMaterialChange,
  genre,
  onGenreChange,
  requirements,
  onRequirementsChange,
  onGenerate,
  isGenerating,
}: InputPanelProps) {
  const updateRequirement = <K extends keyof Requirements>(
    key: K,
    value: Requirements[K]
  ) => {
    onRequirementsChange({ ...requirements, [key]: value });
  };

  const selectedGenreLabel =
    GENRE_OPTIONS.find((o) => o.value === genre)?.label || genre;
  const selectedToneLabel =
    TONE_OPTIONS.find((o) => o.value === requirements.tone)?.label ||
    requirements.tone;
  const selectedWordCountLabel =
    WORD_COUNT_OPTIONS.find((o) => o.value === requirements.wordCount)?.label ||
    requirements.wordCount;

  return (
    <Card className="flex h-full flex-col rounded-none border-0 shadow-none lg:rounded-lg lg:border lg:shadow-sm">
      <CardHeader className="px-4 py-4 lg:px-6">
        <CardTitle className="text-base font-medium">写作工作台</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 pb-4 lg:px-6">
        {/* 素材输入 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="material" className="text-sm font-medium">
              原始素材
            </Label>
            <span className="text-xs text-muted-foreground">
              {material.length} 字
            </span>
          </div>
          <Textarea
            id="material"
            placeholder="粘贴你的原始素材：采访记录、会议纪要、产品资料、故事梗概..."
            className="min-h-[160px] resize-y"
            value={material}
            onChange={(e) => onMaterialChange(e.target.value)}
          />
        </div>

        {/* 体裁选择 */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="genre" className="text-sm font-medium">
            写作体裁
          </Label>
          <Select
            value={genre}
            onValueChange={(value) => onGenreChange(value as Genre)}
          >
            <SelectTrigger id="genre">
              <SelectValue placeholder="选择体裁">
                {selectedGenreLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {GENRE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 调性选择 */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="tone" className="text-sm font-medium">
            语言调性
          </Label>
          <Select
            value={requirements.tone}
            onValueChange={(value) => updateRequirement("tone", value as Tone)}
          >
            <SelectTrigger id="tone">
              <SelectValue placeholder="选择调性">
                {selectedToneLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {TONE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 字数要求 */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="word-count" className="text-sm font-medium">
            字数要求
          </Label>
          <div className="flex gap-2">
            <Select
              value={requirements.wordCount}
              onValueChange={(value) =>
                value && updateRequirement("wordCount", value)
              }
            >
              <SelectTrigger id="word-count" className="flex-1">
                <SelectValue placeholder="选择字数">
                  {selectedWordCountLabel}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {WORD_COUNT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {requirements.wordCount === "custom" && (
              <Input
                placeholder="例如：2000字"
                className="w-32"
                value={requirements.customWordCount || ""}
                onChange={(e) =>
                  updateRequirement("customWordCount", e.target.value)
                }
              />
            )}
          </div>
        </div>

        {/* 补充要求 */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="extra" className="text-sm font-medium">
            补充要求（可选）
          </Label>
          <Textarea
            id="extra"
            placeholder="例如：突出性价比、不要出现价格、语气更像年轻人..."
            className="min-h-[80px] resize-y"
            value={requirements.extra || ""}
            onChange={(e) => updateRequirement("extra", e.target.value)}
          />
        </div>

        {/* 生成按钮 */}
        <Button
          onClick={onGenerate}
          disabled={!material.trim() || isGenerating}
          className="mt-auto w-full gap-2"
          size="lg"
        >
          <Wand2 className="h-4 w-4" />
          {isGenerating ? "生成中..." : "开始生成"}
        </Button>
      </CardContent>
    </Card>
  );
}
