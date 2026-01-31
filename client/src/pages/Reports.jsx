import { useState, useEffect } from 'react';
import { FiBarChart2, FiTrendingUp, FiTrendingDown, FiRefreshCw } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { inventoryService } from '../services/inventoryService';
import { productService } from '../services/productService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import StatCard from '../components/StatCard';
import { formatCurrency } from '../utils/currency';

const Reports = () => {
  const [report, setReport] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const { isAdmin } = useAuth();

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  useEffect(() => {
    if (isAdmin) {
      fetchReport();
      fetchCategoryData();
    }
  }, [period, isAdmin]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await inventoryService.getReport(period);
      setReport(res.data);
    } catch (error) {
      toast.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryData = async () => {
    try {
      const res = await productService.getAll({ limit: 1000 });
      const products = res.data || [];

      // Group by category
      const categoryMap = {};
      products.forEach((product) => {
        const catName = product.category?.name || 'Uncategorized';
        if (!categoryMap[catName]) {
          categoryMap[catName] = { name: catName, quantity: 0, value: 0 };
        }
        categoryMap[catName].quantity += product.quantity;
        categoryMap[catName].value += product.quantity * (product.price || 0);
      });

      setCategoryData(Object.values(categoryMap));
    } catch (error) {
      console.error('Failed to load category data');
    }
  };

  if (!isAdmin) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Access denied. Admin only.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card animate-pulse h-64"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <FiBarChart2 className="text-primary-600 dark:text-primary-400" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Reports</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Inventory analytics and insights</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="input-field w-auto"
          >
            <option value="day">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
          <button
            onClick={() => {
              fetchReport();
              fetchCategoryData();
            }}
            className="btn-secondary flex items-center space-x-2 hover:scale-105 transition-transform"
            title="Refresh Reports"
          >
            <FiRefreshCw size={18} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      {report?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Products"
            value={report.summary.totalProducts}
            icon={FiBarChart2}
            color="primary"
          />
          <StatCard
            title="Low Stock Items"
            value={report.summary.lowStockCount}
            icon={FiTrendingDown}
            color="yellow"
          />
          <StatCard
            title="Out of Stock"
            value={report.summary.outOfStockCount}
            icon={FiTrendingDown}
            color="red"
          />
          <StatCard
            title="Total Value"
            value={formatCurrency(report.summary.totalValue, false)}
            icon={FiTrendingUp}
            color="green"
          />
        </div>
      )}

      {/* Stock Movements */}
      {report?.summary && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Stock Movements ({period})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {report.summary.stockAdded}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Stock Added</div>
            </div>
            <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {report.summary.stockRemoved}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Stock Removed</div>
            </div>
          </div>
        </div>
      )}

      {/* Category Distribution */}
      {categoryData.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Stock by Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#3b82f6" name="Quantity" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category Value Pie Chart */}
      {categoryData.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Inventory Value by Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Low Stock Products */}
      {report?.lowStockProducts && report.lowStockProducts.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Low Stock Products
          </h2>
          <div className="space-y-2">
            {report.lowStockProducts.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{product.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {product.quantity} / {product.lowStockThreshold} (threshold)
                  </div>
                </div>
                <div className="text-yellow-600 dark:text-yellow-400 font-semibold">
                  Low Stock
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
