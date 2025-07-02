// backend/routes/aiRoutes.js
// Defines API routes for interacting with AI services.

import express from 'express';
import { generateSeoContent, getRecentQueries } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All AI-related routes are protected.
router.use(protect);

// @desc    Generate SEO content for a product
// @route   POST /api/ai/generate-seo
router.route('/generate-seo').post(generateSeoContent);

// @desc    Get recent AI queries for the dashboard
// @route   GET /api/ai/queries
router.route('/queries').get(getRecentQueries);

export default router;
