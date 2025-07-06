import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { menuItemService } from "../services/menuItemService";
import { MenuItem, Category } from "../types/order";

// Query keys
export const queryKeys = {
  menuItems: "menuItems",
  categories: "categories",
};

// Hook for fetching all menu items
export const useMenuItemsQuery = () => {
  return useQuery({
    queryKey: [queryKeys.menuItems],
    queryFn: menuItemService.getAllMenuItems,
  });
};

// Hook for fetching a single menu item
export const useMenuItemQuery = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.menuItems, id],
    queryFn: () => menuItemService.getMenuItemById(id),
    enabled: !!id, // Only run the query if we have an ID
  });
};

// Hook for creating a menu item
export const useCreateMenuItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (menuItemData: Omit<MenuItem, "id">) =>
      menuItemService.createMenuItem(menuItemData),
    onSuccess: () => {
      // Invalidate the menu items query to refetch the data
      queryClient.invalidateQueries({ queryKey: [queryKeys.menuItems] });
    },
  });
};

// Hook for updating a menu item
export const useUpdateMenuItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      menuItemData,
    }: {
      id: string;
      menuItemData: Partial<MenuItem>;
    }) => menuItemService.updateMenuItem(id, menuItemData),
    onSuccess: (updatedItem) => {
      // Update the cache for this specific item
      queryClient.setQueryData(
        [queryKeys.menuItems, updatedItem.id],
        updatedItem
      );
      // Invalidate the menu items list query
      queryClient.invalidateQueries({ queryKey: [queryKeys.menuItems] });
    },
  });
};

// Hook for deleting a menu item
export const useDeleteMenuItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => menuItemService.deleteMenuItem(id),
    onSuccess: (_, id) => {
      // Invalidate the menu items query
      queryClient.invalidateQueries({ queryKey: [queryKeys.menuItems] });
      // Remove this specific item from the cache
      queryClient.removeQueries({ queryKey: [queryKeys.menuItems, id] });
    },
  });
};

// Hook for fetching all categories
export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: [queryKeys.categories],
    queryFn: menuItemService.getAllCategories,
  });
};

// Hook for fetching a single category
export const useCategoryQuery = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.categories, id],
    queryFn: () => menuItemService.getCategoryById(id),
    enabled: !!id, // Only run the query if we have an ID
  });
};

// Hook for creating a category
export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData: Omit<Category, "id">) =>
      menuItemService.createCategory(categoryData),
    onSuccess: () => {
      // Invalidate the categories query
      queryClient.invalidateQueries({ queryKey: [queryKeys.categories] });
    },
  });
};

// Hook for updating a category
export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      categoryData,
    }: {
      id: string;
      categoryData: Partial<Category>;
    }) => menuItemService.updateCategory(id, categoryData),
    onSuccess: (updatedCategory) => {
      // Update the cache for this specific category
      queryClient.setQueryData(
        [queryKeys.categories, updatedCategory.id],
        updatedCategory
      );
      // Invalidate the categories list query
      queryClient.invalidateQueries({ queryKey: [queryKeys.categories] });
    },
  });
};

// Hook for deleting a category
export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => menuItemService.deleteCategory(id),
    onSuccess: (_, id) => {
      // Invalidate both categories and menu items (since menu items may reference this category)
      queryClient.invalidateQueries({ queryKey: [queryKeys.categories] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.menuItems] });
      // Remove this specific category from the cache
      queryClient.removeQueries({ queryKey: [queryKeys.categories, id] });
    },
  });
};
