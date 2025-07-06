import api from "./api";

export type DateRangeType = "today" | "yesterday" | "week" | "month" | "all";

export interface DateRange {
  preset?: DateRangeType;
  startDate?: string;
  endDate?: string;
}

export interface TopItem {
  name: string;
  quantity: number;
  revenue: number;
}

export interface CategoryRevenue {
  category: string;
  revenue: number;
}

export interface ServerPerformance {
  name: string;
  orders: number;
  revenue: number;
}

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  averageOrderValue: number;
  avgPrepTime: number;
  topItems: TopItem[];
  categoryRevenue: CategoryRevenue[];
  hourlySales: number[];
  hourlyOrders: number[];
  topServers: ServerPerformance[];
}

const analyticsService = {
  getAnalytics: async (dateRange: DateRange): Promise<AnalyticsData> => {
    const response = await api.post("/orders/analytics", dateRange);
    return response.data;
  },
};

export default analyticsService;
