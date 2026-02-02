import Link from "next/link";
import { notFound } from "next/navigation";
import { getLider } from "@/app/actions/lideres";
import { getCurrentUserRole } from "@/lib/auth/roles";
import { LiderDeleteButton } from "./LiderDeleteButton";

export default async function LiderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: lider, error } = await getLider(id);
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
    </div>
  );
}
