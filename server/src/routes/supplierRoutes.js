import express from 'express';
import {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '../controllers/supplierController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getSuppliers).post(adminOnly, createSupplier);
router.route('/:id').get(getSupplier).put(adminOnly, updateSupplier).delete(adminOnly, deleteSupplier);

export default router;
