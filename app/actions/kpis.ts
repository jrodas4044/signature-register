"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/roles";

export interface TopPerformerRow {
  lider_id: string;
  nombre: string;
  zona: string | null;
  aceptadas: number;
  rechazadas: number;
  revision_tse: number;
  efectividad_real: number;
  hojas_asignadas: number;
  hojas_recibidas: number;
  cumplimiento_meta: number;
}

export interface FraudAlertRow {
  lider_id: string;
  nombre: string;
  zona: string | null;
  total_rechazadas: number;
  rechazos_firma_impresion: number;
  porcentaje_firma_impresion: number;
}

const FRAUD_CAUSES = ["IMPRESION_DACTILAR", "PLANA", "FIRMA_NO_COINCIDE"];
const FRAUD_THRESHOLD_PERCENT = 15;

export interface LiderKpis {
  hojas_asignadas: number;
  hojas_recibidas: number;
  aceptadas: number;
  rechazadas: number;
  revision_tse: number;
  efectividad_real: number;
  cumplimiento_meta: number;
}

export interface TopPerformersResult {
  data: TopPerformerRow[] | null;
  total: number;
  page: number;
  pageSize: number;
  error: string | null;
}

/**
 * RF-05: Top Performers by Efectividad Real.
 * Efectividad = Aceptadas / (Aceptadas + Rechazadas + Revisión) × 100.
 * Cumplimiento = Hojas Recibidas / Hojas Asignadas × 100.
 */
export async function getTopPerformers(
  page = 1,
  pageSize = 10
): Promise<TopPerformersResult> {
  try {
    await requireRole(["administrador", "digitador", "auditor"]);
  } catch (e) {
    return {
      data: null,
      total: 0,
      page,
      pageSize,
      error: e instanceof Error ? e.message : "Acceso denegado.",
    };
  }

  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: lideres, error: lideresError, count } = await supabase
    .from("lideres")
    .select("id, nombre, zona", { count: "exact" })
    .eq("estado", "activo")
    .order("nombre")
    .range(from, to);

  if (lideresError) {
    return { data: [], total: 0, page, pageSize, error: lideresError.message };
  }
  if (!lideres?.length) {
    return { data: [], total: count ?? 0, page, pageSize, error: null };
  }

  const rows: TopPerformerRow[] = [];

  for (const lider of lideres) {
    const { data: hojas } = await supabase
      .from("hojas")
      .select("id")
      .eq("lider_id", lider.id);
    const hojaIds = (hojas ?? []).map((h) => h.id);
    const hojasAsignadas = hojaIds.length;

    const { data: hojasRecibidas } = await supabase
      .from("hojas")
      .select("id")
      .eq("lider_id", lider.id)
      .eq("estado_fisico", "RECIBIDA");
    const hojasRecibidasCount = hojasRecibidas?.length ?? 0;

    let aceptadas = 0;
    let rechazadas = 0;
    let revision_tse = 0;

    if (hojaIds.length > 0) {
      const { data: adhesiones } = await supabase
        .from("adhesiones")
        .select("estado_legal")
        .in("hoja_id", hojaIds);
      for (const a of adhesiones ?? []) {
        if (a.estado_legal === "ACEPTADO") aceptadas++;
        else if (a.estado_legal === "RECHAZADO" || a.estado_legal === "RECHAZADO_INTERNO")
          rechazadas++;
        else if (a.estado_legal === "REVISION_TSE") revision_tse++;
      }
    }

    const denom = aceptadas + rechazadas + revision_tse;
    const efectividadReal =
      denom > 0 ? Math.round((aceptadas / denom) * 10000) / 100 : 0;
    const cumplimientoMeta =
      hojasAsignadas > 0
        ? Math.round((hojasRecibidasCount / hojasAsignadas) * 10000) / 100
        : 0;

    rows.push({
      lider_id: lider.id,
      nombre: lider.nombre,
      zona: lider.zona ?? null,
      aceptadas,
      rechazadas,
      revision_tse,
      efectividad_real: efectividadReal,
      hojas_asignadas: hojasAsignadas,
      hojas_recibidas: hojasRecibidasCount,
      cumplimiento_meta: cumplimientoMeta,
    });
  }

  rows.sort((a, b) => b.efectividad_real - a.efectividad_real);

  return { data: rows, total: count ?? 0, page, pageSize, error: null };
}

/**
 * KPIs for a single leader's assigned sheets.
 * Same formulas as getTopPerformers: efectividad = aceptadas / (aceptadas + rechazadas + revision_tse) × 100;
 * cumplimiento = hojas_recibidas / hojas_asignadas × 100.
 */
export async function getLiderKpis(
  liderId: string
): Promise<{ data: LiderKpis | null; error: string | null }> {
  try {
    await requireRole(["administrador", "digitador", "auditor"]);
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e.message : "Acceso denegado.",
    };
  }

  const supabase = await createClient();

  const { data: hojas, error: hojasError } = await supabase
    .from("hojas")
    .select("id, estado_fisico")
    .eq("lider_id", liderId);

  if (hojasError) {
    return { data: null, error: hojasError.message };
  }

  const hojaIds = (hojas ?? []).map((h) => h.id);
  const hojasAsignadas = hojaIds.length;
  const hojasRecibidasCount =
    (hojas ?? []).filter((h) => h.estado_fisico === "RECIBIDA").length;

  let aceptadas = 0;
  let rechazadas = 0;
  let revision_tse = 0;

  if (hojaIds.length > 0) {
    const { data: adhesiones, error: adhesionesError } = await supabase
      .from("adhesiones")
      .select("estado_legal")
      .in("hoja_id", hojaIds);

    if (adhesionesError) {
      return { data: null, error: adhesionesError.message };
    }

    for (const a of adhesiones ?? []) {
      if (a.estado_legal === "ACEPTADO") aceptadas++;
      else if (
        a.estado_legal === "RECHAZADO" ||
        a.estado_legal === "RECHAZADO_INTERNO"
      )
        rechazadas++;
      else if (a.estado_legal === "REVISION_TSE") revision_tse++;
    }
  }

  const denom = aceptadas + rechazadas + revision_tse;
  const efectividadReal =
    denom > 0 ? Math.round((aceptadas / denom) * 10000) / 100 : 0;
  const cumplimientoMeta =
    hojasAsignadas > 0
      ? Math.round((hojasRecibidasCount / hojasAsignadas) * 10000) / 100
      : 0;

  return {
    data: {
      hojas_asignadas: hojasAsignadas,
      hojas_recibidas: hojasRecibidasCount,
      aceptadas,
      rechazadas,
      revision_tse,
      efectividad_real: efectividadReal,
      cumplimiento_meta: cumplimientoMeta,
    },
    error: null,
  };
}

export interface FraudAlertsResult {
  data: FraudAlertRow[] | null;
  total: number;
  page: number;
  pageSize: number;
  error: string | null;
}

/**
 * RF-06: Fraud Alerts - leaders with > X% of rejections due to IMPRESION_DACTILAR, PLANA, or FIRMA (falsification indicators).
 */
export async function getFraudAlerts(
  thresholdPercent: number = FRAUD_THRESHOLD_PERCENT,
  page = 1,
  pageSize = 10
): Promise<FraudAlertsResult> {
  try {
    await requireRole(["administrador", "digitador", "auditor"]);
  } catch (e) {
    return {
      data: null,
      total: 0,
      page,
      pageSize,
      error: e instanceof Error ? e.message : "Acceso denegado.",
    };
  }

  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: lideres, error: lideresError, count } = await supabase
    .from("lideres")
    .select("id, nombre, zona", { count: "exact" })
    .eq("estado", "activo")
    .order("nombre")
    .range(from, to);

  if (lideresError) {
    return { data: [], total: 0, page, pageSize, error: lideresError.message };
  }
  if (!lideres?.length) {
    return { data: [], total: count ?? 0, page, pageSize, error: null };
  }

  const rows: FraudAlertRow[] = [];

  for (const lider of lideres) {
    const { data: hojas } = await supabase
      .from("hojas")
      .select("id")
      .eq("lider_id", lider.id);
    const hojaIds = (hojas ?? []).map((h) => h.id);

    if (hojaIds.length === 0) continue;

    const { data: adhesiones } = await supabase
      .from("adhesiones")
      .select("estado_legal, causa_rechazo")
      .in("hoja_id", hojaIds);

    let totalRechazadas = 0;
    let rechazosFirmaImpresion = 0;

    for (const a of adhesiones ?? []) {
      if (a.estado_legal === "RECHAZADO" || a.estado_legal === "RECHAZADO_INTERNO") {
        totalRechazadas++;
        if (a.causa_rechazo && FRAUD_CAUSES.includes(a.causa_rechazo)) {
          rechazosFirmaImpresion++;
        }
      }
    }

    if (totalRechazadas === 0) continue;

    const porcentaje =
      Math.round((rechazosFirmaImpresion / totalRechazadas) * 10000) / 100;
    if (porcentaje >= thresholdPercent) {
      rows.push({
        lider_id: lider.id,
        nombre: lider.nombre,
        zona: lider.zona ?? null,
        total_rechazadas: totalRechazadas,
        rechazos_firma_impresion: rechazosFirmaImpresion,
        porcentaje_firma_impresion: porcentaje,
      });
    }
  }

  rows.sort((a, b) => b.porcentaje_firma_impresion - a.porcentaje_firma_impresion);

  return { data: rows, total: count ?? 0, page, pageSize, error: null };
}

// --- Dashboard Summary (KPIs + chart data) ---

export interface DashboardSummary {
  kpis: {
    totalLideresActivos: number;
    totalHojasAsignadas: number;
    totalHojasRecibidas: number;
    totalAdhesiones: number;
    adhesionesAceptadas: number;
    adhesionesRechazadas: number;
    adhesionesPendientes: number;
    efectividadGlobal: number;
  };
  adhesionesPorEstado: { estado: string; cantidad: number }[];
  hojasPorEstado: { estado: string; cantidad: number }[];
}

const ESTADO_ADHESION_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  ACEPTADO: "Aceptado",
  RECHAZADO: "Rechazado",
  REVISION_TSE: "Revisión TSE",
  OMITIDO: "Omitido",
  RECHAZADO_INTERNO: "Rechazado interno",
};

const ESTADO_HOJA_LABELS: Record<string, string> = {
  PENDIENTE_ENTREGA: "Pendiente entrega",
  CIRCULACION: "En circulación",
  RECIBIDA: "Recibida",
  EN_TSE: "En TSE",
  PROCESADA: "Procesada",
};

export async function getDashboardSummary(): Promise<{
  data: DashboardSummary | null;
  error: string | null;
}> {
  try {
    await requireRole(["administrador", "digitador", "auditor"]);
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e.message : "Acceso denegado.",
    };
  }

  const supabase = await createClient();

  const [lideresRes, hojasRes, adhesionesRes] = await Promise.all([
    supabase.from("lideres").select("id", { count: "exact", head: true }).eq("estado", "activo"),
    supabase.from("hojas").select("id, estado_fisico"),
    supabase.from("adhesiones").select("id, estado_legal"),
  ]);

  if (lideresRes.error || hojasRes.error || adhesionesRes.error) {
    return {
      data: null,
      error:
        lideresRes.error?.message ?? hojasRes.error?.message ?? adhesionesRes.error?.message ?? "Error al cargar resumen.",
    };
  }

  const totalLideresActivos = lideresRes.count ?? 0;
  const hojas = hojasRes.data ?? [];
  const adhesiones = adhesionesRes.data ?? [];

  const totalHojasAsignadas = hojas.length;
  const totalHojasRecibidas = hojas.filter((h) => h.estado_fisico === "RECIBIDA").length;
  const totalAdhesiones = adhesiones.length;

  let aceptadas = 0;
  let rechazadas = 0;
  const adhesionesByEstado: Record<string, number> = {};
  const hojasByEstado: Record<string, number> = {};

  for (const a of adhesiones) {
    const est = a.estado_legal ?? "PENDIENTE";
    adhesionesByEstado[est] = (adhesionesByEstado[est] ?? 0) + 1;
    if (est === "ACEPTADO") aceptadas++;
    else if (est === "RECHAZADO" || est === "RECHAZADO_INTERNO") rechazadas++;
  }

  for (const h of hojas) {
    const est = h.estado_fisico ?? "PENDIENTE_ENTREGA";
    hojasByEstado[est] = (hojasByEstado[est] ?? 0) + 1;
  }

  const pendientes = adhesionesByEstado["PENDIENTE"] ?? 0;
  const denom = aceptadas + rechazadas;
  const efectividadGlobal =
    denom > 0 ? Math.round((aceptadas / denom) * 10000) / 100 : 0;

  const adhesionesPorEstado = Object.entries(adhesionesByEstado).map(([est, cant]) => ({
    estado: ESTADO_ADHESION_LABELS[est] ?? est,
    cantidad: cant,
  }));

  const hojasPorEstado = Object.entries(hojasByEstado).map(([est, cant]) => ({
    estado: ESTADO_HOJA_LABELS[est] ?? est,
    cantidad: cant,
  }));

  return {
    data: {
      kpis: {
        totalLideresActivos,
        totalHojasAsignadas,
        totalHojasRecibidas,
        totalAdhesiones,
        adhesionesAceptadas: aceptadas,
        adhesionesRechazadas: rechazadas,
        adhesionesPendientes: pendientes,
        efectividadGlobal,
      },
      adhesionesPorEstado,
      hojasPorEstado,
    },
    error: null,
  };
}
