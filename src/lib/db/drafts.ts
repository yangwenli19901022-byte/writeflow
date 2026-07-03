import { supabase, isSupabaseConfigured } from "./supabase";
import { Draft, Genre, Requirements } from "@/types";

const STORAGE_KEY = "writeflow_drafts";

function loadDraftsFromLocal(): Draft[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveDraftsToLocal(drafts: Draft[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

export async function listDrafts(): Promise<Draft[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("drafts")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data || []) as Draft[];
  }
  return loadDraftsFromLocal();
}

export async function createDraft(
  draft: Omit<Draft, "id" | "created_at" | "updated_at">
): Promise<Draft> {
  const now = new Date().toISOString();
  const newDraft: Draft = {
    ...draft,
    id: crypto.randomUUID(),
    created_at: now,
    updated_at: now,
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("drafts")
      .insert({
        title: newDraft.title,
        material: newDraft.material,
        genre: newDraft.genre,
        requirements: newDraft.requirements,
      })
      .select()
      .single();
    if (error) throw error;
    return data as Draft;
  }

  const drafts = loadDraftsFromLocal();
  drafts.unshift(newDraft);
  saveDraftsToLocal(drafts);
  return newDraft;
}

export async function updateDraft(
  id: string,
  updates: Partial<Omit<Draft, "id" | "created_at" | "updated_at">>
): Promise<Draft> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("drafts")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as Draft;
  }

  const drafts = loadDraftsFromLocal();
  const index = drafts.findIndex((d) => d.id === id);
  if (index === -1) throw new Error("Draft not found");
  drafts[index] = {
    ...drafts[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  // 将更新的草稿移到最前面
  const updated = drafts.splice(index, 1)[0];
  drafts.unshift(updated);
  saveDraftsToLocal(drafts);
  return drafts[0];
}

export async function deleteDraft(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("drafts").delete().eq("id", id);
    if (error) throw error;
    return;
  }

  const drafts = loadDraftsFromLocal().filter((d) => d.id !== id);
  saveDraftsToLocal(drafts);
}
