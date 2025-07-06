import { useCallback } from "react";
import {
  useOrdersQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} from "./useOrdersQuery";
import { Order } from "../types/order";
import { DateRange } from "../types/dateRange";

export const useOrders = (dateRange?: DateRange) => {
  const { data: orders = [], isLoading, error } = useOrdersQuery(dateRange);
  const createOrderMutation = useCreateOrderMutation();
  const updateOrderMutation = useUpdateOrderMutation();
  const updateOrderStatusMutation = useUpdateOrderStatusMutation();
  const deleteOrderMutation = useDeleteOrderMutation();

  const addOrder = useCallback(
    async (
      order: Omit<
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
    ) => {
      try {
        const newOrder = await createOrderMutation.mutateAsync(order);
        return newOrder;
      } catch (err) {
        console.error("Error adding order:", err);
        throw err;
      }
    },
    [createOrderMutation]
  );

  const updateOrderStatus = useCallback(
    async (orderId: string, status: Order["status"]) => {
      try {
        await updateOrderStatusMutation.mutateAsync({ id: orderId, status });
      } catch (err) {
        console.error("Error updating order status:", err);
        throw err;
      }
    },
    [updateOrderStatusMutation]
  );

  const updateOrder = useCallback(
    async (orderId: string, updates: Partial<Order>) => {
      try {
        await updateOrderMutation.mutateAsync({
          id: orderId,
          orderData: updates,
        });
      } catch (err) {
        console.error("Error updating order:", err);
        throw err;
      }
    },
    [updateOrderMutation]
  );

  const deleteOrder = useCallback(
    async (orderId: string) => {
      try {
        await deleteOrderMutation.mutateAsync(orderId);
      } catch (err) {
        console.error("Error deleting order:", err);
        throw err;
      }
    },
    [deleteOrderMutation]
  );

  const getOrdersByStatus = useCallback(
    (status: Order["status"]) => {
      return orders.filter((order) => order.status === status);
    },
    [orders]
  );

  const getActiveOrders = useCallback(() => {
    return orders.filter((order) => order.status !== "completed");
  }, [orders]);

  return {
    orders,
    isLoading,
    error,
    addOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
    getOrdersByStatus,
  };
};
