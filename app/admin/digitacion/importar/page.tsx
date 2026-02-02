import { ImportarCsvForm } from "./ImportarCsvForm";

export default function ImportarPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 text-2xl tracking-tight">
          Importar dictámenes TSE
        </h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400 text-sm">
          Carga masiva CSV: número de hoja, línea (1-5), estado (ACEPTADO/RECHAZADO/…), causa rechazo (opcional).
          Actualiza adhesiones por coincidencia NumeroHoja + Linea.
        </p>
      </div>
      <ImportarCsvForm />
    </div>
  );
}
