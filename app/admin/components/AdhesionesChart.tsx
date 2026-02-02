"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface DataPoint {
  estado: string;
  cantidad: number;
}

const COLORS = [
  "hsl(215 100% 55%)",
  "hsl(142 71% 45%)",
  "hsl(0 84% 60%)",
  "hsl(38 92% 50%)",
  "hsl(262 83% 58%)",
  "hsl(199 89% 48%)",
];

export function AdhesionesChart({ data }: { data: DataPoint[] }) {
  if (!data.length) {
    return (
      <div className="flex justify-center items-center h-64 text-zinc-500 dark:text-zinc-400 text-sm">
        No hay datos de adhesiones
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-zinc-200 dark:stroke-zinc-700"
        />
        <XAxis
          dataKey="estado"
          tick={{ fontSize: 12 }}
          className="fill-zinc-600 dark:fill-zinc-400"
          angle={-25}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          className="fill-zinc-600 dark:fill-zinc-400"
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgb(39 39 42)",
            border: "1px solid rgb(63 63 70)",
            borderRadius: "8px",
            color: "rgb(244 244 245)",
          }}
          formatter={(value) => [value ?? 0, "Cantidad"]}
        />
        <Bar dataKey="cantidad" name="Cantidad" radius={[4, 4, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
