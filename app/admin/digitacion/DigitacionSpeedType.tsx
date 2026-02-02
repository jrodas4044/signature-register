"use client";

import { useRef, useState, useCallback } from "react";
import { getAdhesionesByNumeroHoja, saveAdhesiones } from "@/app/actions/adhesiones";
import type {
  Adhesion,
  AdhesionLineInput,
  EstadoAdhesion,
  CausaRechazo,
} from "@/lib/types/domain";
import {
  ESTADO_ADHESION_VALUES,
  CAUSA_RECHAZO_VALUES,
} from "@/lib/types/domain";

const LINEA_IDS = [1, 2, 3, 4, 5] as const;

function emptyLine(lineaId: number): AdhesionLineInput {
  return {
    linea_id: lineaId,
    dpi_ciudadano: null,
    nombre_ciudadano: null,
    estado_legal: "PENDIENTE",
    causa_rechazo: null,
  };
}

function adhesionToInput(a: Adhesion): AdhesionLineInput {
  return {
    linea_id: a.linea_id,
    dpi_ciudadano: a.dpi_ciudadano ?? null,
    nombre_ciudadano: a.nombre_ciudadano ?? null,
    estado_legal: a.estado_legal,
    causa_rechazo: a.causa_rechazo ?? null,
  };
}

export function DigitacionSpeedType() {
  const [numeroHoja, setNumeroHoja] = useState("");
  const [lines, setLines] = useState<AdhesionLineInput[]>(() =>
    LINEA_IDS.map((id) => emptyLine(id))
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveResult, setSaveResult] = useState<{
    success: boolean;
    error: string | null;
    duplicateAlerts: string[];
  } | null>(null);
  const [hojaId, setHojaId] = useState<string | null>(null);

  const inputNumeroRef = useRef<HTMLInputElement>(null);
  const lineRefs = useRef<(HTMLInputElement | HTMLSelectElement | null)[]>([]);

  const loadHoja = useCallback(async () => {
    const num = Number(numeroHoja);
    if (Number.isNaN(num) || num < 1) {
      setLoadError("Ingrese un número de hoja válido.");
      return;
    }
    setLoadError(null);
    setSaveResult(null);
    setLoading(true);
    const result = await getAdhesionesByNumeroHoja(num);
    setLoading(false);
    if (result.error) {
      setLoadError(result.error);
      setHojaId(null);
      return;
    }
    setHojaId(result.hojaId);
    if (result.adhesiones && result.adhesiones.length === 5) {
      const ordered = LINEA_IDS.map(
        (id) =>
          result.adhesiones!.find((a) => a.linea_id === id) ||
          ({ linea_id: id, estado_legal: "PENDIENTE" } as Adhesion)
      );
      setLines(ordered.map(adhesionToInput));
    } else {
      setLines(LINEA_IDS.map((id) => emptyLine(id)));
    }
    setTimeout(() => lineRefs.current[0]?.focus(), 100);
  }, [numeroHoja]);

  const handleSave = useCallback(async () => {
    const num = Number(numeroHoja);
    if (Number.isNaN(num) || num < 1) {
      setSaveResult({ success: false, error: "Número de hoja inválido.", duplicateAlerts: [] });
      return;
    }
    setSaveResult(null);
    setSaving(true);
    const result = await saveAdhesiones(num, lines);
    setSaving(false);
    setSaveResult(result);
  }, [numeroHoja, lines]);

  const updateLine = useCallback(
    (index: number, field: keyof AdhesionLineInput, value: string | number | null) => {
      setLines((prev) => {
        const next = [...prev];
        const line = { ...next[index] };
        if (field === "linea_id") return prev;
        (line as Record<string, unknown>)[field] = value;
        if (field === "estado_legal" && value !== "RECHAZADO" && value !== "RECHAZADO_INTERNO") {
          line.causa_rechazo = null;
        }
        next[index] = line;
        return next;
      });
    },
    []
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 shadow-sm p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl">
        <label htmlFor="numero_hoja" className="block font-medium text-zinc-700 dark:text-zinc-300 text-sm">
          Número de hoja
        </label>
        <div className="flex gap-2 mt-2">
          <input
            ref={inputNumeroRef}
            id="numero_hoja"
            type="number"
            min={1}
            value={numeroHoja}
            onChange={(e) => setNumeroHoja(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                loadHoja();
              }
            }}
            placeholder="Ej. 500"
            className="block bg-white dark:bg-zinc-800 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg w-full max-w-xs text-zinc-900 dark:text-zinc-100 text-sm"
            autoFocus
          />
          <button
            type="button"
            onClick={loadHoja}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-4 py-2 rounded-lg font-medium text-white text-sm"
          >
            {loading ? "Cargando…" : "Cargar hoja"}
          </button>
        </div>
        {loadError && (
          <p className="mt-2 text-red-600 dark:text-red-400 text-sm">{loadError}</p>
        )}
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow-sm p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl">
        <h3 className="mb-4 font-medium text-zinc-900 dark:text-zinc-50 text-lg">
          Líneas 1–5 (Tab / Enter para navegar)
        </h3>
        <div className="space-y-4">
          {LINEA_IDS.map((_, index) => (
            <fieldset
              key={index}
              className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg"
            >
              <legend className="font-medium text-zinc-600 dark:text-zinc-400 text-sm">
                Línea {index + 1}
              </legend>
              <div>
                <label className="block text-zinc-500 dark:text-zinc-400 text-xs">DPI</label>
                <input
                  ref={(el) => { lineRefs.current[index * 4] = el; }}
                  type="text"
                  value={lines[index]?.dpi_ciudadano ?? ""}
                  onChange={(e) =>
                    updateLine(index, "dpi_ciudadano", e.target.value || null)
                  }
                  className="block bg-white dark:bg-zinc-800 mt-0.5 px-2 py-1.5 border border-zinc-300 dark:border-zinc-600 rounded w-full text-zinc-900 dark:text-zinc-100 text-sm"
                  tabIndex={index * 4 + 1}
                />
              </div>
              <div>
                <label className="block text-zinc-500 dark:text-zinc-400 text-xs">Nombre</label>
                <input
                  ref={(el) => { lineRefs.current[index * 4 + 1] = el; }}
                  type="text"
                  value={lines[index]?.nombre_ciudadano ?? ""}
                  onChange={(e) =>
                    updateLine(index, "nombre_ciudadano", e.target.value || null)
                  }
                  className="block bg-white dark:bg-zinc-800 mt-0.5 px-2 py-1.5 border border-zinc-300 dark:border-zinc-600 rounded w-full text-zinc-900 dark:text-zinc-100 text-sm"
                  tabIndex={index * 4 + 2}
                />
              </div>
              <div>
                <label className="block text-zinc-500 dark:text-zinc-400 text-xs">Estado</label>
                <select
                  ref={(el) => { lineRefs.current[index * 4 + 2] = el; }}
                  value={lines[index]?.estado_legal ?? "PENDIENTE"}
                  onChange={(e) =>
                    updateLine(
                      index,
                      "estado_legal",
                      e.target.value as EstadoAdhesion
                    )
                  }
                  className="block bg-white dark:bg-zinc-800 mt-0.5 px-2 py-1.5 border border-zinc-300 dark:border-zinc-600 rounded w-full text-zinc-900 dark:text-zinc-100 text-sm"
                  tabIndex={index * 4 + 3}
                >
                  {ESTADO_ADHESION_VALUES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-zinc-500 dark:text-zinc-400 text-xs">
                  Causa rechazo
                </label>
                <select
                  ref={(el) => { lineRefs.current[index * 4 + 3] = el; }}
                  value={lines[index]?.causa_rechazo ?? ""}
                  onChange={(e) =>
                    updateLine(
                      index,
                      "causa_rechazo",
                      (e.target.value || null) as CausaRechazo | null
                    )
                  }
                  disabled={
                    lines[index]?.estado_legal !== "RECHAZADO" &&
                    lines[index]?.estado_legal !== "RECHAZADO_INTERNO"
                  }
                  className="block bg-white dark:bg-zinc-800 disabled:opacity-50 mt-0.5 px-2 py-1.5 border border-zinc-300 dark:border-zinc-600 rounded w-full text-zinc-900 dark:text-zinc-100 text-sm"
                  tabIndex={index * 4 + 4}
                >
                  <option value="">—</option>
                  {CAUSA_RECHAZO_VALUES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </fieldset>
          ))}
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !hojaId}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-4 py-2 rounded-lg font-medium text-white text-sm"
          >
            {saving ? "Guardando…" : "Guardar adhesiones"}
          </button>
        </div>
        {saveResult && (
          <div
            className={`mt-4 rounded-lg border p-3 text-sm ${
              saveResult.success
                ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200"
                : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200"
            }`}
          >
            {saveResult.success ? (
              <>
                <p>Guardado correctamente.</p>
                {saveResult.duplicateAlerts.length > 0 && (
                  <ul className="mt-2 pl-4 list-disc">
                    {saveResult.duplicateAlerts.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              saveResult.error
            )}
          </div>
        )}
      </div>
    </div>
  );
}
