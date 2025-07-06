import { useState, useEffect } from "react";
import { useOrders } from "./useOrders";
import { useWebSocket } from "./useWebSocket";
import { Order } from "../types/order";
import { DateRange } from "../types/dateRange";

export const useOrdersWithWebSocket = (dateRange?: DateRange) => {
  const { orders: initialOrders, ...orderMethods } = useOrders(dateRange);
  const { addOrder, updateOrder, deleteOrder } = orderMethods;
  const [orders, setOrders] = useState<Order[]>(initialOrders || []);
  const socket = useWebSocket();

  // Update orders when initialOrders changes (e.g., after initial fetch)
  useEffect(() => {
    if (initialOrders) {
      setOrders(initialOrders);
    }
  }, [initialOrders]);

  // Set up WebSocket event listeners
  useEffect(() => {
    if (!socket) return;

    // Handle new orders
    const handleNewOrder = (order: Order) => {
      // Convert string dates to Date objects
      const parsedOrder = {
        ...order,
        createdAt: new Date(order.createdAt),
        updatedAt: new Date(order.updatedAt),
        estimatedReadyTime: order.estimatedReadyTime
          ? new Date(order.estimatedReadyTime)
          : undefined,
        actualReadyTime: order.actualReadyTime
          ? new Date(order.actualReadyTime)
          : undefined,
      };

      // Check if order already exists to avoid duplicates
      const exists = orders.some((o) => o.id === parsedOrder.id);

      if (!exists) {
        // If the order already has an ID, use updateOrder instead of addOrder
        if (parsedOrder.id) {
          setOrders((prevOrders) =>
            prevOrders.flatMap((o) => o.id).some((id) => id === parsedOrder.id)
              ? prevOrders
              : [...prevOrders, parsedOrder]
          );
        } else {
          // This shouldn't happen with server-sent orders, but just in case
          const {
            id,
            orderNumber,
            createdAt,
            updatedAt,
            createdBy,
            createdById,
            ...orderData
          } = parsedOrder;
          addOrder(orderData as any);
        }
      }
    };

    // Handle order updates
    const handleOrderUpdated = (order: Order) => {
      // Convert string dates to Date objects
      const parsedOrder = {
        ...order,
        createdAt: new Date(order.createdAt),
        updatedAt: new Date(order.updatedAt),
        estimatedReadyTime: order.estimatedReadyTime
          ? new Date(order.estimatedReadyTime)
          : undefined,
        actualReadyTime: order.actualReadyTime
          ? new Date(order.actualReadyTime)
          : undefined,
      };

      // Instead of calling updateOrder which triggers another API call,
      // directly update the local state
      setOrders((prevOrders) => {
        return prevOrders.map((o) =>
          o.id === parsedOrder.id ? parsedOrder : o
        );
      });
    };

    // Handle order deletions
    const handleOrderDeleted = (orderId: string) => {
      deleteOrder(orderId);
    };

    // Subscribe to WebSocket events
    socket.on("new-order", handleNewOrder);
    socket.on("order-updated", handleOrderUpdated);
    socket.on("order-deleted", handleOrderDeleted);

    // Kitchen-specific events
    socket.emit("join-kitchen"); // Join kitchen room for kitchen-specific events
    socket.on("kitchen-new-order", handleNewOrder);
    socket.on("kitchen-order-updated", handleOrderUpdated);
    socket.on("kitchen-order-deleted", handleOrderDeleted);

    // Cleanup function
    return () => {
      socket.off("new-order", handleNewOrder);
      socket.off("order-updated", handleOrderUpdated);
      socket.off("order-deleted", handleOrderDeleted);
      socket.off("kitchen-new-order", handleNewOrder);
      socket.off("kitchen-order-updated", handleOrderUpdated);
      socket.off("kitchen-order-deleted", handleOrderDeleted);
      socket.emit("leave-kitchen");
    };
  }, [socket, addOrder, updateOrder, deleteOrder]); // Remove 'orders' from dependency array

  return { orders, ...orderMethods };
};
