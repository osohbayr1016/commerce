import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface AnalyticsData {
  overview: {
    totalRevenue: number;
    revenueGrowth: number;
    totalOrders: number;
    ordersGrowth: number;
    totalUsers: number;
    usersGrowth: number;
    totalProducts: number;
    productsGrowth: number;
    conversionRate: number;
    conversionGrowth: number;
    avgOrderValue: number;
    avgOrderGrowth: number;
  };
  salesChart: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
    views: number;
  }>;
  recentOrders: Array<{
    id: string;
    user_name: string;
    total_amount: number;
    status: string;
    created_at: string;
    items?: Array<{
      product_id: string;
      product?: { images?: string[]; name_en?: string; name_mn?: string };
    }>;
  }>;
  categoryPerformance: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
}

export async function getAnalyticsData(
  period: "week" | "month" | "year" = "month",
): Promise<AnalyticsData> {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const now = new Date();
  const periodDays = period === "week" ? 7 : period === "month" ? 30 : 365;
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - periodDays);

  const previousStartDate = new Date(startDate);
  previousStartDate.setDate(previousStartDate.getDate() - periodDays);

  const [
    currentOrders,
    previousOrders,
    totalUsersResp,
    newUsersCurrentPeriod,
    newUsersPreviousPeriod,
    totalProductsResp,
    newProductsCurrentPeriod,
    newProductsPreviousPeriod,
    topProducts,
    recentOrders,
    categoryStats,
    dailyStats,
  ] = await Promise.allSettled([
    supabase
      .from("orders")
      .select("total_amount, created_at")
      .gte("created_at", startDate.toISOString()),

    supabase
      .from("orders")
      .select("total_amount")
      .gte("created_at", previousStartDate.toISOString())
      .lt("created_at", startDate.toISOString()),

    adminClient.from("profiles").select("id", { count: "exact", head: true }),

    adminClient
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", startDate.toISOString()),

    adminClient
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", previousStartDate.toISOString())
      .lt("created_at", startDate.toISOString()),

    adminClient.from("products").select("id", { count: "exact", head: true }),

    adminClient
      .from("products")
      .select("id", { count: "exact", head: true })
      .gte("created_at", startDate.toISOString()),

    adminClient
      .from("products")
      .select("id", { count: "exact", head: true })
      .gte("created_at", previousStartDate.toISOString())
      .lt("created_at", startDate.toISOString()),

    supabase.rpc("get_top_products", { limit_count: 10 }),

    adminClient
      .from("orders")
      .select(
        "id, full_name, total_amount, status, created_at, order_items(product_id, products(images, name_en, name_mn))",
      )
      .order("created_at", { ascending: false })
      .limit(10),

    supabase.rpc("get_category_performance"),

    supabase.rpc("get_daily_sales", {
      days: periodDays,
    }),
  ]);

  const currentOrdersData =
    currentOrders.status === "fulfilled" ? currentOrders.value.data || [] : [];
  const previousOrdersData =
    previousOrders.status === "fulfilled"
      ? previousOrders.value.data || []
      : [];

  const totalRevenue = currentOrdersData.reduce(
    (sum: number, order: any) => sum + (order.total_amount || 0),
    0,
  );
  const previousRevenue = previousOrdersData.reduce(
    (sum: number, order: any) => sum + (order.total_amount || 0),
    0,
  );
  const revenueGrowth =
    previousRevenue > 0
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

  const totalOrders = currentOrdersData.length;
  const previousOrdersCount = previousOrdersData.length;
  const ordersGrowth =
    previousOrdersCount > 0
      ? ((totalOrders - previousOrdersCount) / previousOrdersCount) * 100
      : 0;

  const totalUsers =
    totalUsersResp.status === "fulfilled"
      ? (totalUsersResp.value.count ?? 0)
      : 0;
  const newUsersCurrent =
    newUsersCurrentPeriod.status === "fulfilled"
      ? (newUsersCurrentPeriod.value.count ?? 0)
      : 0;
  const newUsersPrevious =
    newUsersPreviousPeriod.status === "fulfilled"
      ? (newUsersPreviousPeriod.value.count ?? 0)
      : 0;
  const usersGrowth =
    newUsersPrevious > 0
      ? ((newUsersCurrent - newUsersPrevious) / newUsersPrevious) * 100
      : newUsersCurrent > 0
        ? 100
        : 0;

  const totalProducts =
    totalProductsResp.status === "fulfilled"
      ? (totalProductsResp.value.count ?? 0)
      : 0;
  const newProductsCurrent =
    newProductsCurrentPeriod.status === "fulfilled"
      ? (newProductsCurrentPeriod.value.count ?? 0)
      : 0;
  const newProductsPrevious =
    newProductsPreviousPeriod.status === "fulfilled"
      ? (newProductsPreviousPeriod.value.count ?? 0)
      : 0;
  const productsGrowth =
    newProductsPrevious > 0
      ? ((newProductsCurrent - newProductsPrevious) / newProductsPrevious) * 100
      : newProductsCurrent > 0
        ? 100
        : 0;

  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const previousAvgOrderValue =
    previousOrdersCount > 0 ? previousRevenue / previousOrdersCount : 0;
  const avgOrderGrowth =
    previousAvgOrderValue > 0
      ? ((avgOrderValue - previousAvgOrderValue) / previousAvgOrderValue) * 100
      : 0;

  const conversionRate = totalUsers > 0 ? (totalOrders / totalUsers) * 100 : 0;
  const previousConversionRate =
    totalUsers > 0 ? (previousOrdersCount / totalUsers) * 100 : 0;
  const conversionGrowth =
    previousConversionRate > 0
      ? ((conversionRate - previousConversionRate) / previousConversionRate) *
        100
      : 0;

  const salesChartData =
    dailyStats.status === "fulfilled" && dailyStats.value.data
      ? dailyStats.value.data.map((day: any) => ({
          date: new Date(day.date).toLocaleDateString("mn-MN", {
            month: "short",
            day: "numeric",
          }),
          revenue: day.revenue || 0,
          orders: day.orders || 0,
        }))
      : [];

  const topProductsData =
    topProducts.status === "fulfilled" && topProducts.value.data
      ? topProducts.value.data.map((product: any) => ({
          id: product.product_id,
          name: product.product_name,
          sales: product.total_sales || 0,
          revenue: product.total_revenue || 0,
          views: 0,
        }))
      : [];

  const recentOrdersData =
    recentOrders.status === "fulfilled" && recentOrders.value.data
      ? recentOrders.value.data.map((order: any) => ({
          id: order.id,
          user_name: order.full_name || "Unknown",
          total_amount: order.total_amount || 0,
          status: order.status || "pending",
          created_at: order.created_at,
          items: (order.order_items || []).map((oi: any) => ({
            product_id: oi.product_id,
            product: oi.products
              ? {
                  images: oi.products.images || [],
                  name_en: oi.products.name_en,
                  name_mn: oi.products.name_mn,
                }
              : undefined,
          })),
        }))
      : [];

  const categoryPerformanceData =
    categoryStats.status === "fulfilled" && categoryStats.value.data
      ? categoryStats.value.data.map((cat: any) => ({
          name: cat.category_name,
          sales: cat.total_sales || 0,
          revenue: cat.total_revenue || 0,
        }))
      : [];

  return {
    overview: {
      totalRevenue,
      revenueGrowth,
      totalOrders,
      ordersGrowth,
      totalUsers,
      usersGrowth,
      totalProducts,
      productsGrowth,
      conversionRate,
      conversionGrowth,
      avgOrderValue,
      avgOrderGrowth,
    },
    salesChart: salesChartData,
    topProducts: topProductsData,
    recentOrders: recentOrdersData,
    categoryPerformance: categoryPerformanceData,
  };
}
