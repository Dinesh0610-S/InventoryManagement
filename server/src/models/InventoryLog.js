import mongoose from 'mongoose';

/**
 * Inventory Log Schema
 * Tracks all stock movements (additions and removals)
 */
const InventoryLogSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Please provide a product'],
    },
    type: {
      type: String,
      enum: ['add', 'remove', 'adjust'],
      required: [true, 'Please provide a log type'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide a quantity'],
      min: [0, 'Quantity cannot be negative'],
    },
    previousQuantity: {
      type: Number,
      required: true,
    },
    newQuantity: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
InventoryLogSchema.index({ product: 1, createdAt: -1 });
InventoryLogSchema.index({ user: 1, createdAt: -1 });

const InventoryLog = mongoose.model('InventoryLog', InventoryLogSchema);

export default InventoryLog;
