import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import {
  User,
  AuthState,
  LoginCredentials,
  RegisterData,
  CreateUserData,
} from "../types/auth";
import { authService } from "../services/authService";
import { userService } from "../services/userService";

const defaultPermissions = {
  admin: [
    {
      id: "manage_users",
      name: "Manage Users",
      description: "Create, edit, and delete users",
    },
    {
      id: "manage_products",
      name: "Manage Products",
      description: "Manage menu items and categories",
    },
    {
      id: "view_analytics",
      name: "View Analytics",
      description: "Access sales reports and analytics",
    },
    {
      id: "manage_orders",
      name: "Manage Orders",
      description: "Create and manage orders",
    },
    {
      id: "kitchen_display",
      name: "Kitchen Display",
      description: "Access kitchen display system",
    },
    {
      id: "view_history",
      name: "View History",
      description: "Access order history",
    },
  ],
  manager: [
    {
      id: "manage_products",
      name: "Manage Products",
      description: "Manage menu items and categories",
    },
    {
      id: "view_analytics",
      name: "View Analytics",
      description: "Access sales reports and analytics",
    },
    {
      id: "manage_orders",
      name: "Manage Orders",
      description: "Create and manage orders",
    },
    {
      id: "kitchen_display",
      name: "Kitchen Display",
      description: "Access kitchen display system",
    },
    {
      id: "view_history",
      name: "View History",
      description: "Access order history",
    },
  ],
  server: [
    {
      id: "manage_orders",
      name: "Manage Orders",
      description: "Create and manage orders",
    },
    {
      id: "view_history",
      name: "View History",
      description: "Access order history",
    },
  ],
  kitchen: [
    {
      id: "kitchen_display",
      name: "Kitchen Display",
      description: "Access kitchen display system",
    },
  ],
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const [users, setUsers] = useState<User[]>([]);

  // Check if this is the first time setup (no admin user exists)
  const isFirstTimeSetup = useCallback(async () => {
    try {
      return await authService.checkFirstTimeSetup();
    } catch (error) {
      console.error("Error checking first time setup:", error);
      return true; // Default to true if there's an error
    }
  }, []);

  // Load auth state from localStorage and fetch users if authenticated
  useEffect(() => {
    const savedAuth = localStorage.getItem("kds-auth");

    if (savedAuth) {
      const parsedAuth = JSON.parse(savedAuth);
      if (parsedAuth.user) {
        setAuthState({
          user: {
            ...parsedAuth.user,
            createdAt: new Date(parsedAuth.user.createdAt),
            updatedAt: new Date(parsedAuth.user.updatedAt),
            lastLogin: parsedAuth.user.lastLogin
              ? new Date(parsedAuth.user.lastLogin)
              : undefined,
          },
          isAuthenticated: true,
          isLoading: false,
        });

        // If user is admin or manager, fetch all users
        if (
          parsedAuth.user.role === "admin" ||
          parsedAuth.user.role === "manager"
        ) {
          const fetchUsers = async () => {
            try {
              const fetchedUsers = await userService.getAllUsers();
              // Add permissions to each user based on their role
              const usersWithPermissions = fetchedUsers.map((user) => ({
                ...user,
                permissions: defaultPermissions[user.role],
                createdAt: new Date(user.createdAt),
                updatedAt: new Date(user.updatedAt),
                lastLogin: user.lastLogin
                  ? new Date(user.lastLogin)
                  : undefined,
              }));
              setUsers(usersWithPermissions);
            } catch (error) {
              console.error("Failed to fetch users:", error);
            }
          };
          fetchUsers();
        }
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Save users to localStorage
  useEffect(() => {
    localStorage.setItem("kds-users", JSON.stringify(users));
  }, [users]);

  // Save auth state to localStorage
  useEffect(() => {
    localStorage.setItem(
      "kds-auth",
      JSON.stringify({
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
      })
    );
  }, [authState]);

  const register = useCallback(
    async (
      data: RegisterData
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        // Check if admin already exists
        const firstTimeSetup = await isFirstTimeSetup();
        if (!firstTimeSetup) {
          return { success: false, error: "Admin user already exists" };
        }
  
        // Call the API to register the user
        const response = await authService.register({
          email: data.email,
          password: data.password,
          name: data.name,
          restaurantName: data.restaurantName
        });
  
        // Save restaurant name in a more appropriate place (could be a separate API endpoint)
        localStorage.setItem("kds-restaurant-name", data.restaurantName);
  
        const newUser: User = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role,
          isActive: true,
          permissions: defaultPermissions.admin,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLogin: new Date(),
        };
  
        setAuthState({
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
        });
  
        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          error: error.response?.data?.message || "Registration failed",
        };
      }
    },
    [isFirstTimeSetup]
  );

  const login = useCallback(
    async (
      credentials: LoginCredentials
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        // Call the API to login the user
        const response = await authService.login(credentials);
  
        const loggedInUser: User = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role,
          isActive: true,
          permissions: defaultPermissions[response.user.role],
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLogin: new Date(),
        };
  
        setAuthState({
          user: loggedInUser,
          isAuthenticated: true,
          isLoading: false,
        });
  
        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          error: error.response?.data?.message || "Login failed",
        };
      }
    },
    []
  );

  const logout = useCallback(() => {
    // Call the auth service to logout
    authService.logout();

    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem("kds-auth");
  }, []);

  const createUser = useCallback(
    async (
      data: CreateUserData
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        // Check if current user is admin
        if (authState.user?.role !== "admin") {
          return { success: false, error: "Unauthorized" };
        }

        // Call the API to create a user
        const response = await userService.createUser({
          email: data.email,
          password: data.password,
          name: data.name,
          role: data.role,
        });

        const newUser: User = {
          ...response,
          permissions: defaultPermissions[data.role],
          createdAt: new Date(response.createdAt),
          updatedAt: new Date(response.updatedAt),
          lastLogin: response.lastLogin
            ? new Date(response.lastLogin)
            : undefined,
        };

        setUsers((prev) => [...prev, newUser]);
        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          error: error.response?.data?.message || "Failed to create user",
        };
      }
    },
    [authState.user]
  );

  const updateUser = useCallback(
    async (
      userId: string,
      updates: Partial<User>
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        // Check if current user is admin
        if (authState.user?.role !== "admin") {
          return { success: false, error: "Unauthorized" };
        }

        // Call the API to update the user
        const response = await userService.updateUser(userId, updates);

        // Update the user in the local state
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  ...response,
                  permissions: user.permissions, // Keep existing permissions
                  createdAt: new Date(response.createdAt),
                  updatedAt: new Date(response.updatedAt),
                  lastLogin: response.lastLogin
                    ? new Date(response.lastLogin)
                    : user.lastLogin,
                }
              : user
          )
        );

        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          error: error.response?.data?.message || "Failed to update user",
        };
      }
    },
    [authState.user]
  );

  const deleteUser = useCallback(
    async (userId: string): Promise<{ success: boolean; error?: string }> => {
      try {
        // Check if current user is admin
        if (authState.user?.role !== "admin") {
          return { success: false, error: "Unauthorized" };
        }

        // Prevent deleting self
        if (authState.user?.id === userId) {
          return { success: false, error: "Cannot delete your own account" };
        }

        // Call the API to delete the user
        await userService.deleteUser(userId);

        // Remove the user from the local state
        setUsers((prev) => prev.filter((user) => user.id !== userId));
        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          error: error.response?.data?.message || "Failed to delete user",
        };
      }
    },
    [authState.user]
  );

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!authState.user) return false;
      return authState.user.permissions.some((p) => p.id === permission);
    },
    [authState.user]
  );

  // Add a new state for first time setup
  const [isFirstTimeSetupState, setIsFirstTimeSetupState] = useState<boolean>(false);
  
  // Check first time setup on component mount
  useEffect(() => {
    const checkFirstTimeSetup = async () => {
      const result = await isFirstTimeSetup();
      setIsFirstTimeSetupState(result);
    };
    checkFirstTimeSetup();
  }, [isFirstTimeSetup]);
  
  // Update the return value
  return {
    ...authState,
    users,
    isFirstTimeSetup: isFirstTimeSetupState,
    register,
    login,
    logout,
    createUser,
    updateUser,
    deleteUser,
    hasPermission,
  };
};

// Auth Context
export const AuthContext = createContext<ReturnType<typeof useAuth> | null>(
  null
);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
