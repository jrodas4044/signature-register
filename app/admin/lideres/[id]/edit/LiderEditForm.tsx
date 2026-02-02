"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateLider } from "@/app/actions/lideres";
import type { Lider, LiderEstado } from "@/lib/types/domain";

const ESTADO_OPTIONS: { value: LiderEstado; label: string }[] = [
  { value: "activo", label: "Activo" },
  { value: "inactivo", label: "Inactivo" },
];

export function LiderEditForm({ lider, id }: { lider: Lider; id: string }) {
  const router = useRouter();
  const [nombre, setNombre] = useState(lider.nombre);
  const [zona, setZona] = useState(lider.zona ?? "");
  const [dpi, setDpi] = useState(lider.dpi);
  const [estado, setEstado] = useState<LiderEstado>(lider.estado);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await updateLider(id, {
      nombre,
      zona: zona.trim() || null,
      dpi,
      estado,
    });
    setLoading(false);
    if (result.success) {
      router.push(`/admin/lideres/${id}`);
      router.refresh();
    } else {
      setError(result.error ?? "Error al actualizar.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className="block font-medium text-zinc-700 dark:text-zinc-300 text-sm">
          Nombre
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="block bg-white dark:bg-zinc-800 mt-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg w-full text-zinc-900 dark:text-zinc-100 text-sm"
        />
      </div>
      <div>
        <label className="block font-medium text-zinc-700 dark:text-zinc-300 text-sm">
          Zona
        </label>
        <input
          type="text"
          value={zona}
          onChange={(e) => setZona(e.target.value)}
          className="block bg-white dark:bg-zinc-800 mt-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg w-full text-zinc-900 dark:text-zinc-100 text-sm"
        />
      </div>
      <div>
        <label className="block font-medium text-zinc-700 dark:text-zinc-300 text-sm">
          DPI
        </label>
        <input
          type="text"
          value={dpi}
          onChange={(e) => setDpi(e.target.value)}
          required
          className="block bg-white dark:bg-zinc-800 mt-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg w-full text-zinc-900 dark:text-zinc-100 text-sm"
        />
      </div>
      <div>
        <label className="block font-medium text-zinc-700 dark:text-zinc-300 text-sm">
          Estado
        </label>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value as LiderEstado)}
          className="block bg-white dark:bg-zinc-800 mt-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg w-full text-zinc-900 dark:text-zinc-100 text-sm"
        >
          {ESTADO_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 p-3 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
          {error}
        </div>
      )}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-4 py-2 rounded-lg font-medium text-white text-sm"
        >
          {loading ? "Guardando…" : "Guardar"}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/admin/lideres/${id}`)}
          className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-700 dark:text-zinc-300 text-sm"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
