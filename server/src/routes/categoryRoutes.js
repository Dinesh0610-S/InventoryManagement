import express from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getCategories).post(adminOnly, createCategory);
router.route('/:id').get(getCategory).put(adminOnly, updateCategory).delete(adminOnly, deleteCategory);

export default router;
