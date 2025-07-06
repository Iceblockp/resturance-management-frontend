import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import {
  LoginCredentials,
  RegisterData,
  User,
  CreateUserData,
} from "../types/auth";

// Query keys
export const queryKeys = {
  users: "users",
  currentUser: "currentUser",
  firstTimeSetup: "firstTimeSetup",
};

// Hook for checking first time setup
export const useFirstTimeSetupQuery = () => {
  return useQuery({
    queryKey: [queryKeys.firstTimeSetup],
    queryFn: authService.checkFirstTimeSetup,
  });
};

// Hook for fetching all users
export const useUsersQuery = () => {
  return useQuery({
    queryKey: [queryKeys.users],
    queryFn: userService.getAllUsers,
  });
};

// Hook for login mutation
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      // Update the current user in the cache
      queryClient.setQueryData([queryKeys.currentUser], data.user);
    },
  });
};

// Hook for register mutation
export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data) => {
      // Update the current user in the cache
      queryClient.setQueryData([queryKeys.currentUser], data.user);
      // Update the first time setup status
      queryClient.setQueryData([queryKeys.firstTimeSetup], false);
    },
  });
};

// Hook for creating a user
export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserData) => userService.createUser(userData),
    onSuccess: () => {
      // Invalidate the users query
      queryClient.invalidateQueries({ queryKey: [queryKeys.users] });
    },
  });
};

// Hook for updating a user
export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: Partial<User> }) =>
      userService.updateUser(id, userData),
    onSuccess: (updatedUser) => {
      // Update the cache for this specific user
      queryClient.setQueryData([queryKeys.users, updatedUser.id], updatedUser);
      // Invalidate the users list query
      queryClient.invalidateQueries({ queryKey: [queryKeys.users] });
    },
  });
};

// Hook for deleting a user
export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: (_, id) => {
      // Invalidate the users query
      queryClient.invalidateQueries({ queryKey: [queryKeys.users] });
      // Remove this specific user from the cache
      queryClient.removeQueries({ queryKey: [queryKeys.users, id] });
    },
  });
};
