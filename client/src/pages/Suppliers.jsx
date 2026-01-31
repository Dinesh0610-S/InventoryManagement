import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiTruck } from 'react-icons/fi';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { supplierService } from '../services/supplierService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await supplierService.getAll();
      setSuppliers(res.data || []);
    } catch (error) {
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;

    try {
      await supplierService.delete(id);
      toast.success('Supplier deleted successfully');
      fetchSuppliers();
    } catch (error) {
      toast.error('Failed to delete supplier');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      contact: formData.get('contact'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
    };

    try {
      if (editingSupplier) {
        await supplierService.update(editingSupplier._id, data);
        toast.success('Supplier updated successfully');
      } else {
        await supplierService.create(data);
        toast.success('Supplier created successfully');
      }
      setIsModalOpen(false);
      setEditingSupplier(null);
      fetchSuppliers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save supplier');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <FiTruck className="text-primary-600 dark:text-primary-400" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Suppliers</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your suppliers</p>
          </div>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="btn-primary flex items-center space-x-2 hover:scale-105 transition-transform"
          >
            <FiPlus size={20} />
            <span>Add Supplier</span>
          </button>
        )}
      </div>

      <Table
        headers={['Name', 'Contact', 'Email', 'Phone', 'Actions']}
        data={suppliers}
        loading={loading}
        renderRow={(supplier) => (
          <tr key={supplier._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">
              {supplier.name}
            </td>
            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
              {supplier.contact || '—'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
              {supplier.email || '—'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
              {supplier.phone || '—'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              {isAdmin && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingSupplier(supplier);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    title="Edit Supplier"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(supplier._id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title="Delete Supplier"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              )}
            </td>
          </tr>
        )}
        emptyMessage="No suppliers found"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSupplier(null);
        }}
        title={editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Supplier Name *
            </label>
            <input
              type="text"
              name="name"
              defaultValue={editingSupplier?.name}
              required
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Person
              </label>
              <input
                type="text"
                name="contact"
                defaultValue={editingSupplier?.contact}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                defaultValue={editingSupplier?.email}
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              defaultValue={editingSupplier?.phone}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>
            <textarea
              name="address"
              defaultValue={editingSupplier?.address}
              rows="3"
              className="input-field"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingSupplier(null);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingSupplier ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Suppliers;
