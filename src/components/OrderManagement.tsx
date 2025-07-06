import React, { useState } from "react";
import { Order } from "../types/order";
import { OrderForm } from "./OrderForm";
import {
  PlusCircle,
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  X,
  Edit,
  Filter,
} from "lucide-react";
import { useOrdersWithWebSocket } from "../hooks/useOrdersWithWebSocket";
import { DateRange, DateRangePreset } from "../types/dateRange";
import { formatCurrencyMMK } from "../data/currency";

interface OrderManagementProps {}

export const OrderManagement: React.FC<OrderManagementProps> = () => {
  // Default to today's orders
  const dateRange: DateRange = { preset: DateRangePreset.TODAY };
  const { orders, addOrder, updateOrder } = useOrdersWithWebSocket(dateRange);

  const [showOrderForm, setShowOrderForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [selectedTable, setSelectedTable] = useState<string>(""); // New state for table filter

  // Function to handle editing an order
  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setShowOrderForm(true);
  };

  // Function to handle order update
  const handleOrderUpdate = (orderData: Partial<Order>) => {
    if (editingOrder) {
      updateOrder(editingOrder.id, orderData);
      setEditingOrder(null);
      setShowOrderForm(false);
    }
  };

  // Calculate stats for the management view
  const stats = React.useMemo(() => {
    const completedOrders = orders.filter(
      (order) => order.status === "completed"
    );

    return {
      totalToday: orders.length,
      completed: completedOrders.length,
      revenue: completedOrders.reduce(
        (sum, order) => sum + Number(order.totalAmount),
        0
      ),
      averageOrderValue:
        completedOrders.length > 0
          ? completedOrders.reduce(
              (sum, order) => sum + Number(order.totalAmount),
              0
            ) / completedOrders.length
          : 0,
      activeOrders: orders.filter((order) => order.status !== "completed")
        .length,
    };
  }, [orders]);

  // Get unique table numbers for the filter dropdown
  const uniqueTableNumbers = React.useMemo(() => {
    const tableNumbers = orders.map((order) => order.tableNumber);
    return [...new Set(tableNumbers)].sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    );
  }, [orders]);

  // Filter orders by table number if selected
  const filteredRecentOrders = React.useMemo(() => {
    let filtered = orders;

    if (selectedTable) {
      filtered = filtered.filter(
        (order) => order.tableNumber === selectedTable
      );
    }

    return filtered
      .slice()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10);
  }, [orders, selectedTable]);

  // Check if an order can be edited (not in-progress, ready, or completed)
  const canEditOrder = (order: Order) => {
    return order.status === "new";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Order Management
            </h1>
            <button
              onClick={() => {
                setEditingOrder(null); // Clear any editing order
                setShowOrderForm(true);
              }}
              className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
            >
              <PlusCircle size={18} />
              New Order
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Orders Today
                </p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900">
                  {stats.totalToday}
                </p>
              </div>
              <Users className="text-blue-500 hidden sm:block" size={32} />
              <Users className="text-blue-500 sm:hidden" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Revenue Today
                </p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900">
                  {formatCurrencyMMK(stats.revenue)}
                </p>
              </div>
              <DollarSign
                className="text-green-500 hidden sm:block"
                size={32}
              />
              <DollarSign className="text-green-500 sm:hidden" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Active Orders
                </p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900">
                  {stats.activeOrders}
                </p>
              </div>
              <Clock className="text-orange-500 hidden sm:block" size={32} />
              <Clock className="text-orange-500 sm:hidden" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Avg Order Value
                </p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900">
                  {formatCurrencyMMK(stats.averageOrderValue)}
                </p>
              </div>
              <TrendingUp
                className="text-purple-500 hidden sm:block"
                size={32}
              />
              <TrendingUp className="text-purple-500 sm:hidden" size={24} />
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Recent Orders
              </h2>

              {/* Table Filter Dropdown */}
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-500" />
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">All Tables</option>
                  {uniqueTableNumbers.map((tableNum) => (
                    <option key={tableNum} value={tableNum}>
                      Table {tableNum}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {filteredRecentOrders.length === 0 ? (
            <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedTable
                  ? `No Orders for Table ${selectedTable}`
                  : "No Orders Yet"}
              </h3>
              <p className="text-gray-500 mb-4">
                {selectedTable
                  ? "Try selecting a different table or clear the filter."
                  : "Get started by creating your first order."}
              </p>
              {!selectedTable && (
                <button
                  onClick={() => setShowOrderForm(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create First Order
                </button>
              )}
              {selectedTable && (
                <button
                  onClick={() => setSelectedTable("")}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear Filter
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Mobile view for orders (cards) */}
              <div className="sm:hidden space-y-3 p-3">
                {filteredRecentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-gray-50 rounded-lg p-3 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div
                          className={`w-2.5 h-2.5 rounded-full mr-2 ${
                            order.priority === "high"
                              ? "bg-red-500"
                              : order.priority === "normal"
                              ? "bg-blue-500"
                              : "bg-gray-400"
                          }`}
                        ></div>
                        <span className="font-medium text-gray-900">
                          #{order.orderNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {canEditOrder(order) && (
                          <button
                            onClick={() => handleEditOrder(order)}
                            className="p-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        <span
                          className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                            order.status === "new"
                              ? "bg-red-100 text-red-800"
                              : order.status === "in-progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "ready"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status.replace("-", " ")}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className="text-gray-500">Table:</div>
                      <div className="text-gray-900 font-medium">
                        {order.tableNumber}
                      </div>
                      <div className="text-gray-500">Server:</div>
                      <div className="text-gray-900 font-medium">
                        {order.createdBy?.name || "Unknown"}
                      </div>
                      <div className="text-gray-500">Total:</div>
                      <div className="text-gray-900 font-medium">
                        {formatCurrencyMMK(Number(order.totalAmount))}
                      </div>
                      <div className="text-gray-500">Time:</div>
                      <div className="text-gray-900 font-medium">
                        {order.createdAt.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop view (table) */}
              <table className="min-w-full divide-y divide-gray-200 hidden sm:table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Table
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Server
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-3 ${
                              order.priority === "high"
                                ? "bg-red-500"
                                : order.priority === "normal"
                                ? "bg-blue-500"
                                : "bg-gray-400"
                            }`}
                          ></div>
                          <span className="font-medium text-gray-900">
                            #{order.orderNumber}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Table {order.tableNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.createdBy?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === "new"
                              ? "bg-red-100 text-red-800"
                              : order.status === "in-progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "ready"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status.replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrencyMMK(Number(order.totalAmount))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.createdAt.toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {canEditOrder(order) && (
                          <button
                            onClick={() => handleEditOrder(order)}
                            className="p-1.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Order Form */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingOrder ? "Edit Order" : "New Order"}
              </h2>
              <button
                onClick={() => {
                  setShowOrderForm(false);
                  setEditingOrder(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <OrderForm
              onSubmit={(orderData) => {
                if (editingOrder) {
                  handleOrderUpdate(orderData);
                } else {
                  addOrder(orderData);
                  setShowOrderForm(false);
                }
              }}
              onCancel={() => {
                setShowOrderForm(false);
                setEditingOrder(null);
              }}
              existingOrder={editingOrder || undefined}
              isEditing={!!editingOrder}
            />
          </div>
        </div>
      )}
    </div>
  );
};
