import { NextRequest } from "next/server";
import { buildPrompt } from "@/lib/prompts";
import { Genre, Requirements } from "@/types";

const KIMI_API_URL = "https://api.kimi.com/coding/v1/chat/completions";
const DEFAULT_MODEL = "kimi-k2.5";

interface ApiErrorResponse {
  error: {
    message: string;
    type?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { material, genre, requirements, apiKey } = body as {
      material: string;
      genre: Genre;
      requirements: Requirements;
      apiKey: string;
    };

    if (!material || !material.trim()) {
      return Response.json(
        { error: "原始素材不能为空" },
        { status: 400 }
      );
    }

    if (!genre) {
      return Response.json(
        { error: "写作体裁不能为空" },
        { status: 400 }
      );
    }

    if (!apiKey || !apiKey.trim()) {
      return Response.json(
        { error: "API Key 不能为空，请先在设置中填写" },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(genre as Genre, material, requirements);

    const response = await fetch(KIMI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          {
            role: "system",
            content:
              "你是一位专业的中文写作助手，擅长根据不同体裁要求将原始素材改写成高质量的文案。请严格按照用户要求的格式输出，不要输出与格式无关的解释性文字。",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        stream: true,
        temperature: 1,
      }),
    });

    if (!response.ok) {
      let errorMessage = `Kimi API 请求失败: ${response.status}`;
      try {
        const errorData: ApiErrorResponse = await response.json();
        errorMessage = errorData.error?.message || errorMessage;
      } catch {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      }
      return Response.json({ error: errorMessage }, { status: response.status });
    }

    if (!response.body) {
      return Response.json(
        { error: "Kimi API 未返回流式数据" },
        { status: 500 }
      );
    }

    // 返回 SSE 流
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith("data: ")) continue;

              const data = trimmed.slice(6);
              if (data === "[DONE]") {
                controller.close();
                return;
              }

              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  controller.enqueue(
                    new TextEncoder().encode(
                      `data: ${JSON.stringify({ content: delta })}\n\n`
                    )
                  );
                }
              } catch {
                // 忽略无法解析的行
              }
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        } finally {
          reader.releaseLock();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Generate API error:", error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "服务器内部错误",
      },
      { status: 500 }
    );
  }
}
