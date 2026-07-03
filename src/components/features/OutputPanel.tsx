"use client";

import { Copy, Download, RotateCcw, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface OutputPanelProps {
  output: string;
  isGenerating: boolean;
  onStop: () => void;
  onRegenerate: () => void;
}

export function OutputPanel({
  output,
  isGenerating,
  onStop,
  onRegenerate,
}: OutputPanelProps) {
  const handleCopy = async () => {
    if (!output.trim()) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success("已复制到剪贴板");
    } catch {
      toast.error("复制失败，请手动复制");
    }
  };

  const handleDownloadMarkdown = () => {
    if (!output.trim()) return;
    const blob = new Blob([output], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `writeflow-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("已导出 Markdown 文件");
  };

  return (
    <Card className="flex h-full flex-col rounded-none border-0 shadow-none lg:rounded-lg lg:border lg:shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-4 lg:px-6">
        <CardTitle className="text-base font-medium">生成结果</CardTitle>
        <div className="flex items-center gap-1">
          {output && (
            <>
              <Button variant="ghost" size="sm" className="gap-1" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
                复制
              </Button>
              <Button variant="ghost" size="sm" className="gap-1" onClick={handleDownloadMarkdown}>
                <Download className="h-4 w-4" />
                导出
              </Button>
            </>
          )}
          {isGenerating ? (
            <Button variant="ghost" size="sm" className="gap-1" onClick={onStop}>
              <Square className="h-4 w-4" />
              停止
            </Button>
          ) : (
            output && (
              <Button variant="ghost" size="sm" className="gap-1" onClick={onRegenerate}>
                <RotateCcw className="h-4 w-4" />
                重新生成
              </Button>
            )
          )}
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="p-4 lg:p-6">
            {!output && !isGenerating ? (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
                <div className="rounded-full bg-zinc-100 p-4">
                  <RotateCcw className="h-6 w-6 opacity-50" />
                </div>
                <p>在左侧输入素材并选择体裁</p>
                <p className="text-xs">点击"开始生成"后，结果将显示在这里</p>
              </div>
            ) : (
              <div className="prose prose-zinc max-w-none prose-headings:font-semibold prose-p:leading-relaxed">
                <ReactMarkdown>{output || "正在生成..."}</ReactMarkdown>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
