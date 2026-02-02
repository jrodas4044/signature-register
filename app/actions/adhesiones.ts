"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/roles";
import type {
  Adhesion,
  AdhesionLineInput,
  EstadoAdhesion,
  CausaRechazo,
} from "@/lib/types/domain";

export interface SaveAdhesionesResult {
  success: boolean;
  error: string | null;
  duplicateAlerts: string[];
}

/**
 * RF-03: Fetch hoja and its 5 adhesiones by numero_hoja for Speed-Type form.
 */
export async function getAdhesionesByNumeroHoja(numeroHoja: number): Promise<{
  hojaId: string | null;
  adhesiones: Adhesion[] | null;
  error: string | null;
}> {
  try {
    await requireRole(["administrador", "digitador"]);
  } catch (e) {
    return {
      hojaId: null,
      adhesiones: null,
      error: e instanceof Error ? e.message : "Acceso denegado.",
    };
  }

  const supabase = await createClient();
  const { data: hoja, error: hojaError } = await supabase
    .from("hojas")
    .select("id")
    .eq("numero_hoja", numeroHoja)
    .single();

  if (hojaError || !hoja) {
    return { hojaId: null, adhesiones: null, error: "Hoja no encontrada." };
  }

  const { data: adhesiones, error: adhesionesError } = await supabase
    .from("adhesiones")
    .select("*")
    .eq("hoja_id", hoja.id)
    .order("linea_id");

  if (adhesionesError) {
    return {
      hojaId: hoja.id,
      adhesiones: null,
      error: adhesionesError.message,
    };
  }

  return {
    hojaId: hoja.id,
    adhesiones: (adhesiones ?? []) as Adhesion[],
    error: null,
  };
}

/**
 * List adhesiones for a hoja by id (for admin detail view).
 */
export async function listAdhesionesByHojaId(hojaId: string): Promise<{
  data: Adhesion[] | null;
  error: string | null;
}> {
  try {
    await requireRole(["administrador", "digitador", "auditor"]);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("adhesiones")
      .select("*")
      .eq("hoja_id", hojaId)
      .order("linea_id");
    if (error) return { data: null, error: error.message };
    return { data: (data ?? []) as Adhesion[], error: null };
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e.message : "Error al listar adhesiones.",
    };
  }
}

/**
 * Check if DPI already exists with ACEPTADO or PENDIENTE in another adhesion (not this hoja).
 */
async function findDuplicateDpi(
  supabase: Awaited<ReturnType<typeof createClient>>,
  dpi: string | null,
  excludeHojaId: string
): Promise<boolean> {
  if (!dpi || dpi.trim() === "") return false;
  const { data } = await supabase
    .from("adhesiones")
    .select("id")
    .eq("dpi_ciudadano", dpi.trim())
    .in("estado_legal", ["ACEPTADO", "PENDIENTE"])
    .neq("hoja_id", excludeHojaId)
    .limit(1);
  return (data?.length ?? 0) > 0;
}

/**
 * RF-03: Save 5 adhesiones for a sheet. Applies duplicate detection (SRS: mark as RECHAZADO_INTERNO and alert).
 */
export async function saveAdhesiones(
  numeroHoja: number,
  lines: AdhesionLineInput[]
): Promise<SaveAdhesionesResult> {
  const duplicateAlerts: string[] = [];

  try {
    await requireRole(["administrador", "digitador"]);
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Acceso denegado.",
      duplicateAlerts: [],
    };
  }

  if (lines.length !== 5) {
    return {
      success: false,
      error: "Debe enviar exactamente 5 líneas de adhesión.",
      duplicateAlerts: [],
    };
  }

  const supabase = await createClient();
  const { data: hoja, error: hojaError } = await supabase
    .from("hojas")
    .select("id")
    .eq("numero_hoja", numeroHoja)
    .single();

  if (hojaError || !hoja) {
    return {
      success: false,
      error: "Hoja no encontrada.",
      duplicateAlerts: [],
    };
  }

  const hojaId = hoja.id;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.linea_id !== i + 1) {
      return {
        success: false,
        error: `Línea ${i + 1}: linea_id debe ser ${i + 1}.`,
        duplicateAlerts: [],
      };
    }
  }

  const toUpsert: Array<{
    hoja_id: string;
    linea_id: number;
    dpi_ciudadano: string | null;
    nombre_ciudadano: string | null;
    estado_legal: EstadoAdhesion;
    causa_rechazo: CausaRechazo | null;
    id?: string;
  }> = [];

  for (const line of lines) {
    let estadoLegal: EstadoAdhesion = line.estado_legal;
    const dpi = line.dpi_ciudadano?.trim() || null;
    const nombre = line.nombre_ciudadano?.trim() || null;

    if (estadoLegal === "PENDIENTE" || estadoLegal === "ACEPTADO") {
      if (dpi) {
        const isDup = await findDuplicateDpi(supabase, dpi, hojaId);
        if (isDup) {
          estadoLegal = "RECHAZADO_INTERNO";
          duplicateAlerts.push(
            `Línea ${line.linea_id}: Posible Duplicado (DPI ${dpi}).`
          );
        }
      }
    }

    toUpsert.push({
      hoja_id: hojaId,
      linea_id: line.linea_id,
      dpi_ciudadano: dpi,
      nombre_ciudadano: nombre,
      estado_legal: estadoLegal,
      causa_rechazo:
        estadoLegal === "RECHAZADO" || estadoLegal === "RECHAZADO_INTERNO"
          ? line.causa_rechazo
          : null,
    });
  }

  const { data: existing } = await supabase
    .from("adhesiones")
    .select("id, linea_id")
    .eq("hoja_id", hojaId);

  const byLinea = new Map((existing ?? []).map((r) => [r.linea_id, r.id]));

  for (const row of toUpsert) {
    const existingId = byLinea.get(row.linea_id);
    if (existingId) {
      const { error: updateError } = await supabase
        .from("adhesiones")
        .update({
          dpi_ciudadano: row.dpi_ciudadano,
          nombre_ciudadano: row.nombre_ciudadano,
          estado_legal: row.estado_legal,
          causa_rechazo: row.causa_rechazo,
        })
        .eq("id", existingId);
      if (updateError) {
        return {
          success: false,
          error: `Línea ${row.linea_id}: ${updateError.message}`,
          duplicateAlerts,
        };
      }
    } else {
      const { error: insertError } = await supabase
        .from("adhesiones")
        .insert({
          hoja_id: row.hoja_id,
          linea_id: row.linea_id,
          dpi_ciudadano: row.dpi_ciudadano,
          nombre_ciudadano: row.nombre_ciudadano,
          estado_legal: row.estado_legal,
          causa_rechazo: row.causa_rechazo,
        });
      if (insertError) {
        return {
          success: false,
          error: `Línea ${row.linea_id}: ${insertError.message}`,
          duplicateAlerts,
        };
      }
    }
  }

  return { success: true, error: null, duplicateAlerts };
}
