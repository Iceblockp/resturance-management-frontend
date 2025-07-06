import api from "./api";
import { MenuItem, Category } from "../types/order";

export const menuItemService = {
  async getAllMenuItems(): Promise<MenuItem[]> {
    try {
      const response = await api.get<MenuItem[]>("/menu-items");
      return response.data;
    } catch (error) {
      console.error("Error fetching menu items:", error);
      // Return empty array instead of localStorage fallback
      return [];
    }
  },

  async getMenuItemById(id: string): Promise<MenuItem> {
    try {
      const response = await api.get<MenuItem>(`/menu-items/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching menu item ${id}:`, error);
      throw error;
    }
  },

  async createMenuItem(menuItemData: Omit<MenuItem, "id">): Promise<MenuItem> {
    try {
      const response = await api.post<MenuItem>("/menu-items", menuItemData);
      return response.data;
    } catch (error) {
      console.error("Error creating menu item:", error);
      throw error;
    }
  },

  async updateMenuItem(
    id: string,
    menuItemData: Partial<MenuItem>
  ): Promise<MenuItem> {
    try {
      const response = await api.patch<MenuItem>(
        `/menu-items/${id}`,
        menuItemData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating menu item ${id}:`, error);
      throw error;
    }
  },

  async deleteMenuItem(id: string): Promise<void> {
    try {
      await api.delete(`/menu-items/${id}`);
    } catch (error) {
      console.error(`Error deleting menu item ${id}:`, error);
      throw error;
    }
  },

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await api.get<Category[]>("/categories");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Return empty array instead of localStorage fallback
      return [];
    }
  },

  async getCategoryById(id: string): Promise<Category> {
    try {
      const response = await api.get<Category>(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  async createCategory(categoryData: Omit<Category, "id">): Promise<Category> {
    try {
      const response = await api.post<Category>("/categories", categoryData);
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  async updateCategory(
    id: string,
    categoryData: Partial<Category>
  ): Promise<Category> {
    try {
      const response = await api.patch<Category>(
        `/categories/${id}`,
        categoryData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  async deleteCategory(id: string): Promise<void> {
    try {
      await api.delete(`/categories/${id}`);
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },
};
