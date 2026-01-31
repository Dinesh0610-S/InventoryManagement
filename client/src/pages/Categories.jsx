import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiTag } from 'react-icons/fi';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getAll();
      setCategories(res.data || []);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await categoryService.delete(id);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
    };

    try {
      if (editingCategory) {
        await categoryService.update(editingCategory._id, data);
        toast.success('Category updated successfully');
      } else {
        await categoryService.create(data);
        toast.success('Category created successfully');
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <FiTag className="text-primary-600 dark:text-primary-400" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Categories</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage product categories</p>
          </div>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="btn-primary flex items-center space-x-2 hover:scale-105 transition-transform"
          >
            <FiPlus size={20} />
            <span>Add Category</span>
          </button>
        )}
      </div>

      <Table
        headers={['Name', 'Description', 'Created', 'Actions']}
        data={categories}
        loading={loading}
        renderRow={(category) => (
          <tr key={category._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">
              {category.name}
            </td>
            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
              {category.description || '—'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {new Date(category.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              {isAdmin && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    title="Edit Category"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title="Delete Category"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              )}
            </td>
          </tr>
        )}
        emptyMessage="No categories found"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              defaultValue={editingCategory?.name}
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={editingCategory?.description}
              rows="3"
              className="input-field"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingCategory(null);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingCategory ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
