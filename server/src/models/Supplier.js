import mongoose from 'mongoose';

/**
 * Supplier Schema
 * Stores supplier/vendor information
 */
const SupplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a supplier name'],
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Supplier = mongoose.model('Supplier', SupplierSchema);

export default Supplier;
