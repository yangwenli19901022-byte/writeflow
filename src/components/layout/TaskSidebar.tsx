"use client";

import { FileText, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Draft } from "@/types";

interface TaskSidebarProps {
  drafts: Draft[];
  selectedDraftId: string | null;
  onSelectDraft: (draft: Draft) => void;
  onNewDraft: () => void;
  onDeleteDraft: (id: string) => void;
}

export function TaskSidebar({
  drafts,
  selectedDraftId,
  onSelectDraft,
  onNewDraft,
  onDeleteDraft,
}: TaskSidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-white lg:flex">
      <div className="flex h-14 items-center justify-between border-b px-4">
        <span className="text-sm font-medium text-muted-foreground">草稿列表</span>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNewDraft}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {drafts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center text-sm text-muted-foreground">
              <FileText className="h-8 w-8 opacity-50" />
              <p>暂无草稿</p>
              <p className="text-xs">点击上方 + 创建新任务</p>
            </div>
          ) : (
            <div className="space-y-1">
              {drafts.map((draft) => (
                <button
                  key={draft.id}
                  onClick={() => onSelectDraft(draft)}
                  className={cn(
                    "group flex w-full flex-col gap-1 rounded-lg px-3 py-2 text-left transition-colors",
                    selectedDraftId === draft.id
                      ? "bg-zinc-100"
                      : "hover:bg-zinc-50"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="line-clamp-1 text-sm font-medium">
                      {draft.title || "未命名草稿"}
                    </span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDraft(draft.id);
                      }}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                    </span>
                  </div>
                  <span className="line-clamp-1 text-xs text-muted-foreground">
                    {new Date(draft.updated_at).toLocaleDateString("zh-CN")}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
