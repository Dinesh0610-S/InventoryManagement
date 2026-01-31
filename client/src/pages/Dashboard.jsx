import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiAlertTriangle, FiXCircle, FiUsers, FiPlus, FiBarChart2, FiTag, FiArrowRight } from 'react-icons/fi';
import StatCard from '../components/StatCard';
import { productService } from '../services/productService';
import { inventoryService } from '../services/inventoryService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    outOfStock: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get products
      const productsRes = await productService.getAll({ limit: 1000 });
      const products = productsRes.data || [];

      // Calculate stats
      const totalProducts = products.length;
      const lowStock = products.filter((p) => p.quantity <= p.lowStockThreshold && p.quantity > 0).length;
      const outOfStock = products.filter((p) => p.quantity === 0).length;

      setStats({
        totalProducts,
        lowStock,
        outOfStock,
        totalUsers: 0, // You can add user count API if needed
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's your inventory overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={FiPackage}
          color="primary"
          onClick={() => navigate('/products')}
        />
        <StatCard
          title="Low Stock"
          value={stats.lowStock}
          icon={FiAlertTriangle}
          color="yellow"
          onClick={() => navigate('/products?lowStock=true')}
        />
        <StatCard
          title="Out of Stock"
          value={stats.outOfStock}
          icon={FiXCircle}
          color="red"
          onClick={() => navigate('/products')}
        />
        {isAdmin && (
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={FiUsers}
            color="blue"
          />
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/products')}
            className="btn-primary text-left p-4 hover:scale-105 transition-transform group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold flex items-center space-x-2">
                <FiPlus size={20} />
                <span>Add Product</span>
              </div>
              <FiArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={18} />
            </div>
            <div className="text-sm opacity-90">Create a new product entry</div>
          </button>
          <button 
            onClick={() => navigate('/reports')}
            className="btn-secondary text-left p-4 hover:scale-105 transition-transform group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold flex items-center space-x-2">
                <FiBarChart2 size={20} />
                <span>View Reports</span>
              </div>
              <FiArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={18} />
            </div>
            <div className="text-sm opacity-90">Check inventory analytics</div>
          </button>
          <button 
            onClick={() => navigate('/categories')}
            className="btn-secondary text-left p-4 hover:scale-105 transition-transform group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold flex items-center space-x-2">
                <FiTag size={20} />
                <span>Manage Categories</span>
              </div>
              <FiArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={18} />
            </div>
            <div className="text-sm opacity-90">Organize your inventory</div>
          </button>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {stats.lowStock > 0 && (
        <div className="card bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center space-x-3">
            <FiAlertTriangle className="text-yellow-600 dark:text-yellow-400" size={24} />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                Low Stock Alert
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {stats.lowStock} product{stats.lowStock > 1 ? 's' : ''} {stats.lowStock > 1 ? 'are' : 'is'} running low on stock
              </p>
            </div>
            <button
              onClick={() => navigate('/products?lowStock=true')}
              className="btn-secondary text-sm"
            >
              View Products
            </button>
          </div>
        </div>
      )}

      {/* Out of Stock Alerts */}
      {stats.outOfStock > 0 && (
        <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-3">
            <FiXCircle className="text-red-600 dark:text-red-400" size={24} />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 dark:text-red-100">
                Out of Stock Alert
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                {stats.outOfStock} product{stats.outOfStock > 1 ? 's' : ''} {stats.outOfStock > 1 ? 'are' : 'is'} out of stock
              </p>
            </div>
            <button
              onClick={() => navigate('/products')}
              className="btn-secondary text-sm"
            >
              View Products
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
