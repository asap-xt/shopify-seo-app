// backend/controllers/subscriptionController.js
// Manages subscription-related actions like viewing plans and changing plans.

import asyncHandler from 'express-async-handler';
import Plan from '../models/Plan.js';
import { changeSubscriptionPlan } from '../services/subscriptionService.js';
import { updateSyncScheduleForShop } from '../utils/syncScheduler.js';
import logger from '../utils/logger.js';

/**
 * @desc    Get all available subscription plans
 * @route   GET /api/subscriptions/plans
 * @access  Private
 */
const getAvailablePlans = asyncHandler(async (req, res) => {
    const plans = await Plan.find({}).sort({ price: 'asc' });
    res.status(200).json(plans);
});

/**
 * @desc    Change the current shop's subscription plan
 * @route   POST /api/subscriptions/change-plan
 * @access  Private
 */
const selectPlan = asyncHandler(async (req, res) => {
    const { newPlanName } = req.body;
    const shopId = req.shop._id;

    if (!newPlanName) {
        res.status(400);
        throw new Error('New plan name is required.');
    }
    
    logger.info(`Shop ${req.shop.shopifyDomain} is attempting to change plan to ${newPlanName}`);

    // In a real application, you would first create a charge in Shopify's Billing API.
    // The user would be redirected to approve the charge.
    // Upon approval, a webhook would notify your app, and only then would you
    // call changeSubscriptionPlan.

    // For this project's scope, we'll change the plan directly.
    const updatedSubscription = await changeSubscriptionPlan(shopId, newPlanName);

    // After changing the plan, we must update the sync schedule to match the new frequency.
    await updateSyncScheduleForShop(shopId);

    res.status(200).json({
        message: `Plan successfully changed to ${newPlanName}.`,
        subscription: updatedSubscription,
    });
});

export { getAvailablePlans, selectPlan };
