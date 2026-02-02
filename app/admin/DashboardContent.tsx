"use client";

import type {
  TopPerformerRow,
  FraudAlertRow,
  DashboardSummary,
} from "@/app/actions/kpis";
import { Pagination } from "./components/Pagination";
import { DashboardOverview } from "./components/DashboardOverview";

interface DashboardContentProps {
  summary: DashboardSummary | null;
  topPerformers: TopPerformerRow[];
  fraudAlerts: FraudAlertRow[];
  fraudError: string | null;
  totalTop: number;
  pageTop: number;
  pageSizeTop: number;
  totalFraud: number;
  pageFraud: number;
  pageSizeFraud: number;
}

export function DashboardContent({
  summary,
  topPerformers,
  fraudAlerts,
  fraudError,
  totalTop,
  pageTop,
  pageSizeTop,
  totalFraud,
  pageFraud,
  pageSizeFraud,
}: DashboardContentProps) {
  return (
    <div className="space-y-8">
      <DashboardOverview summary={summary} topPerformers={topPerformers} />
      <section className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <h3 className="px-6 py-4 border-zinc-200 dark:border-zinc-800 border-b font-medium text-zinc-900 dark:text-zinc-50 text-lg">
          Top Performers (por Efectividad Real)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 text-left">
                <th className="px-4 py-3 font-medium">Líder</th>
                <th className="px-4 py-3 font-medium">Zona</th>
                <th className="px-4 py-3 font-medium text-right">Aceptadas</th>
                <th className="px-4 py-3 font-medium text-right">Rechazadas</th>
                <th className="px-4 py-3 font-medium text-right">Revisión TSE</th>
                <th className="px-4 py-3 font-medium text-right">Efectividad %</th>
                <th className="px-4 py-3 font-medium text-right">Hojas asignadas</th>
                <th className="px-4 py-3 font-medium text-right">Hojas recibidas</th>
                <th className="px-4 py-3 font-medium text-right">Cumplimiento %</th>
              </tr>
            </thead>
            <tbody>
              {topPerformers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-zinc-500 dark:text-zinc-400 text-center">
                    No hay datos de líderes.
                  </td>
                </tr>
              ) : (
                topPerformers.map((row) => (
                  <tr
                    key={row.lider_id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 border-zinc-200 dark:border-zinc-800 border-t"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                      {row.nombre}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {row.zona ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right">{row.aceptadas}</td>
                    <td className="px-4 py-3 text-right">{row.rechazadas}</td>
                    <td className="px-4 py-3 text-right">{row.revision_tse}</td>
                    <td className="px-4 py-3 font-medium text-right">
                      {row.efectividad_real}%
                    </td>
                    <td className="px-4 py-3 text-right">{row.hojas_asignadas}</td>
                    <td className="px-4 py-3 text-right">{row.hojas_recibidas}</td>
                    <td className="px-4 py-3 text-right">{row.cumplimiento_meta}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={pageTop}
          totalPages={Math.ceil(totalTop / pageSizeTop) || 1}
          paramName="pageTop"
        />
      </section>

      <section className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <h3 className="px-6 py-4 border-zinc-200 dark:border-zinc-800 border-b font-medium text-zinc-900 dark:text-zinc-50 text-lg">
          Alertas de fraude (&gt;15% rechazos por firma/impresión dactilar/plana)
        </h3>
        {fraudError && (
          <p className="px-6 py-2 text-red-600 dark:text-red-400 text-sm">{fraudError}</p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 text-left">
                <th className="px-4 py-3 font-medium">Líder</th>
                <th className="px-4 py-3 font-medium">Zona</th>
                <th className="px-4 py-3 font-medium text-right">Total rechazadas</th>
                <th className="px-4 py-3 font-medium text-right">Rechazos firma/impresión</th>
                <th className="px-4 py-3 font-medium text-right">% firma/impresión</th>
              </tr>
            </thead>
            <tbody>
              {fraudAlerts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-zinc-500 dark:text-zinc-400 text-center">
                    No hay alertas de fraude.
                  </td>
                </tr>
              ) : (
                fraudAlerts.map((row) => (
                  <tr
                    key={row.lider_id}
                    className="hover:bg-amber-50 dark:hover:bg-amber-950/20 border-zinc-200 dark:border-zinc-800 border-t"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                      {row.nombre}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {row.zona ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right">{row.total_rechazadas}</td>
                    <td className="px-4 py-3 text-right">
                      {row.rechazos_firma_impresion}
                    </td>
                    <td className="px-4 py-3 font-medium text-amber-700 dark:text-amber-400 text-right">
                      {row.porcentaje_firma_impresion}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={pageFraud}
          totalPages={Math.ceil(totalFraud / pageSizeFraud) || 1}
          paramName="pageFraud"
        />
      </section>
    </div>
  );
}
