// backend/controllers/authController.js (Final Debug Version)

import '@shopify/shopify-api/adapters/node';
import asyncHandler from 'express-async-handler';
import shopify from '@shopify/shopify-api';
const { shopifyApi, LATEST_API_VERSION } = shopify;

import Shop from '../models/Shop.js';
import logger from '../utils/logger.js';
import { createNewSubscription } from '../services/subscriptionService.js';
import { syncProductsForShop } from '../services/shopifyService.js';

// This function remains the same, it's working correctly.
const getShopifyClient = () => {
    if (!process.env.HOST || !process.env.SHOPIFY_API_SCOPES) {
        throw new Error("Server is not configured correctly. Check HOST and SHOPIFY_API_SCOPES variables in Railway.");
    }
    return shopifyApi({
        apiKey: process.env.SHOPIFY_API_KEY,
        apiSecretKey: process.env.SHOPIFY_API_SECRET,
        scopes: process.env.SHOPIFY_API_SCOPES.split(','),
        hostName: process.env.HOST.replace(/https?:\/\//, ''),
        apiVersion: LATEST_API_VERSION,
        isEmbeddedApp: true,
    });
};

const handleShopifyAuth = asyncHandler(async (req, res) => {
  // This part is working correctly.
  const shopDomain = req.query.shop;
  if (!shopDomain) return res.status(400).send("Missing 'shop' parameter.");
  const shopifyClient = getShopifyClient();
  await shopifyClient.auth.begin({
    shop: shopDomain, callbackPath: '/api/auth/shopify/callback',
    isOnline: false, rawRequest: req, rawResponse: res,
  });
});

// --- THE PROBLEM IS INSIDE THIS FUNCTION ---
const handleShopifyCallback = asyncHandler(async (req, res) => {
    try {
        logger.info('--- [1] Callback Received. Processing...');
        const shopifyClient = getShopifyClient();
        const callback = await shopifyClient.auth.callback({
          rawRequest: req,
          rawResponse: res,
        });
        logger.info('--- [2] Auth callback processed successfully.');

        const { session } = callback;
        const { shop: shopifyDomain, accessToken } = session;
        logger.info(`--- [3] Session extracted for shop: ${shopifyDomain}`);

        let shop = await Shop.findOne({ shopifyDomain });
        logger.info(`--- [4] Database checked. Shop exists: ${!!shop}`);

        const client = new shopifyClient.clients.Rest({ session });
        const shopDataResponse = await client.get({ path: 'shop' });
        const shopData = shopDataResponse.body.shop;
        logger.info(`--- [5] Fetched shop data from Shopify API.`);

        if (shop) {
          shop.accessToken = accessToken;
          shop.isActive = true;
          await shop.save();
          logger.info(`--- [6a] Existing shop updated in DB.`);
        } else {
          shop = await Shop.create({
            shopifyDomain, accessToken,
            name: shopData.name, email: shopData.email, timezone: shopData.timezone,
          });
          logger.info(`--- [6b] New shop created in DB.`);

          await createNewSubscription(shop._id, 'Starter');
          logger.info(`--- [7] New subscription created.`);

          syncProductsForShop(shopifyDomain).catch(err => logger.error(`Background sync failed: ${err.message}`));
          logger.info(`--- [8] Background product sync initiated.`);
        }

        const host = req.query.host;
        const redirectUrl = `/?shop=${shopifyDomain}&host=${host}`;
        logger.info(`--- [9] Preparing to redirect to: ${redirectUrl}`);
        res.redirect(redirectUrl);

    } catch (error) {
        // This will catch the exact error and log it.
        logger.error('--- [FATAL ERROR] An error occurred during the callback process ---');
        logger.error(error);
        res.status(500).send("An internal error occurred during installation. Please try again.");
    }
});

export { handleShopifyAuth, handleShopifyCallback };
