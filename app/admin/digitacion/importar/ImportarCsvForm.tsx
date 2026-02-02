"use client";

import { useState } from "react";
import { importTseCsv } from "@/app/actions/csv";

export function ImportarCsvForm() {
  const [csvText, setCsvText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    error: string | null;
    updated: number;
    skipped: number;
    invalidRows: string[];
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;
    setResult(null);
    setLoading(true);
    const res = await importTseCsv(csvText);
    setLoading(false);
    setResult(res);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCsvText(String(reader.result ?? ""));
    reader.readAsText(file, "UTF-8");
  };

  return (
    <div className="bg-white dark:bg-zinc-900 shadow-sm p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl">
      <p className="mb-4 text-zinc-500 dark:text-zinc-400 text-sm">
        Formato esperado: primera columna = número de hoja, segunda = línea (1-5),
        tercera = estado (ACEPTADO, RECHAZADO, PENDIENTE, etc.), cuarta = causa rechazo (opcional).
        Separador: coma o tab. Cabecera opcional.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium text-zinc-700 dark:text-zinc-300 text-sm">
            Archivo CSV o pegar contenido
          </label>
          <input
            type="file"
            accept=".csv,.txt"
            onChange={handleFileChange}
            className="block dark:file:bg-indigo-950 file:bg-indigo-50 file:mr-4 file:px-4 file:py-2 file:border-0 file:rounded w-full text-zinc-500 dark:file:text-indigo-300 file:text-indigo-700 text-sm"
          />
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            rows={12}
            placeholder="numero_hoja,linea,estado,causa_rechazo&#10;1,1,ACEPTADO,&#10;1,2,RECHAZADO,FIRMA_NO_COINCIDE"
            className="block bg-white dark:bg-zinc-800 mt-2 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg w-full font-mono text-zinc-900 dark:text-zinc-100 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !csvText.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-4 py-2 rounded-lg font-medium text-white text-sm"
        >
          {loading ? "Importando…" : "Importar CSV"}
        </button>
      </form>
      {result && (
        <div
          className={`mt-6 rounded-lg border p-4 text-sm ${
            result.success
              ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200"
              : "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200"
          }`}
        >
          <p>
            Actualizadas: {result.updated}, Omitidas (sin coincidencia): {result.skipped}
          </p>
          {result.error && <p className="mt-1">{result.error}</p>}
          {result.invalidRows.length > 0 && (
            <ul className="mt-2 pl-4 max-h-40 overflow-y-auto list-disc">
              {result.invalidRows.slice(0, 20).map((r, i) => (
                <li key={i}>{r}</li>
              ))}
              {result.invalidRows.length > 20 && (
                <li>… y {result.invalidRows.length - 20} más</li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
