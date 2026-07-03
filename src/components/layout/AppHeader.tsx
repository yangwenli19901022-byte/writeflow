"use client";

import { PenLine, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AppHeaderProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export function AppHeader({ apiKey, onApiKeyChange }: AppHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-white px-4 lg:px-6">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white">
          <PenLine className="h-4 w-4" />
        </div>
        <span className="text-lg font-semibold tracking-tight">WriteFlow</span>
      </div>

      <Dialog>
        <DialogTrigger
          render={
            <Button variant="ghost" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              设置
            </Button>
          }
        />
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>API 设置</DialogTitle>
            <DialogDescription>
              请填写你的 Kimi（Moonshot AI）API Key。Key 仅存储在本地浏览器中。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="api-key">Kimi API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                在{" "}
                <a
                  href="https://platform.moonshot.cn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  Moonshot 开放平台
                </a>{" "}
                获取 API Key。
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
