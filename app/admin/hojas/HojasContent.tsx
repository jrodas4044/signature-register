"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { HojaWithLider, Lider } from "@/lib/types/domain";
import { ESTADO_HOJA_VALUES } from "@/lib/types/domain";
import { Pagination } from "../components/Pagination";

const ESTADO_HOJA_LABELS: Record<string, string> = {
  PENDIENTE_ENTREGA: "Pendiente entrega",
  CIRCULACION: "Circulación",
  RECIBIDA: "Recibida",
  EN_TSE: "En TSE",
  PROCESADA: "Procesada",
};

export function HojasContent({
  hojas,
  total,
  page,
  pageSize,
  lideres,
  filterEstado,
  filterLiderId,
}: {
  hojas: HojaWithLider[];
  total: number;
  page: number;
  pageSize: number;
  lideres: Pick<Lider, "id" | "nombre" | "zona">[];
  filterEstado: string;
  filterLiderId: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const setFilter = (key: "estado_fisico" | "lider_id", value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <section className="bg-white dark:bg-zinc-900 shadow-sm p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl">
        <h3 className="mb-4 font-medium text-zinc-900 dark:text-zinc-50 text-lg">
          Filtros
        </h3>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label
              htmlFor="filter_estado"
              className="block font-medium text-zinc-700 dark:text-zinc-300 text-sm"
            >
              Estado físico
            </label>
            <select
              id="filter_estado"
              value={filterEstado}
              onChange={(e) => setFilter("estado_fisico", e.target.value)}
              className="block bg-white dark:bg-zinc-800 mt-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg min-w-[180px] text-zinc-900 dark:text-zinc-100 text-sm"
            >
              <option value="">Todos</option>
              {ESTADO_HOJA_VALUES.map((est) => (
                <option key={est} value={est}>
                  {ESTADO_HOJA_LABELS[est] ?? est}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="filter_lider"
              className="block font-medium text-zinc-700 dark:text-zinc-300 text-sm"
            >
              Líder
            </label>
            <select
              id="filter_lider"
              value={filterLiderId}
              onChange={(e) => setFilter("lider_id", e.target.value)}
              className="block bg-white dark:bg-zinc-800 mt-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg min-w-[200px] text-zinc-900 dark:text-zinc-100 text-sm"
            >
              <option value="">Todos</option>
              {lideres.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nombre} {l.zona ? `(${l.zona})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <h3 className="px-6 py-4 border-zinc-200 dark:border-zinc-800 border-b font-medium text-zinc-900 dark:text-zinc-50 text-lg">
          Listado
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 text-left">
                <th className="px-4 py-3 font-medium">Nº hoja</th>
                <th className="px-4 py-3 font-medium">Líder</th>
                <th className="px-4 py-3 font-medium">Estado físico</th>
                <th className="px-4 py-3 font-medium">Fecha asignación</th>
                <th className="px-4 py-3 font-medium">Fecha recepción</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {hojas.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-zinc-500 dark:text-zinc-400 text-center"
                  >
                    No hay hojas. Usa Inventario para asignar hojas a líderes.
                  </td>
                </tr>
              ) : (
                hojas.map((h) => (
                  <tr
                    key={h.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 border-zinc-200 dark:border-zinc-800 border-t"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                      {h.numero_hoja}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {h.lideres
                        ? `${h.lideres.nombre}${h.lideres.zona ? ` (${h.lideres.zona})` : ""}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {ESTADO_HOJA_LABELS[h.estado_fisico] ?? h.estado_fisico}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {new Date(h.fecha_asignacion).toLocaleDateString("es-GT")}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {h.fecha_recepcion
                        ? new Date(h.fecha_recepcion).toLocaleDateString("es-GT")
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/hojas/${h.id}`}
                        className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline"
                      >
                        Ver
                      </Link>
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
