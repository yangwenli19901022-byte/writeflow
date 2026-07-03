import { supabase, isSupabaseConfigured } from "./supabase";
import { Generation } from "@/types";

const STORAGE_KEY = "writeflow_generations";

function loadGenerationsFromLocal(): Generation[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveGenerationsToLocal(generations: Generation[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(generations));
}

export async function createGeneration(
  generation: Omit<Generation, "id" | "created_at">
): Promise<Generation> {
  const newGeneration: Generation = {
    ...generation,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("generations")
      .insert({
        draft_id: newGeneration.draft_id,
        model: newGeneration.model,
        prompt_version: newGeneration.prompt_version,
        output: newGeneration.output,
        tokens_used: newGeneration.tokens_used,
      })
      .select()
      .single();
    if (error) throw error;
    return data as Generation;
  }

  const generations = loadGenerationsFromLocal();
  generations.unshift(newGeneration);
  saveGenerationsToLocal(generations);
  return newGeneration;
}

export async function listGenerationsByDraft(
  draftId: string
): Promise<Generation[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("generations")
      .select("*")
      .eq("draft_id", draftId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []) as Generation[];
  }

  return loadGenerationsFromLocal().filter((g) => g.draft_id === draftId);
}
