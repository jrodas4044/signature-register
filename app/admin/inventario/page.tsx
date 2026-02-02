import { listAllLideres } from "@/app/actions/lideres";
import { InventarioForms } from "./InventarioForms";

export default async function InventarioPage() {
  const { data: lideres, error: lideresError } = await listAllLideres();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 text-2xl tracking-tight">
          Inventario de hojas
        </h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400 text-sm">
          Asignación masiva de hojas a líderes y registro de recepción.
        </p>
      </div>

      {lideresError && (
        <div className="bg-red-50 dark:bg-red-950/30 p-4 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
          {lideresError}
        </div>
      )}

      <InventarioForms lideres={lideres ?? []} />
    </div>
  );
}
