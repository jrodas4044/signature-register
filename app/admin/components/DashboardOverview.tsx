"use client";

import type { DashboardSummary, TopPerformerRow } from "@/app/actions/kpis";
import { KpiCard } from "./KpiCard";
import { AdhesionesChart } from "./AdhesionesChart";
import { HojasChart } from "./HojasChart";
import { EfectividadChart } from "./EfectividadChart";

interface DashboardOverviewProps {
  summary: DashboardSummary | null;
  topPerformers: TopPerformerRow[];
}

const LeadersIcon = () => (
  <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SheetsIcon = () => (
  <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
  </svg>
);

const AdhesionsIcon = () => (
  <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998-0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

export function DashboardOverview({ summary, topPerformers }: DashboardOverviewProps) {
  const kpis = summary?.kpis;

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg w-1 h-6" />
          <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-lg">
            Resumen general
          </h3>
        </div>
        <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Líderes activos"
            value={kpis?.totalLideresActivos ?? 0}
            icon={<LeadersIcon />}
            variant="neutral"
          />
          <KpiCard
            title="Hojas asignadas"
            value={kpis?.totalHojasAsignadas ?? 0}
            subtitle={
              kpis
                ? `${kpis.totalHojasRecibidas} recibidas`
                : undefined
            }
            icon={<SheetsIcon />}
          />
          <KpiCard
            title="Total adhesiones"
            value={kpis?.totalAdhesiones ?? 0}
            subtitle={
              kpis
                ? `${kpis.adhesionesAceptadas} aceptadas · ${kpis.adhesionesRechazadas} rechazadas`
                : undefined
            }
            icon={<AdhesionsIcon />}
          />
          <KpiCard
            title="Efectividad global"
            value={kpis ? `${kpis.efectividadGlobal}%` : "0%"}
            icon={<ChartIcon />}
            variant={
              (kpis?.efectividadGlobal ?? 0) >= 80
                ? "success"
                : (kpis?.efectividadGlobal ?? 0) >= 50
                  ? "warning"
                  : "default"
            }
          />
        </div>
      </section>

      {/* Charts */}
      <div className="gap-6 grid lg:grid-cols-2">
        <section className="bg-white/80 dark:bg-zinc-900/80 shadow-lg shadow-zinc-900/5 dark:shadow-zinc-950/50 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50/50 dark:from-blue-950/20 to-transparent dark:to-transparent px-6 py-5 border-zinc-200/50 dark:border-zinc-800/50 border-b">
            <div className="flex justify-center items-center bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/25 shadow-lg dark:shadow-blue-500/10 rounded-lg w-10 h-10">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-50">
                Adhesiones por estado
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs">
                Distribución de adhesiones
              </p>
            </div>
          </div>
          <div className="px-4 py-2">
            <AdhesionesChart
              data={summary?.adhesionesPorEstado ?? []}
            />
          </div>
        </section>

        <section className="bg-white/80 dark:bg-zinc-900/80 shadow-lg shadow-zinc-900/5 dark:shadow-zinc-950/50 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50/50 dark:from-purple-950/20 to-transparent dark:to-transparent px-6 py-5 border-zinc-200/50 dark:border-zinc-800/50 border-b">
            <div className="flex justify-center items-center bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/25 dark:shadow-purple-500/10 rounded-lg w-10 h-10">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-50">
                Hojas por estado físico
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs">
                Estado de las hojas
              </p>
            </div>
          </div>
          <div className="px-4 py-2">
            <HojasChart data={summary?.hojasPorEstado ?? []} />
          </div>
        </section>
      </div>

      <section className="bg-white/80 dark:bg-zinc-900/80 shadow-lg shadow-zinc-900/5 dark:shadow-zinc-950/50 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-50/50 dark:from-emerald-950/20 to-transparent dark:to-transparent px-6 py-5 border-zinc-200/50 dark:border-zinc-800/50 border-b">
          <div className="flex justify-center items-center bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/25 shadow-lg dark:shadow-emerald-500/10 rounded-lg w-10 h-10">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50">
              Efectividad por líder
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-xs">
              Top 8 de la página actual
            </p>
          </div>
        </div>
        <div className="px-4 py-2">
          <EfectividadChart topPerformers={topPerformers} />
        </div>
      </section>
    </div>
  );
}
