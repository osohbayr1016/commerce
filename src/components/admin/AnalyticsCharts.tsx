"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SalesChartProps {
  data: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

// Custom Glassmorphic Tooltip Component for Sales Area Chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="backdrop-blur-md bg-white/95 border border-neutral-200/80 p-4 rounded-xl shadow-lg font-sans text-xs">
        <p className="font-bold text-neutral-800 border-b border-neutral-100 pb-2 mb-2 font-mono">{label}</p>
        <div className="space-y-1.5 font-medium">
          {payload.map((pld: any) => (
            <div key={pld.dataKey} className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-1.5 text-neutral-500">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pld.color }}></span>
                {pld.name}
              </span>
              <span className="font-bold font-mono text-neutral-900">
                {pld.dataKey === "revenue"
                  ? new Intl.NumberFormat("mn-MN").format(pld.value) + " ₮"
                  : pld.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="bg-white border border-neutral-200/80 rounded-xl p-6 shadow-xs min-w-0">
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          Борлуулалтын чиг хандлага
        </h3>
        <p className="text-[11px] text-neutral-500 mt-0.5">
          Орлого болон нийт захиалгын харьцуулсан график
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {/* Ambient gradients for high-fidelity fintech presentation */}
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d97706" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            tick={{ fill: "#6b7280", fontSize: 10, fontWeight: 500 }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
          />
          <YAxis
            stroke="#9ca3af"
            tick={{ fill: "#6b7280", fontSize: 10, fontWeight: 500, fontFamily: "monospace" }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, fontWeight: 600, color: "#4b5563" }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Нийт орлого"
            stroke="#d97706"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            dot={{ r: 3, stroke: "#d97706", strokeWidth: 1, fill: "#fff" }}
            activeDot={{ r: 5, strokeWidth: 0, fill: "#d97706" }}
          />
          <Area
            type="monotone"
            dataKey="orders"
            name="Нийт захиалга"
            stroke="#10b981"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorOrders)"
            dot={{ r: 3, stroke: "#10b981", strokeWidth: 1, fill: "#fff" }}
            activeDot={{ r: 5, strokeWidth: 0, fill: "#10b981" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ProductPerformanceProps {
  data: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
}

// Custom Glassmorphic Tooltip Component for Performance Bar Chart
const BarCustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="backdrop-blur-md bg-white/95 border border-neutral-200/80 p-4 rounded-xl shadow-lg font-sans text-xs">
        <p className="font-bold text-neutral-800 border-b border-neutral-100 pb-2 mb-2">{label}</p>
        <div className="space-y-1.5 font-medium">
          {payload.map((pld: any) => (
            <div key={pld.dataKey} className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-1.5 text-neutral-500">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Хэмжээ
              </span>
              <span className="font-bold font-mono text-neutral-900">{pld.value} ширхэг</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function ProductPerformanceChart({ data }: ProductPerformanceProps) {
  return (
    <div className="bg-white border border-neutral-200/80 rounded-xl p-6 shadow-xs min-w-0">
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          Бүтээгдэхүүний Гүйцэтгэл
        </h3>
        <p className="text-[11px] text-neutral-500 mt-0.5">
          Ангилал болон брэндийн борлуулалтын хэмжээ
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#9ca3af"
            tick={{ fill: "#6b7280", fontSize: 10, fontWeight: 500 }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
          />
          <YAxis
            stroke="#9ca3af"
            tick={{ fill: "#6b7280", fontSize: 10, fontWeight: 500, fontFamily: "monospace" }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
          />
          <Tooltip content={<BarCustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, fontWeight: 600, color: "#4b5563" }}
          />
          <Bar
            dataKey="sales"
            name="Борлуулалтын хэмжээ"
            fill="#d97706"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
