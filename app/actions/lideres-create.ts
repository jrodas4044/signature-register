"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/roles";

export interface CreateLiderResult {
  success: boolean;
  error: string | null;
}

export async function createLider(
  nombre: string,
  zona: string,
  dpi: string
): Promise<CreateLiderResult> {
  try {
    await requireRole(["administrador"]);
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Acceso denegado.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("lideres").insert({
    nombre: nombre.trim(),
    zona: zona.trim() || null,
    dpi: dpi.trim(),
    estado: "activo",
  });

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Ya existe un líder con ese DPI." };
    }
    return { success: false, error: error.message };
  }
  return { success: true, error: null };
}
