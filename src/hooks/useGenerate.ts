"use client";

import { useState, useRef, useCallback } from "react";
import { Genre, Requirements } from "@/types";
import { toast } from "sonner";

interface GenerateOptions {
  material: string;
  genre: Genre;
  requirements: Requirements;
  apiKey: string;
}

export function useGenerate() {
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generate = useCallback(
    async (
      options: GenerateOptions,
      onChunk: (chunk: string) => void,
      onComplete: () => void
    ) => {
      const { material, genre, requirements, apiKey } = options;

      if (!material.trim()) {
        toast.error("请先输入原始素材");
        return;
      }

      if (!apiKey.trim()) {
        toast.error("请先填写 DeepSeek API Key");
        return;
      }

      setIsGenerating(true);
      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            material,
            genre,
            requirements,
            apiKey,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          let errorMessage = `生成失败: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch {
            const errorText = await response.text();
            if (errorText) errorMessage = errorText;
          }
          throw new Error(errorMessage);
        }

        if (!response.body) {
          throw new Error("未返回流式数据");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data: ")) continue;

            const data = trimmed.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                onChunk(parsed.content);
              }
            } catch {
              // 忽略解析失败的行
            }
          }
        }

        onComplete();
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          // 用户主动停止，不显示错误
          onComplete();
        } else {
          console.error("Generate error:", error);
          toast.error(error instanceof Error ? error.message : "生成失败");
          onComplete();
        }
      } finally {
        setIsGenerating(false);
        abortControllerRef.current = null;
      }
    },
    []
  );

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    isGenerating,
    generate,
    stop,
  };
}
