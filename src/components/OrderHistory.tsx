import React, { useState, useMemo } from "react";
import { Order } from "../types/order";
import { OrderTicket } from "./OrderTicket";
import { StatusBadge } from "./StatusBadge";
import {
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useOrdersWithWebSocket } from "../hooks/useOrdersWithWebSocket";
import { DateRange, DateRangePreset } from "../types/dateRange";
import { formatCurrencyMMK } from "../data/currency";

interface OrderHistoryProps {}

export const OrderHistory: React.FC<OrderHistoryProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">(
    "all"
  );
  const [dateFilter, setDateFilter] = useState<DateRangePreset>(
    DateRangePreset.TODAY
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const itemsPerPage = 20;

  // Create date range object based on selected filter
  const dateRange: DateRange = useMemo(() => {
    return { preset: dateFilter };
  }, [dateFilter]);

  // Use the date range in the hook
  const { orders, updateOrderStatus } = useOrdersWithWebSocket(dateRange);

  // Filter orders based on search and status (date filtering is now done on the server)
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toString().includes(searchTerm) ||
          (order.createdBy?.name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.tableNumber.toString().includes(searchTerm) ||
          order.orderItems.some((item) =>
            (item.menuItem?.name || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          )
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    return filtered.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }, [orders, searchTerm, statusFilter]);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToCSV = () => {
    const headers = [
      "Order Number",
      "Table",
      "Server",
      "Status",
      "Total",
      "Items",
      "Created At",
    ];
    const csvData = filteredOrders.map((order) => [
      order.orderNumber,
      order.tableNumber,
      order.createdBy?.name || "Unknown",
      order.status,
      order.totalAmount,
      order.orderItems
        .map((item) => `${item.quantity}x ${item.menuItem?.name || ""}`)
        .join("; "),
      order.createdAt.toLocaleString(),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `order-history-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() =>
                  setViewMode(viewMode === "table" ? "cards" : "table")
                }
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Eye size={16} />
                <span className="hidden sm:inline">
                  {viewMode === "table" ? "Card View" : "Table View"}
                </span>
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as Order["status"] | "all")
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
            </select>

            {/* Date Filter - updated to use the new enum */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateRangePreset)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={DateRangePreset.TODAY}>Today</option>
              <option value={DateRangePreset.YESTERDAY}>Yesterday</option>
              <option value={DateRangePreset.WEEK}>Last 7 Days</option>
              <option value={DateRangePreset.MONTH}>Last 30 Days</option>
              <option value={DateRangePreset.ALL}>All Time</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600">
              <Filter size={16} className="mr-2" />
              {filteredOrders.length} orders found
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Orders Found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or date range.
            </p>
          </div>
        ) : viewMode === "cards" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedOrders.map((order) => (
              <OrderTicket
                key={order.id}
                order={order}
                onStatusChange={updateOrderStatus}
                showControls={order.status !== "completed"}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
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
                      Items
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedOrders.map((order) => (
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
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.orderItems.slice(0, 2).map((item, index) => (
                            <div key={index} className="truncate">
                              {item.quantity}x {item.menuItem?.name || ""}
                            </div>
                          ))}
                          {order.orderItems.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{order.orderItems.length - 2} more items
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={order.status} size="sm" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrencyMMK(Number(order.totalAmount))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{order.createdAt.toLocaleDateString()}</div>
                        <div className="text-xs">
                          {order.createdAt.toLocaleTimeString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of{" "}
              {filteredOrders.length} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-3 py-2 text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
