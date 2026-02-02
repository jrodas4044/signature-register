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
      
      <section className="bg-white/80 dark:bg-zinc-900/80 shadow-lg shadow-zinc-900/5 dark:shadow-zinc-950/50 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50/50 dark:from-indigo-950/20 to-transparent dark:to-transparent px-6 py-5 border-zinc-200/50 dark:border-zinc-800/50 border-b">
          <div className="flex justify-center items-center bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-indigo-500/25 shadow-lg dark:shadow-indigo-500/10 rounded-lg w-10 h-10">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-lg">
              Top Performers
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-xs">
              Ordenados por efectividad real
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-800/30 text-zinc-600 dark:text-zinc-400 text-xs text-left uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Líder</th>
                <th className="px-6 py-4 font-semibold">Zona</th>
                <th className="px-6 py-4 font-semibold text-right">Aceptadas</th>
                <th className="px-6 py-4 font-semibold text-right">Rechazadas</th>
                <th className="px-6 py-4 font-semibold text-right">Revisión TSE</th>
                <th className="px-6 py-4 font-semibold text-right">Efectividad %</th>
                <th className="px-6 py-4 font-semibold text-right">Hojas asignadas</th>
                <th className="px-6 py-4 font-semibold text-right">Hojas recibidas</th>
                <th className="px-6 py-4 font-semibold text-right">Cumplimiento %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
              {topPerformers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-zinc-500 dark:text-zinc-400 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-12 h-12 text-zinc-300 dark:text-zinc-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                      </svg>
                      <p className="font-medium">No hay datos de líderes</p>
                    </div>
                  </td>
                </tr>
              ) : (
                topPerformers.map((row, idx) => (
                  <tr
                    key={row.lider_id}
                    className="hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {idx < 3 && (
                          <span className={`flex justify-center items-center rounded-lg w-7 h-7 font-bold text-white text-xs ${
                            idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                            idx === 1 ? 'bg-gradient-to-br from-zinc-300 to-zinc-500' :
                            'bg-gradient-to-br from-orange-400 to-orange-600'
                          }`}>
                            {idx + 1}
                          </span>
                        )}
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {row.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                      {row.zona ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-950/30 px-2.5 py-1 rounded-lg font-medium text-green-700 dark:text-green-400 text-xs">
                        {row.aceptadas}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 bg-red-50 dark:bg-red-950/30 px-2.5 py-1 rounded-lg font-medium text-red-700 dark:text-red-400 text-xs">
                        {row.rechazadas}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-lg font-medium text-amber-700 dark:text-amber-400 text-xs">
                        {row.revision_tse}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/30 px-2.5 py-1 rounded-lg font-bold text-indigo-700 dark:text-indigo-400">
                        {row.efectividad_real}%
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-700 dark:text-zinc-300 text-right">{row.hojas_asignadas}</td>
                    <td className="px-6 py-4 font-medium text-zinc-700 dark:text-zinc-300 text-right">{row.hojas_recibidas}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">{row.cumplimiento_meta}%</span>
                    </td>
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

      <section className="bg-white/80 dark:bg-zinc-900/80 shadow-lg shadow-zinc-900/5 dark:shadow-zinc-950/50 backdrop-blur-sm border border-red-200/50 dark:border-red-900/50 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 bg-gradient-to-r from-red-50/50 dark:from-red-950/20 to-transparent dark:to-transparent px-6 py-5 border-red-200/50 dark:border-red-900/50 border-b">
          <div className="flex justify-center items-center bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/25 dark:shadow-red-500/10 rounded-lg w-10 h-10">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-lg">
              Alertas de fraude
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-xs">
              &gt;15% rechazos por firma/impresión dactilar/plana
            </p>
          </div>
        </div>
        {fraudError && (
          <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 mx-6 mt-4 p-4 border border-red-200 dark:border-red-800/50 rounded-xl text-red-700 dark:text-red-400 text-sm">
            <svg className="flex-shrink-0 mt-0.5 w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <span>{fraudError}</span>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-red-50/50 dark:bg-red-950/20 text-zinc-600 dark:text-zinc-400 text-xs text-left uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Líder</th>
                <th className="px-6 py-4 font-semibold">Zona</th>
                <th className="px-6 py-4 font-semibold text-right">Total rechazadas</th>
                <th className="px-6 py-4 font-semibold text-right">Rechazos firma/impresión</th>
                <th className="px-6 py-4 font-semibold text-right">% firma/impresión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
              {fraudAlerts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-zinc-500 dark:text-zinc-400 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-12 h-12 text-green-300 dark:text-green-900" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="font-medium text-green-600 dark:text-green-400">No hay alertas de fraude</p>
                      <p className="text-xs">Todos los líderes están dentro del rango aceptable</p>
                    </div>
                  </td>
                </tr>
              ) : (
                fraudAlerts.map((row) => (
                  <tr
                    key={row.lider_id}
                    className="hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      {row.nombre}
                    </td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                      {row.zona ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 bg-red-50 dark:bg-red-950/30 px-2.5 py-1 rounded-lg font-medium text-red-700 dark:text-red-400 text-xs">
                        {row.total_rechazadas}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-lg font-medium text-amber-700 dark:text-amber-400 text-xs">
                        {row.rechazos_firma_impresion}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 bg-red-100 dark:bg-red-900/40 px-3 py-1.5 rounded-lg font-bold text-red-700 dark:text-red-300">
                        {row.porcentaje_firma_impresion}%
                      </span>
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
