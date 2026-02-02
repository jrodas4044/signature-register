"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DataPoint {
  estado: string;
  cantidad: number;
}

const COLORS = [
  "hsl(215 100% 55%)",
  "hsl(142 71% 45%)",
  "hsl(38 92% 50%)",
  "hsl(262 83% 58%)",
  "hsl(0 84% 60%)",
];

export function HojasChart({ data }: { data: DataPoint[] }) {
  if (!data.length) {
    return (
      <div className="flex justify-center items-center h-64 text-zinc-500 dark:text-zinc-400 text-sm">
        No hay datos de hojas
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="cantidad"
          nameKey="estado"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "rgb(39 39 42)",
            border: "1px solid rgb(63 63 70)",
            borderRadius: "8px",
            color: "rgb(244 244 245)",
          }}
          formatter={(value, name) => [value ?? 0, name]}
        />
        <Legend
          wrapperStyle={{ fontSize: "12px" }}
          formatter={(value) => value}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
