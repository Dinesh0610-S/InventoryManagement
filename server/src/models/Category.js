import mongoose from 'mongoose';

/**
 * Category Schema
 * Stores product categories (e.g., Electronics, Clothing, Food)
 */
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', CategorySchema);

export default Category;
