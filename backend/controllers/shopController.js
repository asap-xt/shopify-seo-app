// backend/controllers/shopController.js
// Handles requests for shop-specific data, like status and dashboard information.

import asyncHandler from 'express-async-handler';
import Shop from '../models/Shop.js';
import Subscription from '../models/Subscription.js';
import Product from '../models/Product.js';
import Plan from '../models/Plan.js';

/**
 * @desc    Get the current status and dashboard data for the logged-in shop
 * @route   GET /api/shop/status
 * @access  Private
 */
const getShopStatus = asyncHandler(async (req, res) => {
    const shopId = req.shop._id;

    // Fetch subscription and plan details in one go
    const subscription = await Subscription.findOne({ shop: shopId }).populate('plan');

    if (!subscription) {
        res.status(404);
        throw new Error('Subscription details not found for this shop.');
    }

    // Get the total count of synced products for this shop
    const productCount = await Product.countDocuments({ shop: shopId });

    res.status(200).json({
        shop: {
            name: req.shop.name,
            domain: req.shop.shopifyDomain,
            lastSync: req.shop.lastSync,
        },
        plan: {
            name: subscription.plan.name,
            productLimit: subscription.plan.productLimit,
            queryLimit: subscription.plan.queryLimit,
        },
        usage: {
            aiQueriesUsed: subscription.aiQueriesUsed,
            productCount: productCount,
        },
        subscriptionStatus: subscription.status,
        trialEndDate: subscription.trialEndDate,
    });
});

export { getShopStatus };
