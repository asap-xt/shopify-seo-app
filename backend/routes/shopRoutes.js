// backend/routes/shopRoutes.js
// Defines API routes for fetching shop-specific information.

import express from 'express';
import { getShopStatus } from '../controllers/shopController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// @desc    Get the current status and dashboard data for the logged-in shop
// @route   GET /api/shop/status
router.route('/status').get(getShopStatus);

export default router;
