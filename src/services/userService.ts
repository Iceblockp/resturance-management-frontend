// src/services/userService.ts
import api from "./api";
import { User, CreateUserData } from "../types/auth";

export const userService = {
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await api.get<User[]>("/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  async getUserById(id: string): Promise<User> {
    try {
      const response = await api.get<User>(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  async createUser(userData: CreateUserData): Promise<User> {
    try {
      const response = await api.post<User>("/users", {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        role: userData.role,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    try {
      const response = await api.patch<User>(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  },
};
