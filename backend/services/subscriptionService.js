// backend/services/subscriptionService.js
// This service manages the lifecycle of shop subscriptions.

import asyncHandler from 'express-async-handler';
import Shop from '../models/Shop.js';
import Subscription from '../models/Subscription.js';
import Plan from '../models/Plan.js';
import logger from '../utils/logger.js';

/**
 * Creates a new trial subscription for a newly installed shop.
 * @param {string} shopId - The ObjectId of the shop.
 * @param {string} planName - The name of the plan to start the trial on.
 * @returns {object} The created subscription object.
 */
export const createNewSubscription = asyncHandler(async (shopId, planName) => {
    const shop = await Shop.findById(shopId);
    if (!shop) throw new Error('Shop not found during subscription creation.');

    const plan = await Plan.findOne({ name: planName });
    if (!plan) throw new Error(`Plan '${planName}' not found.`);

    // Set trial end date to 5 days from now
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 5);

    const subscription = await Subscription.create({
        shop: shopId,
        plan: plan._id,
        status: 'trialing',
        trialEndDate,
        currentPeriodStart: new Date(),
        currentPeriodEnd: trialEndDate, // For trial, period end is trial end
        aiQueriesUsed: 0,
    });

    shop.subscription = subscription._id;
    await shop.save();

    logger.info(`New '${planName}' trial subscription created for ${shop.shopifyDomain}.`);
    return subscription;
});

/**
 * Changes a shop's subscription plan.
 * @param {string} shopId - The ObjectId of the shop.
 * @param {string} newPlanName - The name of the new plan.
 * @returns {object} The updated subscription object.
 */
export const changeSubscriptionPlan = asyncHandler(async (shopId, newPlanName) => {
    const newPlan = await Plan.findOne({ name: newPlanName });
    if (!newPlan) throw new Error(`Plan '${newPlanName}' not found.`);

    // In a real app with Stripe/Shopify Billing, you'd update the billing provider here.
    
    const now = new Date();
    const nextBillingDate = new Date(now.setMonth(now.getMonth() + 1));

    const updatedSubscription = await Subscription.findOneAndUpdate(
        { shop: shopId },
        {
            $set: {
                plan: newPlan._id,
                status: 'active', // Move from trial or other plan to active
                trialEndDate: null, // End trial if active
                aiQueriesUsed: 0, // Reset usage counters
                currentPeriodStart: new Date(),
                currentPeriodEnd: nextBillingDate,
            }
        },
        { new: true } // Return the updated document
    );
    
    if (!updatedSubscription) throw new Error('Could not find and update subscription.');

    const shop = await Shop.findById(shopId);
    logger.info(`Subscription for ${shop.shopifyDomain} changed to '${newPlanName}'.`);
    return updatedSubscription;
});

// These services were not in the original request, but are good additions.
// For now, I'll omit planService.js and productService.js to stick to the request,
// as their logic is integrated into other services/controllers.
