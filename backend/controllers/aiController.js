// backend/controllers/aiController.js
// This controller is the gateway for all AI-related functionalities.

import asyncHandler from 'express-async-handler';
import { generateSeoForProduct, checkQueryLimitAndPlan, incrementQueryCount } from '../services/aiService.js';
import AIQuery from '../models/AIQuery.js';

/**
 * @desc    Generate SEO content for a specific product
 * @route   POST /api/ai/generate-seo
 * @access  Private
 */
const generateSeoContent = asyncHandler(async (req, res) => {
    const { productId, provider, contentType, customInstruction } = req.body;
    const shopId = req.shop._id;

    // Validate request body
    if (!productId || !provider || !contentType) {
        res.status(400);
        throw new Error('Product ID, AI provider, and content type are required.');
    }

    // Check if the shop's plan allows this feature and has queries left
    await checkQueryLimitAndPlan(shopId, provider);
    
    // Call the AI service to generate content
    const result = await generateSeoForProduct(shopId, productId, provider, contentType, customInstruction);

    // If generation was successful, increment the query count
    if (result.success) {
        await incrementQueryCount(shopId);
    }

    res.status(200).json(result);
});

/**
 * @desc    Get recent AI queries for the current shop for the dashboard
 * @route   GET /api/ai/queries
 * @access  Private
 */
const getRecentQueries = asyncHandler(async (req, res) => {
    const shopId = req.shop._id;
    const queries = await AIQuery.find({ shop: shopId })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('product', 'title imageUrl'); // Populate product title and image for context in the UI

    res.status(200).json(queries);
});

export { generateSeoContent, getRecentQueries };
