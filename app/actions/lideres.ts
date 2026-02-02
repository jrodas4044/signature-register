"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/roles";
import type { Lider, LiderEstado } from "@/lib/types/domain";

export interface ListLideresResult {
  data: Lider[] | null;
  total: number;
  page: number;
  pageSize: number;
  error: string | null;
}

export async function listLideres(
  page = 1,
  pageSize = 10,
  includeDeleted = false
): Promise<ListLideresResult> {
  try {
    await requireRole(["administrador", "digitador", "auditor"]);
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    let query = supabase
      .from("lideres")
      .select("*", { count: "exact" })
      .order("nombre")
      .range(from, to);
    if (!includeDeleted) {
      query = query.is("deleted_at", null);
    }
    const { data, error, count } = await query;
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

/** Returns all leaders without pagination (e.g. for dropdowns). Excludes soft-deleted. */
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
      .is("deleted_at", null)
      .order("nombre");
    if (error) return { data: null, error: error.message };
    return { data: (data ?? []) as Lider[], error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : "Error al listar líderes." };
  }
}

export async function getLider(id: string): Promise<{ data: Lider | null; error: string | null }> {
  try {
    await requireRole(["administrador", "digitador", "auditor"]);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lideres")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return { data: null, error: error.message };
    return { data: data as Lider, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : "Error al obtener líder." };
  }
}

export interface UpdateLiderInput {
  nombre: string;
  zona: string | null;
  dpi: string;
  estado: LiderEstado;
}

export interface UpdateLiderResult {
  success: boolean;
  error: string | null;
}

export async function updateLider(
  id: string,
  input: UpdateLiderInput
): Promise<UpdateLiderResult> {
  try {
    await requireRole(["administrador"]);
    const supabase = await createClient();
    const { error } = await supabase
      .from("lideres")
      .update({
        nombre: input.nombre.trim(),
        zona: input.zona?.trim() || null,
        dpi: input.dpi.trim(),
        estado: input.estado,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .is("deleted_at", null);
    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "Ya existe un líder con ese DPI." };
      }
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Error al actualizar líder.",
    };
  }
}

export interface SoftDeleteLiderResult {
  success: boolean;
  error: string | null;
}

export async function softDeleteLider(id: string): Promise<SoftDeleteLiderResult> {
  try {
    await requireRole(["administrador"]);
    const supabase = await createClient();
    const { error } = await supabase
      .from("lideres")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      .is("deleted_at", null);
    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Error al eliminar líder.",
    };
  }
}
