import { listHojas, type ListHojasFilters } from "@/app/actions/hojas";
import { listAllLideres } from "@/app/actions/lideres";
import { HojasContent } from "./HojasContent";

export default async function HojasPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    estado_fisico?: string;
    lider_id?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const pageSize = Math.min(50, Math.max(5, parseInt(params.pageSize ?? "10", 10) || 10));
  const filters: ListHojasFilters | undefined =
    params.estado_fisico || params.lider_id
      ? {
          ...(params.estado_fisico && {
            estado_fisico: params.estado_fisico as ListHojasFilters["estado_fisico"],
          }),
          ...(params.lider_id && { lider_id: params.lider_id }),
        }
      : undefined;
  const [result, lideresResult] = await Promise.all([
    listHojas(page, pageSize, filters),
    listAllLideres(),
  ]);
  const { data: hojas, total, error } = result;
  const { data: lideres } = lideresResult;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 text-2xl tracking-tight">
          Hojas
        </h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400 text-sm">
          Listado de hojas asignadas a líderes. Ver detalle y administrar estado o reasignación desde cada fila.
        </p>
      </div>
      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 p-4 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
          {error}
        </div>
      )}
      <HojasContent
        hojas={hojas ?? []}
        total={total}
        page={page}
        pageSize={pageSize}
        lideres={lideres ?? []}
        filterEstado={params.estado_fisico ?? ""}
        filterLiderId={params.lider_id ?? ""}
      />
    </div>
  );
}
