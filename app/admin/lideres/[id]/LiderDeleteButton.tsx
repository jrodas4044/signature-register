"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { softDeleteLider } from "@/app/actions/lideres";

export function LiderDeleteButton({
  id,
  nombre,
  disabled,
}: {
  id: string;
  nombre: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await softDeleteLider(id);
    setLoading(false);
    setConfirming(false);
    if (result.success) {
      router.push("/admin/lideres");
      router.refresh();
    } else {
      alert(result.error ?? "Error al eliminar.");
    }
  };

  if (disabled) return null;

  if (confirming) {
    return (
      <span className="flex items-center gap-2 text-sm">
        <span className="text-zinc-600 dark:text-zinc-400">
          ¿Eliminar líder &quot;{nombre}&quot;?
        </span>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-2 py-1 rounded text-white text-sm"
        >
          {loading ? "Eliminando…" : "Sí, eliminar"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={loading}
          className="px-2 py-1 border border-zinc-300 dark:border-zinc-600 rounded text-zinc-700 dark:text-zinc-300 text-sm"
        >
          Cancelar
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg font-medium text-white text-sm"
    >
      Eliminar
    </button>
  );
}
