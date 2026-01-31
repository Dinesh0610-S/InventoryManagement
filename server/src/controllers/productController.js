import Product from '../models/Product.js';
import InventoryLog from '../models/InventoryLog.js';

/**
 * @desc    Get all products with search, filter, and pagination
 * @route   GET /api/products
 * @access  Private (Staff+)
 */
export const getProducts = async (req, res, next) => {
  try {
    const { search, category, supplier, lowStock, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (supplier) {
      query.supplier = supplier;
    }

    if (lowStock === 'true') {
      // Find products where quantity <= lowStockThreshold
      const products = await Product.find(query).populate('category supplier');
      const lowStockProducts = products.filter((p) => p.quantity <= p.lowStockThreshold);
      return res.json({
        success: true,
        count: lowStockProducts.length,
        data: lowStockProducts,
      });
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('supplier', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Private (Staff+)
 */
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('supplier', 'name contact email');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private (Admin only)
 */
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    // Populate references
    await product.populate('category', 'name');
    await product.populate('supplier', 'name');

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private (Admin only)
 */
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name').populate('supplier', 'name');

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private (Admin only)
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product stock (add/remove)
 * @route   PUT /api/products/:id/stock
 * @access  Private (Admin only)
 */
export const updateStock = async (req, res, next) => {
  try {
    const { type, quantity, reason } = req.body; // type: 'add' or 'remove'

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const previousQuantity = product.quantity;
    let newQuantity;

    if (type === 'add') {
      newQuantity = previousQuantity + quantity;
    } else if (type === 'remove') {
      newQuantity = Math.max(0, previousQuantity - quantity); // Prevent negative
    } else {
      return res.status(400).json({ message: 'Invalid type. Use "add" or "remove"' });
    }

    // Update product quantity
    product.quantity = newQuantity;
    await product.save();

    // Create inventory log
    await InventoryLog.create({
      product: product._id,
      type: type === 'add' ? 'add' : 'remove',
      quantity,
      previousQuantity,
      newQuantity,
      reason,
      user: req.user._id,
    });

    await product.populate('category', 'name');
    await product.populate('supplier', 'name');

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
