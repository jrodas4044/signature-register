/**
 * SCA-Political domain types (Ubiquitous Language from SRS).
 * Column names match Supabase/PostgreSQL snake_case.
 */

// --- Enums (Value Objects) ---

export type EstadoHoja =
  | "PENDIENTE_ENTREGA"
  | "CIRCULACION"
  | "RECIBIDA"
  | "EN_TSE"
  | "PROCESADA";

export type EstadoAdhesion =
  | "PENDIENTE"
  | "ACEPTADO"
  | "RECHAZADO"
  | "REVISION_TSE"
  | "OMITIDO"
  | "RECHAZADO_INTERNO";

export type CausaRechazo =
  | "NO_EMPADRONADO"
  | "FIRMA_NO_COINCIDE"
  | "ERROR_CAPTURA"
  | "DATOS_INCOMPLETOS"
  | "DUPLICADO"
  | "IMPRESION_DACTILAR"
  | "PLANA"
  | "AFILIADO"
  | "ACTUALIZACION_PADRON";

export type LiderEstado = "activo" | "inactivo";

export type AppRole = "administrador" | "digitador" | "auditor";

// --- Entities ---

export interface Lider {
  id: string;
  nombre: string;
  zona: string | null;
  dpi: string;
  estado: LiderEstado;
  created_at: string;
  updated_at: string;
}

export interface Hoja {
  id: string;
  numero_hoja: number;
  lider_id: string;
  estado_fisico: EstadoHoja;
  fecha_asignacion: string;
  fecha_recepcion: string | null;
  created_at: string;
  updated_at: string;
}

export interface Adhesion {
  id: string;
  hoja_id: string;
  linea_id: number;
  dpi_ciudadano: string | null;
  nombre_ciudadano: string | null;
  estado_legal: EstadoAdhesion;
  causa_rechazo: CausaRechazo | null;
  created_at: string;
  updated_at: string;
}

export interface AdhesionAuditLog {
  id: string;
  adhesion_id: string;
  user_id: string | null;
  estado_anterior: EstadoAdhesion | null;
  estado_nuevo: EstadoAdhesion;
  created_at: string;
}

// --- With relations (for UI) ---

export interface HojaWithLider extends Hoja {
  lideres: Lider | null;
}

export interface AdhesionWithHoja extends Adhesion {
  hojas: HojaWithLider | null;
}

// --- Form / DTOs ---

export interface AdhesionLineInput {
  linea_id: number;
  dpi_ciudadano: string | null;
  nombre_ciudadano: string | null;
  estado_legal: EstadoAdhesion;
  causa_rechazo: CausaRechazo | null;
}

export const ESTADO_HOJA_VALUES: EstadoHoja[] = [
  "PENDIENTE_ENTREGA",
  "CIRCULACION",
  "RECIBIDA",
  "EN_TSE",
  "PROCESADA",
];

export const ESTADO_ADHESION_VALUES: EstadoAdhesion[] = [
  "PENDIENTE",
  "ACEPTADO",
  "RECHAZADO",
  "REVISION_TSE",
  "OMITIDO",
  "RECHAZADO_INTERNO",
];

export const CAUSA_RECHAZO_VALUES: CausaRechazo[] = [
  "NO_EMPADRONADO",
  "FIRMA_NO_COINCIDE",
  "ERROR_CAPTURA",
  "DATOS_INCOMPLETOS",
  "DUPLICADO",
  "IMPRESION_DACTILAR",
  "PLANA",
  "AFILIADO",
  "ACTUALIZACION_PADRON",
];
