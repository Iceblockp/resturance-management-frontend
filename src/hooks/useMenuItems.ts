import { useState, useEffect, useCallback } from "react";
import { MenuItem, Category } from "../types/order";
import { menuItems as defaultMenuItems } from "../data/menuItems";
import {
  useMenuItemsQuery,
  useCategoriesQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "./useMenuItemsQuery";

const defaultCategories: Category[] = [
  {
    id: "appetizer",
    name: "Appetizers",
    description: "Start your meal with our delicious appetizers",
    image:
      "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "main",
    name: "Main Courses",
    description: "Our signature main dishes",
    image:
      "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "dessert",
    name: "Desserts",
    description: "Sweet endings to your meal",
    image:
      "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=400",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "beverage",
    name: "Beverages",
    description: "Refreshing drinks and beverages",
    image:
      "https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg?auto=compress&cs=tinysrgb&w=400",
    isActive: true,
    sortOrder: 4,
  },
];

export const useMenuItems = () => {
  // Use React Query hooks
  const {
    data: menuItemsData = [],
    isLoading: menuItemsLoading,
    error: menuItemsError,
  } = useMenuItemsQuery();
  const {
    data: categoriesData = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategoriesQuery();

  const createMenuItemMutation = useCreateMenuItemMutation();
  const updateMenuItemMutation = useUpdateMenuItemMutation();
  const deleteMenuItemMutation = useDeleteMenuItemMutation();

  const createCategoryMutation = useCreateCategoryMutation();
  const updateCategoryMutation = useUpdateCategoryMutation();
  const deleteCategoryMutation = useDeleteCategoryMutation();

  // Determine if we should use default data
  const menuItems = menuItemsData.length ? menuItemsData : defaultMenuItems;
  const categories = categoriesData.length ? categoriesData : defaultCategories;

  // Loading and error states
  const loading = menuItemsLoading || categoriesLoading;
  const error =
    menuItemsError || categoriesError
      ? "Failed to load data from server. Using default data instead."
      : null;

  const addMenuItem = useCallback(
    async (item: Omit<MenuItem, "id">) => {
      try {
        const newItem = await createMenuItemMutation.mutateAsync(item);
        return newItem;
      } catch (err) {
        console.error("Error adding menu item:", err);
        throw err;
      }
    },
    [createMenuItemMutation]
  );

  const updateMenuItem = useCallback(
    async (id: string, updates: Partial<MenuItem>) => {
      try {
        await updateMenuItemMutation.mutateAsync({ id, menuItemData: updates });
      } catch (err) {
        console.error("Error updating menu item:", err);
        throw err;
      }
    },
    [updateMenuItemMutation]
  );

  const deleteMenuItem = useCallback(
    async (id: string) => {
      try {
        await deleteMenuItemMutation.mutateAsync(id);
      } catch (err) {
        console.error("Error deleting menu item:", err);
        throw err;
      }
    },
    [deleteMenuItemMutation]
  );

  const addCategory = useCallback(
    async (category: Omit<Category, "id">) => {
      try {
        const newCategory = await createCategoryMutation.mutateAsync(category);
        return newCategory;
      } catch (err) {
        console.error("Error adding category:", err);
        throw err;
      }
    },
    [createCategoryMutation]
  );

  const updateCategory = useCallback(
    async (id: string, updates: Partial<Category>) => {
      try {
        await updateCategoryMutation.mutateAsync({ id, categoryData: updates });
      } catch (err) {
        console.error("Error updating category:", err);
        throw err;
      }
    },
    [updateCategoryMutation]
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      try {
        await deleteCategoryMutation.mutateAsync(id);
      } catch (err) {
        console.error("Error deleting category:", err);
        throw err;
      }
    },
    [deleteCategoryMutation]
  );

  const getMenuItemsByCategory = useCallback(
    (categoryId: string) => {
      return menuItems.filter(
        (item) => item.categoryId === categoryId && item.isAvailable
      );
    },
    [menuItems]
  );

  const getActiveCategories = useCallback(() => {
    return categories
      .filter((category) => category.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [categories]);

  return {
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
    getMenuItemsByCategory,
    getActiveCategories,
  };
};
