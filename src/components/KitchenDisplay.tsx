import React, { useState, useMemo } from "react";
import { OrderTicket } from "./OrderTicket";
import {
  ChefHat,
  Clock,
  AlertTriangle,
  CheckCircle,
  Filter,
  ChevronDown,
} from "lucide-react";
import { useOrdersWithWebSocket } from "../hooks/useOrdersWithWebSocket";
import { DateRange, DateRangePreset } from "../types/dateRange";

interface KitchenDisplayProps {}

type FilterType = "all" | "new" | "in-progress" | "ready";

export const KitchenDisplay: React.FC<KitchenDisplayProps> = () => {
  // Default to today's orders
  const dateRange: DateRange = { preset: DateRangePreset.TODAY };
  const { orders, updateOrderStatus } = useOrdersWithWebSocket(dateRange);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<"time" | "priority">("time");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = orders.filter((order) => order.status !== "completed");

    if (filter !== "all") {
      filtered = filtered.filter((order) => order.status === filter);
    }

    return filtered.sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = { high: 3, normal: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
      }
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }, [orders, filter, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    const activeOrders = orders.filter((order) => order.status !== "completed");
    return {
      total: activeOrders.length,
      new: activeOrders.filter((order) => order.status === "new").length,
      inProgress: activeOrders.filter((order) => order.status === "in-progress")
        .length,
      ready: activeOrders.filter((order) => order.status === "ready").length,
      overdue: activeOrders.filter((order) => {
        const elapsed = Math.floor(
          (new Date().getTime() - order.createdAt.getTime()) / 60000
        );
        const estimatedTime = order.orderItems.reduce(
          (sum, item) => sum + item.quantity * 5,
          0
        );
        return elapsed > estimatedTime;
      }).length,
    };
  }, [orders]);

  const filterButtons = [
    {
      key: "all" as FilterType,
      label: "All Orders",
      shortLabel: "All",
      count: stats.total,
      icon: ChefHat,
    },
    {
      key: "new" as FilterType,
      label: "New Orders",
      shortLabel: "New",
      count: stats.new,
      icon: AlertTriangle,
    },
    {
      key: "in-progress" as FilterType,
      label: "In Progress",
      shortLabel: "Progress",
      count: stats.inProgress,
      icon: Clock,
    },
    {
      key: "ready" as FilterType,
      label: "Ready to Serve",
      shortLabel: "Ready",
      count: stats.ready,
      icon: CheckCircle,
    },
  ];

  const currentFilterButton = filterButtons.find((btn) => btn.key === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <ChefHat className="text-blue-600" size={28} />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Kitchen Display
              </h1>
              {stats.overdue > 0 && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full">
                  <AlertTriangle size={16} />
                  <span className="text-sm font-medium">
                    {stats.overdue} Overdue
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden md:flex items-center gap-2">
                <Filter size={16} className="text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "time" | "priority")
                  }
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="time">Sort by Time</option>
                  <option value="priority">Sort by Priority</option>
                </select>
              </div>

              <div className="text-xs sm:text-sm text-gray-500">
                <span className="hidden sm:inline">Last updated: </span>
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Filter Buttons */}
          <div className="hidden md:flex gap-1 py-4">
            {filterButtons.map(({ key, label, count, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === key
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    filter === key
                      ? "bg-white bg-opacity-20 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* Mobile Filter Dropdown */}
          <div className="md:hidden py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Filter Dropdown */}
              <div className="relative flex-1">
                <button
                  onClick={() => setShowMobileFilter(!showMobileFilter)}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                    filter === "all"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {currentFilterButton && (
                      <currentFilterButton.icon size={18} />
                    )}
                    <span>{currentFilterButton?.shortLabel}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        filter === "all"
                          ? "bg-gray-300 text-gray-600"
                          : "bg-white bg-opacity-20 text-white"
                      }`}
                    >
                      {currentFilterButton?.count}
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform ${
                      showMobileFilter ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {showMobileFilter && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {filterButtons.map(({ key, label, count, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => {
                          setFilter(key);
                          setShowMobileFilter(false);
                        }}
                        className={`w-full flex items-center justify-between gap-2 px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                          filter === key
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon size={18} />
                          <span className="font-medium">{label}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            filter === key
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Sort */}
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "time" | "priority")
                }
                className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="time">Time</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            {/* Mobile Overdue Alert */}
            {stats.overdue > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 mt-3 bg-red-100 text-red-800 rounded-lg">
                <AlertTriangle size={16} />
                <span className="text-sm font-medium">
                  {stats.overdue} Overdue Orders
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <ChefHat size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Orders
            </h3>
            <p className="text-gray-500">
              {filter === "all"
                ? "All caught up! No active orders in the kitchen."
                : `No ${filter.replace("-", " ")} orders at the moment.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredOrders.map((order) => (
              <OrderTicket
                key={order.id}
                order={order}
                onStatusChange={updateOrderStatus}
                showControls={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm overflow-x-auto">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>New ({stats.new})</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="hidden sm:inline">In Progress</span>
                <span className="sm:hidden">Progress</span>
                <span>({stats.inProgress})</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Ready ({stats.ready})</span>
              </div>
              {stats.overdue > 0 && (
                <div className="flex items-center gap-2 text-red-600 font-medium whitespace-nowrap">
                  <AlertTriangle size={14} />
                  <span className="hidden sm:inline">Overdue</span>
                  <span>({stats.overdue})</span>
                </div>
              )}
            </div>

            <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
              <span className="hidden sm:inline">Total Active: </span>
              {stats.total}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close mobile filter */}
      {showMobileFilter && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowMobileFilter(false)}
        />
      )}
    </div>
  );
};
