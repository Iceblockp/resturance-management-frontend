import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider, useAuthContext } from "./components/auth/AuthProvider";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import { KitchenDisplay } from "./components/KitchenDisplay";
import { OrderManagement } from "./components/OrderManagement";
import { ProductManagement } from "./components/ProductManagement";
import { OrderHistory } from "./components/OrderHistory";
import { Analytics } from "./components/Analytics";
import { UserManagement } from "./components/UserManagement";
import { Sidebar } from "./components/Sidebar";
import { useOrdersWithWebSocket } from "./hooks/useOrdersWithWebSocket";
import { ChefHat, Menu, Monitor } from "lucide-react";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

type View =
  | "kitchen"
  | "management"
  | "products"
  | "history"
  | "analytics"
  | "users";

function AppContent() {
  const { user, isAuthenticated, isLoading, isFirstTimeSetup, hasPermission } =
    useAuthContext();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { orders, addOrder, updateOrderStatus } = useOrdersWithWebSocket();
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-refresh every 30 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // This will trigger a re-render to update timers
      window.dispatchEvent(new Event("kds-refresh"));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "k":
            e.preventDefault();
            if (hasPermission("kitchen_display")) navigate("/kitchen");
            break;
          case "m":
            e.preventDefault();
            if (hasPermission("manage_orders")) navigate("/");
            break;
          case "p":
            e.preventDefault();
            if (hasPermission("manage_products")) navigate("/products");
            break;
          case "h":
            e.preventDefault();
            if (hasPermission("view_history")) navigate("/history");
            break;
          case "a":
            e.preventDefault();
            if (hasPermission("view_analytics")) navigate("/analytics");
            break;
          case "u":
            e.preventDefault();
            if (hasPermission("manage_users")) navigate("/users");
            break;
          case "f":
            e.preventDefault();
            setIsFullscreen(!isFullscreen);
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isFullscreen, hasPermission, navigate]);

  // Redirect to appropriate default view based on permissions
  useEffect(() => {
    if (isAuthenticated && user) {
      const path = location.pathname;
      if (path === "/") {
        if (
          !hasPermission("manage_orders") &&
          hasPermission("kitchen_display")
        ) {
          navigate("/kitchen");
        } else if (
          !hasPermission("manage_orders") &&
          !hasPermission("kitchen_display") &&
          hasPermission("manage_products")
        ) {
          navigate("/products");
        } else if (hasPermission("manage_orders")) {
          navigate("/");
        }
      }
    }
  }, [isAuthenticated, user, hasPermission, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show registration form for first-time setup
  if (isFirstTimeSetup) {
    return <RegisterForm />;
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const activeOrderCount = orders.filter(
    (o) => o.status !== "completed"
  ).length;

  // Get current view from URL path
  const getCurrentView = (): View => {
    const path = location.pathname;
    if (path.includes("/kitchen")) return "kitchen";
    if (path.includes("/products")) return "products";
    if (path.includes("/history")) return "history";
    if (path.includes("/analytics")) return "analytics";
    if (path.includes("/users")) return "users";
    return "management";
  };

  const currentView = getCurrentView();

  return (
    <div
      className={`min-h-screen bg-gray-50 ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      <div className="flex h-screen">
        {/* Sidebar */}
        {!isFullscreen && (
          <Sidebar
            currentView={currentView}
            onViewChange={(view) =>
              navigate(`/${view === "management" ? "" : view}`)
            }
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            orderCount={activeOrderCount}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          {!isFullscreen && (
            <div className="lg:hidden bg-white shadow-sm border-b border-gray-200">
              <div className="flex items-center justify-between px-4 py-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu size={24} />
                </button>

                <div className="flex items-center gap-2">
                  <ChefHat className="text-blue-600" size={24} />
                  <span className="font-bold text-gray-900">RestaurantOS</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Toggle Fullscreen"
                  >
                    <Monitor size={20} />
                  </button>

                  {activeOrderCount > 0 && (
                    <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {activeOrderCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route
                path="/kitchen"
                element={
                  hasPermission("kitchen_display") ? (
                    <div className="relative h-full">
                      {isFullscreen && (
                        <button
                          onClick={() => setIsFullscreen(false)}
                          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                          title="Exit Fullscreen"
                        >
                          <Monitor size={20} />
                        </button>
                      )}
                      <KitchenDisplay />
                    </div>
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route
                path="/products"
                element={
                  hasPermission("manage_products") ? (
                    <div className="relative h-full">
                      {isFullscreen && (
                        <button
                          onClick={() => setIsFullscreen(false)}
                          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                          title="Exit Fullscreen"
                        >
                          <Monitor size={20} />
                        </button>
                      )}
                      <ProductManagement />
                    </div>
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route
                path="/history"
                element={
                  hasPermission("view_history") ? (
                    <div className="relative h-full">
                      {isFullscreen && (
                        <button
                          onClick={() => setIsFullscreen(false)}
                          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                          title="Exit Fullscreen"
                        >
                          <Monitor size={20} />
                        </button>
                      )}
                      <OrderHistory />
                    </div>
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route
                path="/analytics"
                element={
                  hasPermission("view_analytics") ? (
                    <div className="relative h-full">
                      {isFullscreen && (
                        <button
                          onClick={() => setIsFullscreen(false)}
                          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                          title="Exit Fullscreen"
                        >
                          <Monitor size={20} />
                        </button>
                      )}
                      <Analytics />
                    </div>
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route
                path="/users"
                element={
                  hasPermission("manage_users") ? (
                    <div className="relative h-full">
                      {isFullscreen && (
                        <button
                          onClick={() => setIsFullscreen(false)}
                          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                          title="Exit Fullscreen"
                        >
                          <Monitor size={20} />
                        </button>
                      )}
                      <UserManagement />
                    </div>
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route
                path="/"
                element={
                  hasPermission("manage_orders") ? (
                    <div className="relative h-full">
                      {isFullscreen && (
                        <button
                          onClick={() => setIsFullscreen(false)}
                          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                          title="Exit Fullscreen"
                        >
                          <Monitor size={20} />
                        </button>
                      )}
                      <OrderManagement />
                    </div>
                  ) : (
                    <AccessDenied />
                  )
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>

      {/* Real-time indicator */}
      {/* {!isFullscreen && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse z-30">
          LIVE
        </div>
      )} */}
    </div>
  );
}

// Access Denied component
function AccessDenied() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <ChefHat size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Access Denied
        </h3>
        <p className="text-gray-500">
          You don't have permission to access this section.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
