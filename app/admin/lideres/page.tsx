import { listLideres } from "@/app/actions/lideres";
import { getCurrentUserRole } from "@/lib/auth/roles";
import { LideresContent } from "./LideresContent";

export default async function LideresPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const pageSize = Math.min(50, Math.max(5, parseInt(params.pageSize ?? "10", 10) || 10));
  const [result, role] = await Promise.all([
    listLideres(page, pageSize),
    getCurrentUserRole(),
  ]);
  const { data: lideres, total, error } = result;
  const canEdit = role === "administrador";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 text-2xl tracking-tight">
          Líderes
        </h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400 text-sm">
          Lista de líderes para asignación de hojas. Crear al menos uno para usar Inventario.
        </p>
      </div>
      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 p-4 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
          {error}
        </div>
      )}
      <LideresContent
        lideres={lideres ?? []}
        total={total}
        page={page}
        pageSize={pageSize}
        canEdit={canEdit}
      />
    </div>
  );
}
