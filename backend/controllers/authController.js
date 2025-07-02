// backend/controllers/authController.js (Final Debug Version)

import '@shopify/shopify-api/adapters/node';
import asyncHandler from 'express-async-handler';
import shopify from '@shopify/shopify-api';
const { shopifyApi, LATEST_API_VERSION } = shopify;

import Shop from '../models/Shop.js';
import logger from '../utils/logger.js';
import { createNewSubscription } from '../services/subscriptionService.js';
import { syncProductsForShop } from '../services/shopifyService.js';

const getShopifyClient = () => {
  if (!process.env.HOST || !process.env.SHOPIFY_API_SCOPES) {
    logger.error("FATAL: Missing HOST or SHOPIFY_API_SCOPES environment variables.");
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
  logger.info('--- New Auth Request Received ---');
  logger.info(`Request Query: ${JSON.stringify(req.query)}`);
  const shopDomain = req.query.shop;
  if (!shopDomain) {
    return res.status(400).send("Missing 'shop' parameter.");
  }
  try {
    const shopifyClient = getShopifyClient();
    await shopifyClient.auth.begin({
      shop: shopDomain,
      callbackPath: '/api/auth/shopify/callback',
      isOnline: false,
      rawRequest: req,
      rawResponse: res,
    });
  } catch (error) {
    logger.error(`Auth initialization failed: ${error.message}`);
    res.status(500).send(`Server configuration error: ${error.message}`);
  }
});

const handleShopifyCallback = asyncHandler(async (req, res) => {
  logger.info('--- Shopify Callback Received ---');
  logger.info(`Callback Query: ${JSON.stringify(req.query)}`);

  const shopifyClient = getShopifyClient();
  const callback = await shopifyClient.auth.callback({
    rawRequest: req,
    rawResponse: res,
  });

  const { session } = callback;
  const { shop: shopifyDomain, accessToken } = session;
  logger.info(`Successfully processed callback for shop: ${shopifyDomain}`);

  // ... (Database logic remains the same)
  let shop = await Shop.findOne({ shopifyDomain });
  const client = new shopifyClient.clients.Rest({ session });
  const shopData = await client.get({ path: 'shop' });
  if (shop) {
    shop.accessToken = accessToken;
    shop.isActive = true;
    await shop.save();
    logger.info(`Shop re-authenticated: ${shopifyDomain}`);
  } else {
    shop = await Shop.create({
      shopifyDomain, accessToken,
      name: shopData.body.shop.name, email: shopData.body.shop.email, timezone: shopData.body.shop.timezone,
    });
    logger.info(`New shop installed: ${shopifyDomain}`);
    await createNewSubscription(shop._id, 'Starter');
    syncProductsForShop(shopifyDomain).catch(err => logger.error(`Initial sync failed: ${err.message}`));
  }

  // --- FINAL DEBUGGING STEP ---
  const host = req.query.host;
  if (!host || !shopifyDomain) {
    logger.error(`FATAL: Cannot redirect to frontend. Missing 'host' or 'shop' parameter.`);
    logger.error(`HOST value: ${host}`);
    logger.error(`SHOP value: ${shopifyDomain}`);
    return res.status(500).send("Could not complete authentication due to missing parameters.");
  }

  const redirectUrl = `/?shop=${shopifyDomain}&host=${host}`;
  logger.info(`--- FINAL REDIRECT ---`);
  logger.info(`Redirecting to: ${redirectUrl}`);
  // --- END DEBUGGING STEP ---

  res.redirect(redirectUrl);
});

export { handleShopifyAuth, handleShopifyCallback };