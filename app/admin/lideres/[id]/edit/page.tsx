import Link from "next/link";
import { notFound } from "next/navigation";
import { getLider } from "@/app/actions/lideres";
import { LiderEditForm } from "./LiderEditForm";

export default async function LiderEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: lider, error } = await getLider(id);

  if (error || !lider) {
    notFound();
  }

  if (lider.deleted_at) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 text-2xl tracking-tight">
          Editar líder
        </h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400 text-sm">
          <Link
            href={`/admin/lideres/${id}`}
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Volver al detalle
          </Link>
          {" · "}
          <Link
            href="/admin/lideres"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Listado
          </Link>
        </p>
      </div>

      <section className="bg-white dark:bg-zinc-900 shadow-sm p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl">
        <LiderEditForm lider={lider} id={id} />
      </section>
    </div>
  );
}
