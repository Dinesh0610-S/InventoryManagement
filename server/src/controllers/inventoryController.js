import InventoryLog from '../models/InventoryLog.js';
import Product from '../models/Product.js';
import { validateDateInput } from '../utils/dateValidation.js';

/**
 * @desc    Get all inventory logs
 * @route   GET /api/inventory/logs
 * @access  Private (Staff+)
 */
export const getInventoryLogs = async (req, res, next) => {
  try {
    const { product, type, startDate, endDate, page = 1, limit = 20 } = req.query;

    // Validate date inputs
    if (startDate) {
      const startDateError = validateDateInput(startDate, 'Start date');
      if (startDateError) {
        return res.status(400).json({
          success: false,
          message: startDateError,
        });
      }
    }

    if (endDate) {
      const endDateError = validateDateInput(endDate, 'End date');
      if (endDateError) {
        return res.status(400).json({
          success: false,
          message: endDateError,
        });
      }
    }

    const query = {};

    if (product) {
      query.product = product;
    }

    if (type) {
      query.type = type;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const logs = await InventoryLog.find(query)
      .populate('product', 'name sku')
      .populate('user', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await InventoryLog.countDocuments(query);

    res.json({
      success: true,
      count: logs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get inventory report (dashboard stats)
 * @route   GET /api/inventory/report
 * @access  Private (Admin only)
 */
export const getInventoryReport = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query; // 'day', 'week', 'month'

    // Calculate date range
    const now = new Date();
    let startDate;
    if (period === 'day') {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (period === 'week') {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else {
      startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    // Get total products
    const totalProducts = await Product.countDocuments();

    // Get low stock products
    const allProducts = await Product.find();
    const lowStockProducts = allProducts.filter((p) => p.quantity <= p.lowStockThreshold);
    const outOfStockProducts = allProducts.filter((p) => p.quantity === 0);

    // Get recent inventory movements
    const recentLogs = await InventoryLog.find({
      createdAt: { $gte: startDate },
    })
      .populate('product', 'name')
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate total value (if price is available)
    const totalValue = allProducts.reduce((sum, p) => sum + p.quantity * (p.price || 0), 0);

    // Get stock movements summary
    const stockAdded = await InventoryLog.aggregate([
      {
        $match: {
          type: 'add',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$quantity' },
        },
      },
    ]);

    const stockRemoved = await InventoryLog.aggregate([
      {
        $match: {
          type: 'remove',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$quantity' },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalProducts,
          lowStockCount: lowStockProducts.length,
          outOfStockCount: outOfStockProducts.length,
          totalValue: totalValue.toFixed(2),
          stockAdded: stockAdded[0]?.total || 0,
          stockRemoved: stockRemoved[0]?.total || 0,
        },
        lowStockProducts: lowStockProducts.slice(0, 10),
        recentLogs,
      },
    });
  } catch (error) {
    next(error);
  }
};
