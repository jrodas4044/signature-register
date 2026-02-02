import Link from "next/link";
import { notFound } from "next/navigation";
import { getHoja } from "@/app/actions/hojas";
import { listAdhesionesByHojaId } from "@/app/actions/adhesiones";
import { listAllLideres } from "@/app/actions/lideres";
import { getCurrentUserRole } from "@/lib/auth/roles";
import { HojaUpdateForm } from "./HojaUpdateForm";

const ESTADO_HOJA_LABELS: Record<string, string> = {
  PENDIENTE_ENTREGA: "Pendiente entrega",
  CIRCULACION: "Circulación",
  RECIBIDA: "Recibida",
  EN_TSE: "En TSE",
  PROCESADA: "Procesada",
};

export default async function HojaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [
    { data: hoja, error },
    { data: adhesiones, error: adhesionesError },
    { data: lideres },
    role,
  ] = await Promise.all([
    getHoja(id),
    listAdhesionesByHojaId(id),
    listAllLideres(),
    getCurrentUserRole(),
  ]);

  if (error || !hoja) {
    notFound();
  }

  const canEdit = role === "administrador";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 text-2xl tracking-tight">
          Detalle de hoja #{hoja.numero_hoja}
        </h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400 text-sm">
          <Link
            href="/admin/hojas"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Volver al listado
          </Link>
        </p>
      </div>

      <section className="space-y-4 bg-white dark:bg-zinc-900 shadow-sm p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl">
        <h3 className="font-medium text-zinc-900 dark:text-zinc-50 text-lg">
          Datos de la hoja
        </h3>
        <dl className="gap-4 grid sm:grid-cols-2 text-sm">
          <div>
            <dt className="font-medium text-zinc-500 dark:text-zinc-400">
              Número de hoja
            </dt>
            <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-100">
              {hoja.numero_hoja}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-500 dark:text-zinc-400">
              Estado físico
            </dt>
            <dd className="mt-0.5 text-zinc-700 dark:text-zinc-300">
              {ESTADO_HOJA_LABELS[hoja.estado_fisico] ?? hoja.estado_fisico}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-500 dark:text-zinc-400">
              Líder
            </dt>
            <dd className="mt-0.5 text-zinc-700 dark:text-zinc-300">
              {hoja.lideres
                ? `${hoja.lideres.nombre}${hoja.lideres.zona ? ` (${hoja.lideres.zona})` : ""}`
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-500 dark:text-zinc-400">
              DPI líder
            </dt>
            <dd className="mt-0.5 text-zinc-700 dark:text-zinc-300">
              {hoja.lideres?.dpi ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-500 dark:text-zinc-400">
              Fecha asignación
            </dt>
            <dd className="mt-0.5 text-zinc-700 dark:text-zinc-300">
              {new Date(hoja.fecha_asignacion).toLocaleString("es-GT")}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-500 dark:text-zinc-400">
              Fecha recepción
            </dt>
            <dd className="mt-0.5 text-zinc-700 dark:text-zinc-300">
              {hoja.fecha_recepcion
                ? new Date(hoja.fecha_recepcion).toLocaleString("es-GT")
                : "—"}
            </dd>
          </div>
        </dl>

        {canEdit && lideres && (
          <div className="pt-4 border-zinc-200 dark:border-zinc-800 border-t">
            <h4 className="mb-3 font-medium text-zinc-700 dark:text-zinc-300 text-sm">
              Administrar (solo administrador)
            </h4>
            <HojaUpdateForm
              hojaId={id}
              currentEstado={hoja.estado_fisico}
              currentLiderId={hoja.lider_id}
              lideres={lideres}
            />
          </div>
        )}
      </section>

      <section className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <h3 className="px-6 py-4 border-zinc-200 dark:border-zinc-800 border-b font-medium text-zinc-900 dark:text-zinc-50 text-lg">
          Adhesiones (5 líneas)
        </h3>
        {adhesionesError ? (
          <p className="px-6 py-4 text-red-600 dark:text-red-400 text-sm">
            {adhesionesError}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 text-left">
                  <th className="px-4 py-3 font-medium">Línea</th>
                  <th className="px-4 py-3 font-medium">DPI ciudadano</th>
                  <th className="px-4 py-3 font-medium">Nombre ciudadano</th>
                  <th className="px-4 py-3 font-medium">Estado legal</th>
                  <th className="px-4 py-3 font-medium">Causa rechazo</th>
                </tr>
              </thead>
              <tbody>
                {(adhesiones ?? []).length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-zinc-500 dark:text-zinc-400 text-center"
                    >
                      No hay adhesiones.
                    </td>
                  </tr>
                ) : (
                  (adhesiones ?? []).map((a) => (
                    <tr
                      key={a.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 border-zinc-200 dark:border-zinc-800 border-t"
                    >
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                        {a.linea_id}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {a.dpi_ciudadano ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {a.nombre_ciudadano ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {a.estado_legal}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {a.causa_rechazo ?? "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
