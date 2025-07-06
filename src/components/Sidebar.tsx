import React from 'react';
import { useAuthContext } from './auth/AuthProvider';
import { 
  ChefHat, 
  ClipboardList, 
  Package, 
  History, 
  BarChart3, 
  Users,
  LogOut,
  X,
  Monitor
} from 'lucide-react';

type View = 'kitchen' | 'management' | 'products' | 'history' | 'analytics' | 'users';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isOpen: boolean;
  onClose: () => void;
  orderCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onViewChange, 
  isOpen, 
  onClose, 
  orderCount 
}) => {
  const { user, logout, hasPermission } = useAuthContext();

  const navigation = [
    {
      key: 'management' as View,
      label: 'Order Management',
      icon: ClipboardList,
      description: 'Create and manage orders',
      badge: null,
      permission: 'manage_orders'
    },
    {
      key: 'kitchen' as View,
      label: 'Kitchen Display',
      icon: ChefHat,
      description: 'View and update order status',
      badge: orderCount > 0 ? orderCount : null,
      permission: 'kitchen_display'
    },
    {
      key: 'products' as View,
      label: 'Product Management',
      icon: Package,
      description: 'Manage menu items and categories',
      badge: null,
      permission: 'manage_products'
    },
    {
      key: 'history' as View,
      label: 'Order History',
      icon: History,
      description: 'View past orders and search',
      badge: null,
      permission: 'view_history'
    },
    {
      key: 'analytics' as View,
      label: 'Analytics',
      icon: BarChart3,
      description: 'Sales reports and insights',
      badge: null,
      permission: 'view_analytics'
    },
    {
      key: 'users' as View,
      label: 'User Management',
      icon: Users,
      description: 'Manage staff accounts',
      badge: null,
      permission: 'manage_users'
    }
  ];

  const filteredNavigation = navigation.filter(item => hasPermission(item.permission));

  const handleNavClick = (view: View) => {
    onViewChange(view);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto lg:shadow-none lg:border-r lg:border-gray-200
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <ChefHat className="text-blue-600" size={32} />
            <div>
              <h1 className="text-xl font-bold text-gray-900">RestaurantOS</h1>
              <p className="text-sm text-gray-500">Kitchen Display System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-sm text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredNavigation.map(({ key, label, icon: Icon, description, badge }) => (
            <button
              key={key}
              onClick={() => handleNavClick(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                currentView === key
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{label}</span>
                  {badge && (
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      currentView === key
                        ? 'bg-white bg-opacity-20 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      {badge}
                    </span>
                  )}
                </div>
                <p className={`text-sm ${
                  currentView === key ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {description}
                </p>
              </div>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
          
          <div className="mt-4 text-xs text-gray-500 text-center">
            <div className="font-medium mb-1">Keyboard Shortcuts</div>
            <div>Ctrl+K: Kitchen • Ctrl+M: Management</div>
            <div>Ctrl+P: Products • Ctrl+H: History</div>
            <div>Ctrl+A: Analytics • Ctrl+F: Fullscreen</div>
          </div>
        </div>
      </div>
    </>
  );
};