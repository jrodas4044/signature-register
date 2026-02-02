"use client";

import { useState } from "react";
import { createLider } from "@/app/actions/lideres-create";
import type { Lider } from "@/lib/types/domain";
import { Pagination } from "../components/Pagination";

export function LideresContent({
  lideres: initialLideres,
  total,
  page,
  pageSize,
}: {
  lideres: Pick<Lider, "id" | "nombre" | "zona" | "dpi" | "estado">[];
  total: number;
  page: number;
  pageSize: number;
}) {
  const [lideres, setLideres] = useState(initialLideres);
  const [nombre, setNombre] = useState("");
  const [zona, setZona] = useState("");
  const [dpi, setDpi] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    const result = await createLider(nombre, zona, dpi);
    setLoading(false);
    if (result.success) {
      setMessage({ type: "success", text: "Líder creado." });
      setNombre("");
      setZona("");
      setDpi("");
      window.location.reload();
    } else {
      setMessage({ type: "error", text: result.error ?? "Error al crear." });
    }
  };

  return (
    <div className="space-y-6">
      <section className="bg-white dark:bg-zinc-900 shadow-sm p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl">
        <h3 className="mb-4 font-medium text-zinc-900 dark:text-zinc-50 text-lg">
          Crear líder (solo administrador)
        </h3>
        <form onSubmit={handleCreate} className="gap-4 grid sm:grid-cols-3 max-w-2xl">
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
          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-4 py-2 rounded-lg font-medium text-white text-sm"
            >
              {loading ? "Creando…" : "Crear líder"}
            </button>
          </div>
        </form>
        {message && (
          <div
            className={`mt-4 rounded-lg border p-3 text-sm ${
              message.type === "success"
                ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200"
                : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200"
            }`}
          >
            {message.text}
          </div>
        )}
      </section>

      <section className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <h3 className="px-6 py-4 border-zinc-200 dark:border-zinc-800 border-b font-medium text-zinc-900 dark:text-zinc-50 text-lg">
          Listado
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 text-left">
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Zona</th>
                <th className="px-4 py-3 font-medium">DPI</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {lideres.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-zinc-500 dark:text-zinc-400 text-center">
                    No hay líderes. Crea uno arriba.
                  </td>
                </tr>
              ) : (
                lideres.map((l) => (
                  <tr
                    key={l.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 border-zinc-200 dark:border-zinc-800 border-t"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                      {l.nombre}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {l.zona ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {l.dpi}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {l.estado}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(total / pageSize) || 1}
          paramName="page"
        />
      </section>
    </div>
  );
}
