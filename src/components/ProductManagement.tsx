import React, { useEffect, useState } from "react";
import { MenuItem, Category } from "../types/order";
import { useMenuItems } from "../hooks/useMenuItems";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  Tag,
  Image,
  Save,
  X,
  Eye,
  EyeOff,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import { Loader } from "lucide-react";
import { formatCurrencyMMK } from "../data/currency";
import { ImageUploader } from "./ImageUploader";

export const ProductManagement: React.FC = () => {
  const {
    menuItems,
    categories,
    loading,
    error,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addCategory,
    updateCategory,
    deleteCategory,
    getActiveCategories,
  } = useMenuItems();

  const [activeTab, setActiveTab] = useState<"products" | "categories">(
    "products"
  );
  const [showMobileTabMenu, setShowMobileTabMenu] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  // Add state for category filter
  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState<string>("");

  const [itemForm, setItemForm] = useState({
    name: "",
    price: 0,
    categoryId: "", // Changed from category to categoryId
    description: "",
    preparationTime: 10,
    image: "",
    isAvailable: true,
    ingredients: [] as string[],
  });
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    image: "",
    isActive: true,
    sortOrder: 1,
  });

  // Add state for image input type
  const [productImageInputType, setProductImageInputType] = useState<
    "url" | "upload"
  >("upload");
  const [categoryImageInputType, setCategoryImageInputType] = useState<
    "url" | "upload"
  >("upload");

  const resetItemForm = () => {
    setItemForm({
      name: "",
      price: 0,
      categoryId: categories.length > 0 ? categories[0].id : "", // Set default category ID
      description: "",
      preparationTime: 10,
      image: "",
      isAvailable: true,
      ingredients: [],
    });
    setEditingItem(null);
    setShowItemForm(false);
  };

  console.log("cc", categories, getActiveCategories());
  console.log("first,", itemForm);

  useEffect(() => {
    if (categories.length > 0 && !itemForm.categoryId) {
      setItemForm((prev) => ({
        ...prev,
        categoryId: categories[0].id,
      }));
    }
  }, [categories]);

  const resetCategoryForm = () => {
    setCategoryForm({
      name: "",
      description: "",
      image: "",
      isActive: true,
      sortOrder: 1,
    });
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMenuItem(editingItem.id, {
        ...itemForm,
        price: Number(itemForm.price),
      });
    } else {
      addMenuItem(itemForm);
    }
    resetItemForm();
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryForm);
    } else {
      addCategory(categoryForm);
    }
    resetCategoryForm();
  };

  const startEditingItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      price: Number(item.price),
      categoryId: item.categoryId, // Use categoryId instead of category
      description: item.description || "",
      preparationTime: item.preparationTime,
      image: item.image || "",
      isAvailable: item.isAvailable,
      ingredients: item.ingredients || [],
    });
    setShowItemForm(true);
  };

  const startEditingCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
      isActive: category.isActive,
      sortOrder: category.sortOrder,
    });
    setShowCategoryForm(true);
  };

  // Filter menu items by selected category
  const filteredMenuItems = selectedCategoryFilter
    ? menuItems.filter((item) => item.categoryId === selectedCategoryFilter)
    : menuItems;

  // Get category name by ID
  const getCategoryNameById = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const tabs = [
    {
      key: "products" as const,
      label: "Products",
      icon: Package,
      count: menuItems.length,
    },
    {
      key: "categories" as const,
      label: "Categories",
      icon: Tag,
      count: categories.length,
    },
  ];

  const currentTab = tabs.find((tab) => tab.key === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Product Management
            </h1>

            {/* Desktop Tab Navigation */}
            <div className="hidden md:flex gap-2">
              {tabs.map(({ key, label, icon: Icon, count }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === key
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === key
                        ? "bg-white bg-opacity-20 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              ))}
            </div>

            {/* Mobile Tab Dropdown */}
            <div className="md:hidden relative">
              <button
                onClick={() => setShowMobileTabMenu(!showMobileTabMenu)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "products"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {currentTab && <currentTab.icon size={18} />}
                <span>{currentTab?.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === "products"
                      ? "bg-white bg-opacity-20 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {currentTab?.count}
                </span>
                <ChevronDown
                  size={16}
                  className={`transform transition-transform ${
                    showMobileTabMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Mobile Dropdown Menu */}
              {showMobileTabMenu && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
                  {tabs.map(({ key, label, icon: Icon, count }) => (
                    <button
                      key={key}
                      onClick={() => {
                        setActiveTab(key);
                        setShowMobileTabMenu(false);
                      }}
                      className={`w-full flex items-center justify-between gap-2 px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                        activeTab === key
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
                          activeTab === key
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
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader size={48} className="text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Loading products and categories...</p>
          </div>
        ) : error ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{error}</p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Menu Items
              </h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {/* Add Category Filter */}
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
                >
                  <option value="">All Categories</option>
                  {getActiveCategories().map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowItemForm(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus size={20} />
                  Add Product
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={
                        item.image ||
                        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400"
                      }
                      alt={item.name}
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {item.isAvailable ? (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Available
                        </span>
                      ) : (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Unavailable
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 flex-1 pr-2">
                        {item.name}
                      </h3>
                      <span className="text-lg font-bold text-blue-600 whitespace-nowrap">
                        {formatCurrencyMMK(Number(item.price))}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span className="bg-gray-100 px-2 py-1 rounded capitalize">
                        {getCategoryNameById(item.categoryId)}
                      </span>
                      <span>{item.preparationTime} min</span>
                    </div>

                    {item.ingredients && item.ingredients.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">
                          Ingredients:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {item.ingredients.slice(0, 3).map((ingredient) => (
                            <span
                              key={ingredient}
                              className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs"
                            >
                              {ingredient}
                            </span>
                          ))}
                          {item.ingredients.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{item.ingredients.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-1">
                      <button
                        onClick={() => startEditingItem(item)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        <Edit size={14} />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() =>
                          updateMenuItem(item.id, {
                            isAvailable: !item.isAvailable,
                          })
                        }
                        className={`flex items-center justify-center px-2 py-2 rounded-lg transition-colors ${
                          item.isAvailable
                            ? "bg-orange-500 text-white hover:bg-orange-600"
                            : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                        title={item.isAvailable ? "Hide" : "Show"}
                      >
                        {item.isAvailable ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                      <button
                        onClick={() => deleteMenuItem(item.id)}
                        className="flex items-center justify-center px-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Categories
              </h2>
              <button
                onClick={() => setShowCategoryForm(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus size={20} />
                Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={
                        category.image ||
                        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400"
                      }
                      alt={category.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {category.isActive ? (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {category.description}
                    </p>
                    <div className="text-xs text-gray-500 mb-3">
                      Sort Order: {category.sortOrder}
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => startEditingCategory(category)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        <Edit size={14} />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() =>
                          updateCategory(category.id, {
                            isActive: !category.isActive,
                          })
                        }
                        className={`flex items-center justify-center px-2 py-2 rounded-lg transition-colors ${
                          category.isActive
                            ? "bg-orange-500 text-white hover:bg-orange-600"
                            : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                        title={category.isActive ? "Deactivate" : "Activate"}
                      >
                        {category.isActive ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="flex items-center justify-center px-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showItemForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingItem ? "Edit Product" : "Add New Product"}
                </h3>
                <button
                  onClick={resetItemForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleItemSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className=" col-span-1 sm:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Image
                      </label>
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => setProductImageInputType("upload")}
                          className={`px-3 py-1 text-sm rounded-md transition-colors ${
                            productImageInputType === "upload"
                              ? "bg-white shadow"
                              : "text-gray-600"
                          }`}
                        >
                          Upload
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductImageInputType("url")}
                          className={`px-3 py-1 text-sm rounded-md transition-colors ${
                            productImageInputType === "url"
                              ? "bg-white shadow"
                              : "text-gray-600"
                          }`}
                        >
                          URL
                        </button>
                      </div>
                    </div>

                    {productImageInputType === "upload" ? (
                      <ImageUploader
                        onImageUploaded={(imageUrl) =>
                          setItemForm((prev) => ({
                            ...prev,
                            image: imageUrl,
                          }))
                        }
                        currentImageUrl={itemForm.image}
                        folder="products"
                      />
                    ) : (
                      <div className="mb-4">
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={itemForm.image}
                            onChange={(e) =>
                              setItemForm((prev) => ({
                                ...prev,
                                image: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://example.com/image.jpg"
                          />
                          {itemForm.image && (
                            <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                              <img
                                src={itemForm.image}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://via.placeholder.com/150?text=Invalid+URL";
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={itemForm.name}
                      onChange={(e) =>
                        setItemForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={itemForm.price}
                      onChange={(e) =>
                        setItemForm((prev) => ({
                          ...prev,
                          price: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={itemForm.categoryId}
                      onChange={(e) =>
                        setItemForm((prev) => ({
                          ...prev,
                          categoryId: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {getActiveCategories().map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prep Time (minutes)
                    </label>
                    <input
                      type="number"
                      value={itemForm.preparationTime}
                      onChange={(e) =>
                        setItemForm((prev) => ({
                          ...prev,
                          preparationTime: parseInt(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={itemForm.description}
                    onChange={(e) =>
                      setItemForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={itemForm.image}
                    onChange={(e) =>
                      setItemForm((prev) => ({
                        ...prev,
                        image: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingredients
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {itemForm.ingredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                      >
                        <span>{ingredient}</span>
                        <button
                          type="button"
                          className="ml-1 text-blue-600 hover:text-blue-800"
                          onClick={() =>
                            setItemForm((prev) => ({
                              ...prev,
                              ingredients: prev.ingredients.filter(
                                (_, i) => i !== index
                              ),
                            }))
                          }
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add ingredient"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const value = e.currentTarget.value.trim();
                          if (value && !itemForm.ingredients.includes(value)) {
                            setItemForm((prev) => ({
                              ...prev,
                              ingredients: [...prev.ingredients, value],
                            }));
                            e.currentTarget.value = "";
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      onClick={(e) => {
                        const input = e.currentTarget
                          .previousSibling as HTMLInputElement;
                        const value = input.value.trim();
                        if (value && !itemForm.ingredients.includes(value)) {
                          setItemForm((prev) => ({
                            ...prev,
                            ingredients: [...prev.ingredients, value],
                          }));
                          input.value = "";
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={itemForm.isAvailable}
                    onChange={(e) =>
                      setItemForm((prev) => ({
                        ...prev,
                        isAvailable: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="isAvailable"
                    className="text-sm font-medium text-gray-700"
                  >
                    Available for ordering
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  <button
                    type="button"
                    onClick={resetItemForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    {editingItem ? "Update" : "Create"} Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Category Form Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
                <button
                  onClick={resetCategoryForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Image
                    </label>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => setCategoryImageInputType("upload")}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          categoryImageInputType === "upload"
                            ? "bg-white shadow"
                            : "text-gray-600"
                        }`}
                      >
                        Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setCategoryImageInputType("url")}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          categoryImageInputType === "url"
                            ? "bg-white shadow"
                            : "text-gray-600"
                        }`}
                      >
                        URL
                      </button>
                    </div>
                  </div>

                  {categoryImageInputType === "upload" ? (
                    <ImageUploader
                      onImageUploaded={(imageUrl) =>
                        setCategoryForm((prev) => ({
                          ...prev,
                          image: imageUrl,
                        }))
                      }
                      currentImageUrl={categoryForm.image}
                      folder="categories"
                    />
                  ) : (
                    <div className="mb-4">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={categoryForm.image}
                          onChange={(e) =>
                            setCategoryForm((prev) => ({
                              ...prev,
                              image: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://example.com/image.jpg"
                        />
                        {categoryForm.image && (
                          <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                            <img
                              src={categoryForm.image}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://via.placeholder.com/150?text=Invalid+URL";
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) =>
                      setCategoryForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) =>
                      setCategoryForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={categoryForm.sortOrder}
                    onChange={(e) =>
                      setCategoryForm((prev) => ({
                        ...prev,
                        sortOrder: parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={categoryForm.isActive}
                    onChange={(e) =>
                      setCategoryForm((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="isActive"
                    className="text-sm font-medium text-gray-700"
                  >
                    Active category
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  <button
                    type="button"
                    onClick={resetCategoryForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    {editingCategory ? "Update" : "Create"} Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close mobile tab menu */}
      {showMobileTabMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowMobileTabMenu(false)}
        />
      )}
    </div>
  );
};
