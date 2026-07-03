"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { TaskSidebar } from "@/components/layout/TaskSidebar";
import { InputPanel } from "@/components/features/InputPanel";
import { OutputPanel } from "@/components/features/OutputPanel";
import { useGenerate } from "@/hooks/useGenerate";
import { createDraft, listDrafts, updateDraft, deleteDraft } from "@/lib/db/drafts";
import { createGeneration, listGenerationsByDraft } from "@/lib/db/generations";
import { Draft, Genre, Requirements } from "@/types";
import { toast } from "sonner";

const DEFAULT_REQUIREMENTS: Requirements = {
  tone: "general",
  wordCount: "medium",
  customWordCount: "",
  extra: "",
};

const createEmptyDraftData = (): Omit<
  Draft,
  "id" | "created_at" | "updated_at"
> => ({
  title: "新任务",
  material: "",
  genre: "wechat",
  requirements: { ...DEFAULT_REQUIREMENTS },
});

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  const [material, setMaterial] = useState("");
  const [genre, setGenre] = useState<Genre>("wechat");
  const [requirements, setRequirements] = useState<Requirements>(DEFAULT_REQUIREMENTS);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { isGenerating, generate, stop } = useGenerate();

  const pendingUpdateRef = useRef<Promise<unknown> | null>(null);

  // 从 localStorage 加载 API Key
  useEffect(() => {
    const savedKey = localStorage.getItem("writeflow_api_key") || "";
    setApiKey(savedKey);
  }, []);

  // 保存 API Key
  const handleApiKeyChange = useCallback((key: string) => {
    setApiKey(key);
    localStorage.setItem("writeflow_api_key", key);
  }, []);

  // 初始加载草稿列表
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    listDrafts()
      .then((data) => {
        if (!mounted) return;
        setDrafts(data);
        if (data.length > 0) {
          setSelectedDraftId(data[0].id);
        }
      })
      .catch((err) => {
        console.error("Failed to load drafts:", err);
        toast.error("加载草稿失败");
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // 加载选中草稿的内容和最新生成结果
  useEffect(() => {
    const currentDraft = drafts.find((d) => d.id === selectedDraftId);
    if (currentDraft) {
      setMaterial(currentDraft.material);
      setGenre(currentDraft.genre);
      setRequirements(currentDraft.requirements);
      setOutput("");
      // 加载最新生成结果
      listGenerationsByDraft(currentDraft.id)
        .then((generations) => {
          if (generations.length > 0) {
            setOutput(generations[0].output);
          }
        })
        .catch((err) => {
          console.error("Failed to load generations:", err);
        });
    }
  }, [selectedDraftId, drafts]);

  // 自动保存当前草稿的修改
  const saveCurrentDraft = useCallback(async () => {
    if (!selectedDraftId) return;
    const title = material.slice(0, 20) || "未命名草稿";
    const updatePromise = updateDraft(selectedDraftId, {
      title,
      material,
      genre,
      requirements,
    });
    pendingUpdateRef.current = updatePromise.catch(() => {});
    try {
      const updated = await updatePromise;
      setDrafts((prev) =>
        prev.map((d) => (d.id === updated.id ? updated : d))
      );
    } catch (err) {
      console.error("Failed to auto-save draft:", err);
    } finally {
      pendingUpdateRef.current = null;
    }
  }, [selectedDraftId, material, genre, requirements]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      saveCurrentDraft();
    }, 800);
    return () => clearTimeout(timeout);
  }, [saveCurrentDraft]);

  const handleNewDraft = async () => {
    // 等待当前保存完成
    if (pendingUpdateRef.current) {
      await pendingUpdateRef.current;
    }
    try {
      const newDraft = await createDraft(createEmptyDraftData());
      setDrafts((prev) => [newDraft, ...prev]);
      setSelectedDraftId(newDraft.id);
      setMaterial(newDraft.material);
      setGenre(newDraft.genre);
      setRequirements(newDraft.requirements);
      setOutput("");
    } catch (err) {
      console.error("Failed to create draft:", err);
      toast.error("创建草稿失败");
    }
  };

  const handleSelectDraft = (draft: Draft) => {
    setSelectedDraftId(draft.id);
  };

  const handleDeleteDraft = async (id: string) => {
    try {
      await deleteDraft(id);
      setDrafts((prev) => prev.filter((d) => d.id !== id));
      if (selectedDraftId === id) {
        setSelectedDraftId(null);
        setMaterial("");
        setGenre("wechat");
        setRequirements(DEFAULT_REQUIREMENTS);
        setOutput("");
      }
    } catch (err) {
      console.error("Failed to delete draft:", err);
      toast.error("删除草稿失败");
    }
  };

  const handleGenerate = async () => {
    if (!selectedDraftId) {
      // 没有选中草稿时先创建一个
      await handleNewDraft();
      return;
    }

    // 确保当前草稿已保存
    await saveCurrentDraft();

    setOutput("");
    let generatedOutput = "";

    generate(
      { material, genre, requirements, apiKey },
      (chunk) => {
        generatedOutput += chunk;
        setOutput((prev) => prev + chunk);
      },
      async () => {
        // 生成完成后保存结果
        if (generatedOutput && selectedDraftId) {
          try {
            await createGeneration({
              draft_id: selectedDraftId,
              model: "kimi-k2.5",
              prompt_version: "1.0",
              output: generatedOutput,
            });
          } catch (err) {
            console.error("Failed to save generation:", err);
          }
        }
      }
    );
  };

  const handleStop = () => {
    stop();
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-zinc-50 text-muted-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
        <p className="mt-4 text-sm">加载中...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-50">
      <AppHeader apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
      <div className="flex flex-1 overflow-hidden">
        <TaskSidebar
          drafts={drafts}
          selectedDraftId={selectedDraftId}
          onSelectDraft={handleSelectDraft}
          onNewDraft={handleNewDraft}
          onDeleteDraft={handleDeleteDraft}
        />
        <main className="flex flex-1 flex-col overflow-hidden lg:flex-row lg:gap-4 lg:p-4">
          <div className="flex h-1/2 flex-col overflow-hidden lg:h-full lg:flex-1">
            <InputPanel
              material={material}
              onMaterialChange={setMaterial}
              genre={genre}
              onGenreChange={setGenre}
              requirements={requirements}
              onRequirementsChange={setRequirements}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>
          <div className="flex h-1/2 flex-col overflow-hidden lg:h-full lg:flex-1">
            <OutputPanel
              output={output}
              isGenerating={isGenerating}
              onStop={handleStop}
              onRegenerate={handleRegenerate}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
