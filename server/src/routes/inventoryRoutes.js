import express from 'express';
import { getInventoryLogs, getInventoryReport } from '../controllers/inventoryController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/logs', getInventoryLogs);
router.get('/report', adminOnly, getInventoryReport);

export default router;
