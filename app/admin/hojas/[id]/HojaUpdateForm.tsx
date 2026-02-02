"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateHoja } from "@/app/actions/hojas";
import type { EstadoHoja, Lider } from "@/lib/types/domain";
import { ESTADO_HOJA_VALUES } from "@/lib/types/domain";

const ESTADO_HOJA_LABELS: Record<EstadoHoja, string> = {
  PENDIENTE_ENTREGA: "Pendiente entrega",
  CIRCULACION: "Circulación",
  RECIBIDA: "Recibida",
  EN_TSE: "En TSE",
  PROCESADA: "Procesada",
};

export function HojaUpdateForm({
  hojaId,
  currentEstado,
  currentLiderId,
  lideres,
}: {
  hojaId: string;
  currentEstado: EstadoHoja;
  currentLiderId: string;
  lideres: Pick<Lider, "id" | "nombre" | "zona">[];
}) {
  const router = useRouter();
  const [estadoFisico, setEstadoFisico] = useState<EstadoHoja>(currentEstado);
  const [liderId, setLiderId] = useState(currentLiderId);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    const result = await updateHoja(hojaId, {
      estado_fisico: estadoFisico,
      lider_id: liderId,
    });
    setLoading(false);
    if (result.success) {
      setMessage({ type: "success", text: "Hoja actualizada." });
      router.refresh();
    } else {
      setMessage({ type: "error", text: result.error ?? "Error al actualizar." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="gap-4 grid sm:grid-cols-2 max-w-xl">
        <div>
          <label
            htmlFor="estado_fisico"
            className="block font-medium text-zinc-700 dark:text-zinc-300 text-sm"
          >
            Estado físico
          </label>
          <select
            id="estado_fisico"
            value={estadoFisico}
            onChange={(e) => setEstadoFisico(e.target.value as EstadoHoja)}
            className="block bg-white dark:bg-zinc-800 mt-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg w-full text-zinc-900 dark:text-zinc-100 text-sm"
          >
            {ESTADO_HOJA_VALUES.map((est) => (
              <option key={est} value={est}>
                {ESTADO_HOJA_LABELS[est]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="lider_id"
            className="block font-medium text-zinc-700 dark:text-zinc-300 text-sm"
          >
            Líder
          </label>
          <select
            id="lider_id"
            value={liderId}
            onChange={(e) => setLiderId(e.target.value)}
            className="block bg-white dark:bg-zinc-800 mt-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg w-full text-zinc-900 dark:text-zinc-100 text-sm"
          >
            {lideres.map((l) => (
              <option key={l.id} value={l.id}>
                {l.nombre} {l.zona ? `(${l.zona})` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-4 py-2 rounded-lg font-medium text-white text-sm"
      >
        {loading ? "Guardando…" : "Actualizar hoja"}
      </button>
      {message && (
        <div
          className={`rounded-lg border p-3 text-sm ${
            message.type === "success"
              ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200"
              : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200"
          }`}
        >
          {message.text}
        </div>
      )}
    </form>
  );
}
