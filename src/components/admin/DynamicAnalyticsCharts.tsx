"use client";

import dynamic from "next/dynamic";

const SalesChart = dynamic(
  () =>
    import("@/components/admin/AnalyticsCharts").then((m) => m.SalesChart),
  { ssr: false }
);

const ProductPerformanceChart = dynamic(
  () =>
    import("@/components/admin/AnalyticsCharts").then(
      (m) => m.ProductPerformanceChart
    ),
  { ssr: false }
);

interface SalesChartData {
  date: string;
  revenue: number;
  orders: number;
}

interface ProductPerformanceData {
  name: string;
  sales: number;
  revenue: number;
}

export function DynamicSalesChart({ data }: { data: SalesChartData[] }) {
  return <SalesChart data={data} />;
}

export function DynamicProductPerformanceChart({
  data,
}: {
  data: ProductPerformanceData[];
}) {
  return <ProductPerformanceChart data={data} />;
}
