import { createContext, useContext, useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { authService } from '../services/authService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    // Only fetch if user is authenticated
    if (!authService.isAuthenticated()) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      setLoading(true);
      const allNotifications = [];

      // Fetch products to check for low stock and out of stock
      const productsRes = await productService.getAll({ limit: 1000 });
      const products = productsRes.data || [];

      // Check for low stock products
      const lowStockProducts = products.filter(
        (p) => p.quantity > 0 && p.quantity <= p.lowStockThreshold
      );

      if (lowStockProducts.length > 0) {
        allNotifications.push({
          id: 'low-stock',
          type: 'warning',
          title: 'Low Stock Alert',
          message: `${lowStockProducts.length} product${lowStockProducts.length > 1 ? 's' : ''} running low on stock`,
          icon: 'alert',
          link: '/products?lowStock=true',
          timestamp: new Date(),
          read: false,
        });
      }

      // Check for out of stock products
      const outOfStockProducts = products.filter((p) => p.quantity === 0);

      if (outOfStockProducts.length > 0) {
        allNotifications.push({
          id: 'out-of-stock',
          type: 'error',
          title: 'Out of Stock Alert',
          message: `${outOfStockProducts.length} product${outOfStockProducts.length > 1 ? 's' : ''} out of stock`,
          icon: 'error',
          link: '/products',
          timestamp: new Date(),
          read: false,
        });
      }

      // Check if we have any products at all
      if (products.length === 0) {
        allNotifications.push({
          id: 'no-products',
          type: 'info',
          title: 'Welcome!',
          message: 'Get started by adding your first product',
          icon: 'info',
          link: '/products',
          timestamp: new Date(),
          read: false,
        });
      }

      setNotifications(allNotifications);
      setUnreadCount(allNotifications.filter((n) => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  useEffect(() => {
    // Check authentication status
    const isAuthenticated = authService.isAuthenticated();
    
    if (isAuthenticated) {
      fetchNotifications();

      // Refresh notifications every 2 minutes
      const interval = setInterval(() => {
        if (authService.isAuthenticated()) {
          fetchNotifications();
        }
      }, 2 * 60 * 1000);

      return () => clearInterval(interval);
    } else {
      // Clear notifications when not authenticated
      setNotifications([]);
      setUnreadCount(0);
    }
  }, []);

  // Expose refresh function for manual updates
  useEffect(() => {
    // Listen for storage events (when products are updated in other tabs/components)
    const handleStorageChange = () => {
      fetchNotifications();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
