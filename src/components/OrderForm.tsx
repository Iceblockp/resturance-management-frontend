import React, { useState, useEffect } from "react";
import { MenuItem, Order, OrderItem } from "../types/order";
import { useMenuItems } from "../hooks/useMenuItems";
import { Plus, Minus, ShoppingCart, X, Search } from "lucide-react";
import { formatCurrencyMMK } from "../data/currency";
import { useAuthContext } from "./auth/AuthProvider";

interface OrderFormProps {
  onSubmit: (
    order: Omit<
      Order,
      | "id"
      | "orderNumber"
      | "createdAt"
      | "updatedAt"
      | "createdBy"
      | "createdById"
    >
  ) => void;
  onCancel: () => void;
  existingOrder?: Order; // Add this prop for editing existing orders
  isEditing?: boolean; // Add this prop to indicate edit mode
}

export const OrderForm: React.FC<OrderFormProps> = ({
  onSubmit,
  onCancel,
  existingOrder,
  isEditing = false,
}) => {
  const { menuItems, getMenuItemsByCategory, getActiveCategories } =
    useMenuItems();
  const { user } = useAuthContext(); // Get the current user from auth context
  const [tableNumber, setTableNumber] = useState<number>(1);
  const [serverName, setServerName] = useState<string>("");
  const [priority, setPriority] = useState<Order["priority"]>("normal");
  const [notes, setNotes] = useState<string>("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"menu" | "cart">("menu");

  // Initialize form with existing order data if in edit mode
  // or set default server name to current user's name if creating new order
  useEffect(() => {
    if (existingOrder && isEditing) {
      setTableNumber(parseInt(existingOrder.tableNumber) || 1);
      setPriority(existingOrder.priority);
      setNotes(existingOrder.notes || "");

      // For server name, we can't edit it as it's tied to the creator
      // But we'll display it for reference
      setServerName(existingOrder.createdBy?.name || "");

      // Clone the order items to avoid reference issues
      setOrderItems([...existingOrder.orderItems]);
    } else if (user) {
      // Set server name to current user's name when creating a new order
      setServerName(user.name);
    }
  }, [existingOrder, isEditing, user]);

  const activeCategories = getActiveCategories();

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.categoryId === selectedCategory;
    return matchesSearch && matchesCategory && item.isAvailable;
  });

  const addItem = (menuItem: MenuItem) => {
    const existingItem = orderItems.find(
      (item) => item.menuItemId === menuItem.id
    );
    if (existingItem) {
      setOrderItems((prev) =>
        prev.map((item) =>
          item.menuItemId === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      const newItem: OrderItem = {
        id: "", // Will be assigned by backend
        menuItemId: menuItem.id,
        orderId: "", // Will be assigned by backend
        categoryId: menuItem.categoryId,
        quantity: 1,
        price: menuItem.price,
        menuItem: menuItem,
        category: menuItem.category,
        image: menuItem.image,
        specialInstructions: "",
      };
      setOrderItems((prev) => [...prev, newItem]);
    }

    // On mobile, switch to cart tab after adding an item
    if (window.innerWidth < 640) {
      setActiveTab("cart");
    }
  };

  const removeItem = (itemId: string) => {
    setOrderItems((prev) => prev.filter((item) => item.menuItemId !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setOrderItems((prev) =>
      prev.map((item) =>
        item.menuItemId === itemId ? { ...item, quantity } : item
      )
    );
  };

  const updateSpecialInstructions = (
    itemId: string,
    specialInstructions: string
  ) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.menuItemId === itemId ? { ...item, specialInstructions } : item
      )
    );
  };

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0 || !serverName.trim()) return;

    const filteredOrderItems = orderItems.map((item) => ({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      specialInstructions: item.specialInstructions,
      categoryId: item.categoryId,
      price: Number(item.price),
      // Include the id if it exists (for editing existing items)
      ...(item.id ? { id: item.id } : {}),
    }));

    const order: Omit<
      Order,
      | "id"
      | "orderNumber"
      | "createdAt"
      | "updatedAt"
      | "createdBy"
      | "createdById"
      | "status"
    > = {
      tableNumber: tableNumber.toString(),
      priority,
      notes: notes.trim(),
      //@ts-ignore
      orderItems: filteredOrderItems,
      totalAmount,
    };

    //@ts-ignore
    onSubmit(order);

    // Reset form
    setTableNumber(1);
    setServerName("");
    setPriority("normal");
    setNotes("");
    setOrderItems([]);
  };

  return (
    <div className="bg-gray-50">
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Order Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Table Number
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={tableNumber}
              onChange={(e) => setTableNumber(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Server Name
            </label>
            <input
              type="text"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isEditing} // Disable editing server name in edit mode
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Order["priority"])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="sm:hidden flex border-b border-gray-200 mb-4">
          <button
            type="button"
            className={`flex-1 py-2 text-center font-medium ${
              activeTab === "menu"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("menu")}
          >
            Menu Items
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-center font-medium ${
              activeTab === "cart"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("cart")}
          >
            Cart {orderItems.length > 0 && `(${orderItems.length})`}
          </button>
        </div>

        {/* Menu Section - Hidden on mobile when cart tab is active */}
        <div className={`${activeTab === "cart" ? "hidden sm:block" : ""}`}>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {activeCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Menu Items Grid */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Menu Items
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[40vh] sm:max-h-[50vh] overflow-y-auto p-1">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors shadow-sm"
                >
                  <div className="flex sm:block">
                    <img
                      src={
                        item.image ||
                        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300"
                      }
                      alt={item.name}
                      className="w-20 h-20 sm:w-full sm:h-32 object-cover rounded-lg"
                    />
                    <div className="ml-3 sm:ml-0 sm:mt-2 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-gray-900 text-sm sm:text-base">
                            {item.name}
                          </h5>
                          <p className="text-base sm:text-lg font-bold text-blue-600">
                            {formatCurrencyMMK(Number(item.price))}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addItem(item)}
                          className="p-1.5 sm:p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 hidden sm:block">
                          {item.description}
                        </p>
                      )}
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded capitalize mt-1 inline-block">
                        {item.category?.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Section - Hidden on mobile when menu tab is active */}
        <div className={`${activeTab === "menu" ? "hidden sm:block" : ""}`}>
          {/* Order Items */}
          {orderItems.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Order Items
              </h3>
              <div className="space-y-3 max-h-[40vh] sm:max-h-[50vh] overflow-y-auto p-1">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gray-50 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          item.image ||
                          "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100"
                        }
                        alt={item.menuItem?.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {item.menuItem?.name}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {formatCurrencyMMK(Number(item.price))} each
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.menuItemId, item.quantity - 1)
                          }
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-medium w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.menuItemId, item.quantity + 1)
                          }
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.menuItemId)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Special instructions"
                      value={item.specialInstructions || ""}
                      onChange={(e) =>
                        updateSpecialInstructions(
                          item.menuItemId,
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <ShoppingCart size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">Your cart is empty</p>
              <button
                type="button"
                onClick={() => setActiveTab("menu")}
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:hidden"
              >
                Browse Menu
              </button>
            </div>
          )}

          {/* Special Notes */}
          {orderItems.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any special requests or notes..."
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-200 gap-3 sticky bottom-0 bg-gray-50 pb-2">
          <div className="text-xl font-bold text-gray-900">
            Total: {formatCurrencyMMK(Number(totalAmount))}
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 sm:flex-initial px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={orderItems.length === 0 || !serverName.trim()}
              className="flex-1 sm:flex-initial px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <ShoppingCart size={18} />
              {isEditing ? "Update Order" : "Submit Order"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
