// src/services/authService.ts
import api from "./api";
import { LoginCredentials, RegisterData, User } from "../types/auth";

interface AuthResponse {
  access_token: string;
  user: User;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      // Store the token in localStorage
      localStorage.setItem("auth-token", response.data.access_token);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Transform the data to match the backend DTO
      const registerData = {
        email: data.email,
        password: data.password,
        name: data.name, // Use name directly now
        role: "admin", // Default role for registration is admin
        restaurantName: data.restaurantName,
      };

      const response = await api.post<AuthResponse>(
        "/auth/register",
        registerData
      );
      // Store the token in localStorage
      localStorage.setItem("auth-token", response.data.access_token);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  logout(): void {
    // Remove the token from localStorage
    localStorage.removeItem("auth-token");
  },

  getToken(): string | null {
    return localStorage.getItem("auth-token");
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  async checkFirstTimeSetup(): Promise<boolean> {
    try {
      const response = await api.get<{ adminExists: boolean }>('/users/check-admin-exists');
      return !response.data.adminExists;
    } catch (error) {
      console.error("Error checking first time setup:", error);
      // If we can't reach the API, assume it's first time setup
      return true;
    }
  },
};
