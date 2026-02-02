"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/roles";
import type { EstadoHoja } from "@/lib/types/domain";

const INITIAL_ESTADO_HOJA: EstadoHoja = "PENDIENTE_ENTREGA";

export interface AssignBulkResult {
  success: boolean;
  created: number;
  skipped: number;
  errors: string[];
}

/**
 * RF-01: Asignación masiva de hojas a un líder.
 * Creates hojas in range [fromNum, toNum] and 5 adhesiones per hoja (block integrity).
 * Only Administrador.
 */
export async function assignBulkSheets(
  liderId: string,
  fromNum: number,
  toNum: number
): Promise<AssignBulkResult> {
  const errors: string[] = [];
  let created = 0;
  let skipped = 0;

  try {
    await requireRole(["administrador"]);
  } catch (e) {
    return {
      success: false,
      created: 0,
      skipped: 0,
      errors: [e instanceof Error ? e.message : "Acceso denegado."],
    };
  }

  if (fromNum > toNum) {
    return {
      success: false,
      created: 0,
      skipped: 0,
      errors: ["El número inicial no puede ser mayor que el final."],
    };
  }

  const supabase = await createClient();

  for (let num = fromNum; num <= toNum; num++) {
    const { data: existing } = await supabase
      .from("hojas")
      .select("id")
      .eq("numero_hoja", num)
      .single();

    if (existing) {
      skipped++;
      continue;
    }

    const { data: newHoja, error: hojaError } = await supabase
      .from("hojas")
      .insert({
        numero_hoja: num,
        lider_id: liderId,
        estado_fisico: INITIAL_ESTADO_HOJA,
      })
      .select("id")
      .single();

    if (hojaError) {
      errors.push(`Hoja ${num}: ${hojaError.message}`);
      continue;
    }

    if (!newHoja?.id) {
      errors.push(`Hoja ${num}: no se obtuvo ID.`);
      continue;
    }

    const adhesiones = [1, 2, 3, 4, 5].map((linea_id) => ({
      hoja_id: newHoja.id,
      linea_id,
      estado_legal: "PENDIENTE" as const,
    }));

    const { error: adhesionesError } = await supabase
      .from("adhesiones")
      .insert(adhesiones);

    if (adhesionesError) {
      errors.push(`Hoja ${num}: error al crear adhesiones: ${adhesionesError.message}`);
      await supabase.from("hojas").delete().eq("id", newHoja.id);
      continue;
    }

    created++;
  }

  return {
    success: errors.length === 0,
    created,
    skipped,
    errors,
  };
}

export interface ReceiveSheetResult {
  success: boolean;
  error: string | null;
}

/**
 * RF-02: Recepción de hoja. Transición CIRCULACION -> RECIBIDA.
 * Administrador (or future "Receptor" role).
 */
export async function receiveSheet(numeroHoja: number): Promise<ReceiveSheetResult> {
  try {
    await requireRole(["administrador"]);
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Acceso denegado.",
    };
  }

  const supabase = await createClient();
  const { data: hoja, error: findError } = await supabase
    .from("hojas")
    .select("id, estado_fisico")
    .eq("numero_hoja", numeroHoja)
    .single();

  if (findError || !hoja) {
    return { success: false, error: "Hoja no encontrada." };
  }

  if (hoja.estado_fisico !== "CIRCULACION") {
    return {
      success: false,
      error: `La hoja no está en circulación (estado actual: ${hoja.estado_fisico}).`,
    };
  }

  const { error: updateError } = await supabase
    .from("hojas")
    .update({
      estado_fisico: "RECIBIDA",
      fecha_recepcion: new Date().toISOString(),
    })
    .eq("id", hoja.id);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return { success: true, error: null };
}
