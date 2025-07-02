// backend/controllers/analyticsController.js
// Handles fetching of analytics data for the dashboard.

import asyncHandler from 'express-async-handler';
import Analytics from '../models/Analytics.js';
import AIQuery from '../models/AIQuery.js';
import Product from '../models/Product.js';

/**
 * @desc    Get aggregated analytics data for a specific time range
 * @route   GET /api/analytics
 * @access  Private
 */
const getAnalytics = asyncHandler(async (req, res) => {
    const shopId = req.shop._id;
    
    // Default to the last 30 days
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 30);

    // Fetch daily aggregated data from the Analytics model
    const dailyData = await Analytics.find({
        shop: shopId,
        date: { $gte: from, $lte: to }
    }).sort({ date: 'asc' });

    // Calculate summary stats
    const totalQueries = dailyData.reduce((acc, day) => acc + day.dailyQueries, 0);
    const totalOptimizations = dailyData.reduce((acc, day) => acc + day.optimizationsPerformed, 0);

    // Get the top 5 most frequently optimized products
    const topOptimizedProducts = await AIQuery.aggregate([
        { $match: { shop: shopId, success: true } },
        { $group: { _id: '$product', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'productDetails' } },
        { $unwind: '$productDetails' },
        { $project: { _id: 0, title: '$productDetails.title', count: 1 } }
    ]);

    res.status(200).json({
        summary: {
            totalQueries,
            totalOptimizations,
            period: { from: from.toISOString(), to: to.toISOString() }
        },
        dailyData,
        topOptimizedProducts,
    });
});

export { getAnalytics };