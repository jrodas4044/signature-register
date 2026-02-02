import { getTopPerformers, getFraudAlerts, getDashboardSummary } from "@/app/actions/kpis";
import { DashboardContent } from "./DashboardContent";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ pageTop?: string; pageFraud?: string }>;
}) {
  const params = await searchParams;
  const pageTop = Math.max(1, parseInt(params.pageTop ?? "1", 10) || 1);
  const pageFraud = Math.max(1, parseInt(params.pageFraud ?? "1", 10) || 1);
  const pageSize = 10;

  const [summaryResult, topResult, fraudResult] = await Promise.all([
    getDashboardSummary(),
    getTopPerformers(pageTop, pageSize),
    getFraudAlerts(undefined, pageFraud, pageSize),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 text-2xl tracking-tight">
          Dashboard
        </h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400 text-sm">
          Top Performers y Alertas de fraude. KPIs por líder.
        </p>
      </div>

      {topResult.error && (
        <div className="bg-red-50 dark:bg-red-950/30 p-4 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
          {topResult.error}
        </div>
      )}

      <DashboardContent
        summary={summaryResult.data}
        topPerformers={topResult.data ?? []}
        fraudAlerts={fraudResult.data ?? []}
        fraudError={fraudResult.error}
        totalTop={topResult.total}
        pageTop={pageTop}
        pageSizeTop={pageSize}
        totalFraud={fraudResult.total}
        pageFraud={pageFraud}
        pageSizeFraud={pageSize}
      />
    </div>
  );
}
