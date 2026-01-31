import { useState, useEffect } from 'react';
import { FiFilter, FiFileText, FiRefreshCw } from 'react-icons/fi';
import Table from '../components/Table';
import DateInput from '../components/DateInput';
import { inventoryService } from '../services/inventoryService';
import { getDateValidationError } from '../utils/dateValidation';
import toast from 'react-hot-toast';

const Inventory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      // Validate dates before making API call
      const startDateError = getDateValidationError(filters.startDate);
      const endDateError = getDateValidationError(filters.endDate);
      
      if (startDateError || endDateError) {
        toast.error('Please fix date validation errors before filtering');
        setLoading(false);
        return;
      }
      
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const res = await inventoryService.getLogs(params);
      setLogs(res.data || []);
    } catch (error) {
      toast.error('Failed to load inventory logs');
    } finally {
      setLoading(false);
    }
  };

  const getTypeBadge = (type) => {
    if (type === 'add') {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
          Added
        </span>
      );
    } else if (type === 'remove') {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
          Removed
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
        Adjusted
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <FiFileText className="text-primary-600 dark:text-primary-400" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Inventory Logs</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Track all stock movements</p>
          </div>
        </div>
        <button
          onClick={fetchLogs}
          className="btn-secondary flex items-center space-x-2 hover:scale-105 transition-transform"
          title="Refresh Logs"
        >
          <FiRefreshCw size={18} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <FiFilter size={20} className="text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="input-field"
            >
              <option value="">All Types</option>
              <option value="add">Add</option>
              <option value="remove">Remove</option>
              <option value="adjust">Adjust</option>
            </select>
          </div>
          <div>
            <DateInput
              label="Start Date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
          </div>
          <div>
            <DateInput
              label="End Date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <Table
        headers={['Product', 'Type', 'Quantity', 'Previous', 'New', 'User', 'Date', 'Reason']}
        data={logs}
        loading={loading}
        renderRow={(log) => (
          <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">
              {log.product?.name || 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">{getTypeBadge(log.type)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
              {log.quantity}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
              {log.previousQuantity}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
              {log.newQuantity}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
              {log.user?.name || 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {new Date(log.createdAt).toLocaleString()}
            </td>
            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
              {log.reason || '—'}
            </td>
          </tr>
        )}
        emptyMessage="No inventory logs found"
      />
    </div>
  );
};

export default Inventory;
