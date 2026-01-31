import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiAlertTriangle, FiPackage, FiTrendingUp, FiTrendingDown, FiInfo, FiExternalLink } from 'react-icons/fi';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { supplierService } from '../services/supplierService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [stockData, setStockData] = useState({ type: 'add', quantity: 0, reason: '' });
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const { isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if lowStock filter is in URL
    const lowStockParam = searchParams.get('lowStock');
    if (lowStockParam === 'true') {
      setFilterLowStock(true);
    }
    fetchCategories();
    fetchSuppliers();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, filterLowStock]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = { search, limit: 100 };
      if (filterLowStock) {
        params.lowStock = 'true';
      }
      const res = await productService.getAll(params);
      setProducts(res.data || []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await categoryService.getAll();
      setCategories(res.data || []);
      if (!res.data || res.data.length === 0) {
        toast.error('No categories found. Please create a category first.', { duration: 4000 });
      }
    } catch (error) {
      console.error('Failed to load categories', error);
      toast.error('Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      setLoadingSuppliers(true);
      const res = await supplierService.getAll();
      setSuppliers(res.data || []);
      if (!res.data || res.data.length === 0) {
        toast.error('No suppliers found. Please create a supplier first.', { duration: 4000 });
      }
    } catch (error) {
      console.error('Failed to load suppliers', error);
      toast.error('Failed to load suppliers');
    } finally {
      setLoadingSuppliers(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await productService.delete(id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      sku: formData.get('sku'),
      category: formData.get('category'),
      supplier: formData.get('supplier'),
      quantity: parseInt(formData.get('quantity')) || 0,
      lowStockThreshold: parseInt(formData.get('lowStockThreshold')) || 10,
      price: parseFloat(formData.get('price')) || 0,
      unit: formData.get('unit') || 'pcs',
    };

    try {
      if (editingProduct) {
        await productService.update(editingProduct._id, data);
        toast.success('Product updated successfully');
      } else {
        await productService.create(data);
        toast.success('Product created successfully');
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
      // Refresh categories and suppliers in case new ones were created elsewhere
      fetchCategories();
      fetchSuppliers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleStockUpdate = async (productId) => {
    try {
      await productService.updateStock(productId, stockData);
      toast.success('Stock updated successfully');
      setIsStockModalOpen(false);
      setStockData({ type: 'add', quantity: 0, reason: '' });
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update stock');
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    // Refresh categories and suppliers when opening modal
    fetchCategories();
    fetchSuppliers();
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    // Refresh categories and suppliers when opening add modal
    fetchCategories();
    fetchSuppliers();
    setIsModalOpen(true);
  };

  const openStockModal = (product) => {
    setEditingProduct(product);
    setIsStockModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <FiPackage className="text-primary-600 dark:text-primary-400" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Products</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your inventory products</p>
          </div>
        </div>
        {isAdmin && (
          <button 
            onClick={handleOpenAddModal}
            className="btn-primary flex items-center space-x-2 hover:scale-105 transition-transform"
          >
            <FiPlus size={20} />
            <span>Add Product</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products by name, SKU, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <button
          onClick={() => setFilterLowStock(!filterLowStock)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            filterLowStock
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-2 border-yellow-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <FiAlertTriangle size={18} />
          <span>Low Stock Only</span>
        </button>
      </div>

      {/* Products Table */}
      <Table
        headers={['Name', 'Category', 'Supplier', 'Quantity', 'Status', 'Actions']}
        data={products}
        loading={loading}
        renderRow={(product) => (
          <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{product.name}</div>
                {product.sku && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">SKU: {product.sku}</div>
                )}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
              {product.category?.name || 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
              {product.supplier?.name || 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
              {product.quantity} {product.unit}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {product.quantity === 0 ? (
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
                  Out of Stock
                </span>
              ) : product.quantity <= product.lowStockThreshold ? (
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 flex items-center space-x-1">
                  <FiAlertTriangle size={12} />
                  <span>Low Stock</span>
                </span>
              ) : (
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                  In Stock
                </span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => openStockModal(product)}
                  className="flex items-center space-x-1 px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                  title="Update Stock"
                >
                  {stockData.type === 'add' ? (
                    <FiTrendingUp size={16} />
                  ) : (
                    <FiTrendingDown size={16} />
                  )}
                  <span className="text-xs font-medium">Stock</span>
                </button>
                {isAdmin && (
                  <>
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="Edit Product"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Delete Product"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </td>
          </tr>
        )}
        emptyMessage="No products found"
      />

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                defaultValue={editingProduct?.name}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <span>SKU (Stock Keeping Unit)</span>
                  <div className="group relative">
                    <FiInfo className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" size={16} />
                    <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <strong>SKU</strong> is a unique identifier for your product (e.g., "IPH15PRO-128GB"). It helps track inventory and is optional.
                    </div>
                  </div>
                </div>
              </label>
              <input
                type="text"
                name="sku"
                defaultValue={editingProduct?.sku}
                className="input-field"
                placeholder="e.g., IPH15PRO-128GB-BLK"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Optional: Unique product identifier</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={editingProduct?.description}
              rows="3"
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              {loadingCategories ? (
                <div className="input-field flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-600"></div>
                  <span className="ml-2 text-sm text-gray-500">Loading categories...</span>
                </div>
              ) : categories.length === 0 ? (
                <div className="space-y-2">
                  <select name="category" required className="input-field border-red-300 dark:border-red-600" disabled>
                    <option value="">No categories available</option>
                  </select>
                  <div className="flex items-center space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <FiAlertTriangle className="text-yellow-600 dark:text-yellow-400" size={18} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">No categories found</p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-400">Create a category first to add products</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        navigate('/categories');
                      }}
                      className="btn-secondary text-xs flex items-center space-x-1 px-3 py-1"
                    >
                      <span>Create</span>
                      <FiExternalLink size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <select name="category" required className="input-field" defaultValue={editingProduct?.category?._id}>
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Supplier *
              </label>
              {loadingSuppliers ? (
                <div className="input-field flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-600"></div>
                  <span className="ml-2 text-sm text-gray-500">Loading suppliers...</span>
                </div>
              ) : suppliers.length === 0 ? (
                <div className="space-y-2">
                  <select name="supplier" required className="input-field border-red-300 dark:border-red-600" disabled>
                    <option value="">No suppliers available</option>
                  </select>
                  <div className="flex items-center space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <FiAlertTriangle className="text-yellow-600 dark:text-yellow-400" size={18} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">No suppliers found</p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-400">Create a supplier first to add products</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        navigate('/suppliers');
                      }}
                      className="btn-secondary text-xs flex items-center space-x-1 px-3 py-1"
                    >
                      <span>Create</span>
                      <FiExternalLink size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <select name="supplier" required className="input-field" defaultValue={editingProduct?.supplier?._id}>
                  <option value="">Select supplier</option>
                  {suppliers.map((sup) => (
                    <option key={sup._id} value={sup._id}>
                      {sup.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                defaultValue={editingProduct?.quantity || 0}
                min="0"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Low Stock Threshold
              </label>
              <input
                type="number"
                name="lowStockThreshold"
                defaultValue={editingProduct?.lowStockThreshold || 10}
                min="0"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unit
              </label>
              <input
                type="text"
                name="unit"
                defaultValue={editingProduct?.unit || 'pcs'}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">₹</span>
              <input
                type="number"
                name="price"
                defaultValue={editingProduct?.price || 0}
                min="0"
                step="0.01"
                className="input-field pl-8"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter price in Indian Rupees</p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingProduct(null);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingProduct ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Update Stock Modal */}
      <Modal
        isOpen={isStockModalOpen}
        onClose={() => {
          setIsStockModalOpen(false);
          setEditingProduct(null);
          setStockData({ type: 'add', quantity: 0, reason: '' });
        }}
        title={`Update Stock - ${editingProduct?.name}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Stock: {editingProduct?.quantity} {editingProduct?.unit}
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Action *
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setStockData({ ...stockData, type: 'add' })}
                className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                  stockData.type === 'add'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-green-400'
                }`}
              >
                <FiTrendingUp size={20} />
                <span>Add Stock</span>
              </button>
              <button
                type="button"
                onClick={() => setStockData({ ...stockData, type: 'remove' })}
                className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                  stockData.type === 'remove'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-red-400'
                }`}
              >
                <FiTrendingDown size={20} />
                <span>Remove Stock</span>
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quantity *
            </label>
            <input
              type="number"
              value={stockData.quantity}
              onChange={(e) => setStockData({ ...stockData, quantity: parseInt(e.target.value) || 0 })}
              min="1"
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason (Optional)
            </label>
            <textarea
              value={stockData.reason}
              onChange={(e) => setStockData({ ...stockData, reason: e.target.value })}
              rows="3"
              className="input-field"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsStockModalOpen(false);
                setEditingProduct(null);
                setStockData({ type: 'add', quantity: 0, reason: '' });
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={() => handleStockUpdate(editingProduct?._id)}
              className="btn-primary"
            >
              Update Stock
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Products;
