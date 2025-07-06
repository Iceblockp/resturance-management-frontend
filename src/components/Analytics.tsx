import React, { useState, useMemo } from "react";
import { Order } from "../types/order";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Clock,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Download,
} from "lucide-react";
import { useOrdersWithWebSocket } from "../hooks/useOrdersWithWebSocket";
import { formatCurrencyMMK } from "../data/currency";
import { useAnalyticsQuery } from "../hooks/useAnalyticsQuery";
import { DateRangeType } from "../services/analyticsService";

interface AnalyticsProps {}

export const Analytics: React.FC<AnalyticsProps> = () => {
  const [dateRange, setDateRange] = useState<DateRangeType>("today");
  const {
    data: analytics,
    isLoading,
    error,
  } = useAnalyticsQuery({ preset: dateRange });
  const [chartType, setChartType] = useState<"revenue" | "orders" | "items">(
    "revenue"
  );

  const exportAnalytics = () => {
    if (!analytics) return;

    const data = {
      dateRange,
      analytics,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${dateRange}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter orders based on date range
  // const filteredOrders = useMemo(() => {
  //   const now = new Date();
  //   const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  //   const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  //   const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  //   const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  //   switch (dateRange) {
  //     case "today":
  //       return orders.filter((order) => order.createdAt >= today);
  //     case "yesterday":
  //       return orders.filter(
  //         (order) => order.createdAt >= yesterday && order.createdAt < today
  //       );
  //     case "week":
  //       return orders.filter((order) => order.createdAt >= weekAgo);
  //     case "month":
  //       return orders.filter((order) => order.createdAt >= monthAgo);
  //     default:
  //       return orders;
  //   }
  // }, [orders, dateRange]);

  // Calculate analytics data
  // const analytics = useMemo(() => {
  //   const completedOrders = filteredOrders.filter(
  //     (order) => order.status === "completed"
  //   );
  //   const totalRevenue = completedOrders.reduce(
  //     (sum, order) => sum + Number(order.totalAmount),
  //     0
  //   );
  //   const totalOrders = filteredOrders.length;
  //   const averageOrderValue =
  //     totalOrders > 0 ? totalRevenue / completedOrders.length : 0;

  //   // Calculate average preparation time
  //   const avgPrepTime =
  //     completedOrders.length > 0
  //       ? completedOrders.reduce((sum, order) => {
  //           const prepTime = Math.floor(
  //             (order.updatedAt.getTime() - order.createdAt.getTime()) / 60000
  //           );
  //           return sum + prepTime;
  //         }, 0) / completedOrders.length
  //       : 0;

  //   // Top selling items
  //   const itemSales = new Map<
  //     string,
  //     { name: string; quantity: number; revenue: number }
  //   >();
  //   completedOrders?.forEach((order) => {
  //     order.orderItems.forEach((item) => {
  //       // Use menuItemId instead of item.id to properly group by menu item
  //       const existing = itemSales.get(item.menuItemId) || {
  //         name: item.menuItem?.name,
  //         quantity: 0,
  //         revenue: 0,
  //       };
  //       itemSales.set(item.menuItemId, {
  //         name: item.menuItem?.name || "",
  //         quantity: existing.quantity + item.quantity,
  //         revenue: existing.revenue + item.price * item.quantity,
  //       });
  //     });
  //   });

  //   const topItems = Array.from(itemSales.values())
  //     .sort((a, b) => b.quantity - a.quantity)
  //     .slice(0, 5);

  //   // Revenue by category
  //   const categoryRevenue = new Map<string, number>();
  //   completedOrders.forEach((order) => {
  //     order.orderItems.forEach((item) => {
  //       const existing = categoryRevenue.get(item.category?.name || "") || 0;
  //       categoryRevenue.set(
  //         item.category?.name || "",
  //         existing + item.price * item.quantity
  //       );
  //     });
  //   });

  //   // Hourly sales data
  //   const hourlySales = new Array(24).fill(0);
  //   const hourlyOrders = new Array(24).fill(0);
  //   completedOrders.forEach((order) => {
  //     const hour = order.createdAt.getHours();
  //     hourlySales[hour] += order.totalAmount;
  //     hourlyOrders[hour] += 1;
  //   });

  //   // Server performance
  //   const serverStats = new Map<string, { orders: number; revenue: number }>();
  //   completedOrders.forEach((order) => {
  //     const existing = serverStats.get(order.createdBy.name) || {
  //       orders: 0,
  //       revenue: 0,
  //     };
  //     // Ensure we're adding numbers, not concatenating strings
  //     serverStats.set(order.createdBy.name, {
  //       orders: existing.orders + 1,
  //       revenue: existing.revenue + Number(order.totalAmount),
  //     });
  //   });

  //   const topServers = Array.from(serverStats.entries())
  //     .map(([name, stats]) => ({ name, ...stats }))
  //     .sort((a, b) => b.revenue - a.revenue)
  //     .slice(0, 5);

  //   return {
  //     totalRevenue,
  //     totalOrders,
  //     completedOrders: completedOrders.length,
  //     averageOrderValue,
  //     avgPrepTime,
  //     topItems,
  //     categoryRevenue: Array.from(categoryRevenue.entries()),
  //     hourlySales,
  //     hourlyOrders,
  //     topServers,
  //   };
  // }, [filteredOrders]);

  // const exportAnalytics = () => {
  //   if (!analytics) return;

  //   const data = {
  //     dateRange,
  //     analytics,
  //     generatedAt: new Date().toISOString(),
  //   };

  //   const blob = new Blob([JSON.stringify(data, null, 2)], {
  //     type: "application/json",
  //   });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = `analytics-${dateRange}-${
  //     new Date().toISOString().split("T")[0]
  //   }.json`;
  //   a.click();
  //   URL.revokeObjectURL(url);
  // };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">
          Loading analytics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-red-600">
          Error loading analytics
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">
          No analytics data available
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as DateRangeType)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
              <button
                onClick={exportAnalytics}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrencyMMK(analytics.totalRevenue)}
                </p>
              </div>
              <DollarSign className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics.totalOrders}
                </p>
              </div>
              <ShoppingCart className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Order Value
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrencyMMK(analytics.averageOrderValue)}
                </p>
              </div>
              <TrendingUp className="text-purple-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Prep Time
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {Math.round(analytics.avgPrepTime)}m
                </p>
              </div>
              <Clock className="text-orange-500" size={32} />
            </div>
          </div>
        </div>

        {/* The rest of the component remains the same, just using analytics directly instead of calculating it */}
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Hourly Sales Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Hourly Performance
              </h3>
              <select
                value={chartType}
                onChange={(e) =>
                  setChartType(e.target.value as "revenue" | "orders" | "items")
                }
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="revenue">Revenue</option>
                <option value="orders">Orders</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between gap-1">
              {(chartType === "revenue"
                ? analytics.hourlySales
                : analytics.hourlyOrders
              ).map((value, hour) => {
                const maxValue = Math.max(
                  ...(chartType === "revenue"
                    ? analytics.hourlySales
                    : analytics.hourlyOrders)
                );
                const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                return (
                  <div key={hour} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                      style={{
                        height: `${height}%`,
                        minHeight: value > 0 ? "4px" : "0px",
                      }}
                      title={`${hour}:00 - ${
                        chartType === "revenue"
                          ? `$${value}`
                          : `${value} orders`
                      }`}
                    ></div>
                    <span className="text-xs text-gray-500 mt-1">{hour}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Revenue */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Revenue by Category
            </h3>
            <div className="space-y-3">
              {analytics.categoryRevenue.map((item) => {
                const percentage =
                  analytics.totalRevenue > 0
                    ? (item.revenue / analytics.totalRevenue) * 100
                    : 0;
                return (
                  <div
                    key={item.category}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm font-medium text-gray-900 capitalize w-20">
                        {item.category}
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 ml-3">
                      {formatCurrencyMMK(item.revenue)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Items and Servers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Selling Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top Selling Items
            </h3>
            <div className="space-y-3">
              {analytics.topItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-900">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {item.quantity} sold
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatCurrencyMMK(item.revenue)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Servers */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top Performing Servers
            </h3>
            <div className="space-y-3">
              {analytics.topServers.map((server, index) => (
                <div
                  key={server.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-green-500 text-white text-xs font-bold rounded-full">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-900">
                      {server.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrencyMMK(server.revenue)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {server.orders} orders
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
