import Supplier from '../models/Supplier.js';

/**
 * @desc    Get all suppliers
 * @route   GET /api/suppliers
 * @access  Private (Staff+)
 */
export const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find().sort({ name: 1 });
    res.json({
      success: true,
      count: suppliers.length,
      data: suppliers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single supplier
 * @route   GET /api/suppliers/:id
 * @access  Private (Staff+)
 */
export const getSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create supplier
 * @route   POST /api/suppliers
 * @access  Private (Admin only)
 */
export const createSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update supplier
 * @route   PUT /api/suppliers/:id
 * @access  Private (Admin only)
 */
export const updateSupplier = async (req, res, next) => {
  try {
    let supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete supplier
 * @route   DELETE /api/suppliers/:id
 * @access  Private (Admin only)
 */
export const deleteSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    await supplier.deleteOne();
    res.json({
      success: true,
      message: 'Supplier deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
