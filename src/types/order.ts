export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
  orderId: string;
  menuItemId: string;
  categoryId: string;
  menuItem?: MenuItem;
  category?: Category;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber: string;
  orderItems: OrderItem[];
  status: "new" | "in-progress" | "ready" | "completed";
  createdAt: Date;
  updatedAt: Date;
  createdBy: User;
  createdById: string;
  totalAmount: number;
  priority: "low" | "normal" | "high";
  estimatedReadyTime?: Date;
  actualReadyTime?: Date;
  notes?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  category?: Category;
  description?: string;
  preparationTime: number; // in minutes
  image?: string;
  isAvailable: boolean;
  allergens?: string[];
  ingredients?: string[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}
