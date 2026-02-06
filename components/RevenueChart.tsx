"use client"; // Obligatoire car un graphique utilise le navigateur (SVG/Canvas)

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// On définit le format des données qu'on attend du SQL
interface ChartData {
  name: string; // Ex: "Automobile"
  total: number; // Ex: 12500
}

interface Props {
  data: ChartData[];
}

export default function RevenueChart({ data }: Props) {
  // Si pas de données, on affiche un message propre
  if (data.length === 0) {
    return (
      <p className="text-slate-400 text-sm text-center py-10">
        Pas assez de données pour le graphique.
      </p>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px]">
      <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-6">
        Répartition du Chiffre d'Affaires
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
          />

          <XAxis
            dataKey="name"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            unit="€"
          />

          <Tooltip
            cursor={{ fill: "#f1f5f9" }}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />

          <Bar
            dataKey="total"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            barSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
