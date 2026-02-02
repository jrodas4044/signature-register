"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/roles";
import type { Lider } from "@/lib/types/domain";

export interface ListLideresResult {
  data: Lider[] | null;
  total: number;
  page: number;
  pageSize: number;
  error: string | null;
}

export async function listLideres(
  page = 1,
  pageSize = 10
): Promise<ListLideresResult> {
  try {
    await requireRole(["administrador", "digitador", "auditor"]);
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error, count } = await supabase
      .from("lideres")
      .select("*", { count: "exact" })
      .order("nombre")
      .range(from, to);
    if (error)
      return { data: null, total: 0, page, pageSize, error: error.message };
    return {
      data: (data ?? []) as Lider[],
      total: count ?? 0,
      page,
      pageSize,
      error: null,
    };
  } catch (e) {
    return {
      data: null,
      total: 0,
      page,
      pageSize,
      error: e instanceof Error ? e.message : "Error al listar líderes.",
    };
  }
}

/** Returns all leaders without pagination (e.g. for dropdowns). */
export async function listAllLideres(): Promise<{
  data: Lider[] | null;
  error: string | null;
}> {
  try {
    await requireRole(["administrador", "digitador", "auditor"]);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lideres")
      .select("*")
      .order("nombre");
    if (error) return { data: null, error: error.message };
    return { data: (data ?? []) as Lider[], error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : "Error al listar líderes." };
  }
}
