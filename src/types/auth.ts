export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'server' | 'kitchen';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  restaurantName: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role: User['role'];
}