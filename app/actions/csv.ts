"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/roles";
import type { EstadoAdhesion, CausaRechazo } from "@/lib/types/domain";

const ESTADO_ADHESION_SET = new Set<string>([
  "PENDIENTE",
  "ACEPTADO",
  "RECHAZADO",
  "REVISION_TSE",
  "OMITIDO",
  "RECHAZADO_INTERNO",
]);

const CAUSA_RECHAZO_SET = new Set<string>([
  "NO_EMPADRONADO",
  "FIRMA_NO_COINCIDE",
  "ERROR_CAPTURA",
  "DATOS_INCOMPLETOS",
  "DUPLICADO",
  "IMPRESION_DACTILAR",
  "PLANA",
  "AFILIADO",
  "ACTUALIZACION_PADRON",
]);

export interface CsvRow {
  numero_hoja: number;
  linea: number;
  estado: EstadoAdhesion;
  causa_rechazo: CausaRechazo | null;
}

export interface ImportCsvResult {
  success: boolean;
  error: string | null;
  updated: number;
  skipped: number;
  invalidRows: string[];
}

function parseCsv(content: string): string[][] {
  const lines = content.trim().split(/\r?\n/);
  return lines.map((line) => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if ((c === "," || c === "\t") && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += c;
      }
    }
    result.push(current.trim());
    return result;
  });
}

/**
 * RF-04: Import TSE dictamen CSV. Columns: numero_hoja, linea (1-5), estado, causa_rechazo (optional).
 * Header row optional; if first row looks like numbers, treat as data.
 */
export async function importTseCsv(csvContent: string): Promise<ImportCsvResult> {
  const invalidRows: string[] = [];
  let updated = 0;
  let skipped = 0;

  try {
    await requireRole(["administrador", "digitador"]);
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Acceso denegado.",
      updated: 0,
      skipped: 0,
      invalidRows: [],
    };
  }

  const rows = parseCsv(csvContent);
  if (rows.length === 0) {
    return {
      success: false,
      error: "El archivo CSV está vacío.",
      updated: 0,
      skipped: 0,
      invalidRows: [],
    };
  }

  const dataRows: CsvRow[] = [];
  const header = rows[0];
  const isHeader =
    header.some((c) => /^[a-zA-Z]/.test(c)) ||
    header[0]?.toLowerCase().includes("hoja") ||
    header[0]?.toLowerCase().includes("numero");
  const start = isHeader ? 1 : 0;

  for (let i = start; i < rows.length; i++) {
    const cells = rows[i];
    const numHoja = Number(cells[0]);
    const linea = Number(cells[1]);
    const estadoRaw = (cells[2] ?? "").trim().toUpperCase().replace(/\s/g, "_");
    const causaRaw = (cells[3] ?? "").trim().toUpperCase().replace(/\s/g, "_");

    if (Number.isNaN(numHoja) || numHoja < 1) {
      invalidRows.push(`Fila ${i + 1}: número de hoja inválido`);
      continue;
    }
    if (Number.isNaN(linea) || linea < 1 || linea > 5) {
      invalidRows.push(`Fila ${i + 1}: línea debe ser 1-5`);
      continue;
    }
    if (!ESTADO_ADHESION_SET.has(estadoRaw)) {
      invalidRows.push(`Fila ${i + 1}: estado inválido "${cells[2]}"`);
      continue;
    }
    const causa: CausaRechazo | null =
      causaRaw && CAUSA_RECHAZO_SET.has(causaRaw)
        ? (causaRaw as CausaRechazo)
        : null;

    dataRows.push({
      numero_hoja: numHoja,
      linea,
      estado: estadoRaw as EstadoAdhesion,
      causa_rechazo: causa,
    });
  }

  const supabase = await createClient();

  for (const row of dataRows) {
    const { data: hoja } = await supabase
      .from("hojas")
      .select("id")
      .eq("numero_hoja", row.numero_hoja)
      .single();

    if (!hoja) {
      skipped++;
      continue;
    }

    const { data: adhesion } = await supabase
      .from("adhesiones")
      .select("id, estado_legal")
      .eq("hoja_id", hoja.id)
      .eq("linea_id", row.linea)
      .single();

    if (!adhesion) {
      skipped++;
      continue;
    }

    const { error } = await supabase
      .from("adhesiones")
      .update({
        estado_legal: row.estado,
        causa_rechazo:
          row.estado === "RECHAZADO" || row.estado === "RECHAZADO_INTERNO"
            ? row.causa_rechazo
            : null,
      })
      .eq("id", adhesion.id);

    if (error) {
      invalidRows.push(
        `Hoja ${row.numero_hoja} línea ${row.linea}: ${error.message}`
      );
      continue;
    }

    updated++;
  }

  return {
    success: invalidRows.length === 0,
    error: null,
    updated,
    skipped,
    invalidRows,
  };
}
