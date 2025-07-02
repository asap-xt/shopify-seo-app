// backend/routes/analyticsRoutes.js
// Defines API routes for analytics data.

import express from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// @desc    Get aggregated analytics data for a specific time range
// @route   GET /api/analytics
router.route('/').get(getAnalytics);

export default router;
