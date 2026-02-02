/**
 * Script de migración CSV → Supabase (SCA-Political).
 * Carga "Base de datos General.csv" en lideres, hojas y adhesiones.
 *
 * Uso:
 *   npx ts-node scripts/migrate-csv-to-supabase.ts [--dry-run] [--file ruta.csv]
 *
 * Requiere: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (o NEXT_PUBLIC_SUPABASE_URL + service key en .env).
 */

import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";

try {
  require("dotenv").config();
} catch {
  // dotenv opcional
}

const DEFAULT_CSV =
  "BASE DE DATOS PARA ESTADÍSTICAS DE ERRORES.xlsx - Base de datos General.csv";

// --- Encoding: try Latin1 first (common for Excel CSV export), then UTF-8 ---
function readCsvContent(filePath: string): string {
  const buf = fs.readFileSync(filePath);
  const asLatin1 = buf.toString("latin1");
  const asUtf8 = buf.toString("utf8");
  if (asLatin1.includes("OBSERVACIÓN") || asLatin1.includes("López") || asLatin1.includes("PADRÓN")) {
    return asLatin1;
  }
  return asUtf8;
}

// --- Parse CSV line (handles quoted fields) ---
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if ((c === "," && !inQuotes) || (c === "\n" && !inQuotes)) {
      out.push(cur.trim());
      cur = "";
      if (c === "\n") break;
    } else {
      cur += c;
    }
  }
  out.push(cur.trim());
  return out;
}

function parseCsv(content: string): string[][] {
  const lines = content.split(/\r?\n/).filter((l) => l.length > 0);
  return lines.map((l) => parseCsvLine(l));
}

// --- Normalize for matching (lowercase, no accents, collapse spaces) ---
function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// --- ESTADO CSV → estado_legal (estado_adhesion) ---
const ESTADO_MAP: Record<string, string> = {
  ACEPTADO: "ACEPTADO",
  RECHAZADO: "RECHAZADO",
  PENDIENTE: "PENDIENTE",
  OMITIDO: "OMITIDO",
  "REVISION TSE": "REVISION_TSE",
  "REVISION_TSE": "REVISION_TSE",
};

function mapEstado(raw: string): string {
  const t = raw.trim().toUpperCase().replace(/\s+/g, " ");
  if (t === "REVISIÓN TSE" || t === "REVISION TSE") return "REVISION_TSE";
  return ESTADO_MAP[t] ?? (t ? "PENDIENTE" : "PENDIENTE");
}

// --- OBSERVACIÓN CSV → causa_rechazo (una clave por valor BD; matching por normalizado en mapCausaRechazo) ---
const OBSERVACION_MAP: Record<string, string> = {
  FIRMA: "FIRMA_NO_COINCIDE",
  "NO EMPADRONADO": "NO_EMPADRONADO",
  "ACTUALIZACION DE DATOS EN PADRON": "ACTUALIZACION_PADRON",
  "CAPTURA DE DATOS EN HOJA": "ERROR_CAPTURA",
  "AFILIADO A UNION": "AFILIADO",
  "IMPRESION DACTILAR": "IMPRESION_DACTILAR",
  PLANA: "PLANA",
  "DATOS INCOMPLETOS": "DATOS_INCOMPLETOS",
  DUPLICADO: "DUPLICADO",
};

function mapCausaRechazo(raw: string): string | null {
  if (!raw || !raw.trim()) return null;
  const n = normalize(raw).toUpperCase().replace(/\s+/g, " ");
  for (const [k, v] of Object.entries(OBSERVACION_MAP)) {
    if (normalize(k).toUpperCase().replace(/\s+/g, " ") === n) return v;
  }
  const key = raw.trim().toUpperCase().replace(/\s+/g, " ");
  return OBSERVACION_MAP[key] ?? null;
}

interface CsvRow {
  numeroHoja: number;
  linea: number;
  estado: string;
  causaRechazo: string | null;
  lider: string;
}

function loadCsvRows(filePath: string): CsvRow[] {
  const content = readCsvContent(filePath);
  const rows = parseCsv(content);
  if (rows.length < 2) return [];
  const header = rows[0].map((h) => h.trim());
  const dataRows = rows.slice(1);
  const fi = (re: RegExp, fallback: number) => {
    const i = header.findIndex((h) => re.test(h));
    return i >= 0 ? i : fallback;
  };
  const idxNoHoja = fi(/NO\.?\s*HOJA/i, 0);
  const idxLinea = fi(/LINEA/i, 1);
  const idxEstado = fi(/ESTADO/i, 2);
  const idxObs = fi(/OBSERVACI/i, 3);
  const idxLider = fi(/LIDER/i, 4);
  const get = (r: string[], i: number) => (i >= 0 && i < r.length ? r[i].trim() : "");

  const out: CsvRow[] = [];
  for (const r of dataRows) {
    const noHoja = parseInt(get(r, idxNoHoja), 10);
    const linea = parseInt(get(r, idxLinea), 10);
    if (Number.isNaN(noHoja) || noHoja < 1 || Number.isNaN(linea) || linea < 1 || linea > 5)
      continue;
    out.push({
      numeroHoja: noHoja,
      linea,
      estado: mapEstado(get(r, idxEstado)),
      causaRechazo: mapCausaRechazo(get(r, idxObs)),
      lider: get(r, idxLider).trim(),
    });
  }
  return out;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const fileArg = process.argv.find((a) => a.startsWith("--file="));
  const csvPath = fileArg
    ? fileArg.replace("--file=", "")
    : path.join(process.cwd(), DEFAULT_CSV);

  if (!fs.existsSync(csvPath)) {
    console.error("Archivo no encontrado:", csvPath);
    process.exit(1);
  }

  console.log("Leyendo CSV:", csvPath);
  const rows = loadCsvRows(csvPath);
  console.log("Filas parseadas:", rows.length);

  const rowsWithLeader = rows.filter((r) => r.lider.length > 0);
  const uniqueLeaderNames = new Map<string, string>();
  for (const r of rowsWithLeader) {
    const key = normalize(r.lider);
    if (!uniqueLeaderNames.has(key)) uniqueLeaderNames.set(key, r.lider);
  }
  const leaderNamesSorted = [...uniqueLeaderNames.values()].sort();
  const numeroHojasWithLeader = new Set(rowsWithLeader.map((r) => r.numeroHoja));

  console.log("Líderes únicos:", leaderNamesSorted.length);
  console.log("Hojas con al menos un líder:", numeroHojasWithLeader.size);
  console.log("Adhesiones a insertar (filas con hoja migrable):", rows.filter((r) => numeroHojasWithLeader.has(r.numeroHoja)).length);

  if (dryRun) {
    console.log("\n[DRY-RUN] No se escribe en Supabase.");
    return;
  }

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("Falta SUPABASE_URL (o NEXT_PUBLIC_SUPABASE_URL) y SUPABASE_SERVICE_ROLE_KEY en el entorno.");
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey);

  const nameToDpi: Record<string, string> = {};
  leaderNamesSorted.forEach((name, i) => {
    nameToDpi[name] = `MIGRADO-${i + 1}`;
  });

  const leaderRows = leaderNamesSorted.map((nombre) => ({
    nombre,
    dpi: nameToDpi[nombre],
    zona: null as string | null,
    estado: "activo" as const,
  }));

  const existingLideres = await supabase.from("lideres").select("id, dpi, nombre");
  const existingDpis = new Set((existingLideres.data ?? []).map((l) => l.dpi));
  const toInsertLideres = leaderRows.filter((r) => !existingDpis.has(r.dpi));
  if (toInsertLideres.length > 0) {
    const { error } = await supabase.from("lideres").upsert(toInsertLideres, {
      onConflict: "dpi",
      ignoreDuplicates: true,
    });
    if (error) {
      console.error("Error insertando líderes:", error.message);
      process.exit(1);
    }
    console.log("Líderes insertados/actualizados:", toInsertLideres.length);
  }

  const allLideres = await supabase.from("lideres").select("id, nombre, dpi");
  const nameToLiderId: Record<string, string> = {};
  for (const l of allLideres.data ?? []) {
    nameToLiderId[l.nombre] = l.id;
  }
  for (const name of leaderNamesSorted) {
    if (!nameToLiderId[name]) {
      const dpi = nameToDpi[name];
      const found = (allLideres.data ?? []).find((x) => x.dpi === dpi);
      if (found) nameToLiderId[name] = found.id;
    }
  }

  const hojaToLider: Record<number, string> = {};
  for (const r of rowsWithLeader) {
    if (!hojaToLider[r.numeroHoja]) hojaToLider[r.numeroHoja] = r.lider;
  }

  const existingHojas = await supabase.from("hojas").select("id, numero_hoja");
  const existingNumHojas = new Set((existingHojas.data ?? []).map((h) => h.numero_hoja));
  const hojaRows: { numero_hoja: number; lider_id: string; estado_fisico: string }[] = [];
  for (const num of numeroHojasWithLeader) {
    if (existingNumHojas.has(num)) continue;
    const leaderName = hojaToLider[num];
    const liderId = nameToLiderId[leaderName];
    if (!liderId) continue;
    hojaRows.push({
      numero_hoja: num,
      lider_id: liderId,
      estado_fisico: "PROCESADA",
    });
  }

  if (hojaRows.length > 0) {
    const BATCH = 500;
    for (let i = 0; i < hojaRows.length; i += BATCH) {
      const chunk = hojaRows.slice(i, i + BATCH);
      const { error } = await supabase.from("hojas").upsert(chunk, {
        onConflict: "numero_hoja",
        ignoreDuplicates: true,
      });
      if (error) {
        console.error("Error insertando hojas:", error.message);
        process.exit(1);
      }
    }
    console.log("Hojas insertadas:", hojaRows.length);
  }

  const allHojas = await supabase.from("hojas").select("id, numero_hoja");
  const numeroToHojaId: Record<number, string> = {};
  for (const h of allHojas.data ?? []) {
    numeroToHojaId[h.numero_hoja] = h.id;
  }

  const adhesionRows: {
    hoja_id: string;
    linea_id: number;
    estado_legal: string;
    causa_rechazo: string | null;
    dpi_ciudadano: string | null;
    nombre_ciudadano: string | null;
  }[] = [];
  for (const r of rows) {
    const hojaId = numeroToHojaId[r.numeroHoja];
    if (!hojaId) continue;
    adhesionRows.push({
      hoja_id: hojaId,
      linea_id: r.linea,
      estado_legal: r.estado,
      causa_rechazo: r.causaRechazo,
      dpi_ciudadano: null,
      nombre_ciudadano: null,
    });
  }

  if (adhesionRows.length > 0) {
    const BATCH = 300;
    let inserted = 0;
    for (let i = 0; i < adhesionRows.length; i += BATCH) {
      const chunk = adhesionRows.slice(i, i + BATCH);
      const { error } = await supabase.from("adhesiones").upsert(chunk, {
        onConflict: "hoja_id,linea_id",
      });
      if (error) {
        console.error("Error insertando adhesiones:", error.message);
        process.exit(1);
      }
      inserted += chunk.length;
    }
    console.log("Adhesiones insertadas/actualizadas:", inserted);
  }

  console.log("\nMigración completada.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
