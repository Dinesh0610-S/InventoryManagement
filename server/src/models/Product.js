import mongoose from 'mongoose';

/**
 * Product Schema
 * Stores product information with stock tracking
 */
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    sku: {
      type: String,
      unique: true,
      trim: true,
      sparse: true, // Allows null values but enforces uniqueness when present
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide a category'],
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: [true, 'Please provide a supplier'],
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Quantity cannot be negative'],
    },
    lowStockThreshold: {
      type: Number,
      required: true,
      default: 10,
      min: [0, 'Low stock threshold cannot be negative'],
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    unit: {
      type: String,
      default: 'pcs',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual to check if product is low in stock
ProductSchema.virtual('isLowStock').get(function () {
  return this.quantity <= this.lowStockThreshold;
});

// Virtual to check if product is out of stock
ProductSchema.virtual('isOutOfStock').get(function () {
  return this.quantity === 0;
});

// Ensure virtuals are included in JSON output
ProductSchema.set('toJSON', { virtuals: true });

const Product = mongoose.model('Product', ProductSchema);

export default Product;
