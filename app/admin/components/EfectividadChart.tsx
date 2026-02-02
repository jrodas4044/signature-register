"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

export function EfectividadChart({
  topPerformers,
}: {
  topPerformers: { nombre: string; efectividad_real: number }[];
}) {
  const chartData = topPerformers.slice(0, 8).map((r) => ({
    nombre: r.nombre.length > 15 ? r.nombre.slice(0, 15) + "…" : r.nombre,
    valor: r.efectividad_real,
  }));

  if (!chartData.length) {
    return (
      <div className="flex justify-center items-center h-64 text-zinc-500 dark:text-zinc-400 text-sm">
        No hay datos de efectividad
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-zinc-200 dark:stroke-zinc-700"
          horizontal={false}
        />
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fontSize: 11 }}
          className="fill-zinc-600 dark:fill-zinc-400"
        />
        <YAxis
          type="category"
          dataKey="nombre"
          width={55}
          tick={{ fontSize: 11 }}
          className="fill-zinc-600 dark:fill-zinc-400"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgb(39 39 42)",
            border: "1px solid rgb(63 63 70)",
            borderRadius: "8px",
            color: "rgb(244 244 245)",
          }}
          formatter={(value) => [`${value ?? 0}%`, "Efectividad"]}
        />
        <ReferenceLine x={80} stroke="hsl(142 71% 45%)" strokeDasharray="3 3" />
        <Bar dataKey="valor" name="Efectividad %" radius={[0, 4, 4, 0]}>
          {chartData.map((entry, index) => (
            <Cell
              key={index}
              fill={
                entry.valor >= 80
                  ? "hsl(142 71% 45%)"
                  : entry.valor >= 50
                    ? "hsl(38 92% 50%)"
                    : "hsl(0 84% 60%)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
