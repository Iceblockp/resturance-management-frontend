import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import analyticsService, {
  DateRange,
  AnalyticsData,
} from "../services/analyticsService";

// Query keys
export const analyticsQueryKeys = {
  analytics: "analytics",
};

// Hook for fetching analytics data
export const useAnalyticsQuery = (dateRange: DateRange) => {
  return useQuery<AnalyticsData>({
    queryKey: [analyticsQueryKeys.analytics, dateRange],
    queryFn: () => analyticsService.getAnalytics(dateRange),
  });
};
