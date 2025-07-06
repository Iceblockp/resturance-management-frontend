import api from "./api";
import { Order } from "../types/order";
import { DateRangePreset } from "../types/dateRange";

interface DateRangeParams {
  preset?: DateRangePreset;
  startDate?: string;
  endDate?: string;
}

const orderService = {
  getAllOrders: async (dateRange?: DateRangeParams): Promise<Order[]> => {
    const params = new URLSearchParams();

    if (dateRange) {
      if (dateRange.preset) {
        params.append("preset", dateRange.preset);
      }
      if (dateRange.startDate) {
        params.append("startDate", dateRange.startDate);
      }
      if (dateRange.endDate) {
        params.append("endDate", dateRange.endDate);
      }
    }

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const response = await api.get(`/orders${queryString}`);

    return response.data.map((order: any) => ({
      ...order,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt),
      estimatedReadyTime: order.estimatedReadyTime
        ? new Date(order.estimatedReadyTime)
        : undefined,
      actualReadyTime: order.actualReadyTime
        ? new Date(order.actualReadyTime)
        : undefined,
    }));
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    const order = response.data;
    return {
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
  },

  createOrder: async (
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
  ): Promise<Order> => {
    const response = await api.post("/orders", orderData);
    const order = response.data;
    return {
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
  },

  updateOrder: async (
    id: string,
    orderData: Partial<Order>
  ): Promise<Order> => {
    const response = await api.patch(`/orders/${id}`, orderData);
    const order = response.data;
    return {
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
  },

  updateOrderStatus: async (
    id: string,
    status: Order["status"]
  ): Promise<Order> => {
    const response = await api.patch(`/orders/${id}`, { status });
    const order = response.data;
    return {
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
  },

  deleteOrder: async (id: string): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },
};

export default orderService;
