import React from "react";
import { MenuItem, Order, OrderItem } from "../types/order";
import { StatusBadge } from "./StatusBadge";
import { OrderTimer } from "./OrderTimer";
import { Users, AlertTriangle, MessageSquare } from "lucide-react";
import { formatCurrencyMMK } from "../data/currency";

interface OrderTicketProps {
  order: Order;
  onStatusChange: (orderId: string, status: Order["status"]) => void;
  showControls?: boolean;
}

const statusFlow: Record<Order["status"], Order["status"] | null> = {
  new: "in-progress",
  "in-progress": "ready",
  ready: "completed",
  completed: null,
};

export const OrderTicket: React.FC<OrderTicketProps> = ({
  order,
  onStatusChange,
  showControls = false,
}) => {
  const nextStatus = statusFlow[order.status];
  const totalTime = order.orderItems.reduce(
    (sum, item) => sum + item.quantity * 5,
    0
  ); // Rough estimation

  const handleStatusChange = () => {
    if (nextStatus) {
      onStatusChange(order.id, nextStatus);
    }
  };

  // Helper function to get category name or a default value
  const getCategoryName = (item: OrderItem) => {
    return item.category?.name || "Uncategorized";
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md border-l-4 p-4 ${
        order.priority === "high"
          ? "border-red-500"
          : order.priority === "normal"
          ? "border-blue-500"
          : "border-gray-300"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-lg text-gray-900">
            #{order.orderNumber}
          </h3>
          <div className="flex items-center gap-1 text-gray-600">
            <Users size={16} />
            <span className="font-medium">Table {order.tableNumber}</span>
          </div>
          {order.priority === "high" && (
            <div className="flex items-center gap-1 text-red-600">
              <AlertTriangle size={16} />
              <span className="text-sm font-medium">Priority</span>
            </div>
          )}
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Order Items */}
      <div className="space-y-2 mb-4">
        {order.orderItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.menuItem?.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  {item.quantity}x {item.menuItem?.name}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 `}
                >
                  {getCategoryName(item)}
                </span>
              </div>
              {item.specialInstructions && (
                <div className="flex items-center gap-1 mt-1 text-sm text-orange-600">
                  <MessageSquare size={14} />
                  <span>{item.specialInstructions}</span>
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-gray-600">
              {formatCurrencyMMK(Number(item.price))}
            </span>
          </div>
        ))}
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <MessageSquare size={16} />
            <span className="font-medium">Notes:</span>
          </div>
          <p className="text-yellow-700 mt-1">{order.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <OrderTimer
            createdAt={order.createdAt}
            estimatedReadyTime={order.estimatedReadyTime}
          />
          <span className="text-sm text-gray-500">
            Server: {order.createdBy?.name || "Unknown"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg text-gray-900">
            {formatCurrencyMMK(Number(order.totalAmount))}
          </span>
          {showControls && nextStatus && (
            <button
              onClick={handleStatusChange}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                nextStatus === "in-progress"
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                  : nextStatus === "ready"
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-500 hover:bg-gray-600 text-white"
              }`}
            >
              Mark as {statusFlow[order.status]?.replace("-", " ")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
