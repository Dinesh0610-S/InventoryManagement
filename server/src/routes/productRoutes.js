import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/').get(getProducts).post(adminOnly, createProduct);
router.route('/:id').get(getProduct).put(adminOnly, updateProduct).delete(adminOnly, deleteProduct);
router.put('/:id/stock', adminOnly, updateStock);

export default router;
