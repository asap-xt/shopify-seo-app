// backend/utils/syncScheduler.js
// This utility uses node-cron to schedule and manage periodic product synchronization tasks.
// It ensures that data from Shopify stores is kept up-to-date automatically.

import cron from 'node-cron';
import Shop from '../models/Shop.js';
import logger from './logger.js';
import { syncProductsForShop } from '../services/shopifyService.js';

// A Map to keep track of running cron jobs for each shop.
// The key is the shop's domain, and the value is the cron task instance.
// This allows us to stop and reschedule jobs dynamically.
const scheduledJobs = new Map();

/**
 * Schedules a new sync job for a given shop based on its subscription plan.
 * @param {object} shop - The Mongoose shop object, populated with subscription and plan details.
 */
const scheduleSyncForShop = (shop) => {
    const shopDomain = shop.shopifyDomain;

    // Stop any existing job for this shop to prevent duplicates on restart or plan change.
    if (scheduledJobs.has(shopDomain)) {
        scheduledJobs.get(shopDomain).stop();
        logger.info(`Stopped existing sync job for ${shopDomain} before rescheduling.`);
    }
    
    // A shop must have a subscription and a plan to have a schedule.
    if (!shop.subscription || !shop.subscription.plan) {
        logger.warn(`Shop ${shopDomain} has no subscription plan. Skipping sync schedule.`);
        return;
    }

    const syncHours = shop.subscription.plan.syncFrequencyHours;
    // Define the cron expression. e.g., '0 */12 * * *' runs at minute 0 of every 12th hour.
    const cronExpression = `0 */${syncHours} * * *`;

    // Create the scheduled task.
    const task = cron.schedule(cronExpression, async () => {
        logger.info(`[CRON] Running scheduled product sync for ${shopDomain}`);
        try {
            await syncProductsForShop(shopDomain);
        } catch (error) {
            logger.error(`[CRON] Scheduled sync failed for ${shopDomain}: ${error.message}`);
        }
    }, {
        scheduled: true,
        timezone: "Etc/UTC" // Use UTC for consistency across different server timezones.
    });

    // Store the new job in our map.
    scheduledJobs.set(shopDomain, task);
    logger.info(`Scheduled product sync for ${shopDomain} with expression: ${cronExpression} (every ${syncHours} hours).`);
};

/**
 * Initializes the scheduler for all active shops when the server starts.
 */
export const startSyncScheduler = async () => {
    logger.info('Initializing sync scheduler for all active shops...');
    try {
        // Find all active shops and populate their subscription details.
        const activeShops = await Shop.find({ isActive: true })
            .populate({ path: 'subscription', populate: { path: 'plan' } });

        for (const shop of activeShops) {
            scheduleSyncForShop(shop);
        }
        logger.info(`Scheduler initialized for ${activeShops.length} shops.`);
    } catch (error) {
        logger.error('Error during sync scheduler initialization:', error);
    }
};

/**
 * Updates a specific shop's sync schedule. Called after a plan change.
 * @param {string} shopId - The MongoDB ObjectId of the shop to update.
 */
export const updateSyncScheduleForShop = async (shopId) => {
     const shop = await Shop.findById(shopId)
        .populate({ path: 'subscription', populate: { path: 'plan' } });

    if (shop) {
        logger.info(`Updating sync schedule for ${shop.shopifyDomain} due to a plan change.`);
        scheduleSyncForShop(shop);
    }
};
