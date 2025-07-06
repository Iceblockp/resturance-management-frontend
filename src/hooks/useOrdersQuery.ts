import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Order } from "../types/order";
import orderService from "../services/orderService";
import { DateRange } from "../types/dateRange";

// Query keys
export const queryKeys = {
  orders: "orders",
};

// Hook for fetching all orders
export const useOrdersQuery = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: [queryKeys.orders, dateRange],
    queryFn: () => orderService.getAllOrders(dateRange),
  });
};

// Hook for fetching a single order
export const useOrderQuery = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.orders, id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id, // Only run the query if we have an ID
  });
};

// Hook for creating an order
export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      orderData: Omit<
        Order,
        | "id"
        | "orderNumber"
        | "createdAt"
        | "updatedAt"
        | "createdBy"
        | "createdById"
        | "totalAmount"
        | "status"
      >
    ) => orderService.createOrder(orderData),
    onSuccess: () => {
      // Invalidate the orders query
      queryClient.invalidateQueries({ queryKey: [queryKeys.orders] });
    },
  });
};

// Hook for updating an order
export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      orderData,
    }: {
      id: string;
      orderData: Partial<Order>;
    }) => orderService.updateOrder(id, orderData),
    onSuccess: (updatedOrder) => {
      // Update the cache for this specific order
      queryClient.setQueryData(
        [queryKeys.orders, updatedOrder.id],
        updatedOrder
      );
      // Invalidate the orders list query
      queryClient.invalidateQueries({ queryKey: [queryKeys.orders] });
    },
  });
};

// Hook for updating an order's status
export const useUpdateOrderStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order["status"] }) =>
      orderService.updateOrderStatus(id, status),
    onSuccess: (updatedOrder) => {
      // Update the cache for this specific order
      queryClient.setQueryData(
        [queryKeys.orders, updatedOrder.id],
        updatedOrder
      );
      // Invalidate the orders list query
      queryClient.invalidateQueries({ queryKey: [queryKeys.orders] });
    },
  });
};

// Hook for deleting an order
export const useDeleteOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orderService.deleteOrder(id),
    onSuccess: (_, id) => {
      // Invalidate the orders query
      queryClient.invalidateQueries({ queryKey: [queryKeys.orders] });
      // Remove this specific order from the cache
      queryClient.removeQueries({ queryKey: [queryKeys.orders, id] });
    },
  });
};
