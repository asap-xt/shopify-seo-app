// backend/routes/subscriptionRoutes.js
// Defines API routes related to managing subscription plans.

import express from 'express';
import { getAvailablePlans, selectPlan } from '../controllers/subscriptionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All subscription routes are protected.
router.use(protect);

// @desc    Get all available subscription plans
// @route   GET /api/subscriptions/plans
router.route('/plans').get(getAvailablePlans);

// @desc    Change the current shop's subscription plan
// @route   POST /api/subscriptions/change-plan
router.route('/change-plan').post(selectPlan);

export default router;
