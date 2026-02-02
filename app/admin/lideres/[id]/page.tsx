import Link from "next/link";
import { notFound } from "next/navigation";
import { getLider } from "@/app/actions/lideres";
import { getLiderKpis } from "@/app/actions/kpis";
import { getCurrentUserRole } from "@/lib/auth/roles";
import { KpiCard } from "@/app/admin/components/KpiCard";
import { LiderDeleteButton } from "./LiderDeleteButton";

const SheetsIcon = () => (
  <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

export default async function LiderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ data: lider, error }, { data: kpis, error: kpisError }] = await Promise.all([
    getLider(id),
    getLiderKpis(id),
  ]);
  const role = await getCurrentUserRole();

  if (error || !lider) {
    notFound();
  }

  const isAdmin = role === "administrador";
  const isDeleted = Boolean(lider.deleted_at);
  const deletedAtFormatted = lider.deleted_at
    ? new Date(lider.deleted_at).toLocaleString("es-GT", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 text-2xl tracking-tight">
            Detalle del líder
          </h2>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400 text-sm">
            <Link
              href="/admin/lideres"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Volver al listado
            </Link>
          </p>
        </div>
      </div>

      <section className="space-y-4 bg-white dark:bg-zinc-900 shadow-sm p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl">
        {isDeleted && (
          <div className="bg-amber-50 dark:bg-amber-950/30 p-3 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-200 text-sm">
            Eliminado el {deletedAtFormatted}
          </div>
        )}
        <dl className="gap-4 grid sm:grid-cols-2 text-sm">
          <div>
            <dt className="font-medium text-zinc-500 dark:text-zinc-400">
              Nombre
            </dt>
            <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-100">
              {lider.nombre}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-500 dark:text-zinc-400">
              Zona
            </dt>
            <dd className="mt-0.5 text-zinc-700 dark:text-zinc-300">
              {lider.zona ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-500 dark:text-zinc-400">DPI</dt>
            <dd className="mt-0.5 text-zinc-700 dark:text-zinc-300">
              {lider.dpi}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-500 dark:text-zinc-400">
              Estado
            </dt>
            <dd className="mt-0.5 text-zinc-700 dark:text-zinc-300 capitalize">
              {lider.estado}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-500 dark:text-zinc-400">
              Creado
            </dt>
            <dd className="mt-0.5 text-zinc-700 dark:text-zinc-300">
              {new Date(lider.created_at).toLocaleString("es-GT")}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-500 dark:text-zinc-400">
              Actualizado
            </dt>
            <dd className="mt-0.5 text-zinc-700 dark:text-zinc-300">
              {new Date(lider.updated_at).toLocaleString("es-GT")}
            </dd>
          </div>
        </dl>
        <div className="flex flex-wrap items-center gap-3 pt-2 border-zinc-200 dark:border-zinc-800 border-t">
          {!isDeleted && (
            <Link
              href={`/admin/lideres/${id}/edit`}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium text-white text-sm"
            >
              Editar
            </Link>
          )}
          <LiderDeleteButton
            id={id}
            nombre={lider.nombre}
            disabled={!isAdmin || isDeleted}
          />
        </div>
      </section>

      <section className="space-y-4 bg-white dark:bg-zinc-900 shadow-sm p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl">
        <h3 className="font-medium text-zinc-600 dark:text-zinc-400 text-sm">
          KPIs de hojas asignadas
        </h3>
        {kpisError || !kpis || kpis.hojas_asignadas === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            {kpisError
              ? "No hay datos de KPIs."
              : "Sin hojas asignadas."}
          </p>
        ) : (
          <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="Hojas asignadas"
              value={kpis.hojas_asignadas}
              icon={<SheetsIcon />}
            />
            <KpiCard title="Hojas recibidas" value={kpis.hojas_recibidas} />
            <KpiCard title="Aceptadas" value={kpis.aceptadas} />
            <KpiCard title="Rechazadas" value={kpis.rechazadas} />
            <KpiCard title="Revisión TSE" value={kpis.revision_tse} />
            <KpiCard
              title="Efectividad real"
              value={`${kpis.efectividad_real}%`}
              icon={<ChartIcon />}
              variant={kpis.efectividad_real >= 80 ? "success" : "default"}
            />
            <KpiCard
              title="Cumplimiento meta"
              value={`${kpis.cumplimiento_meta}%`}
              variant={kpis.cumplimiento_meta >= 80 ? "success" : "default"}
            />
          </div>
        )}
      </section>
    </div>
  );
}
